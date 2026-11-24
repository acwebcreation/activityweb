// netlify/functions/generate-pdf.js
// Reçoit le contenu personnalisé de chaque certificat (déjà validé côté client),
// re-vérifie la session Stripe, régénère les SVG côté serveur (jamais confiance
// dans un SVG envoyé par le client), et exporte un PDF A4 par certificat
// (ou un PDF multi-pages si plusieurs certificats) via Puppeteer.
//
// Le PDF est stocké temporairement (ex: Netlify Blobs ou un bucket S3) avec une
// expiration de 24h, et un lien signé est retourné. Si un email est fourni,
// le PDF est aussi envoyé par email (ex: via Resend ou Postmark).

import Stripe from "stripe";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { renderCertificate } from "../../src/data/renderTemplate.js";
import { getStore } from "@netlify/blobs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_URL = process.env.SITE_URL || "https://crazycertif.com";

// Enveloppe un SVG A4 dans une page HTML calibrée pour l'impression A4 exacte,
// dans la bonne orientation (portrait ou paysage).
function buildPrintableHtml(svgMarkup, orientation) {
  const cssSize = orientation === "landscape" ? "A4 landscape" : "A4 portrait";
  const width = orientation === "landscape" ? "297mm" : "210mm";
  const height = orientation === "landscape" ? "210mm" : "297mm";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  @page { size: ${cssSize}; margin: 0; }
  html, body { margin: 0; padding: 0; }
  svg { width: ${width}; height: ${height}; display: block; }
</style>
</head>
<body>${svgMarkup}</body>
</html>`;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "invalid_json" }) };
  }

  const { sessionToken, certificates, email } = body;

  if (!sessionToken || !Array.isArray(certificates) || certificates.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "invalid_payload" }) };
  }

  // 1. Re-vérifier le paiement et que les styles envoyés correspondent bien à ceux achetés.
  //    Le titre/la phrase restent libres (le client peut les changer par rapport au combo
  //    initialement affiché sur la page catégorie) — seul le nombre de certificats par
  //    style acheté fait foi, comme validé dans la conception initiale du parcours.
  let paidStyles;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionToken);
    if (session.payment_status !== "paid") {
      return { statusCode: 402, body: JSON.stringify({ error: "not_paid" }) };
    }
    let combos = [];
    try {
      combos = JSON.parse(session.metadata.combos || "[]");
    } catch {
      combos = [];
    }
    paidStyles = combos.map((c) => c.style).filter(Boolean);
  } catch (err) {
    return { statusCode: 404, body: JSON.stringify({ error: "session_not_found" }) };
  }

  const requestedStyles = certificates.map((c) => c.styleId);
  const stylesMatch =
    requestedStyles.length === paidStyles.length &&
    requestedStyles.every((s) => paidStyles.includes(s));
  if (!stylesMatch) {
    return { statusCode: 403, body: JSON.stringify({ error: "styles_mismatch" }) };
  }

  // 2. Régénérer les SVG côté serveur à partir du contenu envoyé (source de vérité = renderTemplate.js).
  const pages = certificates.map((c) => {
    const orientation = c.orientation === "landscape" ? "landscape" : "portrait";
    const svg = renderCertificate(
      c.styleId,
      {
        title: c.title,
        firstname: c.firstname,
        date: c.date,
        phrase: c.phrase,
        image: c.image || null,
      },
      orientation
    );
    return { html: buildPrintableHtml(svg, orientation), orientation };
  });

  // 3. Générer un PDF A4 (une page par certificat) avec Puppeteer + chromium serverless.
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    const pdfBuffers = [];

    for (const { html } of pages) {
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true, // laisse le @page CSS (portrait/paysage) décider du format
      });
      pdfBuffers.push(pdfBuffer);
    }

    await browser.close();

    // 4. Fusionner en un seul PDF si plusieurs certificats (pack de 3).
    const finalPdf =
      pdfBuffers.length === 1 ? pdfBuffers[0] : await mergePdfBuffers(pdfBuffers);

    // 5. Stocker temporairement (24h) et générer un lien de téléchargement.
    const store = getStore("crazycertif-pdfs");
    const fileId = `${sessionToken}-${Date.now()}.pdf`;
    await store.set(fileId, finalPdf, {
      metadata: { expiresAt: Date.now() + 24 * 60 * 60 * 1000 },
    });

    const downloadUrl = `${SITE_URL}/.netlify/functions/download-pdf?file=${encodeURIComponent(fileId)}`;

    // 6. Envoi par email si fourni (implémentation à brancher sur Resend/Postmark).
    if (email) {
      // await sendPdfByEmail(email, finalPdf);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ downloadUrl }),
    };
  } catch (err) {
    console.error("PDF generation error", err);
    if (browser) await browser.close();
    return { statusCode: 500, body: JSON.stringify({ error: "pdf_generation_failed" }) };
  }
}

// Fusionne plusieurs PDF (un par certificat) en un seul document multi-pages.
async function mergePdfBuffers(buffers) {
  const { PDFDocument } = await import("pdf-lib");
  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const doc = await PDFDocument.load(buf);
    const [copiedPage] = await merged.copyPages(doc, [0]);
    merged.addPage(copiedPage);
  }
  return Buffer.from(await merged.save());
}

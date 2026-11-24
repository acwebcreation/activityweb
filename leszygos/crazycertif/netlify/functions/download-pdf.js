// netlify/functions/download-pdf.js
// Sert le PDF généré, stocké temporairement (24h) dans Netlify Blobs.

import { getStore } from "@netlify/blobs";

export async function handler(event) {
  const fileId = event.queryStringParameters?.file;
  if (!fileId) {
    return { statusCode: 400, body: "Fichier manquant" };
  }

  const store = getStore("crazycertif-pdfs");
  const { data, metadata } = await store.getWithMetadata(fileId, { type: "arrayBuffer" });

  if (!data) {
    return { statusCode: 404, body: "Ce lien de téléchargement a expiré." };
  }
  if (metadata?.expiresAt && Date.now() > metadata.expiresAt) {
    await store.delete(fileId);
    return { statusCode: 410, body: "Ce lien de téléchargement a expiré (24h)." };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="crazycertif.pdf"',
    },
    body: Buffer.from(data).toString("base64"),
    isBase64Encoded: true,
  };
}

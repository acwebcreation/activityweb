// netlify/functions/create-checkout.js
// Crée une session Stripe Checkout : 5€ pour 1 certificat, 12€ pour 3.
// Les combos choisis (style + titre + phrase + catégorie, sélectionnés sur la
// page catégorie) sont stockés en JSON dans les metadata de la session Stripe,
// pas dans une base de données — pas besoin de compte utilisateur.
// Metadata Stripe : 500 caractères max par valeur — un combo fait ~120-150
// caractères, donc un pack de 3 (~450) reste dans la limite.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_URL = process.env.SITE_URL || "https://crazycertif.com";

const PRICES = {
  1: { amount: 500, label: "1 certificat CrazyCertif" },   // 5,00 €
  3: { amount: 1200, label: "Pack de 3 certificats CrazyCertif" }, // 12,00 €
};

const MAX_METADATA_VALUE_LENGTH = 490; // marge sous la limite Stripe de 500

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

  const { count, combos } = body;
  const pricing = PRICES[count];

  const combosValid =
    Array.isArray(combos) &&
    combos.length === count &&
    combos.every((c) => c && typeof c.style === "string" && typeof c.title === "string" && typeof c.phrase === "string");

  if (!pricing || !combosValid) {
    return { statusCode: 400, body: JSON.stringify({ error: "invalid_selection" }) };
  }

  const combosJson = JSON.stringify(
    combos.map((c) => ({ style: c.style, title: c.title, phrase: c.phrase, categoryId: c.categoryId }))
  );
  if (combosJson.length > MAX_METADATA_VALUE_LENGTH) {
    return { statusCode: 400, body: JSON.stringify({ error: "selection_too_large" }) };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: pricing.label },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        combos: combosJson,
        count: String(count),
      },
      success_url: `${SITE_URL}/personalize.html?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/index.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe checkout error", err);
    return { statusCode: 500, body: JSON.stringify({ error: "stripe_error" }) };
  }
}

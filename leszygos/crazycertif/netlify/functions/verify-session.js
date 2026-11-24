// netlify/functions/verify-session.js
// Vérifie côté serveur qu'une session Stripe est bien payée avant de débloquer
// la page de personnalisation. Empêche d'accéder à /personalize.html sans payer.
// Renvoie les combos (style + titre + phrase + catégorie) choisis sur la page
// catégorie, pour préremplir chaque certificat côté client.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  const sessionId = event.queryStringParameters?.session;

  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: "missing_session" }) };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { statusCode: 402, body: JSON.stringify({ error: "not_paid" }) };
    }

    let combos = [];
    try {
      combos = JSON.parse(session.metadata.combos || "[]");
    } catch {
      combos = [];
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ combos }),
    };
  } catch (err) {
    console.error("Stripe verify error", err);
    return { statusCode: 404, body: JSON.stringify({ error: "session_not_found" }) };
  }
}

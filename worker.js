/**
 * Compteur de places — Pack SaaS Débutant
 * ----------------------------------------
 * Ce Worker interroge l'API Stripe pour connaître le nombre réel de
 * paiements déjà effectués sur ton Payment Link, et renvoie
 * { "used": X, "limit": 100 } en JSON à la page de vente.
 *
 * La clé secrète Stripe ne quitte jamais ce Worker : elle n'est
 * jamais exposée au navigateur du visiteur.
 *
 * DÉPLOIEMENT (avec wrangler, déjà utilisé pour tes autres Workers) :
 *
 * 1. wrangler secret put STRIPE_SECRET_KEY
 *    → colle ta clé secrète Stripe (sk_live_... ou sk_test_... pour tester)
 *
 * 2. Renseigne PAYMENT_LINK_ID et ALLOWED_ORIGIN dans wrangler.toml
 *    (l'ID du Payment Link n'est pas secret, pas besoin de "wrangler secret")
 *
 * 3. wrangler deploy
 *
 * 4. Récupère l'URL du Worker (ex: https://pack-saas-compteur.<ton-sous-domaine>.workers.dev)
 *    et colle-la dans COUNTER_ENDPOINT sur la page de vente.
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "method_not_allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!env.STRIPE_SECRET_KEY || !env.PAYMENT_LINK_ID) {
      return new Response(
        JSON.stringify({ error: "missing_config" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sert une réponse mise en cache si elle a moins de 2 minutes,
    // pour ne pas interroger Stripe à chaque chargement de page.
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const stripeRes = await fetch(
        `https://api.stripe.com/v1/payment_links/${env.PAYMENT_LINK_ID}`,
        { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
      );

      if (!stripeRes.ok) {
        throw new Error(`Stripe a répondu ${stripeRes.status}`);
      }

      const data = await stripeRes.json();
      const used = data?.restrictions?.completed_sessions?.count ?? 0;
      const limit = data?.restrictions?.completed_sessions?.limit ?? 100;

      const response = new Response(JSON.stringify({ used, limit }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=120",
          ...corsHeaders,
        },
      });

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (err) {
      // En cas de souci avec Stripe, on renvoie une erreur claire plutôt
      // qu'un faux chiffre — la page de vente retombe alors sur son
      // compteur de secours (FALLBACK_USED) sans induire le visiteur en erreur.
      return new Response(JSON.stringify({ error: "stripe_unavailable" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};

/* Le Coin des Cadeaux — affichage d'une page guide ou du sommaire.
   Les données (produits et guides) sont dans produits.js. */
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const parNom = n => PRODUITS.find(p => p.n === n);
  const lien = p => p.url ? p.url :
    "https://" + CONFIG.domaine + "/s?k=" + encodeURIComponent(p.q) + (CONFIG.tag ? "&tag=" + encodeURIComponent(CONFIG.tag) : "");
  const marchand = p => (p.url && p.url.includes("etsy.com")) ? "Etsy" : "Amazon";

  function carte(p) {
    const r = CATS[p.c] ? CATS[p.c].r : "fun";
    const badge = p.top ? `<span class="badge ${r}">${r === "malin" ? "Rentable" : "Coup de cœur"}</span>` : "";
    return `<article class="carte ${r}">
      <div class="visuel ${p.image ? "photo" : ""}">
        <span class="emoji" aria-hidden="true">${p.e}</span>
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.n)}" loading="lazy" onerror="this.parentNode.classList.remove('photo');this.remove()">` : ""}
        ${badge}
      </div>
      <div class="corps">
        <h3>${esc(p.n)}</h3>
        <p>${esc(p.d)}</p>
        ${p.eco ? `<span class="eco">💰 ${esc(p.eco)}</span>` : ""}
        <div class="meta"><span class="prix">${BUDGETS[p.b]}</span>
          <a class="voir" href="${lien(p)}" target="_blank" rel="nofollow sponsored noopener" data-produit="${esc(p.n)}">Voir sur ${marchand(p)} →</a></div>
      </div>
    </article>`;
  }

  const encartEtsy = `<section class="bandeau encart">
    <div><h2>Le cadeau qu'on ne trouve pas en magasin</h2>
    <p>Une chanson écrite sur mesure, avec son prénom et vos souvenirs.</p></div>
    <a href="https://www.etsy.com/shop/ActivityWebStudio" target="_blank" rel="noopener">🎵 Découvrir les chansons personnalisées</a>
  </section>`;

  function pageGuide(id) {
    const g = GUIDES_PAGES.find(x => x.id === id);
    if (!g) return;
    const produits = g.produits.map(parNom).filter(Boolean);
    const zone = $("#grille");
    if (!produits.length) {
      zone.outerHTML = `<div class="bientot"><p>Les idées de ce guide arrivent très bientôt.</p>
        <a href="/coindescadeaux/">En attendant, parcourir toutes les idées cadeaux →</a></div>` + encartEtsy;
    } else {
      const cartes = produits.map(carte);
      const avant = cartes.slice(0, 3).join(""), apres = cartes.slice(3).join("");
      zone.innerHTML = avant;
      zone.insertAdjacentHTML("afterend", encartEtsy + (apres ? `<div class="grille">${apres}</div>` : ""));
    }
    autres(id);
  }

  function vignette(g) {
    const n = g.produits.filter(parNom).length;
    return `<a class="guide-lien" href="/coindescadeaux/${g.slug}/">
      <span class="gl-emoji" aria-hidden="true">${g.emoji}</span>
      <span class="gl-nom">${esc(g.court)}</span>
      <span class="gl-nb">${n ? n + " idée" + (n > 1 ? "s" : "") : "Bientôt"}</span></a>`;
  }

  function autres(id) {
    const z = $("#autres");
    if (z) z.innerHTML = GUIDES_PAGES.filter(g => g.id !== id).map(vignette).join("");
  }

  document.addEventListener("click", e => {
    const a = e.target.closest("[data-produit]");
    if (a && typeof gtag === "function") gtag("event", "clic_affilie", { produit: a.dataset.produit, page: location.pathname });
  });
  const h = document.getElementById("hamburger");
  if (h) h.addEventListener("click", () => { const m = $("#mobileNav"); m.style.display = m.style.display === "flex" ? "none" : "flex"; });

  const id = document.body.dataset.guide;
  if (id) pageGuide(id);
  else if ($("#sommaire")) $("#sommaire").innerHTML = GUIDES_PAGES.map(vignette).join("");
})();

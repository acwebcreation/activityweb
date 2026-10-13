/* =========================================================
   La Boîte à Bonheurs — occasion « à la une » automatique
   ---------------------------------------------------------
   Ce script remplit tout seul :
   - la case du menu  <li data-saison></li>
   - le bandeau       <div data-saison-bandeau></div>  (facultatif)
   selon la date du jour. Tu n'as rien à faire au fil de l'année.

   ⚙️  La SEULE partie à modifier est la liste SAISONS ci-dessous.
   - debut / fin : "MM-JJ" (mois-jour), dates incluses
   - lien : chemin depuis le dossier boite-a-bonheur/
   - Si plusieurs occasions tombent en même temps, les 2 premières
     de la liste s'affichent.
   ========================================================= */
var SAISONS = [
  { nom: "Halloween",     emoji: "🎃", debut: "10-01", fin: "10-31",
    lien: "occasions.html#halloween",
    bandeau: "Halloween approche : jeux, coloriages et cartes à gratter" },
  { nom: "Saint-Nicolas", emoji: "🎅", debut: "11-01", fin: "12-06",
    lien: "occasions.html#saint-nicolas",
    bandeau: "Saint-Nicolas : chanson et lettre avec le prénom de votre enfant" },
  { nom: "Noël",          emoji: "🎄", debut: "10-20", fin: "12-25",
    lien: "noel/",
    bandeau: "C'est bientôt Noël : escape game, lettres du Père Noël, planner…" },
  { nom: "Pâques",        emoji: "🐣", debut: "PAQUES-35", fin: "PAQUES+1",
    lien: "occasions.html#paques",
    bandeau: "Pâques arrive : chasse aux œufs et activités à imprimer" },
  { nom: "Fête des mères", emoji: "💐", debut: "04-15", fin: "MERES",
    lien: "occasions.html#fete-des-meres",
    bandeau: "Fête des mères : cartes-poèmes et chanson pour maman" },
  { nom: "Fête des pères", emoji: "👔", debut: "MERES+1", fin: "PERES",
    lien: "occasions.html#fete-des-peres",
    bandeau: "Fête des pères : carnet de bons cadeaux pour papa" },
  { nom: "Rentrée",       emoji: "✏️", debut: "08-10", fin: "09-15",
    lien: "occasions.html#rentree",
    bandeau: "C'est la rentrée : cahiers d'écriture et activités" }
];
/* ========================================================= */

(function () {
  var me = document.currentScript;
  var root = (me && me.getAttribute("data-racine")) || "./";

  // Dimanche de Pâques (calcul grégorien)
  function paques(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
        h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
        l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
        mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  // 2e dimanche d'un mois (Belgique : mai pour les mères, juin pour les pères)
  function deuxiemeDimanche(y, mois) {
    var d = new Date(y, mois, 1);
    d.setDate(1 + ((7 - d.getDay()) % 7) + 7);
    return d;
  }
  function jour(y, code) {
    var m = code.match(/^(PAQUES|MERES|PERES)([+-]\d+)?$/);
    if (m) {
      var base = m[1] === "PAQUES" ? paques(y) : deuxiemeDimanche(y, m[1] === "MERES" ? 4 : 5);
      base.setDate(base.getDate() + (m[2] ? parseInt(m[2], 10) : 0));
      return base;
    }
    var p = code.split("-");
    return new Date(y, parseInt(p[0], 10) - 1, parseInt(p[1], 10));
  }

  var now = new Date(); now.setHours(12, 0, 0, 0);
  var y = now.getFullYear();
  var actives = SAISONS.filter(function (s) {
    var d = jour(y, s.debut), f = jour(y, s.fin);
    d.setHours(0, 0, 0, 0); f.setHours(23, 59, 59, 0);
    return f >= d ? (now >= d && now <= f) : (now >= d || now <= f); // gère une période à cheval sur 2 années
  }).slice(0, 2);

  var css = document.createElement("style");
  css.textContent =
    "[data-saison] a{color:#C2577A!important;font-weight:700}" +
    "[data-saison][hidden]{display:none}" +
    ".saison-bandeau{display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:999px;padding:8px 16px;margin-bottom:16px;box-shadow:0 4px 14px rgba(167,123,202,.18);text-decoration:none;font-weight:700;color:#6E4F8B;font-size:.95rem}" +
    ".saison-bandeau:hover{transform:translateY(-1px)}" +
    ".saison-bandeau span{color:#C2577A}";
  document.head.appendChild(css);

  document.querySelectorAll("[data-saison]").forEach(function (li) {
    if (!actives.length) { li.hidden = true; return; }
    li.innerHTML = actives.map(function (s) {
      return '<a href="' + root + s.lien + '">' + s.emoji + " " + s.nom + "</a>";
    }).join(" · ");
  });

  document.querySelectorAll("[data-saison-bandeau]").forEach(function (el) {
    if (!actives.length) return;
    var s = actives[0];
    el.innerHTML = '<a class="saison-bandeau" href="' + root + s.lien + '">' + s.emoji + " " + s.bandeau + " <span>→</span></a>";
  });
})();

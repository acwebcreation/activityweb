// renderTemplate.js
// Génère le SVG d'un certificat pour un style donné + un contenu donné.
// Utilisé côté navigateur (aperçu live) ET côté serveur (génération PDF finale),
// pour garantir que l'aperçu = le rendu téléchargé.
//
// Chaque style existe en DEUX compositions dessinées séparément :
// - portrait (RENDERERS_PORTRAIT)  : viewBox 420x594 (A4 debout)
// - paysage  (RENDERERS_LANDSCAPE) : viewBox 594x420 (A4 couché)
// Le paysage n'est pas une simple rotation du portrait (le texte se
// retrouverait sur le côté) : c'est une vraie mise en page horizontale,
// avec le texte qui reste lisible normalement.

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// Insère une photo optionnelle (fournie en data URL par le client) dans un médaillon
// rond. Ne génère rien si aucune image n'est fournie.
function photoBadge(image, styleId, { cx, cy, r = 30, ring = "#ffffff" }) {
  if (!image) return "";
  const clipId = `photoclip-${styleId}`;
  return `
<defs><clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
<circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="${ring}" stroke="#00000022" stroke-width="1"/>
<image href="${image}" x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`;
}

// ============================================================
// PORTRAIT — viewBox 420x594
// ============================================================
const RENDERERS_PORTRAIT = {
  parchemin: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="420" height="594" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/>
<rect x="14" y="14" width="392" height="566" fill="none" stroke="#BA7517" stroke-width="1.5"/>
<rect x="20" y="20" width="380" height="554" fill="none" stroke="#EF9F27" stroke-width="0.75"/>
<circle cx="40" cy="40" r="6" fill="#EF9F27"/><circle cx="380" cy="40" r="6" fill="#EF9F27"/>
<circle cx="40" cy="554" r="6" fill="#EF9F27"/><circle cx="380" cy="554" r="6" fill="#EF9F27"/>
<text x="210" y="95" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="4" fill="#854F0B">CERTIFICAT OFFICIEL</text>
<text x="210" y="145" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="500" fill="#412402">${escapeXml(title)}</text>
<line x1="150" y1="165" x2="270" y2="165" stroke="#EF9F27" stroke-width="1"/>
<text x="210" y="210" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#5F5E5A">Ce certificat est fièrement décerné à</text>
<text x="210" y="260" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="34" font-weight="500" fill="#4A1B0C">${escapeXml(firstname)}</text>
<line x1="90" y1="278" x2="330" y2="278" stroke="#D3D1C7" stroke-width="1"/>
<text x="210" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#412402">« ${escapeXml(phrase)} »</text>
<text x="210" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#888780">Décerné le</text>
<text x="210" y="420" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#2C2C2A">${escapeXml(formatDate(date))}</text>
<circle cx="210" cy="490" r="42" fill="#FAC775" stroke="#854F0B" stroke-width="2"/>
<circle cx="210" cy="490" r="34" fill="none" stroke="#854F0B" stroke-width="1"/>
<text x="210" y="486" text-anchor="middle" font-family="Georgia, serif" font-size="10" letter-spacing="1" fill="#412402">CRAZY</text>
<text x="210" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="10" letter-spacing="1" fill="#412402">CERTIF</text>
<text x="210" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#888780">crazycertif.com</text>
${photoBadge(image, "parchemin-p", { cx: 362, cy: 56 })}`,

  neon: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="420" height="594" fill="#1a1a1a"/>
<rect x="16" y="16" width="388" height="562" fill="none" stroke="#ED93B1" stroke-width="3"/>
<rect x="26" y="26" width="368" height="542" fill="none" stroke="#85B7EB" stroke-width="1.5"/>
<line x1="16" y1="16" x2="60" y2="16" stroke="#D4537E" stroke-width="6"/>
<line x1="16" y1="16" x2="16" y2="60" stroke="#D4537E" stroke-width="6"/>
<line x1="404" y1="578" x2="360" y2="578" stroke="#378ADD" stroke-width="6"/>
<line x1="404" y1="578" x2="404" y2="534" stroke="#378ADD" stroke-width="6"/>
<text x="210" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" letter-spacing="5" fill="#85B7EB">CERTIFICAT OFFICIEL</text>
<text x="210" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#ED93B1">${escapeXml(title.toUpperCase())}</text>
<text x="210" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" letter-spacing="1" fill="#B4B2A9">CE CERTIFICAT EST DÉCERNÉ À</text>
<text x="210" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#F4C0D1">${escapeXml(firstname.toUpperCase())}</text>
<line x1="90" y1="298" x2="330" y2="298" stroke="#378ADD" stroke-width="2"/>
<text x="210" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#B5D4F4">« ${escapeXml(phrase.toUpperCase())} »</text>
<text x="210" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="1" fill="#888780">DÉCERNÉ LE</text>
<text x="210" y="432" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#F1EFE8">${escapeXml(formatDate(date))}</text>
<rect x="150" y="480" width="120" height="40" fill="none" stroke="#ED93B1" stroke-width="2"/>
<text x="210" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="#ED93B1">CRAZYCERTIF</text>
<text x="210" y="565" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" letter-spacing="1" fill="#5F5E5A">CRAZYCERTIF.COM</text>
${photoBadge(image, "neon-p", { cx: 362, cy: 56, ring: "#1a1a1a" })}`,

  comic: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<defs>
  <linearGradient id="comic-bg-p" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#FFE566"/>
    <stop offset="45%" stop-color="#FF8FB1"/>
    <stop offset="100%" stop-color="#7FD8E8"/>
  </linearGradient>
</defs>
<rect x="0" y="0" width="420" height="594" fill="url(#comic-bg-p)"/>
<rect x="14" y="14" width="392" height="566" rx="18" fill="#ffffff" stroke="#2C2C2A" stroke-width="4"/>
<circle cx="40" cy="45" r="9" fill="#FF6F61"/>
<circle cx="70" cy="30" r="6" fill="#4FC3E8"/>
<circle cx="365" cy="40" r="8" fill="#7ED957"/>
<circle cx="385" cy="65" r="5" fill="#FFC93C"/>
<polygon points="35,545 45,530 55,545 45,560" fill="#FFC93C"/>
<polygon points="375,530 385,515 395,530 385,545" fill="#FF6F61"/>
<circle cx="200" cy="555" r="6" fill="#B683E3"/>
<circle cx="230" cy="560" r="4" fill="#4FC3E8"/>
<text x="210" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#B683E3">✦ CERTIFICAT OFFICIEL ✦</text>
<text x="210" y="168" text-anchor="middle" font-family="Arial, sans-serif" font-size="27" font-weight="800" fill="#FF6F61">${escapeXml(title.toUpperCase())}</text>
<text x="210" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#5F5E5A">DÉCERNÉ HAUT LA MAIN À</text>
<rect x="80" y="228" width="260" height="60" rx="30" fill="#FFE566" stroke="#2C2C2A" stroke-width="3" transform="rotate(-1.5 210 258)"/>
<text x="210" y="267" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#2C2C2A" transform="rotate(-1.5 210 258)">${escapeXml(firstname.toUpperCase())}</text>
<text x="210" y="335" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#2C2C2A">${escapeXml(phrase)}</text>
<text x="210" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="#8A857C">LE</text>
<text x="210" y="434" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="800" fill="#2C2C2A">${escapeXml(formatDate(date))}</text>
<circle cx="210" cy="495" r="38" fill="#7ED957" stroke="#2C2C2A" stroke-width="3"/>
<text x="210" y="491" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#ffffff">CRAZY</text>
<text x="210" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#ffffff">CERTIF</text>
<text x="210" y="562" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="#8A857C">crazycertif.com</text>
${photoBadge(image, "comic-p", { cx: 362, cy: 56 })}`,

  minimal: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="420" height="594" fill="#ffffff"/>
<line x1="60" y1="60" x2="360" y2="60" stroke="#1D9E75" stroke-width="1"/>
<text x="210" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="6" fill="#888780">CERTIFICAT OFFICIEL</text>
<text x="210" y="195" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="400" fill="#2C2C2A">${escapeXml(title)}</text>
<text x="210" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" letter-spacing="2" fill="#B4B2A9">DÉCERNÉ À</text>
<text x="210" y="320" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#1D9E75">${escapeXml(firstname)}</text>
<text x="210" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#5F5E5A">${escapeXml(phrase)}</text>
<text x="210" y="460" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="1" fill="#B4B2A9">${escapeXml(formatDate(date).toUpperCase())}</text>
<line x1="60" y1="534" x2="360" y2="534" stroke="#1D9E75" stroke-width="1"/>
<text x="210" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" letter-spacing="2" fill="#B4B2A9">CRAZYCERTIF.COM</text>
${photoBadge(image, "minimal-p", { cx: 362, cy: 56, ring: "#ffffff" })}`,

  grunge: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="420" height="594" fill="#161412"/>
<rect x="10" y="10" width="400" height="574" fill="none" stroke="#C93A3A" stroke-width="3" stroke-dasharray="9 5"/>
<polygon points="0,0 34,0 0,34" fill="#C93A3A"/>
<polygon points="420,594 386,594 420,560" fill="#C93A3A"/>
<line x1="30" y1="70" x2="390" y2="70" stroke="#5A5650" stroke-width="1"/>
<text x="210" y="105" text-anchor="middle" font-family="Courier New, monospace" font-size="12" letter-spacing="4" fill="#C93A3A">*** DOCUMENT OFFICIEL ***</text>
<text x="210" y="160" text-anchor="middle" font-family="Courier New, monospace" font-size="22" font-weight="700" fill="#F1EFE8">${escapeXml(title.toUpperCase())}</text>
<text x="210" y="215" text-anchor="middle" font-family="Courier New, monospace" font-size="11" letter-spacing="2" fill="#8A857C">DECERNE A :</text>
<text x="210" y="268" text-anchor="middle" font-family="Courier New, monospace" font-size="30" font-weight="700" fill="#F1EFE8">${escapeXml(firstname.toUpperCase())}</text>
<line x1="90" y1="285" x2="330" y2="285" stroke="#5A5650" stroke-width="1" stroke-dasharray="1 5"/>
<text x="210" y="335" text-anchor="middle" font-family="Courier New, monospace" font-size="13" fill="#D7D3C8">"${escapeXml(phrase.toUpperCase())}"</text>
<text x="210" y="400" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#8A857C">LE ${escapeXml(formatDate(date).toUpperCase())}</text>
<g transform="translate(210,485) rotate(-10)">
<circle cx="0" cy="0" r="46" fill="none" stroke="#C93A3A" stroke-width="4"/>
<circle cx="0" cy="0" r="37" fill="none" stroke="#C93A3A" stroke-width="1.5"/>
<text x="0" y="-6" text-anchor="middle" font-family="Courier New, monospace" font-size="12" font-weight="700" fill="#C93A3A">CRAZY</text>
<text x="0" y="11" text-anchor="middle" font-family="Courier New, monospace" font-size="12" font-weight="700" fill="#C93A3A">CERTIF</text>
</g>
<line x1="30" y1="524" x2="390" y2="524" stroke="#5A5650" stroke-width="1"/>
<text x="210" y="562" text-anchor="middle" font-family="Courier New, monospace" font-size="10" letter-spacing="1" fill="#8A857C">crazycertif.com</text>
${photoBadge(image, "grunge-p", { cx: 362, cy: 56, ring: "#161412" })}`,

  pastel: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<defs>
  <pattern id="pastel-dots-p" width="26" height="26" patternUnits="userSpaceOnUse">
    <circle cx="4" cy="4" r="2" fill="#F6C9D6"/>
  </pattern>
</defs>
<rect x="0" y="0" width="420" height="594" fill="#FFF7F2"/>
<rect x="0" y="0" width="420" height="594" fill="url(#pastel-dots-p)" opacity="0.6"/>
<rect x="22" y="22" width="376" height="550" rx="16" fill="#ffffff" stroke="#F0B8CB" stroke-width="2"/>
<polygon points="140,22 280,22 260,64 160,64" fill="#F6A5C0"/>
<text x="210" y="50" text-anchor="middle" font-family="Georgia, serif" font-size="12" letter-spacing="2" fill="#ffffff">officiel</text>
<text x="210" y="115" text-anchor="middle" font-family="Georgia, serif" font-size="27" font-weight="500" fill="#8A3B57">${escapeXml(title)}</text>
<path d="M90 140 q120 -22 240 0" fill="none" stroke="#F0B8CB" stroke-width="2"/>
<text x="210" y="195" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#B98CA0">décerné avec amour à</text>
<text x="210" y="250" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="34" font-weight="500" fill="#D4537E">${escapeXml(firstname)}</text>
<circle cx="95" cy="245" r="4" fill="#9AD8C4"/><circle cx="325" cy="248" r="5" fill="#F6C9D6"/>
<text x="210" y="310" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#72243E">${escapeXml(phrase)}</text>
<text x="210" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#B98CA0">${escapeXml(formatDate(date))}</text>
<rect x="165" y="455" width="90" height="70" rx="12" fill="#FDEFE6" stroke="#F0B8CB" stroke-width="1.5"/>
<text x="210" y="486" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#8A3B57">crazy</text>
<text x="210" y="502" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#8A3B57">certif</text>
<text x="210" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#B98CA0">crazycertif.com</text>
${photoBadge(image, "pastel-p", { cx: 362, cy: 56, ring: "#ffffff" })}`,
};

// ============================================================
// PAYSAGE — viewBox 594x420 — vraie mise en page horizontale,
// texte lisible normalement (pas une rotation du portrait).
// Le sceau/badge est déplacé sur le côté droit pour profiter de
// la largeur plutôt que d'empiler les éléments verticalement.
// ============================================================
const RENDERERS_LANDSCAPE = {
  parchemin: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="594" height="420" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/>
<rect x="14" y="14" width="566" height="392" fill="none" stroke="#BA7517" stroke-width="1.5"/>
<rect x="20" y="20" width="554" height="380" fill="none" stroke="#EF9F27" stroke-width="0.75"/>
<circle cx="40" cy="40" r="6" fill="#EF9F27"/><circle cx="554" cy="40" r="6" fill="#EF9F27"/>
<circle cx="40" cy="380" r="6" fill="#EF9F27"/><circle cx="554" cy="380" r="6" fill="#EF9F27"/>
<text x="247" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="4" fill="#854F0B">CERTIFICAT OFFICIEL</text>
<text x="247" y="122" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="500" fill="#412402">${escapeXml(title)}</text>
<line x1="147" y1="138" x2="347" y2="138" stroke="#EF9F27" stroke-width="1"/>
<text x="247" y="172" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#5F5E5A">Ce certificat est fièrement décerné à</text>
<text x="247" y="215" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="32" font-weight="500" fill="#4A1B0C">${escapeXml(firstname)}</text>
<line x1="107" y1="230" x2="387" y2="230" stroke="#D3D1C7" stroke-width="1"/>
<text x="247" y="270" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#412402">« ${escapeXml(phrase)} »</text>
<text x="247" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#888780">Décerné le ${escapeXml(formatDate(date))}</text>
<circle cx="512" cy="210" r="46" fill="#FAC775" stroke="#854F0B" stroke-width="2"/>
<circle cx="512" cy="210" r="38" fill="none" stroke="#854F0B" stroke-width="1"/>
<text x="512" y="206" text-anchor="middle" font-family="Georgia, serif" font-size="10" letter-spacing="1" fill="#412402">CRAZY</text>
<text x="512" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="10" letter-spacing="1" fill="#412402">CERTIF</text>
<text x="247" y="392" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#888780">crazycertif.com</text>
${photoBadge(image, "parchemin-l", { cx: 82, cy: 60 })}`,

  neon: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="594" height="420" fill="#1a1a1a"/>
<rect x="16" y="16" width="562" height="388" fill="none" stroke="#ED93B1" stroke-width="3"/>
<rect x="26" y="26" width="542" height="368" fill="none" stroke="#85B7EB" stroke-width="1.5"/>
<line x1="16" y1="16" x2="60" y2="16" stroke="#D4537E" stroke-width="6"/>
<line x1="16" y1="16" x2="16" y2="60" stroke="#D4537E" stroke-width="6"/>
<line x1="578" y1="404" x2="534" y2="404" stroke="#378ADD" stroke-width="6"/>
<line x1="578" y1="404" x2="578" y2="360" stroke="#378ADD" stroke-width="6"/>
<text x="247" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" letter-spacing="4" fill="#85B7EB">CERTIFICAT OFFICIEL</text>
<text x="247" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ED93B1">${escapeXml(title.toUpperCase())}</text>
<text x="247" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="1" fill="#B4B2A9">CE CERTIFICAT EST DÉCERNÉ À</text>
<text x="247" y="205" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#F4C0D1">${escapeXml(firstname.toUpperCase())}</text>
<line x1="107" y1="222" x2="387" y2="222" stroke="#378ADD" stroke-width="2"/>
<text x="247" y="258" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#B5D4F4">« ${escapeXml(phrase.toUpperCase())} »</text>
<text x="247" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#F1EFE8">DÉCERNÉ LE ${escapeXml(formatDate(date).toUpperCase())}</text>
<rect x="472" y="182" width="90" height="56" fill="none" stroke="#ED93B1" stroke-width="2"/>
<text x="517" y="208" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1" fill="#ED93B1">CRAZY</text>
<text x="517" y="222" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1" fill="#ED93B1">CERTIF</text>
<text x="247" y="392" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" letter-spacing="1" fill="#5F5E5A">CRAZYCERTIF.COM</text>
${photoBadge(image, "neon-l", { cx: 82, cy: 60, ring: "#1a1a1a" })}`,

  comic: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<defs>
  <linearGradient id="comic-bg-l" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#FFE566"/>
    <stop offset="45%" stop-color="#FF8FB1"/>
    <stop offset="100%" stop-color="#7FD8E8"/>
  </linearGradient>
</defs>
<rect x="0" y="0" width="594" height="420" fill="url(#comic-bg-l)"/>
<rect x="14" y="14" width="566" height="392" rx="18" fill="#ffffff" stroke="#2C2C2A" stroke-width="4"/>
<circle cx="40" cy="42" r="8" fill="#FF6F61"/><circle cx="66" cy="30" r="5" fill="#4FC3E8"/>
<circle cx="554" cy="40" r="7" fill="#7ED957"/><circle cx="572" cy="60" r="5" fill="#FFC93C"/>
<polygon points="35,378 45,364 55,378 45,392" fill="#FFC93C"/>
<polygon points="549,364 559,350 569,364 559,378" fill="#FF6F61"/>
<text x="247" y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#B683E3">✦ CERTIFICAT OFFICIEL ✦</text>
<text x="247" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#FF6F61">${escapeXml(title.toUpperCase())}</text>
<text x="247" y="152" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#5F5E5A">DÉCERNÉ HAUT LA MAIN À</text>
<rect x="132" y="166" width="230" height="52" rx="26" fill="#FFE566" stroke="#2C2C2A" stroke-width="3" transform="rotate(-1.5 247 192)"/>
<text x="247" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#2C2C2A" transform="rotate(-1.5 247 192)">${escapeXml(firstname.toUpperCase())}</text>
<text x="247" y="252" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#2C2C2A">${escapeXml(phrase)}</text>
<text x="247" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="800" fill="#2C2C2A">LE ${escapeXml(formatDate(date))}</text>
<circle cx="517" cy="215" r="34" fill="#7ED957" stroke="#2C2C2A" stroke-width="3"/>
<text x="517" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="800" fill="#ffffff">CRAZY</text>
<text x="517" y="224" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="800" fill="#ffffff">CERTIF</text>
<text x="247" y="392" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="#8A857C">crazycertif.com</text>
${photoBadge(image, "comic-l", { cx: 77, cy: 215, r: 26 })}`,

  minimal: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="594" height="420" fill="#ffffff"/>
<line x1="90" y1="55" x2="504" y2="55" stroke="#1D9E75" stroke-width="1"/>
<text x="297" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="6" fill="#888780">CERTIFICAT OFFICIEL</text>
<text x="297" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="400" fill="#2C2C2A">${escapeXml(title)}</text>
<text x="297" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" letter-spacing="2" fill="#B4B2A9">DÉCERNÉ À</text>
<text x="297" y="242" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#1D9E75">${escapeXml(firstname)}</text>
<text x="297" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#5F5E5A">${escapeXml(phrase)}</text>
<text x="297" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="1" fill="#B4B2A9">${escapeXml(formatDate(date).toUpperCase())}</text>
<line x1="90" y1="365" x2="504" y2="365" stroke="#1D9E75" stroke-width="1"/>
<text x="297" y="392" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" letter-spacing="2" fill="#B4B2A9">CRAZYCERTIF.COM</text>
${photoBadge(image, "minimal-l", { cx: 534, cy: 56, ring: "#ffffff" })}`,

  grunge: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<rect x="0" y="0" width="594" height="420" fill="#161412"/>
<rect x="10" y="10" width="574" height="400" fill="none" stroke="#C93A3A" stroke-width="3" stroke-dasharray="9 5"/>
<polygon points="0,0 34,0 0,34" fill="#C93A3A"/>
<polygon points="594,420 560,420 594,386" fill="#C93A3A"/>
<line x1="30" y1="60" x2="564" y2="60" stroke="#5A5650" stroke-width="1"/>
<text x="247" y="92" text-anchor="middle" font-family="Courier New, monospace" font-size="12" letter-spacing="3" fill="#C93A3A">*** DOCUMENT OFFICIEL ***</text>
<text x="247" y="132" text-anchor="middle" font-family="Courier New, monospace" font-size="20" font-weight="700" fill="#F1EFE8">${escapeXml(title.toUpperCase())}</text>
<text x="247" y="168" text-anchor="middle" font-family="Courier New, monospace" font-size="11" letter-spacing="2" fill="#8A857C">DECERNE A :</text>
<text x="247" y="208" text-anchor="middle" font-family="Courier New, monospace" font-size="26" font-weight="700" fill="#F1EFE8">${escapeXml(firstname.toUpperCase())}</text>
<line x1="107" y1="222" x2="387" y2="222" stroke="#5A5650" stroke-width="1" stroke-dasharray="1 5"/>
<text x="247" y="258" text-anchor="middle" font-family="Courier New, monospace" font-size="13" fill="#D7D3C8">"${escapeXml(phrase.toUpperCase())}"</text>
<text x="247" y="330" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#8A857C">LE ${escapeXml(formatDate(date).toUpperCase())}</text>
<g transform="translate(517,210) rotate(-10)">
<circle cx="0" cy="0" r="40" fill="none" stroke="#C93A3A" stroke-width="4"/>
<circle cx="0" cy="0" r="32" fill="none" stroke="#C93A3A" stroke-width="1.5"/>
<text x="0" y="-5" text-anchor="middle" font-family="Courier New, monospace" font-size="10" font-weight="700" fill="#C93A3A">CRAZY</text>
<text x="0" y="9" text-anchor="middle" font-family="Courier New, monospace" font-size="10" font-weight="700" fill="#C93A3A">CERTIF</text>
</g>
<line x1="30" y1="350" x2="564" y2="350" stroke="#5A5650" stroke-width="1"/>
<text x="247" y="392" text-anchor="middle" font-family="Courier New, monospace" font-size="10" letter-spacing="1" fill="#8A857C">crazycertif.com</text>
${photoBadge(image, "grunge-l", { cx: 77, cy: 60, ring: "#161412" })}`,

  pastel: ({ title, firstname, date, phrase, image }) => `
<title>${escapeXml(title)}</title>
<defs>
  <pattern id="pastel-dots-l" width="26" height="26" patternUnits="userSpaceOnUse">
    <circle cx="4" cy="4" r="2" fill="#F6C9D6"/>
  </pattern>
</defs>
<rect x="0" y="0" width="594" height="420" fill="#FFF7F2"/>
<rect x="0" y="0" width="594" height="420" fill="url(#pastel-dots-l)" opacity="0.6"/>
<rect x="22" y="22" width="550" height="376" rx="16" fill="#ffffff" stroke="#F0B8CB" stroke-width="2"/>
<polygon points="197,22 337,22 317,58 217,58" fill="#F6A5C0"/>
<text x="247" y="46" text-anchor="middle" font-family="Georgia, serif" font-size="11" letter-spacing="2" fill="#ffffff">officiel</text>
<text x="247" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="25" font-weight="500" fill="#8A3B57">${escapeXml(title)}</text>
<path d="M127 128 q120 -18 240 0" fill="none" stroke="#F0B8CB" stroke-width="2"/>
<text x="247" y="168" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#B98CA0">décerné avec amour à</text>
<text x="247" y="212" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="30" font-weight="500" fill="#D4537E">${escapeXml(firstname)}</text>
<circle cx="132" cy="207" r="4" fill="#9AD8C4"/><circle cx="362" cy="210" r="5" fill="#F6C9D6"/>
<text x="247" y="262" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#72243E">${escapeXml(phrase)}</text>
<text x="247" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#B98CA0">${escapeXml(formatDate(date))}</text>
<rect x="482" y="178" width="76" height="60" rx="12" fill="#FDEFE6" stroke="#F0B8CB" stroke-width="1.5"/>
<text x="520" y="204" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#8A3B57">crazy</text>
<text x="520" y="218" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#8A3B57">certif</text>
<text x="247" y="392" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#B98CA0">crazycertif.com</text>
${photoBadge(image, "pastel-l", { cx: 77, cy: 60, ring: "#ffffff" })}`,
};

/**
 * Génère le SVG complet d'un certificat.
 * @param {string} styleId - id du style (parchemin, neon, comic, minimal, grunge, pastel)
 * @param {{title:string, firstname:string, date:string, phrase:string, image?:string}} content
 *        image : data URL (base64) de la photo optionnelle uploadée par le client, ou null/undefined.
 * @param {"portrait"|"landscape"} [orientation="portrait"]
 * @returns {string} SVG complet A4 — viewBox 420x594 en portrait, 594x420 en paysage.
 *          Le paysage est une vraie composition horizontale dédiée (pas une rotation).
 */
export function renderCertificate(styleId, content, orientation = "portrait") {
  const set = orientation === "landscape" ? RENDERERS_LANDSCAPE : RENDERERS_PORTRAIT;
  const renderer = set[styleId];
  if (!renderer) throw new Error(`Style inconnu : ${styleId} (${orientation})`);
  const safe = {
    title: content.title || "",
    firstname: content.firstname || "Votre prénom",
    date: content.date || "",
    phrase: content.phrase || "",
    image: content.image || null,
  };
  const inner = renderer(safe).trim();
  const viewBox = orientation === "landscape" ? "0 0 594 420" : "0 0 420 594";

  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" role="img">
${inner}
</svg>`;
}

export const AVAILABLE_STYLE_IDS = Object.keys(RENDERERS_PORTRAIT);
export const ORIENTATIONS = ["portrait", "landscape"];

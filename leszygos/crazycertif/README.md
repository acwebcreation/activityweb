# CrazyCertif

Certificats et diplômes absurdes personnalisés, format A4 PDF.

## Parcours (v2 — catégorie d'abord)

1. **index.html** — le client choisit une occasion/catégorie (Flemme, Boulot,
   Amitié, Fêtes, Famille, Halloween, Noël, Nouvel An, Anniversaire), chacune
   avec sa couleur thème et son nombre de titres/phrases affiché.
2. **category.html?cat=xxx** — affiche 20 certificats déjà remplis avec de
   vrais titres/phrases de cette catégorie, répartis sur les 6 styles visuels
   (parchemin, néon, fiesta pop, minimaliste, grunge, cocooning pastel). Le
   client choisit son pack (1 ou 3 certificats à 5€/12€) puis sélectionne
   ses cartes préférées → paiement Stripe.
3. **personalize.html?session=...** — après paiement, chaque certificat est
   **préchargé** avec le combo choisi sur la page catégorie (style + titre +
   phrase). Le client n'a plus qu'à ajuster prénom / date / photo /
   orientation — ou changer catégorie/titre/phrase s'il change d'avis.

C'est le même principe qu'avant (paiement avant personnalisation, pour éviter
le screenshot-and-DIY), mais la page d'entrée est bien plus engageante :
du contenu concret et coloré plutôt qu'une grille de styles vides.

## Structure (fichiers principaux à la racine)

```
index.html            Page d'accueil : sélection de catégorie
category.html          20 aperçus remplis de la catégorie + pricing + paiement
personalize.html       Personnalisation après paiement (préremplie)
category-select.js     Logique de index.html
gallery.js              Logique de category.html
personalize.js          Logique de personalize.html
styles.css              Styles partagés (toutes les pages)

src/data/
  content.js             Catégories (titres, phrases, themeColor, emoji),
                          styles visuels, generateCategoryTemplates()
  renderTemplate.js       Génère le SVG (portrait ET paysage, vraies mises
                          en page distinctes — pas une rotation)

netlify/functions/
  create-checkout.js      Crée la session Stripe (combos en metadata JSON)
  verify-session.js       Vérifie le paiement, renvoie les combos achetés
  generate-pdf.js          Revérifie le paiement, régénère les SVG, export PDF
  download-pdf.js          Sert le PDF stocké 24h
```

## Étendre le catalogue

Tout se pilote depuis `src/data/content.js` :
- Ajouter une catégorie → nouvel objet dans `CATEGORIES` (id, name, themeColor,
  emoji, titles, phrases). Apparaît automatiquement sur `index.html` et génère
  ses 20 aperçus sur `category.html`.
- Ajouter un style visuel → nouvelle entrée dans `STYLES` + son renderer dans
  `renderTemplate.js` (portrait ET paysage).

## À brancher avant mise en prod

- Variables d'environnement : `STRIPE_SECRET_KEY`, `SITE_URL`
- Un vrai service d'email (Resend/Postmark) dans `generate-pdf.js` si `email`
  est fourni
- Netlify Blobs pour le stockage temporaire des PDF — déjà câblé
- Le bouton "🧪 Tester sans payer" sur `index.html` est un raccourci de
  développement (bypass total de Stripe) — à retirer ou protéger avant une
  mise en ligne publique

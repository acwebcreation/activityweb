// content.js
// Source unique de vérité pour CrazyCertif : catégories, titres, phrases, styles.
// Un style visuel (gabarit) est totalement indépendant d'une catégorie de contenu :
// n'importe quel style peut afficher n'importe quelle catégorie/titre/phrase.

export const STYLES = [
  {
    id: "parchemin",
    name: "Parchemin classique",
    description: "Cadre doré gravé, sceau rond, ambiance diplôme traditionnel",
  },
  {
    id: "neon",
    name: "Néon rétro",
    description: "Fond noir, bordures fluo rose et cyan, typo bold",
  },
  {
    id: "comic",
    name: "Fiesta pop",
    description: "Fond arc-en-ciel, confettis et ballons, gros lettrage fun — le style coloré ados/enfants",
  },
  {
    id: "minimal",
    name: "Minimaliste moderne",
    description: "Fond blanc, une ligne fine de couleur, beaucoup d'espace",
  },
  {
    id: "grunge",
    name: "Grunge tampon",
    description: "Fond sombre, tampon rouge incliné, coins déchirés, look affiche officielle",
  },
  {
    id: "pastel",
    name: "Cocooning pastel",
    description: "Bandeau-ruban, fond à pois, cadre arrondi — ambiance douce et chaleureuse",
  },
];

export const CATEGORIES = [
  {
    id: "flemme",
    name: "Flemme / Anti-motivation",
    themeColor: "#B9773F",
    emoji: "😴",
    titles: [
      "Diplôme du Roi de la Flemme",
      "Certificat Officiel d'Anti-Motivation",
      "Brevet de Maître Procrastinateur",
      "Diplôme de Sieste Professionnelle",
      "Certificat de Résistance à l'Effort",
      "Diplôme du Snooze Olympique",
    ],
    phrases: [
      "Pour avoir survécu à un lundi sans café",
      "Pour avoir remis à demain avec brio",
      "Pour excellence en report de tâches",
      "Pour avoir gagné contre son réveil (0 fois)",
      "Pour avoir dormi malgré 5 alarmes",
      "Pour talent inné en procrastination",
      "Pour avoir dit \"je commence lundi\" 52 fois cette année",
      "Pour avoir choisi la sieste plutôt que la gloire",
      "Pour résistance héroïque à toute forme d'effort",
    ],
  },
  {
    id: "boulot",
    name: "Boulot / Réunions",
    themeColor: "#4C6FA5",
    emoji: "💼",
    titles: [
      "Certificat de Survie en Réunion",
      "Diplôme de Résistance au Boulot",
      "Brevet du Café-Machine Expert",
      "Certificat de Multitâche Approximatif",
      "Diplôme du Vendredi Bien Mérité",
      "Certificat Officiel de \"Ça Marche\"",
    ],
    phrases: [
      "Pour avoir survécu à une réunion qui aurait pu être un email",
      "Pour talent exceptionnel en café-machine",
      "Pour avoir hoché la tête sans rien comprendre",
      "Pour avoir tenu jusqu'au vendredi",
      "Pour avoir répondu \"ça marche\" sans rien noter",
      "Pour maîtrise experte du silence gênant en visio",
      "Pour avoir survécu à un \"petit point rapide\" de 2h",
      "Pour avoir fait semblant d'écrire pendant qu'on parlait de foot",
      "Pour ténacité exemplaire un vendredi à 17h",
    ],
  },
  {
    id: "amitie",
    name: "Amitié / Couple",
    themeColor: "#D4537E",
    emoji: "🤝",
    titles: [
      "Brevet Officiel de Supportage",
      "Diplôme du Meilleur Pote",
      "Certificat de Patience Infinie",
      "Diplôme de Fidélité à Toute Épreuve",
      "Brevet du Confident Officiel",
      "Certificat d'Amitié Inébranlable",
    ],
    phrases: [
      "Pour patience infinie et sans faille",
      "Pour avoir supporté mes histoires 100 fois racontées",
      "Pour présence assurée même dans les pires idées",
      "Pour fidélité à toute épreuve (même à 3h du mat')",
      "Pour avoir toujours la bonne excuse prête",
      "Pour soutien logistique en toute situation (déménagement inclus)",
      "Pour avoir ri à la même blague pour la 10e fois",
      "Pour disponibilité totale, même à l'improviste",
      "Pour avoir dit \"oui\" à toutes les mauvaises idées",
    ],
  },
  {
    id: "fetes",
    name: "Fêtes / Saisonnier",
    themeColor: "#C9932B",
    emoji: "🎉",
    titles: [
      "Certificat de Bonnes Résolutions Ratées",
      "Diplôme de Survie à la Rentrée",
      "Certificat de Retard aux Fêtes",
      "Diplôme du Cadeau de Dernière Minute",
      "Certificat de Résistance au Repas de Famille",
      "Diplôme du Réveillon Légendaire",
    ],
    phrases: [
      "Pour avoir tenu sa résolution... 3 jours",
      "Pour avoir survécu à la rentrée sans pleurer",
      "Pour optimisme légendaire chaque 1er janvier",
      "Pour avoir recommencé le sport (une fois)",
      "Pour avoir survécu au repas de famille sans clash",
      "Pour record personnel de retard aux fêtes",
      "Pour avoir offert un cadeau la veille pour la veille",
      "Pour avoir tenu le rythme des soirées de fin d'année",
      "Pour espoir renouvelé chaque nouvelle année",
    ],
  },
  {
    id: "famille",
    name: "Famille",
    themeColor: "#5C9B7A",
    emoji: "❤️",
    titles: [
      "Diplôme du Meilleur Papa",
      "Diplôme de la Meilleure Maman",
      "Certificat Officiel de Super Mamie / Papi",
      "Brevet du Meilleur Enfant du Monde",
      "Certificat de Patience Parentale Illimitée",
      "Diplôme de la Famille la Plus Folle",
    ],
    phrases: [
      "Pour amour inconditionnel et sans limite",
      "Pour avoir supporté mes crises depuis toujours",
      "Pour excellence en câlins et bons conseils",
      "Pour avoir toujours cru en moi, même quand j'y croyais pas",
      "Pour disponibilité 24h/24, même à 3h du mat'",
      "Pour talent naturel à tout réparer (ou presque)",
      "Pour avoir survécu à l'adolescence (la mienne)",
      "Pour cœur toujours ouvert, porte toujours ouverte",
      "Pour fous rires en famille inoubliables",
      "Pour présence à chaque étape importante",
    ],
  },
  {
    id: "halloween",
    name: "Halloween",
    themeColor: "#D9631E",
    emoji: "🎃",
    titles: [
      "Certificat Officiel de Trouille Assumée",
      "Diplôme du Meilleur Déguisement Raté",
      "Brevet de Survie à la Maison Hantée",
      "Certificat de Chasseur de Bonbons Professionnel",
      "Diplôme de la Pire Citrouille Sculptée",
      "Certificat Officiel de Sorcière / Sorcier Confirmé(e)",
    ],
    phrases: [
      "Pour avoir crié plus fort que tout le monde",
      "Pour avoir mangé tous les bonbons avant les enfants",
      "Pour déguisement improvisé la veille au soir",
      "Pour talent inégalé en sculpture de citrouille ratée",
      "Pour avoir eu peur de sa propre décoration",
      "Pour record personnel de bonbons volés au frère/à la sœur",
      "Pour bravoure exceptionnelle face à une simple araignée en plastique",
      "Pour avoir refusé d'ouvrir la porte toute la soirée",
      "Pour meilleur cri de sorcière du quartier",
    ],
  },
  {
    id: "noel",
    name: "Noël",
    themeColor: "#B4302E",
    emoji: "🎄",
    titles: [
      "Certificat Officiel du Plus Sage de l'Année (Presque)",
      "Diplôme du Meilleur Ouvreur de Cadeaux",
      "Brevet de Survie au Repas de Noël",
      "Certificat de Champion du Pull Moche",
      "Diplôme du Père Noël Assistant Officiel",
      "Certificat de Résistance aux Chants de Noël en Boucle",
    ],
    phrases: [
      "Pour avoir deviné son cadeau avant l'heure",
      "Pour talent exceptionnel en emballage cadeau approximatif",
      "Pour avoir survécu à Tonton au repas de Noël",
      "Pour port du pull le plus moche avec fierté assumée",
      "Pour avoir cru au Père Noël un an de plus que prévu",
      "Pour avoir écouté \"Petit Papa Noël\" 47 fois sans craquer",
      "Pour avoir mangé plus de bûche que quiconque",
      "Pour patience légendaire pendant l'ouverture des cadeaux des autres",
      "Pour esprit de Noël inébranlable, même un 5 décembre",
    ],
  },
  {
    id: "nouvel-an",
    name: "Nouvel An",
    themeColor: "#8858B5",
    emoji: "🥂",
    titles: [
      "Certificat Officiel de Résolution Prise au Sérieux (5 Minutes)",
      "Diplôme du Dernier Debout à Minuit",
      "Brevet de Survie au Réveillon",
      "Certificat de Vœux les Plus Optimistes",
      "Diplôme du Meilleur Toast de Nouvel An",
      "Certificat Officiel de Nouvelle Année, Même Motivation",
    ],
    phrases: [
      "Pour avoir tenu debout jusqu'à minuit sans s'endormir",
      "Pour optimisme inébranlable chaque 1er janvier",
      "Pour avoir embrassé tout le monde deux fois par erreur",
      "Pour discours de minuit le plus improvisé",
      "Pour avoir dit \"cette année c'est la bonne\" une fois de plus",
      "Pour record de coupes de champagne renversées",
      "Pour avoir survécu au réveillon sans dormir avant 3h",
      "Pour avoir pris une résolution qu'il/elle ne tiendra pas",
    ],
  },
  {
    id: "anniversaire",
    name: "Anniversaire",
    themeColor: "#3E9BC2",
    emoji: "🎂",
    titles: [
      "Diplôme Officiel d'une Année de Plus",
      "Certificat de Sagesse Toute Relative",
      "Brevet du Meilleur Gâteau Soufflé d'un Coup",
      "Certificat de Résistance au Temps qui Passe",
      "Diplôme du Roi / de la Reine du Jour",
      "Certificat Officiel de Légende Vivante",
    ],
    phrases: [
      "Pour avoir soufflé toutes les bougies du premier coup",
      "Pour une année de plus, pas forcément de sagesse",
      "Pour avoir menti sur son âge avec assurance",
      "Pour avoir fait semblant d'aimer tous ses cadeaux",
      "Pour longévité exceptionnelle malgré les apparences",
      "Pour avoir survécu jusqu'ici, contre toute attente",
      "Pour élégance légendaire face au temps qui passe",
    ],
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

// Permet au client de choisir "Certificat" ou "Diplôme" indépendamment du titre
// prédéfini, en remplaçant uniquement le premier mot du titre (Diplôme/Certificat/Brevet)
// tout en gardant le reste intact (ex: "Certificat Officiel d'Anti-Motivation" devient
// "Diplôme Officiel d'Anti-Motivation").
export function applyTitleType(title, type) {
  const label = type === "diplome" ? "Diplôme" : "Certificat";
  return title.replace(/^(Diplôme|Certificat|Brevet)/, label);
}

// Détecte le type affiché par défaut pour un titre donné (utilisé pour préremplir
// le sélecteur Certificat/Diplôme quand l'utilisateur change de titre).
export function detectTitleType(title) {
  return /^Diplôme/.test(title) ? "diplome" : "certificat";
}

export function getStyle(id) {
  return STYLES.find((s) => s.id === id);
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Trouve un pas premier avec `length`, pour que le cycle (i * step) % length
// parcoure bien toutes les valeurs possibles avant de se répéter, au lieu de
// ne retomber que sur une poignée d'entre elles (ex: pas=3 avec 9 éléments
// ne donnerait que 3 valeurs distinctes).
function coprimeStep(length) {
  if (length <= 1) return 1;
  for (let step = 7; step < length + 7; step++) {
    if (gcd(step, length) === 1) return step;
  }
  return 1;
}

// Génère `count` combinaisons (style + titre + phrase) pour une catégorie donnée,
// utilisées pour peupler la grille de 20 aperçus déjà remplis sur la page catégorie.
export function generateCategoryTemplates(categoryId, count = 20) {
  const category = getCategory(categoryId);
  if (!category) return [];
  const styleIds = STYLES.map((s) => s.id);
  const titleStep = coprimeStep(category.titles.length);
  const phraseStep = coprimeStep(category.phrases.length);
  const templates = [];
  for (let i = 0; i < count; i++) {
    templates.push({
      style: styleIds[i % styleIds.length],
      title: category.titles[(i * titleStep) % category.titles.length],
      phrase: category.phrases[(i * phraseStep) % category.phrases.length],
      categoryId,
    });
  }
  return templates;
}

export const PRICING = {
  single: { count: 1, price: 5 },
  pack: { count: 3, price: 12 },
};

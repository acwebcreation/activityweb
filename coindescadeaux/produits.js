/* ============ RÉGLAGES ============ */
const CONFIG = {
  tag: "mauvaiseshabi-21",
  domaine: "www.amazon.fr",
  formulaire: ""   // ← adresse Formspree, ex. "https://formspree.io/f/abcdwxyz" — le formulaire reste caché tant que c'est vide
};

/* ============ LISTES DES FILTRES ============ */
const POUR_QUI = {
  papa:"Papa", maman:"Maman", homme:"Homme", femme:"Femme", couple:"Couple", ado:"Ado", enfant:"Enfant",
  grandsparents:"Grands-parents", collegue:"Collègue", geek:"Geek", gamer:"Gamer", cuisinier:"Fan de cuisine",
  jardinier:"Jardinier", voyageur:"Voyageur", sportif:"Sportif", animaux:"Fan d'animaux", musicien:"Musicien"
};
const OCCASIONS = {
  noel:"🎄 Noël", anniversaire:"🎂 Anniversaire", secret:"🎁 Secret Santa (< 20 €)", stvalentin:"❤️ Saint-Valentin",
  peres:"👨 Fête des pères", meres:"👩 Fête des mères", cremaillere:"🏠 Crémaillère", soi:"😎 Se faire plaisir"
};
const BUDGETS = {1:"< 20 €", 2:"20–50 €", 3:"50–150 €", 4:"150–500 €", 5:"500 € +"};
const BUDGETS_LONG = {1:"Moins de 20 €", 2:"20 à 50 €", 3:"50 à 150 €", 4:"150 à 500 €", 5:"Folies : plus de 500 €"};

/* ============ CATÉGORIES (r = rayon) ============ */
const CATS = {
  confort:  {r:"fun",   label:"😴 Confort & flemme"},
  cuisine:  {r:"fun",   label:"🍳 Cuisine absurde"},
  fete:     {r:"fun",   label:"🎉 Fêtes & soirées"},
  musique:  {r:"fun",   label:"🎵 Musique & son"},
  jeux:     {r:"fun",   label:"🎲 Jeux de société & plein air"},
  geek:     {r:"fun",   label:"🤓 Geek & déco"},
  blague:   {r:"fun",   label:"🤡 Blagues & idioties"},
  animaux:  {r:"fun",   label:"🐾 Pour les animaux"},
  folies:   {r:"fun",   label:"💎 Folies hors de prix"}
};

/* ============ PRODUITS ============
   n = nom, d = description, e = emoji, c = catégorie
   p = pour qui, b = budget (1 à 5), q = recherche Amazon (utilisée si pas d'url)
   url = lien affilié direct, image = URL de la photo, top = coup de cœur, o = occasions en plus
   (Noël et anniversaire sont ajoutés partout ; fête des pères/mères, Saint-Valentin, Secret Santa,
    crémaillère et « se faire plaisir » sont déduits automatiquement — voir la fonction occasions())
   Les nouveaux produits s'ajoutent À LA FIN de la liste : ils apparaissent en premier dans « Nouveautés ».
*/
const PRODUITS = [
  {n:"Oreiller autruche", e:"😴", c:"confort", p:["collegue","ado","voyageur"], b:1, q:"oreiller autruche sieste", top:true,
   url:"https://link.amazon/B0gsjgFnl", image:"https://m.media-amazon.com/images/I/61uskpJfVlL._AC_SX679_.jpg",
   d:"Pour faire la sieste n'importe où, n'importe quand. La dignité est vendue séparément."},
  {n:"Couverture tortilla géante", e:"🌯", c:"confort", p:["ado","couple","enfant"], b:1, q:"couverture tortilla géante", top:true,
   url:"https://link.amazon/B0gthWMxF", image:"https://m.media-amazon.com/images/I/81n53JplUaL._AC_SL1500_.jpg",
   d:"Deviens un burrito humain. Le guacamole n'est pas fourni."},
  {n:"Plaid à manches", e:"🛋️", c:"confort", p:["maman","papa","grandsparents"], b:1, q:"plaid à manches",
   d:"Un plaid avec des manches. L'humanité a enfin atteint son sommet."},
  {n:"Hamac pour pieds sous le bureau", e:"🦶", c:"confort", p:["collegue","geek"], b:1, q:"hamac pieds bureau",
   d:"Tes pieds en vacances pendant que tu réponds aux mails. Ton manager n'a pas besoin de savoir."},
  {n:"Chaussons chauffants USB", e:"🔌", c:"confort", p:["geek","collegue","gamer"], b:1, q:"chaussons chauffants usb",
   d:"Branchés sur l'ordi, tes pieds sont enfin aussi chauds que ton processeur."},
  {n:"Pyjama combinaison dinosaure", e:"🦖", c:"confort", p:["ado","couple"], b:1, q:"pyjama combinaison dinosaure adulte",
   d:"Idéal pour les visios caméra éteinte. Ou allumée, on ne juge pas."},
  {n:"Chaussons requin", e:"🦈", c:"confort", p:["ado","enfant"], b:1, q:"chaussons requin",
   d:"Les Dents de la mer, version salon."},
  {n:"Oreiller bras câlin", e:"🤗", c:"confort", p:["ado","collegue"], b:1, q:"oreiller bras petit ami",
   d:"Un bras qui t'enlace toute la nuit et qui ne ronfle jamais."},
  {n:"Bain de pieds massant", e:"🛁", c:"confort", p:["maman","papa","grandsparents"], b:2, q:"bain de pieds massant",
   d:"Le spa, mais dans le salon, devant la série, avec les chips."},
  {n:"Coussin massant shiatsu", e:"💆", c:"confort", p:["papa","maman","grandsparents"], b:2, q:"coussin massant shiatsu chauffant",
   d:"Un kiné de poche qui ne pose pas de questions sur ta posture."},

  {n:"Coupe-banane", e:"🍌", c:"cuisine", p:["papa","maman","collegue","cuisinier"], b:1, q:"coupe banane", top:true,
   url:"https://link.amazon/B0iphsxuM", image:"https://m.media-amazon.com/images/I/71Xw8yDLnxL._AC_SL1500_.jpg",
   d:"Découpe une banane en rondelles d'un coup. Révolutionnaire. Inutile. Indispensable."},
  {n:"Tasse auto-mélangeuse", e:"🌀", c:"cuisine", p:["collegue","geek"], b:1, q:"tasse auto mélangeuse",
   d:"Appuie sur le bouton, elle touille toute seule. La flemme, niveau expert."},
  {n:"Chauffe-tasse USB", e:"🔥", c:"cuisine", p:["collegue","geek","gamer"], b:1, q:"chauffe tasse usb",
   d:"Le café reste chaud pendant la 4e réunion qui aurait pu être un mail."},
  {n:"Raclette à la bougie pour deux", e:"🧀", c:"cuisine", p:["couple"], b:1, q:"raclette bougie 2 personnes", top:true,
   d:"Le romantisme a une odeur, et c'est celle du fromage fondu."},
  {n:"Machine à barbe à papa", e:"🍭", c:"cuisine", p:["ado","enfant","maman"], b:2, q:"machine barbe à papa",
   d:"La fête foraine dans la cuisine. Le sucre sur le plafond aussi."},
  {n:"Fontaine à chocolat", e:"🍫", c:"cuisine", p:["couple","maman","enfant"], b:2, q:"fontaine à chocolat",
   d:"Tremper des fraises dans une cascade de chocolat : la vraie définition du luxe."},
  {n:"Cuiseur à œufs électrique", e:"🥚", c:"cuisine", p:["papa","cuisinier"], b:1, q:"cuiseur oeufs électrique",
   d:"Pour ceux qui arrivent à rater même les œufs durs."},
  {n:"Distributeur de céréales", e:"🥣", c:"cuisine", p:["ado","enfant"], b:1, q:"distributeur céréales",
   d:"Le petit-déj comme à l'hôtel, mais en pyjama dinosaure."},
  {n:"Moule à glaçons boules", e:"🧊", c:"cuisine", p:["papa","couple"], b:1, q:"moule glaçons boule",
   d:"Des glaçons ronds. Les carrés, c'est pour les amateurs."},
  {n:"Couteau à beurre râpe", e:"🧈", c:"cuisine", p:["maman","papa","cuisinier"], b:1, q:"couteau à beurre râpe",
   d:"Il râpe le beurre sorti du frigo. Fini les tartines déchirées."},
  {n:"Machine à popcorn rétro", e:"🍿", c:"cuisine", p:["ado","couple","enfant"], b:2, q:"machine popcorn rétro",
   d:"Le cinéma à la maison, avec l'odeur et le bruit qui va avec."},
  {n:"Four à pizza d'extérieur", e:"🍕", c:"cuisine", p:["papa","cuisinier"], b:4, q:"four à pizza extérieur",
   d:"Pizza napolitaine en quelques minutes dans le jardin. Ton barbecue est jaloux."},

  {n:"Pull de Noël moche", e:"🎄", c:"fete", p:["papa","maman","collegue","ado"], b:1, q:"pull de noel moche", top:true,
   d:"Plus il est moche, plus il est réussi. C'est la règle."},
  {n:"Pull de Noël lumineux", e:"💡", c:"fete", p:["collegue","papa"], b:1, q:"pull de noel led lumineux",
   d:"Pour être visible depuis l'espace au repas d'entreprise."},
  {n:"Machine à bulles", e:"🫧", c:"fete", p:["ado","couple","enfant"], b:1, q:"machine à bulles",
   d:"Transforme n'importe quelle soirée en clip des années 90."},
  {n:"Enceinte de douche", e:"🎤", c:"fete", p:["ado"], b:1, q:"enceinte de douche étanche",
   d:"Pour tes concerts privés. Les voisins, eux, n'ont rien demandé."},

  {n:"Globe terrestre en lévitation", e:"🌍", c:"geek", p:["geek","papa"], b:3, q:"globe terrestre lévitation", top:true,
   d:"La Terre flotte sur ton bureau. Les platistes détestent."},
  {n:"Lampe Lune 3D", e:"🌕", c:"geek", p:["maman","ado","couple","enfant"], b:1, q:"lampe lune 3d",
   d:"La Lune en veilleuse, avec tous ses cratères. Le loup-garou n'est pas inclus."},
  {n:"Projecteur ciel étoilé", e:"🌌", c:"geek", p:["ado","couple","enfant"], b:1, q:"projecteur ciel étoilé galaxie",
   d:"Une galaxie au plafond de la chambre. Romantique ou hypnotique, au choix."},
  {n:"Lampe à lave", e:"🫠", c:"geek", p:["geek","ado"], b:1, q:"lampe à lave",
   d:"Aucune utilité. Beaucoup de bonheur. Hypnotique depuis les années 60."},
  {n:"Réveil qui s'enfuit", e:"⏰", c:"geek", p:["ado"], b:1, q:"réveil roulant qui s'enfuit",
   d:"Il roule et se cache. Pour l'éteindre, il faut d'abord l'attraper."},
  {n:"Mini aspirateur de bureau", e:"🧹", c:"geek", p:["collegue","geek","gamer"], b:1, q:"mini aspirateur de bureau",
   d:"Pour les miettes dans le clavier. Oui, on sait que tu manges devant l'écran."},
  {n:"Imprimante photo instantanée", e:"📸", c:"geek", p:["ado","maman","voyageur"], b:3, q:"imprimante photo instantanée smartphone",
   d:"Tes photos de téléphone en vrai papier. Comme en 1995, mais en mieux."},
  {n:"Enceinte en lévitation", e:"🔊", c:"geek", p:["geek","gamer"], b:3, q:"enceinte lévitation bluetooth", top:true,
   url:"https://link.amazon/B09t8n7kq", image:"https://m.media-amazon.com/images/I/61jARSstTKS._AC_SL1500_.jpg",
   d:"Une enceinte qui flotte dans les airs. Le son est bon, l'effet est meilleur."},
  {n:"Tapis de souris géant", e:"🖱️", c:"geek", p:["geek","ado","gamer"], b:1, q:"tapis de souris xxl",
   d:"Si grand qu'il pourrait servir de nappe pour le réveillon."},
  {n:"Potager d'intérieur connecté", e:"🌱", c:"geek", p:["maman","couple","jardinier","cuisinier"], b:3, q:"potager intérieur connecté",
   url:"https://link.amazon/B08slkWPn", image:"https://m.media-amazon.com/images/I/81G-CaCHfoL._AC_SL1500_.jpg",
   d:"Du basilic frais toute l'année, même pour ceux qui tuent les cactus."},

  {n:"Coussin péteur", e:"💨", c:"blague", p:["papa","ado","collegue","enfant"], b:1, q:"coussin péteur",
   d:"Le classique indémodable, testé et approuvé par tous les tontons."},
  {n:"Puzzle 1000 pièces tout blanc", e:"⬜", c:"blague", p:["papa","geek"], b:1, q:"puzzle blanc 1000 pièces", top:true,
   d:"Aucune image. Juste du blanc. Et ta santé mentale qui s'effrite."},
  {n:"Papier toilette sudoku", e:"🧻", c:"blague", p:["collegue","papa"], b:1, q:"papier toilette sudoku",
   d:"Enfin une activité intellectuelle aux toilettes."},
  {n:"Veilleuse de toilettes LED", e:"🚽", c:"blague", p:["papa","ado"], b:1, q:"veilleuse toilette led détecteur",
   d:"La cuvette s'illumine en couleurs. Ambiance boîte de nuit à 3 h du matin."},
  {n:"Bouée licorne géante", e:"🦄", c:"blague", p:["ado","couple","enfant"], b:2, q:"bouée licorne géante",
   d:"Pour arriver à la piscine comme une rock star. Ou comme une licorne."},
  {n:"Parapluie inversé", e:"☂️", c:"blague", p:["maman","collegue"], b:1, q:"parapluie inversé",
   d:"Il se ferme à l'envers. Personne ne sait pourquoi c'est génial, mais ça l'est."},
  {n:"Kit pour faire pousser des champignons", e:"🍄", c:"blague", p:["geek","maman","jardinier","cuisinier"], b:1, q:"kit culture champignons pleurotes",
   d:"Des pleurotes qui poussent dans une boîte en carton. De la magie, légalement."},
  {n:"Masque de cheval", e:"🐴", c:"blague", p:["collegue","ado"], b:1, q:"masque de cheval latex",
   d:"Pour la visio du vendredi. Effet garanti, carrière moins garantie."},
  {n:"Chaussettes avec un visage", e:"🧦", c:"blague", p:["papa","maman","couple","grandsparents"], b:1, q:"chaussettes personnalisées photo visage",
   d:"Avec la tête de ton chat. Ou de ta belle-mère. À tes risques et périls."},

  {n:"Hamac pour chat sur radiateur", e:"🐈", c:"animaux", p:["animaux"], b:1, q:"hamac chat radiateur", top:true,
   d:"Le chat avait déjà la meilleure place de la maison. Maintenant, il a un hamac."},
  {n:"Sac à dos hublot pour chat", e:"🎒", c:"animaux", p:["animaux"], b:2, q:"sac à dos hublot chat",
   d:"Ton chat voyage comme un astronaute. Il te juge quand même."},
  {n:"Caméra lance-friandises", e:"🐶", c:"animaux", p:["animaux","geek"], b:3, q:"caméra distributeur friandises chien",
   d:"Parle à ton chien et lance-lui des croquettes depuis le bureau."},
  {n:"Tapis de fouille pour chien", e:"🦴", c:"animaux", p:["animaux"], b:1, q:"tapis de fouille chien",
   d:"Il cherche ses croquettes, tu gagnes vingt minutes de calme."},
  {n:"Fontaine à eau pour chat", e:"🚰", c:"animaux", p:["animaux"], b:1, q:"fontaine à eau chat",
   d:"Parce que l'eau d'un bol, visiblement, c'est bon pour les chiens."},

  /* ---------- NOUVEAUTÉS (ajoutées le 3 novembre) ---------- */
  {n:"Gants de jardinage à griffes", e:"🧤", c:"blague", p:["jardinier","grandsparents"], b:1, q:"gants de jardinage griffes",
   d:"Creuser la terre comme Wolverine. Les taupes n'ont qu'à bien se tenir."},
  {n:"Kit bonsaï à faire pousser", e:"🌳", c:"geek", p:["jardinier","ado","collegue"], b:1, q:"kit bonsai à faire pousser",
   d:"Du zen, de la patience, et quelques années d'attente pour un arbre de 20 cm."},
  {n:"Console rétro portable", e:"🎮", c:"geek", p:["gamer","ado","papa"], b:2, q:"console rétro portable",
   d:"Les jeux de ton enfance dans la poche. Adieu, productivité."},
  {n:"Clavier rétro façon machine à écrire", e:"⌨️", c:"geek", p:["geek","gamer"], b:3, q:"clavier mécanique rétro machine à écrire",
   d:"Le clic-clac d'une machine à écrire de 1950, branché en USB."},
  {n:"Lampe nuage d'orage", e:"🌩️", c:"geek", p:["ado","couple","enfant"], b:3, q:"lampe nuage orage",
   d:"Un nuage qui gronde au-dessus du lit. Apaisant ou terrifiant, selon l'humeur."},
  {n:"Mug objectif photo", e:"📷", c:"cuisine", p:["geek","voyageur"], b:1, q:"mug objectif appareil photo",
   d:"On dirait un objectif hors de prix. Rempli de café, il est bien plus utile."},
  {n:"Mug magique thermoréactif", e:"☕", c:"cuisine", p:["collegue","couple"], b:1, q:"mug magique thermoréactif",
   d:"Le dessin apparaît quand le café est chaud. Le petit plaisir du lundi matin."},
  {n:"Distributeur de bonbons rétro", e:"🍬", c:"cuisine", p:["enfant","ado","collegue"], b:2, q:"distributeur bonbons gumball",
   d:"Le distributeur de la fête foraine, pour ton bureau. Idéal pour se faire des amis."},
  {n:"Pouf poire géant", e:"🫘", c:"confort", p:["ado","gamer","couple"], b:3, q:"pouf poire géant",
   d:"Tu t'assois dedans à 18 h, tu en ressors au printemps."},
  {n:"Fauteuil suspendu", e:"🪺", c:"confort", p:["maman","ado"], b:2, q:"fauteuil suspendu hamac chaise",
   d:"Un hamac version salon. Les vacances, sans quitter la maison."},
  {n:"Kit kart pour hoverboard", e:"🏎️", c:"geek", p:["ado","enfant"], b:3, q:"kit kart hoverboard",
   d:"Transforme un hoverboard en kart. Le trottoir devient un circuit."},

  /* ---------- 💎 FOLIES HORS DE PRIX ---------- */
  {n:"Lit pour chien taille humaine", e:"🛏️", c:"folies", p:["ado","couple"], b:4, q:"lit pour chien taille humaine", top:true,
   d:"Un panier géant pour faire la sieste comme un golden retriever. Sans le jugement."},
  {n:"Spa gonflable", e:"🫧", c:"folies", p:["couple","papa","maman"], b:4, q:"spa gonflable",
   d:"Les bulles dans le jardin, sans faire venir une grue."},
  {n:"Borne d'arcade", e:"🕹️", c:"folies", p:["gamer","papa","geek"], b:5, q:"borne d'arcade",
   d:"La salle de jeux de ton adolescence, dans ton salon. Les pièces de 1 franc ne sont plus nécessaires."},
  {n:"Fauteuil de massage", e:"💺", c:"folies", p:["papa","maman","grandsparents"], b:5, q:"fauteuil de massage zéro gravité",
   d:"Le kiné, l'ostéo et la sieste réunis dans un seul fauteuil. Aussi cher qu'un petit voyage."},
  {n:"Cockpit simulateur de course", e:"🏁", c:"folies", p:["gamer","papa"], b:5, q:"cockpit simulateur course",
   d:"Pour piloter une F1 depuis le salon. Ta vraie voiture, elle, reste une citadine."},
  {n:"Télescope motorisé", e:"🔭", c:"folies", p:["geek","papa","enfant"], b:5, q:"télescope motorisé goto",
   d:"Il trouve les planètes tout seul. Toi, tu n'as plus qu'à dire « waouh »."},
  {n:"Tente bulle transparente", e:"⛺", c:"folies", p:["couple","voyageur"], b:5, q:"tente bulle transparente",
   d:"Dormir sous les étoiles, au chaud. Les voisins aussi auront une belle vue."},
  {n:"Sauna infrarouge", e:"🧖", c:"folies", p:["couple","maman","papa"], b:5, q:"sauna infrarouge",
   d:"La Finlande dans le garage. Les bouleaux ne sont pas inclus."},

  /* ---------- NOUVEAUTÉS (ajoutées le 21 novembre) : musique, jeux, soirées ---------- */
  /* 🎵 Musique & son */
  {n:"Platine vinyle avec enceintes intégrées", e:"💿", c:"musique", p:["papa","maman","couple","musicien"], b:3, q:"platine vinyle enceintes intégrées bluetooth", top:true, o:["soi"],
   d:"Les vinyles de papa ressortent du grenier. Le son craque, et c'est exactement ce qu'on voulait."},
  {n:"Platine vinyle Hi-Fi", e:"🎶", c:"musique", p:["papa","musicien","couple"], b:4, q:"platine vinyle hifi", o:["soi"],
   d:"Pour ceux qui disent « on entend la différence ». Et qui ont raison, en plus."},
  {n:"Meuble de rangement pour vinyles", e:"🗄️", c:"musique", p:["papa","couple","musicien"], b:2, q:"meuble rangement vinyles",
   d:"Parce qu'une pile de disques par terre, ce n'est pas un coin musique. C'est un obstacle."},
  {n:"Casque sans fil à réduction de bruit", e:"🎧", c:"musique", p:["papa","ado","musicien","voyageur","collegue"], b:4, q:"casque sans fil réduction de bruit", top:true, o:["soi"],
   d:"Il coupe le bruit de l'open space, du train et des enfants. Enfin, presque des enfants."},
  {n:"Casque audio enfant à volume limité", e:"🎧", c:"musique", p:["enfant"], b:2, q:"casque audio enfant volume limité",
   d:"Ses chansons à fond dans ses oreilles, et plus dans les tiennes. Tout le monde gagne."},
  {n:"Enceinte Bluetooth étanche", e:"🔊", c:"musique", p:["ado","sportif","voyageur","couple"], b:2, q:"enceinte bluetooth étanche portable",
   d:"Au bord de la piscine, sous la douche, en rando. Elle survit à tout, même à ta playlist."},
  {n:"Enceinte Bluetooth design rétro", e:"📻", c:"musique", p:["papa","maman","couple"], b:3, q:"enceinte bluetooth rétro vintage",
   d:"Un look de radio des années 60, le son d'aujourd'hui. Elle a sa place sur le buffet."},
  {n:"Ukulélé pour débutant (pack complet)", e:"🪕", c:"musique", p:["ado","enfant","musicien","maman"], b:2, q:"ukulélé débutant pack housse accordeur", top:true,
   d:"Quatre cordes, trois accords, et c'est déjà une chanson. L'instrument le plus facile pour se lancer."},
  {n:"Guitare folk pour débutant (pack)", e:"🎸", c:"musique", p:["ado","papa","musicien"], b:3, q:"guitare folk débutant pack",
   d:"Pour enfin jouer autre chose que Jeux interdits autour du feu de camp."},
  {n:"Clavier piano 61 touches", e:"🎹", c:"musique", p:["enfant","ado","musicien"], b:3, q:"clavier piano 61 touches débutant",
   d:"Les premières gammes au casque, pour préserver la santé mentale du reste de la maison."},
  {n:"Conteuse audio pour enfant", e:"📚", c:"musique", p:["enfant","grandsparents"], b:3, q:"conteuse audio enfant sans écran", top:true,
   d:"Des histoires et des chansons sans écran. Les parents récupèrent leur téléphone."},
  {n:"Instruments de musique d'éveil pour bébé", e:"🥁", c:"musique", p:["enfant","grandsparents"], b:2, q:"instruments musique éveil bébé lot",
   d:"Maracas, tambourin, xylophone : un orchestre complet. Les voisins vont adorer."},
  {n:"Kalimba (piano à pouces)", e:"🎼", c:"musique", p:["ado","musicien","collegue"], b:1, q:"kalimba 17 touches",
   d:"Un son de boîte à musique, et on joue une mélodie dès le premier soir. Parfait en Secret Santa."},
  {n:"Micro USB pour chanter ou podcaster", e:"🎙️", c:"musique", p:["ado","musicien","geek","gamer"], b:2, q:"micro usb streaming podcast",
   d:"Le home studio commence ici. La carrière de star, un peu plus tard."},

  /* 🎉 Fêtes & soirées */
  {n:"Machine karaoké avec deux micros", e:"🎤", c:"fete", p:["ado","enfant","couple","maman"], b:3, q:"machine karaoké 2 micros sans fil", top:true,
   d:"La soirée commence timide. Elle finit sur du Céline Dion à pleins poumons."},
  {n:"Micro karaoké Bluetooth", e:"🎤", c:"fete", p:["ado","enfant"], b:1, q:"micro karaoké bluetooth enfant",
   d:"Le concert dans le salon, version poche. Prévois des bouchons d'oreilles pour les invités."},
  {n:"Appareil photo instantané", e:"📸", c:"fete", p:["ado","couple","maman","voyageur"], b:3, q:"appareil photo instantané", top:true,
   d:"La photo sort tout de suite, on la secoue (inutile, mais on le fait). Le roi des mariages et anniversaires."},
  {n:"Vidéoprojecteur portable", e:"📽️", c:"fete", p:["couple","ado","papa","geek"], b:3, q:"vidéoprojecteur portable wifi",
   d:"Un drap blanc, du popcorn, et le salon devient un cinéma. Ou le jardin, l'été."},
  {n:"Guirlande guinguette LED", e:"💡", c:"fete", p:["maman","couple","jardinier"], b:1, q:"guirlande guinguette led extérieur",
   d:"Accrochée au-dessus de la terrasse, elle transforme un simple barbecue en soirée de mariage."},
  {n:"Boule disco LED", e:"🪩", c:"fete", p:["ado","enfant","couple"], b:1, q:"boule disco led",
   d:"Branche-la, éteins la lumière : la boîte de nuit est ouverte. Fermeture à 22 h, c'est un mardi."},

  /* 🎲 Jeux de société & plein air */
  {n:"Jeu d'ambiance pour soirée entre amis", e:"🃏", c:"jeux", p:["ado","couple","collegue"], b:1, q:"jeu de société ambiance soirée adulte", top:true,
   d:"Les règles s'expliquent en deux minutes, les fous rires durent toute la soirée."},
  {n:"Jeu coopératif pour toute la famille", e:"🤝", c:"jeux", p:["maman","papa","enfant","grandsparents"], b:2, q:"jeu de société coopératif famille",
   d:"On gagne ou on perd ensemble. Fini les crises de larmes au Monopoly."},
  {n:"Jeu de quiz pour toute la famille", e:"❓", c:"jeux", p:["grandsparents","papa","maman","ado"], b:1, q:"jeu quiz famille questions réponses",
   d:"Mamie connaît la date de la bataille de Marignan, le petit-fils toutes les capitales. Duel au sommet."},
  {n:"Escape game en boîte", e:"🔐", c:"jeux", p:["couple","ado","collegue","geek"], b:1, q:"escape game boîte maison",
   d:"Une heure pour sortir, sans sortir du salon. Le couple qui y survit peut tout affronter."},
  {n:"Puzzle 1000 pièces illustré", e:"🧩", c:"jeux", p:["maman","grandsparents","couple"], b:1, q:"puzzle 1000 pièces illustré",
   d:"Une vraie image, cette fois. Le dimanche après-midi parfait, thé compris."},
  {n:"Jeu de Mölkky", e:"🪵", c:"jeux", p:["papa","maman","ado","grandsparents"], b:2, q:"jeu molkky",
   d:"Des quilles en bois, un lancer, et tout le monde devient expert en physique à l'apéro."},
  {n:"Jeu de cornhole", e:"🎯", c:"jeux", p:["papa","ado","couple"], b:2, q:"jeu cornhole",
   d:"Lancer des sacs dans un trou : simple, addictif, et on peut jouer un verre à la main."},
  {n:"Set de pétanque", e:"⚪", c:"jeux", p:["papa","grandsparents","voyageur"], b:2, q:"set pétanque 8 boules",
   d:"Le débat éternel « elle est plus près, la mienne » enfin réglé grâce au mètre fourni."}
];

/* ============ GUIDES (vignettes du haut) ============ */
const GUIDES = [
  {id:"musique",  titre:n => `${n} cadeaux pour les fans de musique`, filtre:p => p.c === "musique", cover:"", emoji:"🎵"},
  {id:"jeux",     titre:n => `${n} jeux pour jouer en famille ou entre amis`, filtre:p => p.c === "jeux", cover:"", emoji:"🎲"},
  {id:"soiree",   titre:n => `${n} idées pour une soirée réussie`, filtre:p => p.c === "fete", cover:"", emoji:"🎉"},
  {id:"absurdes", titre:n => `${n} objets complètement absurdes`, filtre:p => p.c === "blague" || p.c === "cuisine", cover:"Coupe-banane", emoji:"🤪"},
  {id:"flemme",   titre:n => `${n} cadeaux pour la flemme assumée`, filtre:p => p.c === "confort", cover:"Oreiller autruche", emoji:"😴"},
  {id:"geek",     titre:n => `${n} trouvailles pour geeks et gamers`, filtre:p => p.c === "geek", cover:"Enceinte en lévitation", emoji:"🤓"},
  {id:"moins20",  titre:n => `${n} cadeaux à moins de 20 €`, filtre:p => p.b === 1, cover:"Couverture tortilla géante", emoji:"🎁"},
  {id:"folies",   titre:n => `${n} folies hors de prix`, filtre:p => p.c === "folies", cover:"", emoji:"💎"}
];

/* ============ PAGES GUIDES ============
   Une page par guide, à l'adresse activityweb.be/coindescadeaux/<slug>/
   produits = noms EXACTS des produits de la liste PRODUITS ci-dessus, dans l'ordre d'affichage.
   Pour remplir un guide : ajouter le nom du produit dans sa liste (et le produit dans PRODUITS s'il n'y est pas).
*/
const GUIDES_PAGES = [
  {id:"anniversaire", slug:"cadeaux-anniversaire", emoji:"🎂", court:"Cadeaux d'anniversaire",
   produits:[
    "Appareil photo instantané",
    "Platine vinyle avec enceintes intégrées",
    "Enceinte Bluetooth design rétro",
    "Jeu d'ambiance pour soirée entre amis",
    "Globe terrestre en lévitation",
    "Couverture tortilla géante"
   ]},
  {id:"karaoke", slug:"soiree-karaoke", emoji:"🎤", court:"Soirée karaoké",
   produits:[
    "Machine karaoké avec deux micros",
    "Micro karaoké Bluetooth",
    "Enceinte Bluetooth étanche",
    "Boule disco LED",
    "Guirlande guinguette LED",
    "Machine à bulles"
   ]},
  {id:"jeux-famille", slug:"jeux-de-societe-famille", emoji:"🎲", court:"Jeux de société en famille",
   produits:[
    "Jeu coopératif pour toute la famille",
    "Jeu de quiz pour toute la famille",
    "Jeu d'ambiance pour soirée entre amis",
    "Escape game en boîte",
    "Puzzle 1000 pièces illustré"
   ]},
  {id:"enfants-musique", slug:"cadeaux-musicaux-enfants", emoji:"🧸", court:"Cadeaux musicaux pour enfants",
   produits:[
    "Conteuse audio pour enfant",
    "Instruments de musique d'éveil pour bébé",
    "Casque audio enfant à volume limité",
    "Ukulélé pour débutant (pack complet)",
    "Clavier piano 61 touches",
    "Micro karaoké Bluetooth"
   ]},
  {id:"vinyle", slug:"coin-musique-vinyle", emoji:"💿", court:"Coin musique et vinyles",
   produits:[
    "Platine vinyle avec enceintes intégrées",
    "Platine vinyle Hi-Fi",
    "Meuble de rangement pour vinyles",
    "Enceinte Bluetooth design rétro",
    "Casque sans fil à réduction de bruit"
   ]},
  {id:"saint-valentin", slug:"cadeaux-saint-valentin", emoji:"❤️", court:"Saint-Valentin",
   produits:[
    "Appareil photo instantané",
    "Raclette à la bougie pour deux",
    "Projecteur ciel étoilé",
    "Fontaine à chocolat",
    "Vidéoprojecteur portable"
   ]},
  {id:"fete-des-meres", slug:"cadeaux-fete-des-meres", emoji:"👩", court:"Fête des mères",
   produits:[]},
  {id:"fete-des-peres", slug:"cadeaux-fete-des-peres", emoji:"👨", court:"Fête des pères",
   produits:[]},
  {id:"mariage", slug:"cadeaux-mariage", emoji:"💍", court:"Mariage",
   produits:[]},
  {id:"cinema", slug:"soiree-cinema-maison", emoji:"🍿", court:"Soirée cinéma",
   produits:[
    "Vidéoprojecteur portable",
    "Machine à popcorn rétro",
    "Pouf poire géant",
    "Projecteur ciel étoilé"
   ]},
  {id:"exterieur", slug:"jeux-exterieur-famille", emoji:"🌳", court:"Jeux d'extérieur",
   produits:[
    "Jeu de Mölkky",
    "Jeu de cornhole",
    "Set de pétanque"
   ]},
  {id:"noel", slug:"cadeaux-noel", emoji:"🎄", court:"Cadeaux de Noël",
   produits:[]},
  {id:"instruments", slug:"instrument-de-musique-a-offrir", emoji:"🎸", court:"Instrument à offrir",
   produits:[
    "Ukulélé pour débutant (pack complet)",
    "Guitare folk pour débutant (pack)",
    "Clavier piano 61 touches",
    "Kalimba (piano à pouces)",
    "Micro USB pour chanter ou podcaster"
   ]},
  {id:"escape", slug:"escape-game-enigmes", emoji:"🔐", court:"Escape games et énigmes",
   produits:[
    "Escape game en boîte",
    "Puzzle 1000 pièces illustré",
    "Puzzle 1000 pièces tout blanc"
   ]},
  {id:"seniors", slug:"activites-seniors", emoji:"🧩", court:"Activités seniors",
   produits:[
    "Jeu de quiz pour toute la famille",
    "Puzzle 1000 pièces illustré"
   ]}
];

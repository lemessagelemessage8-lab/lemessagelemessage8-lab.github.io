// ====== RÉGLAGES DU SITE — à modifier ======
window.SITE_CONFIG = {
  // Langue par défaut si le navigateur du visiteur n'est dans aucune langue du site
  defaultLang: "fr",

  // Formulaire de suggestions :
  // 1) Créez un compte gratuit sur https://formspree.io, créez un formulaire,
  //    et collez ici son adresse (ex. "https://formspree.io/f/abcdwxyz").
  // 2) Si vide, le formulaire ouvre la messagerie du visiteur vers contactEmail.
  formEndpoint: "",
  contactEmail: "lemessagelemessage8@gmail.com",

  // Musique d'accueil : vidéo YouTube officielle « The Message » (Maurice Jarre),
  // publiée par Trancas International Films. Pour changer de musique, remplacez l'identifiant
  // (la partie après "watch?v=" dans l'adresse YouTube).
  youtubeVideoId: "P9fqh52YBRs",
  musicVolume: 50, // de 0 à 100

  // Le film « The Message » (1976), GRATUIT sur YouTube (demande d'Ahmed : pas de lien payant).
  // Film complet : identifiant YouTube par langue (la partie après "watch?v="). Copies choisies le 12/10/2026 sur de grandes
  // chaînes de distribution (anglais : « Hollywood Action » ; hindi : « Dimension On Demand »). Si YouTube en retire une,
  // remplacer l'identifiant ici. Bande-annonce officielle : Front Row Filmed Entertainment (restauration 4K, 2018).
  filmFull: { en: "vQKqv4JboBU", hi: "G67xLEvg-Ic" },
  filmTrailerId: "gRo7rjAiAw8",
  filmSearch: {   // recherche du film entier sur YouTube : anglais + langue du visiteur quand un doublage existe
    en: "The Message 1976 full movie Anthony Quinn English",
    fr: "Le Message 1976 film complet version française",
    es: "El Mensaje 1976 película completa español",
    de: "Mohammed Der Gesandte Gottes 1976 ganzer Film deutsch",
    it: "Il Messaggio 1976 film completo italiano",
    pt: "A Mensagem 1976 filme completo dublado",
    hi: "The Message 1976 Hindi dubbed full movie",
    tr: "Çağrı 1976 filmi Türkçe dublaj tek parça",
    id: "The Message 1976 film lengkap subtitle Indonesia",
    ru: "Послание 1976 фильм полностью на русском"
  }
};

// Complément de js/data.js pour les 8 langues ajoutées le 13/10/2026 (tr, id, ru, vi, th, tl, sv, ro) : descriptions des cartes,
// titres des flyers, Coran officiel de chaque langue, adresses par langue. Les textes sont dans js/i18n-monde-1.js à -4.js
// (« cartes », « titres », « coran » de chaque langue). À charger APRÈS js/data-plus.js.
(function () {
  var D = window.SITE_DATA, T = window.I18N, M = window.MONDE || {}, V = window.VERSETS || {};
  var L = ["tr", "id", "ru", "vi", "th", "tl", "sv", "ro", "ca"];     // ca : 26/10/2026

  // carte (nom ou identifiant) → [texte, titre de flyer] : même table que js/data-plus.js
  var CARTES = {
    "misericorde-fr": ["f_mercy", "mercy"], "mercy-en": ["f_mercy", "mercy"], "sonrisa-es": ["f_mercy", "smile"],
    "femme-fr": ["f_woman", "woman"], "mujer-es": ["f_woman", "woman"], "parents-fr": ["f_parents", "parents"],
    "haute-moralite-fr": ["f_morals", "morals"], "alta-moralidad-es": ["f_morals", "morals"],
    "Quran.com": ["q_qurancom"], "QuranEnc — Encyclopedia of translations": ["q_enc"], "Tanzil — translations": ["q_tanzil"],
    "King Fahd Quran Complex": ["q_fahd"], "Le-Coran.com": ["q_lecoran"], "Quran.com — Français": ["q_qurancom"],
    "Quran.com — Español": ["q_qurancom"], "Quran for All": ["q_forall"], "Audio — English translation": ["q_audio"],
    "Audio — Traduction française": ["q_audio"], "Audio — Traducción española": ["q_audio"], "Audio — Deutsche Übersetzung": ["q_audio"],
    "MP3 Quran": ["q_mp3"],
    "Quran.com Radio": ["m_qradio"], "Radio Islam International": ["m_radioislam"], "Channel Islam International": ["m_cii"],
    "Huda TV": ["m_huda"], "Islam Channel": ["m_islamchannel"], "Radio ZamZam": ["m_zamzam"],
    "SNRT Live — Radio Mohammed VI du Saint Coran": ["m_snrt"], "Radio Islámico": ["m_islamico"], "Koran-Audio auf Deutsch": ["q_audio"],
    "MP3 Quran Radios": ["m_mp3radios"],
    "Mosquées de Tunisie et du monde": ["l_mosq"], "IslamReligion.com": ["l_islamreligion"], "IslamHouse": ["l_islamhouse"],
    "WhyIslam": ["l_whyislam"], "NewMuslims.com": ["l_newmuslims"], "Sunnah.com": ["l_sunnah"], "IslamWeb": ["l_islamweb"],
    "Zentralrat der Muslime — islam.de": ["l_islamde"], "IslamiQ": ["l_islamiq"]
  };
  ["flyers", "quran", "media", "links"].forEach(function (s) {
    D[s].forEach(function (c) {
      var k = CARTES[c.name || c.id];
      if (!k) return;
      L.forEach(function (l) {
        if (!M[l]) return;
        if (c.desc && !c.desc[l]) c.desc[l] = M[l].cartes[k[0]];
        if (k[1] && c.title && !c.title[l]) c.title[l] = M[l].titres[k[1]] + " (" + T[l].langNames[c.lang] + ")";
      });
    });
  });

  // flyers dont le titre et la description sont écrits directement dans js/data.js : « flyers » du bloc de la langue
  D.flyers.forEach(function (c) {
    L.forEach(function (l) {
      var f = M[l] && M[l].flyers && M[l].flyers[c.id];
      if (!f) return;
      if (!c.title[l]) c.title[l] = f[0] + " (" + T[l].langNames[c.lang] + ")";
      if (!c.desc[l]) c.desc[l] = f[1];
    });
  });

  // Le Coran officiel de chaque nouvelle langue (la traduction d'où viennent les versets cités), placé après ceux des 11 premières langues
  var apres = 0;
  D.quran.forEach(function (c, i) { if (c.officiel) apres = i + 1; });
  L.forEach(function (l) {
    if (V[l] && M[l]) D.quran.splice(apres++, 0, { name: M[l].coran, url: V[l].url, lang: l, kind: "read", descKey: "quranTransDesc", source: V[l].source, officiel: true });
  });

  // Adresse du même site dans la langue du visiteur, quand elle existe (vérifié le 13/10/2026)
  function adresses(nom, urls) {
    ["quran", "links"].forEach(function (s) {
      D[s].forEach(function (c) { if (c.name === nom) c.localUrl = Object.assign(c.localUrl || {}, urls); });
    });
  }
  adresses("Quran.com", { tr: "https://quran.com/tr", id: "https://quran.com/id", ru: "https://quran.com/ru", vi: "https://quran.com/vi", th: "https://quran.com/th" });
  adresses("IslamHouse", { tr: "https://islamhouse.com/tr/", id: "https://islamhouse.com/id/", ru: "https://islamhouse.com/ru/", vi: "https://islamhouse.com/vi/", th: "https://islamhouse.com/th/", tl: "https://islamhouse.com/tl/", sv: "https://islamhouse.com/sv/", ro: "https://islamhouse.com/ro/" });
  adresses("IslamReligion.com", { ru: "https://www.islamreligion.com/ru/" });
})();

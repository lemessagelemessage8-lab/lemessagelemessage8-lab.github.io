// Catalan, ajouté le 26/10/2026 (demande d'Ahmed, après la demande d'un visiteur : « Folletos en catalán »).
// Même structure que les blocs de js/i18n-monde-*.js : textes du site, film, page « Paroles du Prophète », « cartes », « titres ».
// VERSETS : il n'existe AUCUNE traduction officielle du Coran en catalan (ni QuranEnc, ni HadeethEnc). Le catalan affiche donc la
// traduction officielle EN CASTILLAN (js/versets.js, js/paroles.js), avec une phrase en catalan qui l'explique : nous ne traduisons
// jamais les versets nous-mêmes (règle d'Ahmed). Les champs de versets ci-dessous reprennent ceux de l'espagnol.
// Textes de l'interface écrits par Claude : à faire relire par une personne dont c'est la langue.
(function () {
  var T = window.I18N, M = window.MONDE = window.MONDE || {};
  var ES = T.es;

  // le nom « catalan » dans chacune des 19 autres langues (étiquettes et filtres)
  var NOM = { en: "Catalan", fr: "Catalan", es: "Catalán", de: "Katalanisch", it: "Catalano", pt: "Catalão", nl: "Catalaans",
    zh: "加泰罗尼亚语", ja: "カタルーニャ語", ko: "카탈루냐어", hi: "कातालान", tr: "Katalanca", id: "Katalan", ru: "Каталанский",
    vi: "Tiếng Catalan", th: "ภาษากาตาลา", tl: "Katalan", sv: "Katalanska", ro: "Catalană" };
  Object.keys(NOM).forEach(function (l) { if (T[l] && T[l].langNames) T[l].langNames.ca = NOM[l]; });

  M.ca = {
    siteName: "The Message",
    welcomeSub: "Descobreix l'islam, l'Alcorà i el seu missatge de misericòrdia, en la teva llengua.",
    enterMusic: "Entra amb música ♪",
    enterSilent: "Entra sense so",
    pageTitle: "The Message — descobrir l'islam i l'Alcorà | رسالة الإسلام",
    metaDesc: "Descobreix l'islam de manera senzilla: qui és Déu, què és l'Alcorà, qui és el Profeta Muhammad; fullets gratuïts per imprimir, l'Alcorà traduït i emissores de ràdio.",
    backTop: "Inici", readFlyer: "Llegeix", prevPage: "Pàgina 1", nextPage: "Pàgina 2", pageOf: "Pàgina {n} de 2", zoomHint: "Fes clic a la pàgina per ampliar-la",
    musicTitle: "♪ The Message — Maurice Jarre",
    navMessage: "L'islam", navThemes: "Temes", navQuran: "Alcorà", navFlyers: "Fullets",
    navMedia: "Ràdio i TV", navLinks: "Enllaços", navContact: "Preguntes",
    basmala: ES.basmala,
    heroLead: "L'islam és un missatge de pau, de misericòrdia i de la unicitat de Déu, adreçat a tota la humanitat. Descobreix-lo aquí, amb calma, amb les fonts, en la teva llengua.",
    heroCta1: "Descobreix el missatge", heroCta2: "Fullets per imprimir",
    msgTitle: "Quin és el missatge de l'islam?",
    msgIntro: "«Islam» vol dir submissió al Déu Únic, i ve de la mateixa arrel que «salam»: la pau. Els musulmans creuen que Déu va enviar profetes a cada poble —Noè, Abraham, Moisès, Jesús i d'altres— i que Muhammad ﷺ és l'últim de tots, enviat amb l'Alcorà per a tota la humanitat.",
    msgVerse: ES.msgVerse,
    msgVerseRef: "Alcorà 21:107 — Els Profetes",
    pillarsIslamTitle: "Els cinc pilars de l'islam",
    pillarsIslam: [
      "El testimoni de fe (xahada): no hi ha més déu que Déu, i Muhammad és el seu missatger",
      "La pregària (salat), cinc vegades al dia",
      "L'almoina obligatòria (zakat) per als necessitats",
      "El dejuni del mes de ramadà",
      "El pelegrinatge a la Meca (hajj), per a qui pugui fer-lo"
    ],
    pillarsFaithTitle: "Els sis pilars de la fe",
    pillarsFaith: [
      "Creure en Déu, l'Únic",
      "Creure en els seus àngels",
      "Creure en els seus llibres revelats (la Torà, els Salms, l'Evangeli, l'Alcorà)",
      "Creure en els seus missatgers",
      "Creure en el Dia del Judici",
      "Creure en el decret diví"
    ],
    themesTitle: "Els temes del missatge",
    themesIntro: "Breus introduccions amb versicles de l'Alcorà. Pots compartir cada tema amb un amic.",
    themes: [
      { id: "why-created", icon: "✦", title: "Per què hem estat creats?", text: "L'Alcorà respon una de les preguntes més antigues de la humanitat: la vida té un sentit —conèixer i adorar el nostre Creador, i fer el bé a la terra." },
      { id: "god", icon: "☀", title: "Qui és Déu (Al·là)?", text: "«Al·là» és simplement la paraula àrab per dir Déu —la mateixa que fan servir els cristians àrabs. Ell és Únic, sense associats, i res no se li assembla." },
      { id: "quran", icon: "📖", title: "Què és l'Alcorà?", text: "L'Alcorà és la paraula de Déu revelada al Profeta Muhammad ﷺ al llarg de 23 anys, i conservada en àrab fins avui. És una guia per a tota la humanitat." },
      { id: "prophet", icon: "☾", title: "Qui és Muhammad ﷺ?", text: "Va néixer a la Meca cap a l'any 570 i era conegut com a «al-Amín», el digne de confiança." },
      { id: "mercy", icon: "❤", title: "La misericòrdia", text: "Tots els capítols de l'Alcorà menys un comencen amb «" + ES.basmala + "». La misericòrdia envers les persones, els animals i la terra és al cor del missatge." },
      { id: "humanity", icon: "🌍", title: "Una sola humanitat", text: "Cap poble no és superior a un altre pel color de la pell o per l'origen. La diversitat és un signe de Déu, i el millor dels homes és el més piadós." },
      { id: "woman", icon: "✿", title: "La dona en l'islam", text: "L'home i la dona són iguals davant de Déu en la fe, en les obres i en la recompensa." },
      { id: "parents", icon: "🤲", title: "Els pares i la gent gran", text: "La bondat envers els pares ve just després de l'adoració de Déu." },
      { id: "freedom", icon: "🕊", title: "La llibertat de creure", text: "La fe no es pot imposar: és una elecció sincera del cor. La tasca del musulmà és transmetre el missatge amb saviesa i amabilitat." }
    ],
    share: "Comparteix", read: "Llegeix-ne més", open: "Obre", listen: "Escolta",
    quranTitle: "L'Alcorà en la teva llengua",
    quranIntro: "Llegeix i escolta l'Alcorà amb la traducció del seu sentit en moltes llengües.",
    flyersTitle: "Fullets per imprimir",
    flyersIntro: "Fullets gratuïts per imprimir (A4 apaïsat, a doble cara, plegats en tres) i per regalar a amics, veïns o companys.",
    flyersTip: "Consell: imprimeix a doble cara («girar per la vora curta») i després plega en tres.",
    front: "Anvers", back: "Revers", downloadPdf: "Descarrega / imprimeix (PDF)",
    mediaTitle: "Ràdio i mitjans del món",
    mediaIntro: "Emissores de ràdio, canals de televisió i webs d'àudio, en diverses llengües, que parlen de l'islam o emeten l'Alcorà.",
    linksTitle: "Enllaços útils",
    linksIntro: "Recursos fiables per a qualsevol persona que vulgui fer-se una idea de l'islam.",
    all: "Tots",
    langNames: { en: "Anglès", fr: "Francès", es: "Castellà", de: "Alemany", it: "Italià", pt: "Portuguès", nl: "Neerlandès", zh: "Xinès", ja: "Japonès", ko: "Coreà", hi: "Hindi", tr: "Turc", id: "Indonesi", ru: "Rus", vi: "Vietnamita", th: "Tai", tl: "Filipí", sv: "Suec", ro: "Romanès", ca: "Català", ar: "Àrab", multi: "Multilingüe" },
    kinds: { radio: "Ràdio", tv: "TV", audio: "Àudio", read: "Lectura", site: "Web", app: "Aplicació" },
    contactTitle: "Preguntes i suggeriments",
    contactIntro: "Tens una pregunta sobre l'islam, un suggeriment per al web o vols un fullet en la teva llengua? Escriu-nos.",
    fName: "Nom (opcional)", fEmail: "Correu electrònic (obligatori, per rebre resposta)", fEmailErr: "Escriu la teva adreça de correu (obligatòria) perquè et puguem respondre.", fReply: "L'hem rebut i et respondrem a l'adreça:", fAnother: "Envia un altre missatge", fType: "Assumpte",
    fTypeQ: "Una pregunta sobre l'islam", fTypeS: "Un suggeriment per al web", fTypeF: "Un fullet en la meva llengua",
    fMessage: "El teu missatge", fSend: "Envia",
    fSending: "S'està enviant…", fOk: "Gràcies! El teu missatge s'ha enviat.", fErr: "Ho sentim, no s'ha pogut enviar el missatge. Torna-ho a provar més tard.",
    fMail: "S'obrirà la teva aplicació de correu per enviar el missatge.",
    footerVerse: ES.footerVerse,
    footerNote: "Les traduccions de l'Alcorà són traduccions del seu sentit; el text original és en àrab. Els enllaços externs s'ofereixen a títol informatiu.",
    shareSite: "Comparteix aquest web", shareTitle: "Comparteix", copyLink: "Copia l'enllaç", copied: "Enllaç copiat!", close: "Tanca",
    shareText: "Descobreix el missatge de l'islam:",
    quranTransDesc: "Traducció del sentit de l'Alcorà, per llegir en línia o descarregar.",
    verseNote: "No existeix cap traducció oficial de l'Alcorà en català: els versicles es citen literalment de la traducció oficial en castellà:",
    navFilm: "Pel·lícula", filmTitle: "La pel·lícula «The Message» (1976)",
    filmText: "La pel·lícula de Moustapha Akkad explica el naixement de l'islam i el missatge que va portar el Profeta Muhammad ﷺ. Per respecte, el Profeta no s'hi mostra mai ni se li sent la veu. La versió anglesa la interpreten Anthony Quinn i Irene Papas; la pel·lícula es va restaurar en 4K el 2018, i aquest web li deu el nom.",
    filmFull: "Mira la pel·lícula sencera, gratis (en anglès)", filmFullLocal: "", filmTrailer: "Tràiler oficial",
    filmSearchEn: "Cerca la pel·lícula sencera en anglès a YouTube", filmSearchLocal: "Cerca la versió en castellà a YouTube",
    filmNote: "La pel·lícula es pot veure gratis a YouTube (2 h 53). Si el vídeo ja no funciona, fes servir el botó de cerca.",
    navProphet: "Paraules del Profeta", pTitle: "Paraules del Profeta ﷺ",
    pLead: "El que el Profeta Muhammad ﷺ va dir de Maria, la mare de Jesús, i dels qui abracen l'islam —amb les fonts.",
    pMaryTitle: "Maria (Maryam), mare de Jesús",
    pMaryIntro: "Maria (Maryam en àrab) és la dona més honrada de l'islam. Un capítol sencer de l'Alcorà porta el seu nom, i és l'única dona que l'Alcorà esmenta pel seu nom. Els musulmans creuen en el naixement miraculós del seu fill Jesús, a qui reconeixen com un gran profeta i com el Messies.",
    pQuranSays: "El que diu l'Alcorà", pProphetSays: "El que va dir el Profeta ﷺ",
    pConvTitle: "Per als qui abracen l'islam",
    pConvIntro: "Abraçar l'islam és començar de nou: les faltes del passat són perdonades, i el bé que ja s'ha fet es conserva.",
    pHowTitle: "Com es fa musulmà una persona?",
    pHowText: "Una persona es fa musulmana pronunciant el testimoni de fe, sincerament i per convicció:",
    pShahada: "«Dono testimoni que no hi ha més déu que Déu, i dono testimoni que Muhammad és el Missatger de Déu.»",
    pOfficial: "Traducció oficial en castellà (no n'hi ha cap en català) — HadeethEnc.com",
    pUnofficial: "Traducció no oficial, en castellà, feta per a aquest web a partir de la traducció anglesa oficial. Només és una traducció: consulta la font oficial.",
    pSeeSource: "Consulta la font oficial", pBack: "Torna a l'inici", pAsk: "Tens una pregunta? Escriu-nos",
    pCardText: "Maria, la mare de Jesús, a l'Alcorà i en les paraules del Profeta ﷺ —i la bona notícia per als qui abracen l'islam.",
    coran: "L'Alcorà — traducció oficial en castellà",
    titres: { mercy: "La misericòrdia", smile: "Somriure i compassió", woman: "La dona en l'islam", parents: "Els pares i la gent gran", morals: "El caràcter noble" },
    cartes: {
      f_mercy: "Per què hem estat creats? Què és l'islam? El miracle de la llet i la misericòrdia en l'islam.",
      f_woman: "Què és l'islam? El lloc i els drets de la dona en l'islam.",
      f_parents: "Qui és Muhammad ﷺ? Qui és Déu? Què és l'Alcorà? Els drets dels pares i de la gent gran.",
      f_morals: "Què és l'islam? El miracle de l'embriologia a l'Alcorà i el caràcter noble del Profeta ﷺ.",
      q_qurancom: "Llegeix i escolta l'Alcorà amb traduccions en més de 50 llengües.",
      q_enc: "Traduccions revisades del sentit de l'Alcorà en desenes de llengües, amb PDF per descarregar.",
      q_tanzil: "Text àrab revisat i moltes traduccions per descarregar.",
      q_fahd: "El complex oficial d'impressió de l'Alcorà de Medina: l'Alcorà i traduccions en moltes llengües.",
      q_lecoran: "L'Alcorà en àrab i en francès, amb recitació.",
      q_forall: "L'Alcorà amb traducció al castellà i a altres llengües.",
      q_audio: "Escolta la traducció del sentit de l'Alcorà.",
      q_mp3: "Centenars de recitadors i ràdios de l'Alcorà en directe.",
      m_qradio: "Recitació contínua de l'Alcorà per recitadors reconeguts.",
      m_radioislam: "Ràdio de Johannesburg que s'escolta a tot el món: conferències, notícies i programes islàmics (en anglès).",
      m_cii: "Ràdio islàmica en anglès des de Sud-àfrica.",
      m_huda: "Televisió islàmica en anglès, les 24 hores, amb programes per a qui vol conèixer l'islam.",
      m_islamchannel: "Canal de televisió islàmic britànic (en anglès).",
      m_zamzam: "Ràdio musulmana per internet en francès: l'Alcorà recitat les 24 hores.",
      m_snrt: "La ràdio marroquina del Sagrat Alcorà (àrab i francès).",
      m_islamico: "Ensenyaments islàmics en castellà, les 24 hores.",
      m_mp3radios: "Més de 100 ràdios de l'Alcorà en directe, algunes amb traducció.",
      l_mosq: "El nostre web germà: les mesquites en un mapa i la història de les grans mesquites de Tunísia, amb fotos.",
      l_islamreligion: "Articles i vídeos que expliquen l'islam als no musulmans, en moltes llengües.",
      l_islamhouse: "Llibres, àudios i vídeos gratuïts sobre l'islam en més de 100 llengües.",
      l_whyislam: "Respostes a les preguntes més freqüents sobre l'islam (en anglès).",
      l_newmuslims: "Lliçons pas a pas per a qui acaba d'abraçar l'islam (en anglès).",
      l_sunnah: "Les paraules del Profeta ﷺ (hadits), en àrab i en anglès.",
      l_islamweb: "Articles i respostes a preguntes, en diverses llengües.",
      l_islamiq: "Portal de notícies i informació sobre l'islam (en alemany).",
      l_islamde: "Informació sobre l'islam i els musulmans a Alemanya (en alemany)."
    },
    // flyers dont le titre et la description sont écrits directement dans js/data.js (posés par js/data-monde.js)
    flyers: {
      "quran-en": ["L'Alcorà: l'última revelació a la humanitat", "Què és l'Alcorà? Com es va revelar, com sabem que ve de Déu i quin és el seu propòsit? Fullet publicat per l'Islamic Information Center (Dubai)."],
      "jesus-en": ["Jesús, un profeta de Déu", "Qui era Jesús? El que els musulmans creuen sobre ell: el seu naixement miraculós, els seus miracles i el seu missatge. Fullet publicat per l'Islamic Information Center (Dubai)."],
      "concept-god-en": ["El concepte de Déu en l'islam", "Existeix Déu? Qui és Déu? Déu és Un i únic, totpoderós, just i misericordiós; la naturalesa de Jesús; el propòsit de la vida. Fullet publicat per l'Islamic Information Center (Dubai)."],
      "misconceptions-en": ["Idees equivocades sobre l'islam", "Respostes a les idees equivocades més esteses: els valors dels musulmans, la paraula «Al·là», el terrorisme, la dona, l'Alcorà, el vel, els àrabs, el gihad, el matrimoni forçat i la conversió forçada. Fullet publicat per l'Islamic Information Center (Dubai)."],
      "introduccion-islam-es": ["Introducció a l'islam: un estil de vida pràctic i equilibrat", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "profeta-muhammad-es": ["El Profeta Muhammad: has de conèixer aquest home!", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "jesus-es": ["Jesús: un profeta de Déu", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "concepto-dios-es": ["El concepte de Déu en l'islam", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "coran-es": ["L'Alcorà: l'última revelació a la humanitat", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "proposito-vida-es": ["Quin és el propòsit de la vida?", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "conceptos-erroneos-es": ["Idees equivocades sobre l'islam", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "derechos-mujeres-es": ["Els drets de les dones en l'islam", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "milagros-cientificos-es": ["Els miracles científics de l'Alcorà", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."],
      "muerte-mas-alla-es": ["La mort i el més enllà", "Desplegable de 6 pàgines publicat per l'Islamic Information Center (Dubai)."]
    }
  };
  // les citations des thèmes = versets : ceux de la traduction officielle (castillan), jamais une traduction de notre part
  M.ca.themes.forEach(function (th, i) { th.quote = ES.themes[i].quote; th.ref = ES.themes[i].ref.replace(/^\S+/, "Alcorà"); });

  T.ca = M.ca;
})();

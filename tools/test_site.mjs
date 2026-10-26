// Tests du site « Le Message » : node tools/test_site.mjs  (aucune dépendance à installer)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = f => fs.readFileSync(path.join(racine, f), "utf8");
const require = createRequire(import.meta.url);
let echecs = 0;
const ok = (cond, texte) => { if (!cond) { echecs++; console.error("ÉCHEC : " + texte); } };

const html = lire("index.html");
const ADRESSE = "https://message.clicvia.com/";

// --- visibilité (règle commune § 8) ---
ok(/<header class="topbar">[\s\S]*id="share-head"[\s\S]*<\/header>/.test(html), "bouton « Partager » absent de l'en-tête");
ok(html.includes(`<link rel="canonical" href="${ADRESSE}">`), "adresse canonique absente");
const LANGUES = ["en", "fr", "es", "de", "it", "pt", "nl", "zh", "ja", "ko", "hi", "tr", "id", "ru", "vi", "th", "tl", "sv", "ro", "ca"];     // ni arabe ni ourdou : choix d'Ahmed (13/10/2026)
for (const l of LANGUES) ok(html.includes(`data-setlang="${l}"`) && html.includes(`<option value="${l}"`), "langue " + l + " absente des boutons");
// 14/10/2026 (contrôle de visibilité, règle commune § 8) : pas de hreflang vers « ?lang= » (le serveur renvoie la même page :
// doublons pour Google) ; un seul titre h1 ; lien vers le portail clicvia.com ; clé IndexNow
for (const f of ["index.html", "paroles-du-prophete/index.html"]) ok(!/hreflang="[a-z-]+" href="[^"]*[?]lang=/.test(lire(f)), f + " : hreflang vers « ?lang= »");
ok((html.match(/<h1[\s>]/g) || []).length === 1, "il faut un seul titre h1 sur l'accueil");
ok(html.includes('href="https://clicvia.com/"'), "lien vers le portail clicvia.com absent");
ok(fs.existsSync(path.join(racine, "377f054ba9c5ed40d6796adc8d87d1e8.txt")), "clé IndexNow absente");
ok(html.includes("goatcounter.com/count"), "compteur de visites GoatCounter absent");
ok(html.includes(`og:image" content="${ADRESSE}assets/og-image-v2.jpg"`), "image d'aperçu de partage absente");
ok(fs.existsSync(path.join(racine, "assets/og-image-v2.jpg")), "fichier assets/og-image-v2.jpg absent");
const blocs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
ok(blocs.some(b => b["@type"] === "FAQPage" && b.mainEntity.length >= 3), "questions-réponses pour Google (FAQPage) absentes");
ok(lire("CNAME").trim() === "message.clicvia.com", "fichier CNAME incorrect");

const robots = lire("robots.txt");
ok(robots.includes(`Sitemap: ${ADRESSE}sitemap.xml`), "robots.txt : ligne Sitemap absente");
for (const r of ["GPTBot", "ClaudeBot", "CCBot", "Bytespider"]) ok(robots.includes("User-agent: " + r), "robots.txt : " + r + " non interdit");
ok(!/User-agent: Googlebot[\s\S]{0,200}?Disallow: \/\s/.test(robots.split("# Robots d'IA")[0]), "robots.txt interdit Googlebot");
const plan = lire("sitemap.xml");
ok(plan.includes(`<loc>${ADRESSE}</loc>`), "sitemap.xml : accueil absent");
for (const l of LANGUES) ok(plan.includes(`<loc>${ADRESSE}?lang=${l}</loc>`), "sitemap.xml : langue " + l + " absente");

// --- textes : chaque langue a toutes les clés ---
globalThis.window = {};
require(path.join(racine, "js/config.js"));
for (const f of ["i18n", "i18n-plus", "i18n-asie", "i18n-paroles", "i18n-film", "i18n-monde-1", "i18n-monde-2", "i18n-monde-3", "i18n-monde-4", "i18n-ca", "versets", "paroles", "data", "data-plus", "data-monde"]) require(path.join(racine, "js/" + f + ".js"));
const T = window.I18N, D = window.SITE_DATA;
const cles = Object.keys(T.fr);
ok(LANGUES.every(l => T[l]) && Object.keys(T).length === LANGUES.length, "les langues du site ne sont pas celles attendues : " + Object.keys(T));
for (const l of Object.keys(T)) for (const c of [...LANGUES, "ar", "multi"]) ok(T[l].langNames[c], `nom de la langue ${c} absent en ${l}`);
for (const l of Object.keys(T)) for (const k of Object.keys(T.fr.kinds)) ok(T[l].kinds[k], `type ${k} absent en ${l}`);
for (const l of Object.keys(T)) ok(T[l].siteName === "The Message" && T[l].pageTitle.startsWith("The Message"), "le nom du site doit être « The Message » en " + l);
ok(html.includes('<span class="arabic">الرسالة</span>'), "nom arabe الرسالة absent de l'en-tête");
for (const l of Object.keys(T)) {
  for (const k of cles) ok(T[l][k] != null && (T[l][k] !== "" || k === "filmSearchLocal" || k === "filmFullLocal"),   // filmSearchLocal : vide quand le film n'est pas doublé dans la langue
    `texte « ${k} » absent en ${l}`);
  ok(T[l].themes.length === T.fr.themes.length, "nombre de thèmes différent en " + l);
}
for (const n of html.matchAll(/data-i18n(?:-list)?="(\w+)"/g)) ok(n[1] in T.fr, "clé de texte inconnue dans index.html : " + n[1]);

// --- versets : traduction officielle pour chaque langue, jamais une traduction maison (demande d'Ahmed) ---
const V = window.VERSETS;
for (const l of LANGUES) {
  ok(V[l] && /^https:\/\/quranenc\.com\//.test(V[l].url) && V[l].source, "traduction officielle du Coran absente en " + l);
  for (const r of ["21:107", "51:56", "112:1-4", "2:2", "68:4", "7:156", "49:13", "16:97", "17:23", "2:256", "16:125"]) ok(V[l] && V[l].versets[r] && V[l].versets[r].length > 8, `verset ${r} absent en ${l}`);
  ok(T[l].verseNote, "mention de la source des versets absente en " + l);
  ok(D.quran.some(i => i.officiel && i.lang === l && i.url === V[l].url), "Coran officiel absent de la section Coran en " + l);
}
ok(html.includes("js/versets.js") && html.includes("data-verse-note"), "versets officiels non branchés dans index.html");
// les 8 langues du 13/10/2026 : leurs versets sont ceux de la traduction officielle (jamais une traduction maison), dans les textes aussi
for (const l of ["tr", "id", "ru", "vi", "th", "tl", "sv", "ro"]) {
  ok(T[l].msgVerse === V[l].versets["21:107"] && T[l].basmala === V[l].basmala && T[l].footerVerse.startsWith(V[l].versets["16:125"]), "verset non officiel dans les textes en " + l);
  for (const th of T[l].themes) ok(Object.values(V[l].versets).includes(th.quote), `thème ${th.id} : verset non officiel en ${l}`);
  ok(["js/i18n-monde-1.js", "js/i18n-monde-4.js", "js/data-monde.js"].every(f => html.includes(f)) && lire("paroles-du-prophete/index.html").includes("js/i18n-monde-4.js"), "fichiers des 8 langues non branchés dans les pages");
}
ok(/V\[l\]|window\.VERSETS/.test(lire("js/app.js")), "app.js n'applique pas les versets officiels");

// --- page « Paroles du Prophète » : sources officielles, traductions maison clairement signalées ---
const page = lire("paroles-du-prophete/index.html"), P = window.PAROLES;
ok(/<header class="topbar">[\s\S]*id="share-head"[\s\S]*<\/header>/.test(page), "page Paroles : bouton « Partager » absent de l'en-tête");
ok(page.includes(`<link rel="canonical" href="${ADRESSE}paroles-du-prophete/">`) && page.includes("goatcounter.com/count"), "page Paroles : adresse canonique ou compteur absent");
ok(html.includes('href="paroles-du-prophete/"') && plan.includes(`<loc>${ADRESSE}paroles-du-prophete/</loc>`), "page Paroles absente du menu de l'accueil ou du plan du site");
for (const l of LANGUES) {
  ok(page.includes(`<option value="${l}"`), "page Paroles : langue " + l + " absente");
  ok(plan.includes(`<loc>${ADRESSE}paroles-du-prophete/?lang=${l}</loc>`), "sitemap.xml : page Paroles absente en " + l);
  for (const r of [...P.plan.versets.marie, ...P.plan.versets.islam]) ok(P.langues[l].versets[r] && P.langues[l].versets[r].length > 20, `page Paroles : verset ${r} absent en ${l}`);
  for (const id of [...P.plan.hadiths.marie, ...P.plan.hadiths.islam]) {
    const h = P.langues[l].hadiths[id];
    ok(h && h.texte && h.source && /^https:\/\/hadeethenc\.com\//.test(h.url) && typeof h.officiel === "boolean", `page Paroles : hadith ${id} incomplet en ${l}`);
    if (h && h.officiel) ok(h.url.includes("/" + (l === "ca" ? "es" : l) + "/"), `hadith ${id} : lien officiel dans une autre langue en ${l}`);   // catalan : officiel castillan
  }
}
ok(lire("js/page-paroles.js").includes("pUnofficial"), "page Paroles : la mention « traduction non officielle » n'est plus affichée");

// --- les thèmes ne citent plus de parole du Prophète traduite par nous (elles sont sur la page dédiée, avec leurs sources) ---
for (const l of LANGUES) for (const th of T[l].themes) if (["prophet", "woman", "parents"].includes(th.id)) ok(!th.text.includes("ﷺ") && th.text.length > 8, `thème ${th.id} : parole du Prophète non sourcée en ${l}`);

// --- le film : film complet gratuit (demande d'Ahmed), bande-annonce officielle, recherche par langue ---
const C = window.SITE_CONFIG;
ok(html.includes('id="film"') && html.includes('href="#film"') && html.includes("js/i18n-film.js"), "section « Le film » absente de l'accueil ou du menu");
ok(html.includes('id="film-full"') && html.includes('id="film-trailer"'), "boutons du film absents");
ok(/^[\w-]{11}$/.test(C.filmTrailerId) && C.filmFull && /^[\w-]{11}$/.test(C.filmFull.en) && C.filmSearch.en, "réglages du film incomplets dans js/config.js");
ok(!/justwatch|amazon\.|apple\.com/.test(html + lire("js/config.js")), "lien payant pour le film : Ahmed veut un lien gratuit");

// --- données : fichiers des flyers présents, descriptions dans les 4 langues, liens en https ---
// 25/10/2026 (Ahmed) : chaque page de chaque flyer porte le tampon « message.clicvia.com » + QR code (tools/flyers.py,
// à partir des originaux du dépôt privé) ; tampons.json = fichiers tamponnés et leur taille : un fichier remplacé sans
// tampon (taille différente) ou un flyer ajouté sans passer par l'outil est refusé
const tampons = JSON.parse(lire("flyers/tampons.json"));
for (const f of D.flyers) {
  for (const k of ["pdf", "front", "back"]) ok(fs.existsSync(path.join(racine, f[k])), "fichier absent : " + f[k]);
  ok(fs.existsSync(path.join(racine, f.front.replace(/\.jpg$/, "-mini.jpg"))), "vignette absente : " + f.front);
  const pages = f.pages || [f.front, f.back];
  ok(pages[0] === f.front && pages[1] === f.back, "flyer " + f.id + " : pages[0]/pages[1] doivent être le recto et le verso");
  for (const fic of [f.pdf, ...pages, f.front.replace(/\.jpg$/, "-mini.jpg"), f.back.replace(/\.jpg$/, "-mini.jpg")]) {
    ok(fs.existsSync(path.join(racine, fic)), "page de flyer absente : " + fic);
    const nom = path.basename(fic);
    ok(tampons[nom] && fs.existsSync(path.join(racine, fic)) && fs.statSync(path.join(racine, fic)).size === tampons[nom],
       "flyer sans tampon message.clicvia.com (lancer python tools/flyers.py " + f.id + ") : " + nom);
  }
}
ok(/function carteFlyer\(/.test(lire("js/app.js")) && /flyer-langue/.test(lire("js/app.js")) && /\.flyer-langue/.test(lire("css/style.css")),
   "flyers : rangement par langue (un titre par langue) absent");
for (const l of Object.keys(T)) ok((String(T[l].prevPage || T.en.prevPage).match(/1/g) || []).length === 1 && (String(T[l].nextPage || T.en.nextPage).match(/2/g) || []).length === 1, "prevPage/nextPage (" + l + ") : un seul chiffre, remplacé par la page voisine");
for (const l of Object.keys(T)) ok((String(T[l].pageOf || T.en.pageOf).match(/2/g) || []).length === 1, "pageOf (" + l + ") : un seul « 2 » (le total, remplacé par le nombre de pages)");
// RÈGLE D'AHMED (25/10/2026) : tout flyer proposé au téléchargement est IMPRIMABLE sur A4 recto-verso : le PDF proposé est la
// version « -a4 » de tools/flyers.py, exactement 2 feuilles A4 paysage (842 × 595) ; dépliant de 6 panneaux = 3 panneaux par face
for (const f of D.flyers) {
  ok(/-a4\.pdf$/.test(f.pdf), "flyer " + f.id + " : le PDF proposé n'est pas la version A4 à imprimer (tools/flyers.py)");
  const pdf = fs.readFileSync(path.join(racine, f.pdf), "latin1");
  ok((pdf.match(/\/Type\s*\/Page[^s]/g) || []).length === 2 && (pdf.match(/MediaBox\s*\[\s*0 0 842 595\s*\]/g) || []).length === 2, "flyer " + f.id + " : le PDF A4 doit avoir 2 feuilles A4 paysage");
}
ok(/function pagesDe\(/.test(lire("js/app.js")) && /showPage\(vPage \+ 1\)/.test(lire("js/app.js")), "lecteur de flyer : toutes les pages (pas seulement recto/verso)");
for (const s of ["flyers", "quran", "media", "links"]) for (const i of D[s]) {
  for (const l of Object.keys(T)) ok(i.descKey ? T[l][i.descKey] : (i.desc && i.desc[l]), `description absente en ${l} : ${i.name || i.id}`);
  if (i.title) for (const l of Object.keys(T)) ok(i.title[l], `titre absent en ${l} : ${i.id}`);
  for (const u of Object.values(i.localUrl || {})) ok(/^https:\/\//.test(u), "lien non sécurisé : " + u);
  if (i.url) ok(/^https:\/\//.test(i.url), "lien non sécurisé : " + i.url);
}
ok(D.links.some(i => i.url === "https://mosquees.clicvia.com/"), "lien vers le site Mosquées absent des liens utiles");
ok(/^[^@\s]+@[^@\s]+\.[a-z]+$/.test(window.SITE_CONFIG.contactEmail) && !/exemple/.test(window.SITE_CONFIG.contactEmail), "adresse de contact non réglée");

// --- formulaire de contact : e-mail obligatoire et confirmation claire dans la carte (demande d'Ahmed, 15/10/2026) ---
ok(/<input name="email" type="email" autocomplete="email" required>/.test(html), "contact : l'e-mail doit être obligatoire (required)");
const appJs = lire("js/app.js");
// 26/10/2026 (Ahmed) : les messages vont à la boîte du site (FormSubmit) ; secours Formspree commun si FormSubmit refuse
ok(/formEndpoint: "https:\/\/formsubmit\.co\/ajax\/lemessagelemessage8@gmail\.com"/.test(lire("js/config.js")) && /formBackup: "https:\/\/formspree\.io\/f\/mwlpakqj"/.test(lire("js/config.js")) && /name="site" value="The Message"/.test(html), "contact : envoi vers lemessagelemessage8@gmail.com (FormSubmit) avec secours Formspree");
ok(/CFG\.formBackup/.test(lire("js/app.js")) && /j\.success === "false"/.test(lire("js/app.js")), "contact : le secours doit prendre le relais quand FormSubmit refuse");
for (const f of ["index.html", "paroles-du-prophete/index.html"]) ok(/connect-src[^;]*https:\/\/formsubmit\.co/.test(lire(f)), f + " : formsubmit.co absent de la politique de sécurité");
ok(/t\("fEmailErr"\)/.test(appJs) && /function merci\(/.test(appJs) && /form\.hidden = true/.test(appJs), "contact : contrôle de l'e-mail et confirmation dans la carte absents de js/app.js");
const i18nTout = fs.readdirSync(path.join(racine, "js")).filter(n => /^i18n.*\.js$/.test(n)).map(n => lire("js/" + n)).join("\n");
for (const k of ["fEmailErr", "fReply", "fAnother"]) ok((i18nTout.match(new RegExp(k + ': "', "g")) || []).length === LANGUES.length, `contact : texte ${k} absent d'une des ${LANGUES.length} langues`);
ok(!/fEmail: "[^"]*(optional|facultati|opcional|isteğe|opsional|необязательно|không bắt buộc|ไม่บังคับ|opsyonal|frivilligt|opțional|optioneel|任意|选填|선택|वैकल्पिक)/.test(i18nTout), "contact : un libellé dit encore « e-mail facultatif »");
// catalan (26/10/2026) : aucune traduction officielle en catalan -> versets de la traduction officielle castillane, jamais traduits par nous
ok(window.VERSETS.ca && window.VERSETS.ca.url === window.VERSETS.es.url && JSON.stringify(window.VERSETS.ca.versets) === JSON.stringify(window.VERSETS.es.versets), "catalan : les versets doivent être ceux de la traduction officielle castillane");
ok(T.ca.themes.every((th, i) => th.quote === T.es.themes[i].quote) && /castell/.test(T.ca.verseNote), "catalan : citations des thèmes = versets officiels castillans, et la note doit le dire");

console.log(echecs ? `\n${echecs} échec(s)` : "Tous les tests passent.");
process.exit(echecs ? 1 : 0);

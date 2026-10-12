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
const LANGUES = ["en", "fr", "es", "de", "it", "pt", "nl", "zh", "ja", "ko", "hi"];
for (const l of LANGUES) ok(html.includes(`href="${ADRESSE}?lang=${l}"`) && html.includes(`data-setlang="${l}"`) && html.includes(`<option value="${l}"`), "langue " + l + " absente de l'en-tête ou des boutons");
ok(html.includes('hreflang="x-default"'), "hreflang x-default absent");
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
for (const f of ["i18n", "i18n-plus", "i18n-asie", "i18n-paroles", "i18n-film", "versets", "paroles", "data", "data-plus"]) require(path.join(racine, "js/" + f + ".js"));
const T = window.I18N, D = window.SITE_DATA;
const cles = Object.keys(T.fr);
ok(LANGUES.every(l => T[l]) && Object.keys(T).length === LANGUES.length, "les langues du site ne sont pas celles attendues : " + Object.keys(T));
for (const l of Object.keys(T)) for (const c of [...LANGUES, "ar", "multi"]) ok(T[l].langNames[c], `nom de la langue ${c} absent en ${l}`);
for (const l of Object.keys(T)) for (const k of Object.keys(T.fr.kinds)) ok(T[l].kinds[k], `type ${k} absent en ${l}`);
for (const l of Object.keys(T)) ok(T[l].siteName === "The Message" && T[l].pageTitle.startsWith("The Message"), "le nom du site doit être « The Message » en " + l);
ok(html.includes('<span class="arabic">الرسالة</span>'), "nom arabe الرسالة absent de l'en-tête");
for (const l of Object.keys(T)) {
  for (const k of cles) ok(T[l][k] != null && (T[l][k] !== "" || k === "filmSearchLocal"),   // filmSearchLocal : vide quand le film n'est pas doublé dans la langue
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
ok(/V\[l\]|window\.VERSETS/.test(lire("js/app.js")), "app.js n'applique pas les versets officiels");

// --- page « Paroles du Prophète » : sources officielles, traductions maison clairement signalées ---
const page = lire("paroles-du-prophete/index.html"), P = window.PAROLES;
ok(/<header class="topbar">[\s\S]*id="share-head"[\s\S]*<\/header>/.test(page), "page Paroles : bouton « Partager » absent de l'en-tête");
ok(page.includes(`<link rel="canonical" href="${ADRESSE}paroles-du-prophete/">`) && page.includes("goatcounter.com/count"), "page Paroles : adresse canonique ou compteur absent");
ok(html.includes('href="paroles-du-prophete/"') && plan.includes(`<loc>${ADRESSE}paroles-du-prophete/</loc>`), "page Paroles absente du menu de l'accueil ou du plan du site");
for (const l of LANGUES) {
  ok(page.includes(`paroles-du-prophete/?lang=${l}"`) && page.includes(`<option value="${l}"`), "page Paroles : langue " + l + " absente");
  ok(plan.includes(`<loc>${ADRESSE}paroles-du-prophete/?lang=${l}</loc>`), "sitemap.xml : page Paroles absente en " + l);
  for (const r of [...P.plan.versets.marie, ...P.plan.versets.islam]) ok(P.langues[l].versets[r] && P.langues[l].versets[r].length > 20, `page Paroles : verset ${r} absent en ${l}`);
  for (const id of [...P.plan.hadiths.marie, ...P.plan.hadiths.islam]) {
    const h = P.langues[l].hadiths[id];
    ok(h && h.texte && h.source && /^https:\/\/hadeethenc\.com\//.test(h.url) && typeof h.officiel === "boolean", `page Paroles : hadith ${id} incomplet en ${l}`);
    if (h && h.officiel) ok(h.url.includes("/" + l + "/"), `hadith ${id} : lien officiel dans une autre langue en ${l}`);
  }
}
ok(lire("js/page-paroles.js").includes("pUnofficial"), "page Paroles : la mention « traduction non officielle » n'est plus affichée");

// --- les thèmes ne citent plus de parole du Prophète traduite par nous (elles sont sur la page dédiée, avec leurs sources) ---
for (const l of LANGUES) for (const th of T[l].themes) if (["prophet", "woman", "parents"].includes(th.id)) ok(!th.text.includes("ﷺ") && th.text.length > 8, `thème ${th.id} : parole du Prophète non sourcée en ${l}`);

// --- le film : bande-annonce officielle, plateformes légales, pas de lien direct vers une copie non officielle ---
const C = window.SITE_CONFIG;
ok(html.includes('id="film"') && html.includes('href="#film"') && html.includes("js/i18n-film.js"), "section « Le film » absente de l'accueil ou du menu");
ok(/^[\w-]{11}$/.test(C.filmTrailerId) && /^https:\/\/www\.justwatch\.com\//.test(C.filmWatchUrl) && C.filmSearch.en, "réglages du film incomplets dans js/config.js");
ok(!/youtube\.com\/watch|youtu\.be\//.test(html + lire("js/config.js")), "lien direct vers une vidéo YouTube : n'utiliser qu'une publication officielle (voir config.js)");

// --- une seule version (?v=) sur tous les fichiers CSS et JS, pour que les visiteurs reçoivent bien les mises à jour ---
const versions = new Set();
for (const src of [html, page]) for (const m of src.matchAll(/(?:href|src)="(?:\.\.\/)?(?:css|js)\/[\w.-]+\.(?:css|js)(\?v=\w+)?"/g)) versions.add(m[1] || "sans version");
ok(versions.size === 1 && !versions.has("sans version"), "versions des fichiers CSS/JS : " + [...versions].join(", ") + " (lancer python tools/version.py)");

// --- données : fichiers des flyers présents, descriptions dans les 4 langues, liens en https ---
for (const f of D.flyers) {
  for (const k of ["pdf", "front", "back"]) ok(fs.existsSync(path.join(racine, f[k])), "fichier absent : " + f[k]);
  ok(fs.existsSync(path.join(racine, f.front.replace(/\.jpg$/, "-mini.jpg"))), "vignette absente : " + f.front);
}
for (const s of ["flyers", "quran", "media", "links"]) for (const i of D[s]) {
  for (const l of Object.keys(T)) ok(i.descKey ? T[l][i.descKey] : (i.desc && i.desc[l]), `description absente en ${l} : ${i.name || i.id}`);
  if (i.title) for (const l of Object.keys(T)) ok(i.title[l], `titre absent en ${l} : ${i.id}`);
  for (const u of Object.values(i.localUrl || {})) ok(/^https:\/\//.test(u), "lien non sécurisé : " + u);
  if (i.url) ok(/^https:\/\//.test(i.url), "lien non sécurisé : " + i.url);
}
ok(D.links.some(i => i.url === "https://mosquees.clicvia.com/"), "lien vers le site Mosquées absent des liens utiles");
ok(/^[^@\s]+@[^@\s]+\.[a-z]+$/.test(window.SITE_CONFIG.contactEmail) && !/exemple/.test(window.SITE_CONFIG.contactEmail), "adresse de contact non réglée");

console.log(echecs ? `\n${echecs} échec(s)` : "Tous les tests passent.");
process.exit(echecs ? 1 : 0);

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
for (const l of ["fr", "en", "es", "de", "x-default"]) ok(html.includes(`hreflang="${l}"`), "hreflang " + l + " absent");
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
for (const l of ["fr", "en", "es", "de"]) ok(plan.includes(`<loc>${ADRESSE}?lang=${l}</loc>`), "sitemap.xml : langue " + l + " absente");

// --- textes : chaque langue a toutes les clés ---
globalThis.window = {};
require(path.join(racine, "js/config.js"));
require(path.join(racine, "js/i18n.js"));
require(path.join(racine, "js/data.js"));
const T = window.I18N, D = window.SITE_DATA;
const cles = Object.keys(T.fr);
for (const l of Object.keys(T)) ok(T[l].siteName === "The Message" && T[l].pageTitle.startsWith("The Message"), "le nom du site doit être « The Message » en " + l);
ok(html.includes('<span class="arabic">الرسالة</span>'), "nom arabe الرسالة absent de l'en-tête");
for (const l of Object.keys(T)) {
  for (const k of cles) ok(T[l][k] != null && T[l][k] !== "", `texte « ${k} » absent en ${l}`);
  ok(T[l].themes.length === T.fr.themes.length, "nombre de thèmes différent en " + l);
}
for (const n of html.matchAll(/data-i18n(?:-list)?="(\w+)"/g)) ok(n[1] in T.fr, "clé de texte inconnue dans index.html : " + n[1]);

// --- données : fichiers des flyers présents, descriptions dans les 4 langues, liens en https ---
for (const f of D.flyers) {
  for (const k of ["pdf", "front", "back"]) ok(fs.existsSync(path.join(racine, f[k])), "fichier absent : " + f[k]);
  ok(fs.existsSync(path.join(racine, f.front.replace(/\.jpg$/, "-mini.jpg"))), "vignette absente : " + f.front);
}
for (const s of ["flyers", "quran", "media", "links"]) for (const i of D[s]) {
  for (const l of Object.keys(T)) ok(i.desc && i.desc[l], `description absente en ${l} : ${i.name || i.id}`);
  if (i.url) ok(/^https:\/\//.test(i.url), "lien non sécurisé : " + i.url);
}
ok(D.links.some(i => i.url === "https://mosquees.clicvia.com/"), "lien vers le site Mosquées absent des liens utiles");
ok(/^[^@\s]+@[^@\s]+\.[a-z]+$/.test(window.SITE_CONFIG.contactEmail) && !/exemple/.test(window.SITE_CONFIG.contactEmail), "adresse de contact non réglée");

console.log(echecs ? `\n${echecs} échec(s)` : "Tous les tests passent.");
process.exit(echecs ? 1 : 0);

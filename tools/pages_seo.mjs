// Pages lisibles par Google (08/11/2026) : node tools/pages_seo.mjs
//
// Avant : 2 vraies pages seulement ; tous les textes étaient écrits par JavaScript et les langues n'avaient pas d'adresse
// propre (« ?lang=es »), donc Google ne voyait qu'une page en français.
// Ce programme fabrique, à partir des textes de js/*.js (rien n'est traduit ici) :
//   - l'accueil dans chaque langue : /en/, /es/, /ca/…  (le français reste à la racine « / ») ;
//   - « Paroles du Prophète » dans chaque langue : /en/paroles-du-prophete/… ;
//   - une page par thème et par langue : /qui-est-dieu/, /en/who-is-god-allah/, /es/quien-es-dios-ala/… ;
//   - une page par flyer, dans la langue du flyer : /flyer/femme-fr/, /es/flyer/jesus-es/… avec son texte complet quand il
//     existe (tools/flyers_textes.json : texte des dépliants, versets officiels compris), puis ses pages et le PDF ;
//   - sitemap.xml (toutes ces adresses, avec les liens hreflang entre langues) et js/pages.js (adresses pour app.js).
// Tout le texte est DANS le HTML ; app.js le réécrit ensuite pour le visiteur (même texte, mêmes boutons).
// À relancer après toute modification de index.html, paroles-du-prophete/index.html ou js/*.js (le test le vérifie).
// Ne jamais modifier à la main les dossiers fabriqués (en/, es/…, flyer/, pages de thèmes) : ils sont refaits ici.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ADRESSE = "https://message.clicvia.com/";
const VERIFIER = process.argv.includes("--verifier");      // mode test : compare sans rien écrire
const require = createRequire(import.meta.url);
const lire = f => fs.readFileSync(path.join(RACINE, f), "utf8");

globalThis.window = globalThis.window || {};
for (const f of ["config", "i18n", "i18n-plus", "i18n-asie", "i18n-paroles", "i18n-film", "i18n-monde-1", "i18n-monde-2", "i18n-monde-3",
  "i18n-monde-4", "i18n-ca", "versets", "paroles", "data", "data-plus", "data-monde"]) require(path.join(RACINE, "js/" + f + ".js"));
const T = structuredClone(window.I18N), D = window.SITE_DATA, V = window.VERSETS || {}, P = window.PAROLES, CFG = window.SITE_CONFIG;
const TEXTES = JSON.parse(lire("tools/flyers_textes.json"));

// ordre des langues = celui des boutons ; le français est à la racine du site (adresse d'origine, inchangée)
const LANGUES = ["fr", "en", "es", "ca", "de", "it", "pt", "nl", "zh", "ja", "ko", "hi", "tr", "id", "ru", "vi", "th", "tl", "sv", "ro"];
const PRINCIPALE = "fr";
const HL = l => (l === "zh" ? "zh-Hans" : l);                                   // code hreflang / lang
const pre = l => (l === PRINCIPALE ? "" : l + "/");                              // dossier de la langue
const DOSSIERS_FIXES = new Set(["assets", "css", "js", "tools", "flyers", "flyer", "paroles-du-prophete", ".github", ...LANGUES]);

// ───────── versets officiels (même calcul qu'app.js) ─────────
const REF_THEME = { "why-created": "51:56", god: "112:1-4", quran: "2:2", prophet: "68:4", mercy: "7:156", humanity: "49:13", woman: "16:97", parents: "17:23", freedom: "2:256" };
for (const l of Object.keys(V)) {
  const x = T[l], v = V[l];
  if (!x) continue;
  const mot = x.themes[0].ref.replace("51:56", "").trim();
  x.basmala = v.basmala;
  x.msgVerse = v.versets["21:107"];
  x.footerVerse = v.versets["16:125"] + " — " + mot + " 16:125";
  for (const th of x.themes) {
    if (REF_THEME[th.id]) th.quote = v.versets[REF_THEME[th.id]];
    if (th.id === "mercy") th.text = th.text.replace(/(["«„‘“「]\s?)([^"»“’”」]+?)(\s?["»“’”」])/, (m, a, b, c) => a + v.basmala + c);
  }
}
const t = (l, k) => (T[l] && T[l][k] != null ? T[l][k] : T.en[k]);
// Google coupe au-delà de ~70 caractères (titre) et ~160 (description) : TOUTE page fabriquée ici passe par court() (16/11/2026)
const court = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:—-]+\S*$/, "") + "…");
const loc = (l, o) => (o ? o[l] || o.en || o[Object.keys(o)[0]] : "");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const nomLangue = l => T[l].langNames[l] || l;

// ───────── adresses des thèmes (mots de la langue quand elle s'écrit en lettres latines, sinon l'anglais) ─────────
function slug(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ﷺ/g, "").replace(/[ıİ]/g, "i").replace(/[đĐ]/g, "d").replace(/ß/g, "ss")
    .replace(/[·'’]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const SLUGS = {};
for (const l of LANGUES) {
  SLUGS[l] = {};
  const vus = new Set();
  T[l].themes.forEach((th, i) => {
    let s = slug(th.title);
    if (s.length < 3 || /[^\x00-\x7f]/.test(th.title.replace(/[\u00c0-\u024f\u1e00-\u1eff·’ﷺ¿]/g, ""))) s = slug(T.en.themes[i].title);
    if (DOSSIERS_FIXES.has(s) || vus.has(s)) s += "-" + th.id;
    vus.add(s);
    SLUGS[l][th.id] = s;
  });
}
const urlTheme = (l, id) => pre(l) + SLUGS[l][id] + "/";
const urlFlyer = f => pre(f.lang) + "flyer/" + f.id + "/";
const urlAccueil = l => pre(l);
const urlParoles = l => pre(l) + "paroles-du-prophete/";
const pagesDe = f => (f.pages && f.pages.length ? f.pages : [f.front, f.back]);
const flyersDe = l => D.flyers.filter(f => f.lang === l);
const groupe = f => f.id.replace(/-(es|ca|de|en|fr)$/, "");                   // jesus-es, jesus-ca, jesus-de = même dépliant

// ───────── morceaux communs ─────────
const CSP = lire("index.html").match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0];
const VERSION = (lire("index.html").match(/css\/style\.css\?v=(\w+)/) || [])[1];
const ICONE = lire("index.html").match(/<link rel="icon"[^>]*>/)[0];
const POLICES = '<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  ' +
  lire("index.html").match(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/)[0];

function alternates(urls) {          // urls : { langue: adresse relative } ; x-default = la version française (racine)
  return Object.entries(urls).map(([l, u]) => `  <link rel="alternate" hreflang="${HL(l)}" href="${ADRESSE}${u}">`).join("\n") +
    (urls[PRINCIPALE] != null ? `\n  <link rel="alternate" hreflang="x-default" href="${ADRESSE}${urls[PRINCIPALE]}">` : "");
}
function navLangues(urls, l, r) {    // liens vers la même page dans les autres langues (lisibles par Google, sans JavaScript)
  const liens = Object.entries(urls).map(([x, u]) => x === l
    ? `<strong lang="${HL(x)}">${esc(nomLangue(x))}</strong>`
    : `<a href="${r}${u}" hreflang="${HL(x)}" lang="${HL(x)}">${esc(nomLangue(x))}</a>`);
  return `<nav class="langues-pied" aria-label="Languages">🌐 ${liens.join(" · ")}</nav>`;
}
function tete({ l, titre, desc, url, alt, r, type = "article", image = "assets/og-image-v2.jpg" }) {
  return `<!doctype html>
<html lang="${HL(l)}" data-lang="${l}" data-racine="${r}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(court(titre, 70))}</title>
  <meta name="description" content="${esc(court(desc, 160))}">
  <meta name="robots" content="noai, noimageai">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  ${CSP}
  <meta name="theme-color" content="#0f3b2e">
  <link rel="canonical" href="${ADRESSE}${url}">
${alt}
  <meta property="og:title" content="${esc(titre)}">
  <meta property="og:description" content="${esc(court(desc, 160))}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${ADRESSE}${url}">
  <meta property="og:site_name" content="The Message — الرسالة">
  <meta property="og:image" content="${ADRESSE}${image}">${image === "assets/og-image-v2.jpg" ? '\n  <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">' : ""}
  <meta name="twitter:card" content="summary_large_image">
  ${ICONE}
  ${POLICES}
  <link rel="stylesheet" href="${r}css/style.css?v=${VERSION}">
</head>`;
}
function entete(l, r) {
  return `<body class="page-paroles page-seo">
  <header class="topbar">
    <a href="${r}${urlAccueil(l)}" class="brand"><span class="arabic">الرسالة</span> <span>The Message</span></a>
    <nav class="nav nav-page"><a href="${r}${urlAccueil(l)}">← ${esc(t(l, "pBack"))}</a></nav>
  </header>`;
}
function pied(l, r, urls) {
  return `  <footer class="footer">
    <p>${esc(t(l, "footerVerse"))}</p>
    <p class="small">${esc(t(l, "footerNote"))}</p>
    ${navLangues(urls, l, r)}
    <p class="small"><a href="${r}${urlAccueil(l)}">The Message</a> · <a href="${r}${urlParoles(l)}">${esc(t(l, "pTitle"))}</a> · <a href="https://clicvia.com/">clicvia.com</a></p>
  </footer>
  <script src="${r}js/stats.js?v=${VERSION}"></script>
  <script data-goatcounter="https://prix-eaux-tunisie.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</body>
</html>
`;
}
function noteVerset(l) {
  const v = V[l];
  return v ? `${esc(t(l, "verseNote"))} <a href="${v.url}" target="_blank" rel="noopener">${esc(v.source)} — QuranEnc.com ↗</a>` : "";
}
function carteFlyerLien(l, f, r) {
  return `<a class="card lien-page" href="${r}${urlFlyer(f)}"><img src="${r}${f.front.replace(/\.jpg$/, "-mini.jpg")}" alt="" loading="lazy" width="120"><span><strong>${esc(loc(l, f.title))}</strong><br><span class="small">${esc(T[l].langNames[f.lang] || f.lang)}</span></span></a>`;
}

const sorties = new Map();            // chemin -> contenu
const plan = [];                      // { url, alternates: {l: url} }
const ecrire = (fichier, contenu) => sorties.set(fichier, contenu);

// ───────── 1. Accueil et « Paroles » : texte de chaque langue écrit dans le HTML ─────────
function remplir(html, l) {
  html = html.replace(/<(\w+)([^>]*?)\sdata-i18n="(\w+)"([^>]*)>([^<]*)<\/\1>/g,
    (m, tag, a, k, b) => `<${tag}${a} data-i18n="${k}"${b}>${esc(t(l, k))}</${tag}>`);
  html = html.replace(/<(\w+)([^>]*?)\sdata-i18n-list="(\w+)"([^>]*)><\/\1>/g,
    (m, tag, a, k, b) => `<${tag}${a} data-i18n-list="${k}"${b}>${t(l, k).map(s => "<li>" + esc(s) + "</li>").join("")}</${tag}>`);
  html = html.replace(/(<p[^>]*data-verse-note[^>]*>)<\/p>/g, (m, o) => o + noteVerset(l) + "</p>");
  return html;
}
function grilleThemes(l, r) {
  return T[l].themes.map(th => `<article class="card theme-card" id="theme-${th.id}"><div class="icon" aria-hidden="true">${th.icon}</div>` +
    `<h3><a href="${r}${urlTheme(l, th.id)}">${esc(th.title)}</a></h3><p>${esc(th.text)}</p><p class="quote">${esc(th.quote)}<cite>${esc(th.ref)}</cite></p>` +
    `<div class="card-actions"><a class="share-btn" href="${r}${urlTheme(l, th.id)}">${esc(t(l, "read"))} →</a></div></article>`).join("\n");
}
function grilleFlyers(l, r) {
  const nb = {};
  D.flyers.forEach(f => { nb[f.lang] = (nb[f.lang] || 0) + 1; });
  const langues = [...new Set(D.flyers.map(f => f.lang))].sort((a, b) => (b === l) - (a === l) || nb[b] - nb[a] || a.localeCompare(b));
  return langues.map(x => `<h3 class="flyer-langue" id="flyers-${x}">${esc(T[l].langNames[x] || x)} <span>(${nb[x]})</span></h3>\n` +
    D.flyers.filter(f => f.lang === x).map(f => `<article class="card flyer-card" id="flyer-${f.id}">` +
      `<div class="flyer-thumbs${/-a4-1\.jpg$/.test(f.front) ? " a4" : ""}"><a href="${r}${urlFlyer(f)}"><img src="${r}${f.front.replace(/\.jpg$/, "-mini.jpg")}" alt="${esc(loc(l, f.title))}" loading="lazy"></a></div>` +
      `<h3><a href="${r}${urlFlyer(f)}">${esc(loc(l, f.title))}</a></h3><p class="small">${esc(loc(l, f.desc))}</p>` +
      `<div class="card-actions"><a class="btn btn-gold btn-small" href="${r}${urlFlyer(f)}">📖 ${esc(t(l, "readFlyer"))}</a><a class="share-btn" href="${r}${f.pdf}" download>⬇ PDF</a></div></article>`).join("\n")).join("\n");
}
function grilleLiens(l, section) {
  return D[section].map((it, i) => {
    const url = (it.localUrl && it.localUrl[l]) || it.url;
    return `<article class="card" id="${section}-${i}"><div class="tags"><span class="tag kind">${esc(T[l].kinds[it.kind] || it.kind)}</span><span class="tag">${esc(T[l].langNames[it.lang] || it.lang)}</span></div>` +
      `<h3>${esc(it.name)}</h3><p>${esc(it.descKey ? t(l, it.descKey) + (it.source ? " — " + it.source : "") : loc(l, it.desc))}</p>` +
      `<div class="card-actions"><a class="btn btn-gold btn-small" href="${esc(url)}" target="_blank" rel="noopener">${esc(["radio", "audio", "tv"].includes(it.kind) ? t(l, "listen") : t(l, "open"))} ↗</a></div></article>`;
  }).join("\n");
}
const URLS_ACCUEIL = Object.fromEntries(LANGUES.map(l => [l, urlAccueil(l)]));
const URLS_PAROLES = Object.fromEntries(LANGUES.map(l => [l, urlParoles(l)]));

function accueil(l) {
  const r = l === PRINCIPALE ? "" : "../";
  let h = lire("index.html");
  h = h.replace(/^<html[^>]*>/m, `<html lang="${HL(l)}" data-lang="${l}" data-racine="${r}">`);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(t(l, "pageTitle"))}</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*/, "$1" + esc(court(t(l, "metaDesc"), 160)));
  h = h.replace(/(<meta property="og:description" content=")[^"]*/, "$1" + esc(court(t(l, "metaDesc"), 160)));
  h = h.replace(/(<link rel="canonical" href=")[^"]*/, "$1" + ADRESSE + urlAccueil(l));
  h = h.replace(/(<meta property="og:url" content=")[^"]*/, "$1" + ADRESSE + urlAccueil(l));
  h = h.replace(/\n  <link rel="alternate" hreflang[^\n]*/g, "");
  h = h.replace(/(<link rel="canonical"[^>]*>)/, "$1\n" + alternates(URLS_ACCUEIL));
  if (l !== PRINCIPALE) {
    h = h.replace(/(<meta property="og:title" content=")[^"]*/, "$1" + esc(t(l, "pageTitle")));
    h = h.replace(/\s*<script type="application\/ld\+json">\{"@context": "https:\/\/schema.org", "@type": "FAQPage"[^\n]*<\/script>/, "");   // questions-réponses écrites en français
    h = h.replace(/((?:href|src)=")((?:css|js|assets|flyers)\/)/g, "$1../$2");
  }
  h = remplir(h, l);
  h = h.replace(/(<div id="themes-grid" class="grid">)[\s\S]*?(<\/div>\n\s*<p class="note verse-note")/, `$1\n${grilleThemes(l, r)}\n        $2`);
  h = h.replace(/(<div id="flyers-grid" class="grid grid-flyers">)[\s\S]*?(<\/div>\n\s*<p class="note")/, `$1\n${grilleFlyers(l, r)}\n        $2`);
  for (const s of ["quran", "media", "links"]) h = h.replace(new RegExp(`(<div id="${s}-grid" class="grid grid-links">)[\\s\\S]*?(</div>\\n\\s*</div>\\n\\s*</section>)`), `$1\n${grilleLiens(l, s)}\n        $2`);
  h = h.replace(/<nav class="langues-pied"[\s\S]*?<\/nav>/, navLangues(URLS_ACCUEIL, l, r));
  return h;
}
function paroles(l) {
  const r = l === PRINCIPALE ? "../" : "../../";
  let h = lire("paroles-du-prophete/index.html");
  h = h.replace(/^<html[^>]*>/m, `<html lang="${HL(l)}" data-lang="${l}" data-racine="${r}">`);
  if (l !== PRINCIPALE) {
    h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc([t(l, "pTitle") + " — " + t(l, "siteName"), t(l, "pTitle")].find(x => x.length <= 70) || court(t(l, "pTitle"), 70))}</title>`);
    h = h.replace(/(<meta name="description" content=")[^"]*/, "$1" + esc(court(t(l, "pLead"), 160)));
    h = h.replace(/(<meta property="og:description" content=")[^"]*/, "$1" + esc(court(t(l, "pLead"), 160)));
    h = h.replace(/(<meta property="og:title" content=")[^"]*/, "$1" + esc(t(l, "pTitle")));
    h = h.replace(/((?:href|src)=")\.\.\/((?:css|js|assets)\/)/g, "$1../../$2");
  }
  h = h.replace(/(<link rel="canonical" href=")[^"]*/, "$1" + ADRESSE + urlParoles(l));
  h = h.replace(/(<meta property="og:url" content=")[^"]*/, "$1" + ADRESSE + urlParoles(l));
  h = h.replace(/\n  <link rel="alternate" hreflang[^\n]*/g, "");
  h = h.replace(/(<link rel="canonical"[^>]*>)/, "$1\n" + alternates(URLS_PAROLES));
  h = remplir(h, l);
  const mot = T[l].themes[0].ref.replace("51:56", "").trim();
  for (const p of ["marie", "islam"]) {
    const vs = P.plan.versets[p].map(ref => `<blockquote class="verse verse-page"><p>${esc(P.langues[l].versets[ref])}</p><cite>${esc(mot + " " + ref)}</cite></blockquote>`).join("");
    const hs = P.plan.hadiths[p].map(id => {
      const x = P.langues[l].hadiths[id];
      return `<article class="card hadith" id="hadith-${id}">` + (P.arabe[id] ? `<p class="arabic hadith-ar">${esc(P.arabe[id])}</p>` : "") +
        `<p class="hadith-texte">${esc(x.texte)}</p><p class="hadith-source">${esc(x.source)}</p>` +
        (x.officiel ? `<p class="hadith-note officiel">✓ ${esc(t(l, "pOfficial"))} · <a href="${x.url}" target="_blank" rel="noopener">${esc(t(l, "pSeeSource"))} ↗</a></p>`
          : `<p class="hadith-note non-officiel">⚠ ${esc(t(l, "pUnofficial"))} <a href="${x.url}" target="_blank" rel="noopener">${esc(t(l, "pSeeSource"))} ↗</a></p>`) + "</article>";
    }).join("");
    h = h.replace(`<div id="versets-${p}"></div>`, `<div id="versets-${p}">${vs}</div>`).replace(`<div id="hadiths-${p}"></div>`, `<div id="hadiths-${p}">${hs}</div>`);
  }
  for (const id of ["lien-accueil", "retour-accueil", "pied-accueil"]) h = h.replace(new RegExp(`href="[^"]*"( (?:class="[^"]*" )?id="${id}")`), `href="${r}${urlAccueil(l)}"$1`);
  h = h.replace(/href="[^"]*"( id="lien-question")/, `href="${r}${urlAccueil(l)}#contact"$1`);
  h = h.replace(/<nav class="langues-pied"[\s\S]*?<\/nav>/, navLangues(URLS_PAROLES, l, r));
  return h;
}
for (const l of LANGUES) {
  ecrire(urlAccueil(l) + "index.html", accueil(l));
  ecrire(urlParoles(l) + "index.html", paroles(l));
}
plan.push({ url: "", alt: URLS_ACCUEIL, prio: "1.0" }, ...LANGUES.filter(l => l !== PRINCIPALE).map(l => ({ url: urlAccueil(l), alt: URLS_ACCUEIL, prio: "0.9" })));
plan.push(...LANGUES.map(l => ({ url: urlParoles(l), alt: URLS_PAROLES, prio: "0.8" })));

// ───────── 2. Une page par thème et par langue ─────────
for (const l of LANGUES) {
  T[l].themes.forEach(th => {
    const url = urlTheme(l, th.id), r = "../".repeat(url.split("/").filter(Boolean).length);
    const urls = Object.fromEntries(LANGUES.map(x => [x, urlTheme(x, th.id)]));
    const autres = T[l].themes.filter(x => x.id !== th.id).map(x => `<li><a href="${r}${urlTheme(l, x.id)}">${esc(x.title)}</a></li>`).join("");
    const fl = (flyersDe(l).length ? flyersDe(l) : flyersDe("en")).map(f => carteFlyerLien(l, f, r)).join("\n");
    const titre = th.title + " — " + t(l, "siteName");
    const desc = (th.text + " " + th.quote).slice(0, 300);
    ecrire(url + "index.html", tete({ l, titre, desc: desc.length > 160 ? desc.slice(0, 157).replace(/\s+\S*$/, "") + "…" : desc, url, alt: alternates(urls), r }) + "\n" + entete(l, r) + `
  <main>
    <section class="hero hero-page">
      <div class="hero-inner">
        <p class="arabic hero-ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 class="hero-title page-title">${esc(th.title)}</h1>
      </div>
    </section>
    <section class="section">
      <div class="container narrow-large">
        <p class="lead">${esc(th.text)}</p>
        <blockquote class="verse verse-page"><p>${esc(th.quote)}</p><cite>${esc(th.ref)}</cite></blockquote>
        <p class="note verse-note">${noteVerset(l)}</p>
        <p class="centre"><a class="btn btn-gold" href="${r}${urlAccueil(l)}#themes">${esc(t(l, "themesTitle"))}</a> <a class="share-btn" href="${r}${urlParoles(l)}">${esc(t(l, "pTitle"))}</a></p>
      </div>
    </section>
    <section class="section section-alt">
      <div class="container narrow-large">
        <h2>${esc(t(l, "themesTitle"))}</h2>
        <ul class="liste-pages">${autres}</ul>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>${esc(t(l, "flyersTitle"))}</h2>
        <div class="grid grid-pages">
${fl}
        </div>
      </div>
    </section>
  </main>
` + pied(l, r, urls));
    plan.push({ url, alt: urls, prio: "0.7" });
  });
}

// ───────── 3. Une page par flyer (dans la langue du flyer) ─────────
function texteFlyer(x) {
  const bloc = b => {
    const ref = b.ref ? `<cite>${esc(b.ref)}</cite>` : "";
    switch (b.type) {
      case "titre": return `<h2>${esc(b.texte)}</h2>`;
      case "sous_titre": return `<h3>${esc(b.texte)}</h3>`;
      case "puce": return `<li>${esc(b.texte)}</li>`;
      case "citation": case "bulle": return `<blockquote class="verse verse-page"><p>${esc(b.texte)}</p>${ref}</blockquote>`;
      default: return `<p>${esc(b.texte)}${b.ref ? " <cite>(" + esc(b.ref) + ")</cite>" : ""}</p>`;
    }
  };
  const corps = x.panneaux.flat().map(bloc).join("\n").replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, m => `<ul>${m}</ul>`);
  const notes = [x.note_off, x.note].filter(Boolean).map(n => `<p class="small">${esc(n)}</p>`).join("");
  return `<div class="texte-flyer">${x.couverture.sous_titre ? `<p class="lead">${esc(x.couverture.sous_titre)}</p>` : ""}\n${corps}\n${notes}<p class="small">${esc(x.credit)}</p></div>`;
}
for (const f of D.flyers) {
  const l = f.lang, url = urlFlyer(f), r = "../".repeat(url.split("/").filter(Boolean).length);
  const urls = Object.fromEntries(D.flyers.filter(g => groupe(g) === groupe(f) && LANGUES.includes(g.lang)).map(g => [g.lang, urlFlyer(g)]));
  const titre = loc(l, f.title), desc = loc(l, f.desc);
  const pages = pagesDe(f).map((p, i) => `<a href="${r}${p}"><img src="${r}${p}" alt="${esc(titre)} — ${i + 1}/${pagesDe(f).length}" loading="lazy" width="600"></a>`).join("\n");
  const autres = flyersDe(l).filter(g => g.id !== f.id).map(g => carteFlyerLien(l, g, r)).join("\n");
  const x = TEXTES[f.id];
  const altLangues = Object.keys(urls).length > 1 ? alternates(urls) : "";
  ecrire(url + "index.html", tete({ l, titre: [titre + " — " + t(l, "flyersTitle") + " | The Message", titre + " | The Message", titre].find(x => x.length <= 70) || titre, desc, url, alt: altLangues, r, image: f.front }) + "\n" + entete(l, r) + `
  <main>
    <section class="hero hero-page">
      <div class="hero-inner">
        <h1 class="hero-title page-title">${esc(titre)}</h1>
        <p class="hero-lead">${esc(desc)}</p>
        <div class="hero-actions"><a class="btn btn-gold" href="${r}${f.pdf}" download>⬇ ${esc(t(l, "downloadPdf"))}</a> <a class="btn btn-ghost" href="#pages">📖 ${esc(t(l, "readFlyer"))}</a></div>
      </div>
    </section>
${x ? `    <section class="section">
      <div class="container narrow-large">
${texteFlyer(x)}
      </div>
    </section>
` : ""}    <section class="section section-alt" id="pages">
      <div class="container narrow-large pages-flyer">
${pages}
        <p class="centre"><a class="btn btn-gold" href="${r}${f.pdf}" download>⬇ ${esc(t(l, "downloadPdf"))}</a></p>
      </div>
    </section>
${autres ? `    <section class="section">
      <div class="container">
        <h2>${esc(t(l, "flyersTitle"))}</h2>
        <div class="grid grid-pages">
${autres}
        </div>
      </div>
    </section>
` : ""}  </main>
` + pied(l, r, Object.keys(urls).length > 1 ? urls : { [l]: url }));
  plan.push({ url, alt: Object.keys(urls).length > 1 ? urls : null, prio: "0.6" });
}

// ───────── 4. Plan du site et adresses pour app.js ─────────
const jour = process.env.DATE_PLAN || new Date().toISOString().slice(0, 10);
const ancien = fs.existsSync(path.join(RACINE, "sitemap.xml")) ? lire("sitemap.xml") : "";
const entree = p => `  <url><loc>${ADRESSE}${p.url}</loc><lastmod>${jour}</lastmod><priority>${p.prio}</priority>` +
  (p.alt ? "\n" + Object.entries(p.alt).map(([l, u]) => `    <xhtml:link rel="alternate" hreflang="${HL(l)}" href="${ADRESSE}${u}"/>`).join("\n") +
    (p.alt[PRINCIPALE] != null ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${ADRESSE}${p.alt[PRINCIPALE]}"/>` : "") + "\n  " : "") + "</url>";
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${plan.map(entree).join("\n")}\n</urlset>\n`;
// date inchangée si rien d'autre n'a changé (pas de fausse nouveauté chaque jour)
const sansDate = s => s.replace(/<lastmod>[^<]*<\/lastmod>/g, "");
if (ancien && sansDate(ancien) === sansDate(xml)) xml = ancien;
ecrire("sitemap.xml", xml);
ecrire("js/pages.js", "// Fabriqué par tools/pages_seo.mjs — ne pas modifier à la main.\nwindow.SITE_PAGES = " +
  JSON.stringify({ principale: PRINCIPALE, themes: SLUGS, flyers: Object.fromEntries(D.flyers.map(f => [f.id, urlFlyer(f)])) }) + ";\n");

// ───────── écriture (ou vérification) ─────────
let differences = 0;
for (const [f, c] of sorties) {
  const p = path.join(RACINE, f);
  const avant = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (avant === c) continue;
  differences++;
  if (VERIFIER) { console.error("pas à jour : " + f); continue; }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c);
}
// pages fabriquées qui n'existent plus (thème ou flyer retiré) : supprimées
const attendus = new Set([...sorties.keys()].map(f => f.replace(/\\/g, "/")));
const enTrop = [];
const fouiller = dir => {
  for (const n of fs.readdirSync(path.join(RACINE, dir), { withFileTypes: true })) {
    const rel = dir ? dir + "/" + n.name : n.name;
    if (n.isDirectory()) { if (!dir && DOSSIERS_FIXES.has(n.name) && !LANGUES.includes(n.name) && n.name !== "flyer") continue; if (n.name !== ".git" && n.name !== "node_modules") fouiller(rel); }
    else if (n.name === "index.html" && rel !== "index.html" && !attendus.has(rel) && fs.readFileSync(path.join(RACINE, rel), "utf8").includes('data-racine=')) enTrop.push(rel);
  }
};
fouiller("");
for (const f of enTrop) {
  differences++;
  if (VERIFIER) console.error("en trop : " + f);
  else fs.rmSync(path.join(RACINE, f));
}
if (VERIFIER) {
  if (differences) { console.error(`${differences} fichier(s) pas à jour : lancer « node tools/pages_seo.mjs »`); process.exit(1); }
  console.log("pages fabriquées à jour (" + sorties.size + " fichiers)");
} else console.log(`${sorties.size} fichiers fabriqués (${differences} modifiés) ; ${plan.length} adresses dans sitemap.xml`);
export { LANGUES, SLUGS, PRINCIPALE };

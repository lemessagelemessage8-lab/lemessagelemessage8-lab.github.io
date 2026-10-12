// Page « Paroles du Prophète » : affiche les versets et les hadiths de js/paroles.js dans la langue du visiteur.
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG, T = window.I18N, P = window.PAROLES, V = window.VERSETS || {};
  window.goatcounter = window.goatcounter || {};
  window.goatcounter.path = function (p) { return "/le-message" + p; };

  function pickLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && T[q]) return q;
    try { var s = localStorage.getItem("lang"); if (s && T[s]) return s; } catch (e) {}
    var nav = (navigator.language || "").slice(0, 2);
    return T[nav] ? nav : CFG.defaultLang;
  }
  var lang = pickLang();
  function t(k) { return (T[lang] && T[lang][k] != null) ? T[lang][k] : T.en[k]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function versets(partie) {
    var mot = T[lang].themes[0].ref.replace("51:56", "").trim();     // « Coran », « Quran »…
    return P.plan.versets[partie].map(function (ref) {
      return '<blockquote class="verse verse-page"><p>' + esc(P.langues[lang].versets[ref]) + "</p><cite>" + esc(mot + " " + ref) + "</cite></blockquote>";
    }).join("");
  }
  function hadiths(partie) {
    return P.plan.hadiths[partie].map(function (id) {
      var h = P.langues[lang].hadiths[id];
      return '<article class="card hadith" id="hadith-' + id + '">' +
        (P.arabe[id] ? '<p class="arabic hadith-ar">' + esc(P.arabe[id]) + "</p>" : "") +
        '<p class="hadith-texte">' + esc(h.texte) + "</p>" +
        '<p class="hadith-source">' + esc(h.source) + "</p>" +
        (h.officiel
          ? '<p class="hadith-note officiel">✓ ' + esc(t("pOfficial")) + ' · <a href="' + h.url + '" target="_blank" rel="noopener">' + esc(t("pSeeSource")) + " ↗</a></p>"
          : '<p class="hadith-note non-officiel">⚠ ' + esc(t("pUnofficial")) + ' <a href="' + h.url + '" target="_blank" rel="noopener">' + esc(t("pSeeSource")) + " ↗</a></p>") +
        "</article>";
    }).join("");
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l === "zh" ? "zh-Hans" : l;
    document.getElementById("lang-select").value = l;
    document.title = t("pTitle") + " — " + t("siteName");
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", t("pLead"));
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.dataset.i18n); });
    ["marie", "islam"].forEach(function (p) {
      document.getElementById("versets-" + p).innerHTML = versets(p);
      document.getElementById("hadiths-" + p).innerHTML = hadiths(p);
    });
    document.querySelectorAll("[data-verse-note]").forEach(function (n) {
      var v = V[lang];
      n.innerHTML = v ? esc(t("verseNote")) + ' <a href="' + v.url + '" target="_blank" rel="noopener">' + esc(v.source) + " — QuranEnc.com ↗</a>" : "";
    });
    ["lien-accueil", "retour-accueil", "pied-accueil"].forEach(function (id) { document.getElementById(id).href = "../?lang=" + l; });
    document.getElementById("lien-question").href = "../?lang=" + l + "#contact";
    var sh = document.getElementById("share-head"); sh.title = t("share"); sh.setAttribute("aria-label", t("share"));
  }

  // ───────── Partage (même fonctionnement que l'accueil) ─────────
  function share() {
    var url = location.href.split("#")[0].split("?")[0] + "?lang=" + lang, title = t("pTitle");
    var text = t("shareText") + " " + title;
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "partage/le-message/paroles-du-prophete", title: "Partage", event: true }); } catch (e) {}
    if (navigator.share) { navigator.share({ title: t("siteName") + " — " + title, text: text, url: url }).catch(function () {}); return; }
    var full = encodeURIComponent(text + " " + url), u = encodeURIComponent(url), tx = encodeURIComponent(text);
    var links = {
      whatsapp: "https://wa.me/?text=" + full, facebook: "https://www.facebook.com/sharer/sharer.php?u=" + u,
      x: "https://twitter.com/intent/tweet?text=" + tx + "&url=" + u, telegram: "https://t.me/share/url?url=" + u + "&text=" + tx,
      email: "mailto:?subject=" + encodeURIComponent(t("siteName") + " — " + title) + "&body=" + full
    };
    document.querySelectorAll(".share-targets a").forEach(function (a) { a.href = links[a.dataset.net]; });
    document.getElementById("share-what").textContent = title;
    document.getElementById("share-copy").onclick = function () {
      (navigator.clipboard ? navigator.clipboard.writeText(text + " " + url) : Promise.reject()).then(function () {
        document.getElementById("share-copy").textContent = t("copied");
      }, function () { prompt("", text + " " + url); });
    };
    document.getElementById("share-sheet").hidden = false;
  }
  document.getElementById("share-head").onclick = share;
  document.getElementById("share-close").onclick = function () { document.getElementById("share-sheet").hidden = true; };
  document.getElementById("share-sheet").onclick = function (e) { if (e.target === this) this.hidden = true; };
  document.getElementById("lang-select").onchange = function (e) { setLang(e.target.value); };

  setLang(lang);
})();

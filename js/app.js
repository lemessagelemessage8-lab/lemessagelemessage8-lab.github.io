(function () {
  "use strict";
  var CFG = window.SITE_CONFIG, T = window.I18N, D = window.SITE_DATA;
  // Statistiques : les visites de ce site sont rangées sous /le-message dans le compteur commun
  window.goatcounter = window.goatcounter || {};
  window.goatcounter.path = function (p) { return "/le-message" + p; };
  // ───────── Versets : traduction officielle du Coran pour chaque langue (js/versets.js, fabriqué par tools/versets.py) ─────────
  var V = window.VERSETS || {};
  var REF_THEME = { "why-created": "51:56", god: "112:1-4", quran: "2:2", prophet: "68:4", mercy: "7:156", humanity: "49:13", woman: "16:97", parents: "17:23", freedom: "2:256" };
  Object.keys(V).forEach(function (l) {
    var x = T[l], v = V[l];
    if (!x) return;
    var mot = x.themes[0].ref.replace("51:56", "").trim();          // « Coran », « Quran », « 《古兰经》 »…
    x.basmala = v.basmala;
    x.msgVerse = v.versets["21:107"];
    x.footerVerse = v.versets["16:125"] + " — " + mot + " 16:125";
    x.themes.forEach(function (th) {
      if (REF_THEME[th.id]) th.quote = v.versets[REF_THEME[th.id]];
      // le thème « miséricorde » cite la formule d'ouverture des sourates : même texte que la traduction officielle
      if (th.id === "mercy") th.text = th.text.replace(/(["«„‘“「]\s?)([^"»“’”」]+?)(\s?["»“’”」])/, function (m, a, b, c) { return a + v.basmala + c; });
    });
  });

  var lang = pickLang();
  var filters = { quran: "all", media: "all", flyers: "all" };

  function pickLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && T[q]) return q;
    try { var s = localStorage.getItem("lang"); if (s && T[s]) return s; } catch (e) {}
    var nav = (navigator.language || "").slice(0, 2);
    return T[nav] ? nav : CFG.defaultLang;
  }
  function t(key) { return (T[lang] && T[lang][key] != null) ? T[lang][key] : T.en[key]; }
  function loc(obj) { return obj ? (obj[lang] || obj.en || obj[Object.keys(obj)[0]]) : ""; }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ───────── Langue ─────────
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l === "zh" ? "zh-Hans" : l;
    document.getElementById("lang-select").value = l;
    document.querySelectorAll("[data-setlang]").forEach(function (b) { b.classList.toggle("active", b.dataset.setlang === l); });
    document.title = t("pageTitle");
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", t("metaDesc"));
    var sh = document.getElementById("share-head"); sh.title = t("share"); sh.setAttribute("aria-label", t("share"));
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll("[data-i18n-list]").forEach(function (n) {
      n.innerHTML = t(n.dataset.i18nList).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    });
    document.querySelectorAll("[data-verse-note]").forEach(function (n) {
      var v = V[lang];
      n.innerHTML = v ? esc(t("verseNote")) + ' <a href="' + v.url + '" target="_blank" rel="noopener">' + esc(v.source) + " — QuranEnc.com ↗</a>" : "";
    });
    document.querySelectorAll("[data-page-paroles]").forEach(function (a) { a.href = "paroles-du-prophete/?lang=" + lang; });
    // le film : liens de recherche dans la langue du visiteur quand un doublage existe
    var q = function (x) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(x); };
    var yt = function (id) { return "https://www.youtube.com/" + "watch?v=" + id; };
    document.getElementById("film-full").href = yt(CFG.filmFull.en);
    document.getElementById("film-trailer").href = yt(CFG.filmTrailerId);
    var fl = document.getElementById("film-full-local");
    fl.hidden = !(CFG.filmFull[lang] && lang !== "en" && t("filmFullLocal"));
    if (!fl.hidden) fl.href = yt(CFG.filmFull[lang]);
    document.getElementById("film-search-en").href = q(CFG.filmSearch.en);
    var loc2 = document.getElementById("film-search-local");
    loc2.hidden = !(t("filmSearchLocal") && CFG.filmSearch[lang] && lang !== "en");
    if (!loc2.hidden) loc2.href = q(CFG.filmSearch[lang]);
    renderThemes(); renderFlyers(); renderLinks("quran"); renderLinks("media"); renderLinks("links");
  }

  // ───────── Thèmes ─────────
  function renderThemes() {
    var g = document.getElementById("themes-grid"); g.innerHTML = "";
    t("themes").forEach(function (th) {
      var c = el("article", { class: "card theme-card", id: "theme-" + th.id });
      c.innerHTML =
        '<div class="icon" aria-hidden="true">' + th.icon + "</div>" +
        "<h3>" + esc(th.title) + "</h3><p>" + esc(th.text) + "</p>" +
        '<p class="quote">' + esc(th.quote) + "<cite>" + esc(th.ref) + "</cite></p>";
      c.appendChild(actions([shareButton(th.title, "theme-" + th.id)]));
      g.appendChild(c);
    });
  }

  // ───────── Flyers ─────────
  function renderFlyers() {
    var g = document.getElementById("flyers-grid"); g.innerHTML = "";
    var fbar = document.getElementById("flyers-filter"); fbar.innerHTML = "";
    // 25/10/2026 (Ahmed) : flyers rangés PAR LANGUE — la langue du visiteur d'abord, puis la langue qui a le plus de flyers
    var nb = {}; D.flyers.forEach(function (f) { nb[f.lang] = (nb[f.lang] || 0) + 1; });
    var langues = unique(D.flyers.map(function (f) { return f.lang; })).sort(function (a, b) {
      return (b === lang) - (a === lang) || nb[b] - nb[a] || (t("langNames")[a] || a).localeCompare(t("langNames")[b] || b);
    });
    ["all"].concat(langues).forEach(function (l) {
      var b = el("button", { type: "button" }, esc(l === "all" ? t("all") + " (" + D.flyers.length + ")" : (t("langNames")[l] || l) + " (" + nb[l] + ")"));
      b.classList.toggle("active", filters.flyers === l);
      b.onclick = function () { filters.flyers = l; renderFlyers(); };
      fbar.appendChild(b);
    });
    langues.forEach(function (l) {
      if (filters.flyers !== "all" && l !== filters.flyers) return;
      var titre = el("h3", { class: "flyer-langue", id: "flyers-" + l }, esc(t("langNames")[l] || l) + ' <span>(' + nb[l] + ")</span>");
      g.appendChild(titre);
      D.flyers.filter(function (f) { return f.lang === l; }).forEach(function (f) { g.appendChild(carteFlyer(f)); });
    });
  }

  function pagesDe(f) { return f.pages && f.pages.length ? f.pages : [f.front, f.back]; }

  function carteFlyer(f) {
      var c = el("article", { class: "card flyer-card", id: "flyer-" + f.id });
      c.innerHTML =
        '<div class="flyer-thumbs">' +
          '<button type="button" data-page="0"><img src="' + mini(f.front) + '" alt="' + esc(t("front")) + '" loading="lazy"><span>' + esc(t("prevPage")) + " — " + esc(t("front")) + "</span></button>" +
          '<button type="button" data-page="1"><img src="' + mini(f.back) + '" alt="' + esc(t("back")) + '" loading="lazy"><span>' + esc(t("nextPage")) + " — " + esc(t("back")) + "</span></button>" +
        "</div>" +
        '<div class="tags"><span class="tag">' + esc(t("langNames")[f.lang] || f.lang) + "</span></div>" +
        "<h3>" + esc(loc(f.title)) + "</h3><p class=\"small\">" + esc(loc(f.desc)) + "</p>";
      c.querySelectorAll(".flyer-thumbs button").forEach(function (b) { b.onclick = function () { openViewer(f, +b.dataset.page); }; });
      var read = el("button", { type: "button", class: "btn btn-gold btn-small" }, "📖 " + esc(t("readFlyer")));
      read.onclick = function () { openViewer(f, 0); };
      var dl = el("a", { class: "share-btn", href: f.pdf, target: "_blank", download: "" }, "⬇ PDF");
      c.appendChild(actions([read, dl, shareButton(loc(f.title), "flyer-" + f.id)]));
      return c;
  }

  function mini(src) { return src.replace(/\.jpg$/, "-mini.jpg"); }

  // ───────── Lecteur de flyer (page 1 → page 2) ─────────
  var viewer = document.getElementById("viewer"), vImg = document.getElementById("viewer-img");
  var vStage = document.getElementById("viewer-stage"), vFlyer = null, vPage = 0;
  function openViewer(f, page) {
    vFlyer = f;
    document.getElementById("viewer-title").textContent = loc(f.title);
    document.getElementById("viewer-pdf").href = f.pdf;
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
    showPage(page);
    document.getElementById("viewer-close").focus();
  }
  function showPage(n) {
    var P = pagesDe(vFlyer);
    n = Math.max(0, Math.min(P.length - 1, n));
    vPage = n;
    vStage.classList.remove("zoomed");
    vImg.src = P[n];
    // « Page {n} sur 2 » : le seul « 2 » du texte traduit est le total -> remplacé par le vrai nombre de pages (avant {n})
    var libelle = t("pageOf").replace("2", P.length).replace("{n}", n + 1);
    vImg.alt = loc(vFlyer.title) + " — " + libelle;
    document.getElementById("viewer-page").textContent = libelle + (P.length > 2 ? "" : " · " + (n === 0 ? t("front") : t("back")));
    document.getElementById("viewer-prev").disabled = n === 0;
    document.getElementById("viewer-next").disabled = n === P.length - 1;
    // boutons « ‹ Page 1 » / « Page 2 › » : le chiffre suit la page en cours (flyers de plus de 2 pages, 25/10/2026)
    document.querySelector("#viewer-prev span").textContent = t("prevPage").replace("1", Math.max(1, n));
    document.querySelector("#viewer-next span").textContent = t("nextPage").replace("2", Math.min(P.length, n + 2));
  }
  function closeViewer() { viewer.hidden = true; document.body.style.overflow = ""; vImg.removeAttribute("src"); }
  document.getElementById("viewer-prev").onclick = function () { showPage(vPage - 1); };
  document.getElementById("viewer-next").onclick = function () { showPage(vPage + 1); };
  document.getElementById("viewer-close").onclick = closeViewer;
  vImg.onclick = function () { vStage.classList.toggle("zoomed"); };
  document.addEventListener("keydown", function (e) {
    if (viewer.hidden) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") showPage(vPage + 1);
    if (e.key === "ArrowLeft") showPage(vPage - 1);
  });
  // Glisser le doigt à gauche/droite sur téléphone pour changer de page
  var touchX = null;
  vStage.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  vStage.addEventListener("touchend", function (e) {
    if (touchX === null || vStage.classList.contains("zoomed")) return;
    var dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (dx < -50) showPage(vPage + 1); else if (dx > 50) showPage(vPage - 1);
  });

  // ───────── Corans / médias / liens ─────────
  function renderLinks(section) {
    var items = D[section];
    var grid = document.getElementById(section + "-grid"); grid.innerHTML = "";
    var fbar = document.getElementById(section + "-filter");
    if (fbar) {
      var langsHere = ["all"].concat(unique(items.map(function (i) { return i.lang; })).filter(function (l) { return l !== "multi"; }));
      fbar.innerHTML = "";
      langsHere.forEach(function (l) {
        var b = el("button", { type: "button" }, esc(l === "all" ? t("all") : (t("langNames")[l] || l)));
        b.classList.toggle("active", filters[section] === l);
        b.onclick = function () { filters[section] = l; renderLinks(section); };
        fbar.appendChild(b);
      });
    }
    // section Coran : les traductions dans la langue du visiteur passent en premier
    var ordre = items.map(function (it, i) { return i; });
    if (section === "quran") ordre.sort(function (a, b) { return (items[b].lang === lang) - (items[a].lang === lang) || a - b; });
    ordre.forEach(function (i) {
      var it = items[i];
      var f = filters[section];
      if (fbar && f !== "all" && it.lang !== f && it.lang !== "multi") return;
      var url = (it.localUrl && it.localUrl[lang]) || it.url;
      var id = section + "-" + i;
      var c = el("article", { class: "card", id: id });
      c.innerHTML =
        '<div class="tags"><span class="tag kind">' + esc(t("kinds")[it.kind] || it.kind) + '</span><span class="tag">' + esc(t("langNames")[it.lang] || it.lang) + "</span></div>" +
        "<h3>" + esc(it.name) + "</h3><p>" + esc(it.descKey ? t(it.descKey) + (it.source ? " — " + it.source : "") : loc(it.desc)) + "</p>";
      var label = (it.kind === "radio" || it.kind === "audio" || it.kind === "tv") ? t("listen") : t("open");
      var a = el("a", { class: "btn btn-gold btn-small", href: url, target: "_blank", rel: "noopener" }, esc(label) + " ↗");
      c.appendChild(actions([a, shareButton(it.name, id, url)]));
      grid.appendChild(c);
    });
  }
  function unique(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function actions(nodes) { var d = el("div", { class: "card-actions" }); nodes.forEach(function (n) { d.appendChild(n); }); return d; }

  // ───────── Partage ─────────
  function pageUrl(anchor) {
    var base = location.href.split("#")[0].split("?")[0];
    return base + "?lang=" + lang + (anchor ? "#" + anchor : "");
  }
  function shareButton(title, anchor, externalUrl) {
    var b = el("button", { type: "button", class: "share-btn" }, "↗ " + esc(t("share")));
    b.onclick = function () { share(title, pageUrl(anchor), externalUrl); };
    return b;
  }
  function share(title, url, externalUrl) {
    // clic compté dans les statistiques (GoatCounter) ; le partage marche aussi sans
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "partage/le-message" + (url.split("#")[1] ? "/" + url.split("#")[1] : ""), title: "Partage", event: true }); } catch (e) {}
    var text = t("shareText") + " " + title + (externalUrl ? " — " + externalUrl : "");
    if (navigator.share) {
      navigator.share({ title: t("siteName") + " — " + title, text: text, url: url }).catch(function () {});
      return;
    }
    var full = encodeURIComponent(text + " " + url), u = encodeURIComponent(url), tx = encodeURIComponent(text);
    var links = {
      whatsapp: "https://wa.me/?text=" + full,
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + u,
      x: "https://twitter.com/intent/tweet?text=" + tx + "&url=" + u,
      telegram: "https://t.me/share/url?url=" + u + "&text=" + tx,
      email: "mailto:?subject=" + encodeURIComponent(t("siteName") + " — " + title) + "&body=" + full
    };
    document.querySelectorAll(".share-targets a").forEach(function (a) { a.href = links[a.dataset.net]; });
    document.getElementById("share-what").textContent = title;
    document.getElementById("share-copy").onclick = function () { copy(text + " " + url); };
    document.getElementById("share-sheet").hidden = false;
  }
  function copy(s) {
    (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(function () { toast(t("copied")); }, function () { prompt("", s); });
  }
  function toast(msg) {
    var d = el("div", { class: "toast", role: "status" }, esc(msg));
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 2200);
  }

  // ───────── Musique ─────────
  // Lecteur YouTube : chargé dès l'ouverture, lancé au clic du visiteur (les navigateurs bloquent le son automatique).
  var musicBtn = document.getElementById("music-toggle");
  var playerBox = document.getElementById("music-player");
  var yt = null, ytReady = false, wantPlay = false;
  window.onYouTubeIframeAPIReady = function () {
    yt = new YT.Player("yt-player", {
      width: 300, height: 200, videoId: CFG.youtubeVideoId,
      playerVars: { playsinline: 1, rel: 0, loop: 1, playlist: CFG.youtubeVideoId },
      events: {
        onReady: function () { ytReady = true; yt.setVolume(CFG.musicVolume); if (wantPlay) yt.playVideo(); },
        onStateChange: function (e) { musicBtn.setAttribute("aria-pressed", e.data === YT.PlayerState.PLAYING ? "true" : "false"); }
      }
    });
  };
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
  function playMusic() {
    playerBox.hidden = false;
    wantPlay = true;
    if (ytReady) yt.playVideo();
  }
  function stopMusic() {
    wantPlay = false;
    if (ytReady) yt.pauseVideo();
    playerBox.hidden = true;
  }
  musicBtn.onclick = function () {
    if (musicBtn.getAttribute("aria-pressed") === "true") stopMusic(); else playMusic();
  };
  document.getElementById("music-close").onclick = stopMusic;

  // ───────── Le film complet se charge seulement au clic (YouTube sans cookies) ─────────
  document.getElementById("film-image").src = "https://i.ytimg.com/vi/" + CFG.filmTrailerId + "/hqdefault.jpg";   // affiche du film
  document.getElementById("film-play").onclick = function () {
    stopMusic();   // pas deux sons en même temps
    var film = CFG.filmFull[lang] || CFG.filmFull.en;     // film complet : dans la langue du visiteur si elle existe, sinon en anglais
    document.getElementById("film-video").innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + film +
      '?autoplay=1&rel=0" title="The Message (1976)" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "film/complet", title: "Film complet", event: true }); } catch (e) {}
  };

  // ───────── Accueil ─────────
  var welcome = document.getElementById("welcome");
  function enter(withMusic) {
    if (withMusic) playMusic();
    welcome.classList.add("hide");
    setTimeout(function () { welcome.style.display = "none"; }, 650);
    if (location.hash) { var target = document.querySelector(location.hash); if (target) target.scrollIntoView(); }
  }
  document.getElementById("enter-music").onclick = function () { enter(true); };
  document.getElementById("enter-silent").onclick = function () { enter(false); };
  document.querySelectorAll("[data-setlang]").forEach(function (b) { b.onclick = function () { setLang(b.dataset.setlang); }; });

  // ───────── Formulaire ─────────
  // Après l'envoi : le formulaire est remplacé DANS la carte par une confirmation bien visible (demande d'Ahmed, 15/10/2026)
  function merci(form, status, mail) {
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); };
    var boite = document.getElementById("contact-merci");
    if (!boite) {
      boite = document.createElement("div"); boite.id = "contact-merci"; boite.className = "avis-merci"; boite.tabIndex = -1;
      boite.setAttribute("role", "status"); boite.setAttribute("aria-live", "polite");
      form.parentNode.insertBefore(boite, form.nextSibling);
    }
    form.reset(); status.textContent = "";
    boite.innerHTML = '<p class="avis-merci-titre">✅ ' + esc(t("fOk")) + "</p><p>" + esc(t("fReply")) + ' <b dir="ltr">' + esc(mail) + '</b></p><button type="button" class="btn-avis-autre">' + esc(t("fAnother")) + "</button>";
    boite.querySelector("button").onclick = function () { boite.hidden = true; form.hidden = false; form.elements.message.focus(); };
    form.hidden = true; boite.hidden = false;
    try { boite.focus({ preventScroll: true }); boite.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (x) { /* ancien navigateur */ }
  }
  document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, status = document.getElementById("form-status");
    var data = new FormData(form);
    if (data.get("_gotcha")) return;
    // 15/10/2026 (demande d'Ahmed) : e-mail obligatoire pour pouvoir répondre
    var mail = String(data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { status.className = "form-status err"; status.textContent = t("fEmailErr"); form.elements.email.focus(); return; }
    status.className = "form-status";
    data.append("lang", lang);
    if (!CFG.formEndpoint) {
      var body = "Type: " + data.get("type") + "\nLangue: " + lang + "\nNom: " + (data.get("name") || "") + "\nEmail: " + (data.get("email") || "") + "\n\n" + data.get("message");
      location.href = "mailto:" + CFG.contactEmail + "?subject=" + encodeURIComponent("[" + t("siteName") + "] " + data.get("type")) + "&body=" + encodeURIComponent(body);
      status.textContent = t("fMail");
      return;
    }
    status.textContent = t("fSending");
    fetch(CFG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw 0; merci(form, status, mail); })
      .catch(function () { status.textContent = t("fErr"); });
  });

  // ───────── Bouton « Accueil » ─────────
  var backTop = document.getElementById("back-top");
  window.addEventListener("scroll", function () { backTop.hidden = window.scrollY < 500; }, { passive: true });
  backTop.onclick = function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); history.replaceState(null, "", location.pathname + location.search); };

  // ───────── Divers ─────────
  document.getElementById("lang-select").onchange = function (e) { setLang(e.target.value); };
  document.querySelector(".share-site").onclick = function () { share(t("siteName"), pageUrl("")); };
  document.getElementById("share-head").onclick = function () { share(t("siteName"), pageUrl("")); };
  document.getElementById("share-close").onclick = function () { document.getElementById("share-sheet").hidden = true; };
  document.getElementById("share-sheet").onclick = function (e) { if (e.target === this) this.hidden = true; };
  var nav = document.getElementById("nav"), mt = document.querySelector(".menu-toggle");
  mt.onclick = function () { var o = nav.classList.toggle("open"); mt.setAttribute("aria-expanded", o); };
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); mt.setAttribute("aria-expanded", "false"); } });

  setLang(lang);
})();

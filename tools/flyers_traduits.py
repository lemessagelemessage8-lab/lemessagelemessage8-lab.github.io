"""Fabrique les flyers TRADUITS (catalan, allemand…) à partir des traductions « texte-<langue>.json » des dépliants espagnols de
l'Islamic Information Center (demandes d'Ahmed : catalan 26/10/2026, allemand 26/10/2026 — demandes de visiteurs).

Pour chaque dépliant <id>-es traduit (« flyers originaux/<id>-es/texte-<langue>.json ») :
  1. versets : si la langue a une traduction OFFICIELLE du Coran (QuranEnc), le texte de chaque verset référencé (« Koran 2:185 »…)
     est REMPLACÉ par la traduction officielle (phrase d'introduction gardée) ; sinon (catalan) le verset garde notre traduction
     et porte un astérisque « non officiel ». Paroles du Prophète (« sacre » sans verset officiel) : toujours astérisque + note ;
  2. page HTML de 6 panneaux au format des originaux (393 × 842 pt), taille du texte ajustée seule (jamais < 8,5 pt : sinon arrêt) ;
  3. Chrome l'imprime -> « flyers originaux/<id>-<langue>/original.pdf » + page-1.jpg … page-6.jpg ;
  4. ensuite : python tools/flyers.py <id>-<langue> (tampon, PDF A4 recto-verso, images).
L'éditeur d'origine est cité sur la couverture et sur le dernier panneau.
Usage (depuis site/) : python tools/flyers_traduits.py <langue> <id-es> […]      Besoin : Chrome, PyMuPDF, Internet (QuranEnc).
"""
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from versets import propre                                     # nettoyage des notes et numéros (même règle que le site)

ICI = os.path.dirname(os.path.abspath(__file__))
ORIGINAUX = os.path.join(os.path.dirname(os.path.dirname(ICI)), "flyers originaux")
CACHE = os.path.join(ICI, "flyers_versets.json")              # versets officiels déjà téléchargés
CHROME = next((c for c in [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                           r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"]
               if os.path.exists(c)), None)
LP, HP = 393, 842
EDITEUR = "Islamic Information Center (Dubai) · www.islamicic.com · info@islamicic.com · +971 56 204 2045"

LANGUES = {
    "ca": {"nom": "CATALÀ", "gratuit": "CÒPIA GRATUÏTA", "officiel": None, "guillemets": "«»",
           "note": "* Traducció no oficial del sentit, feta per a aquest fullet: no existeix cap traducció oficial de l'Alcorà ni dels hadits en català. Traducció oficial en castellà: quranenc.com/es",
           "note_off": "", "credit": "Traducció al català del fullet de l'Islamic Information Center (Dubai) · www.islamicic.com · info@islamicic.com · +971 56 204 2045"},
    "de": {"nom": "DEUTSCH", "gratuit": "GRATISEXEMPLAR", "officiel": ("german_bubenheim", "Koran"), "guillemets": "„“",
           "note": "* Inoffizielle Übersetzung, für dieses Faltblatt angefertigt (Aussprüche des Propheten und frei zitierte Stellen). Offizielle Hadith-Übersetzungen: hadeethenc.com",
           "note_off": "Koranverse: offizielle Übersetzung von Frank Bubenheim und Dr. Nadeem Elyas (quranenc.com).",
           "credit": "Deutsche Übersetzung des Faltblatts des Islamic Information Center (Dubai) · www.islamicic.com · info@islamicic.com · +971 56 204 2045"},
}
# Références fausses de l'original (signalées à Ahmed) : (id, référence de l'original, début du texte espagnol) -> bonne référence ;
# None = citation libre (paraphrase), pas un verset : garde notre traduction avec l'astérisque.
CORRECTIONS = {
    ("coran-es", "2:185", 0): "39:1",          # « La revelación del Libro procede de Dios… » = 39:1 (le 2e 2:185 est juste)
    ("proposito-vida-es", "19:36", 0): None,   # paraphrase, pas le texte de 19:36
}

CSS = open(os.path.join(ICI, "flyers_traduits.css"), encoding="utf-8").read() if os.path.exists(os.path.join(ICI, "flyers_traduits.css")) else ""

AJUSTE = """
<script>
document.fonts.ready.then(function () {
  var trop = [];
  document.querySelectorAll('.texte').forEach(function (t, i) {
    var taille = 13;
    t.style.setProperty('--t', taille + 'pt');
    while (t.scrollHeight > t.clientHeight + 1 && taille > 8.5) { taille -= 0.25; t.style.setProperty('--t', taille + 'pt'); }
    if (t.scrollHeight > t.clientHeight + 1) trop.push(i + 1);
    t.dataset.taille = taille;
  });
  document.title = trop.length ? 'TROP:' + trop.join(',') : 'OK:' + [].map.call(document.querySelectorAll('.texte'), function (t) { return t.dataset.taille; }).join(',');
});
</script>"""


def e(s):
    return html.escape(s, quote=False)


# ───────── versets officiels ─────────
def cache():
    return json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}


def verset_officiel(cle, ref, memo):
    """« 23:99-100 » -> texte officiel (versets joints). Téléchargé une fois, gardé dans tools/flyers_versets.json."""
    m = re.fullmatch(r"(\d+):(\d+)(?:-(\d+))?", ref)
    if not m:
        return None
    s, a, b = int(m.group(1)), int(m.group(2)), int(m.group(3) or m.group(2))
    morceaux = []
    for v in range(a, b + 1):
        k = f"{cle}/{s}:{v}"
        if k not in memo:
            for _ in range(3):
                try:
                    d = json.load(urllib.request.urlopen(urllib.request.Request(
                        f"https://quranenc.com/api/v1/translation/aya/{cle}/{s}/{v}", headers={"User-Agent": "Mozilla/5.0"}), timeout=40))
                    memo[k] = propre(d["result"]["translation"])
                    break
                except Exception:
                    time.sleep(3)
            else:
                raise SystemExit(f"verset {s}:{v} introuvable sur QuranEnc ({cle})")
        morceaux.append(memo[k])
    return " ".join(morceaux)


def officialiser(fid, d, conf, memo):
    """Remplace les versets référencés par la traduction officielle ; retourne le nombre de versets remplacés."""
    if not conf["officiel"]:
        return 0
    cle, mot = conf["officiel"]
    g0, g1 = conf["guillemets"]
    vus, n = {}, 0
    c = d["couverture"]                                         # verset en sous-titre de couverture : « „…“ (Koran 41:53) »
    m = re.search(r"\(" + mot + r" (\d+:\d+(?:-\d+)?)\)\s*$", c.get("sous_titre", ""))
    if m:
        c["sous_titre"] = g0 + verset_officiel(cle, m.group(1), memo).strip(" „“\"«»") + g1 + f" ({mot} {m.group(1)})"
        n += 1
    for p in d["panneaux"]:
        for b in p:
            r = re.fullmatch(mot + r" (\d+:\d+(?:-\d+)?)", (b.get("ref") or "").replace("–", "-"))
            if not r:
                continue
            ref = r.group(1)
            rang = vus.get(ref, 0); vus[ref] = rang + 1
            if (fid, ref, rang) in CORRECTIONS:
                bonne = CORRECTIONS[(fid, ref, rang)]
                if bonne is None:
                    continue                                    # paraphrase : reste « non officiel »
                ref = bonne
                b["ref"] = f"{mot} {ref}"
            texte = verset_officiel(cle, ref, memo)
            if not texte:
                continue
            t = b["texte"]
            i = t.find(g0)
            intro = t[:i] if i > 0 else ""                       # « Allah, der Erhabene, sagte: » gardé
            b["texte"] = intro + g0 + texte.strip(" „“\"«»") + g1
            b["officiel"] = True
            b.pop("sacre", None)
            n += 1
    return n


# ───────── mise en page ─────────
def bloc(b):
    t = e(b["texte"]) + (' <span class="etoile">*</span>' if b.get("sacre") else "")
    ref = f'<span class="ref">{e(b["ref"])}</span>' if b.get("ref") else ""
    return {"titre": f"<h2>{t}</h2>", "sous_titre": f"<h3>{t}</h3>", "para": f"<p>{t}</p>", "puce": f'<p class="puce">{t}</p>',
            "citation": f'<p class="cit">{t}{ref}</p>', "bulle": f'<div class="bulle">{t}{ref}</div>'}[b["type"]]


def page_html(d, langue, conf):
    c = d["couverture"]
    morceaux = [f"""<div class="p couv"><div class="contenu">
  <h1 class="titre-couv">{e(c["titre"])}</h1>
  <div class="bandeau"><span>{conf["nom"]}</span><span>{conf["gratuit"]}</span></div>
  <div class="sous-couv">{e(c.get("sous_titre", ""))}</div>
  <div class="ornement">✦</div>
  <div class="pied-couv"><b>The Message — الرسالة</b> · message.clicvia.com<br>{e(conf["credit"])}</div>
</div></div>"""]
    for i, blocs in enumerate(d["panneaux"], 1):
        notes = (f'<div class="note">{e(conf["note"])}</div>' if any(b.get("sacre") for b in blocs) else "") + \
                (f'<div class="note">{e(conf["note_off"])}</div>' if conf["note_off"] and any(b.get("officiel") for b in blocs) else "")
        bas = notes + (f'<div class="credit">{e(conf["credit"])}<br><b>The Message</b> · message.clicvia.com</div>' if i == 5 else "")
        morceaux.append(f'<div class="p"><span class="num">{i}</span><div class="contenu"><div class="texte">'
                        + "".join(bloc(b) for b in blocs) + f"</div>{bas}</div></div>")
    return f"""<!doctype html><html lang="{langue}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,600&display=block" rel="stylesheet">
<style>{CSS}</style><title>…</title></head><body>{"".join(morceaux)}{AJUSTE}</body></html>"""


def fabriquer(langue, id_es, memo):
    conf = LANGUES[langue]
    src = os.path.join(ORIGINAUX, id_es, f"texte-{langue}.json")
    d = json.load(open(src, encoding="utf-8"))
    assert len(d["panneaux"]) == 5, f"{id_es} : {len(d['panneaux'])} panneaux"
    n_off = officialiser(id_es, d, conf, memo)
    id_l = (id_es[:-3] if id_es.endswith("-es") else id_es) + "-" + langue
    dossier = os.path.join(ORIGINAUX, id_l)
    os.makedirs(dossier, exist_ok=True)
    tmp = tempfile.mkdtemp()
    page = os.path.join(tmp, "flyer.html")
    with open(page, "w", encoding="utf-8", newline="\n") as f:
        f.write(page_html(d, langue, conf))
    profil = os.path.join(tmp, "profil")
    url = "file:///" + page.replace("\\", "/")
    dom = subprocess.run([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={profil}", "--virtual-time-budget=15000",
                          "--dump-dom", url], capture_output=True, text=True, encoding="utf-8").stdout
    etat = dom.split("<title>")[1].split("</title>")[0] if "<title>" in dom else "?"
    if not etat.startswith("OK"):
        sys.exit(f"{id_l} : texte trop long pour le(s) panneau(x) {etat} — à raccourcir dans texte-{langue}.json")
    pdf = os.path.join(dossier, "original.pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={profil}", "--virtual-time-budget=15000",
                    "--no-pdf-header-footer", f"--print-to-pdf={pdf}", url], capture_output=True)
    doc = pymupdf.open(pdf)
    assert len(doc) == 6 and all(round(p.rect.width) == LP and round(p.rect.height) == HP for p in doc), \
        f"{id_l} : PDF de {len(doc)} pages — 6 pages de {LP}×{HP} attendues"
    for k, p in enumerate(doc, 1):
        p.get_pixmap(dpi=200).save(os.path.join(dossier, f"page-{k}.jpg"), jpg_quality=88)
    with open(os.path.join(dossier, f"texte-{langue}.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)                     # texte final (versets officiels compris)
        f.write("\n")
    shutil.rmtree(tmp, ignore_errors=True)
    return id_l, etat, n_off


if __name__ == "__main__":
    if not CHROME:
        sys.exit("Chrome introuvable")
    if len(sys.argv) < 3 or sys.argv[1] not in LANGUES:
        sys.exit(f"Usage : python tools/flyers_traduits.py <{'|'.join(LANGUES)}> <id-es> […]")
    memo = cache()
    for i in sys.argv[2:]:
        id_l, etat, n = fabriquer(sys.argv[1], i, memo)
        with open(CACHE, "w", encoding="utf-8", newline="\n") as f:
            json.dump(memo, f, ensure_ascii=False, indent=1, sort_keys=True)
            f.write("\n")
        print(f"{id_l} : 6 panneaux, texte {etat[3:]} pt, {n} verset(s) en traduction officielle")

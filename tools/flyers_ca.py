"""Fabrique les flyers CATALANS à partir des traductions « texte-ca.json » (demande d'Ahmed, 26/10/2026, après la demande
d'un visiteur : « Folletos en catalán »).

Pour chaque dépliant espagnol <id>-es de l'Islamic Information Center traduit en catalan (« flyers originaux/<id>-es/texte-ca.json ») :
  1. une page HTML de 6 panneaux au format des originaux (393 × 842 pt) : couverture + panneaux 1 à 5 ; la taille du texte
     se réduit d'elle-même si un panneau est trop rempli (jamais en dessous de 8,5 pt : sinon l'outil s'arrête) ;
  2. Chrome l'imprime en PDF -> « flyers originaux/<id>-ca/original.pdf » + page-1.jpg … page-6.jpg (comme les autres originaux) ;
  3. ensuite : python tools/flyers.py <id>-ca (tampon, vignettes, PDF A4 recto-verso à imprimer).
RÈGLE D'AHMED : il n'existe aucune traduction officielle du Coran en catalan ; versets et paroles du Prophète (« sacre ») sont
traduits pour le site et MARQUÉS : astérisque + note « traducció no oficial » + lien vers la traduction officielle castillane.
L'éditeur d'origine (Islamic Information Center, Dubaï) est cité sur la couverture et sur le dernier panneau.
Usage (depuis site/) : python tools/flyers_ca.py <id-es> […]      Besoin : Chrome, PyMuPDF.
"""
import html
import json
import os
import shutil
import subprocess
import sys
import tempfile

import pymupdf

ICI = os.path.dirname(os.path.abspath(__file__))
ORIGINAUX = os.path.join(os.path.dirname(os.path.dirname(ICI)), "flyers originaux")
CHROME = next((c for c in [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                           r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"]
               if os.path.exists(c)), None)
LP, HP = 393, 842                       # panneau des originaux, en points
NOTE = ("* Traducció no oficial del sentit, feta per a aquest fullet: no existeix cap traducció oficial de l'Alcorà ni dels hadits "
        "en català. Traducció oficial en castellà: quranenc.com/es")
CREDIT = ("Traducció al català del fullet de l'Islamic Information Center (Dubai) · www.islamicic.com · info@islamicic.com · "
          "+971 56 204 2045")

CSS = """
@page { size: 393pt 842pt; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Source Sans 3', 'Segoe UI', Arial, sans-serif; color: #1f2a24; }
.p { width: 393pt; height: 842pt; overflow: hidden; position: relative; page-break-after: always; background: #fff; }
.p:last-child { page-break-after: auto; }
.contenu { position: absolute; left: 20pt; right: 20pt; top: 22pt; bottom: 20pt; display: flex; flex-direction: column; }
.texte { flex: 1; overflow: hidden; font-size: var(--t, 13pt); line-height: 1.34; }
.num { position: absolute; top: 8pt; right: 12pt; background: #c9a54c; color: #0f3b2e; font: 700 9pt 'Source Sans 3', sans-serif; padding: 1pt 5pt; border-radius: 2pt; }
h2 { font-family: 'Cormorant Garamond', Georgia, serif; color: #0f6b4c; text-align: center; font-size: 1.9em; line-height: 1.02;
     margin: .35em 0 .3em; text-transform: uppercase; font-weight: 700; }
h3 { color: #a6242a; font-style: italic; font-size: 1.12em; margin: .65em 0 .2em; text-transform: uppercase; font-weight: 700; }
p { margin: 0 0 .45em; text-align: justify; hyphens: auto; }
.puce { padding-left: 1.1em; position: relative; }
.puce::before { content: "•"; position: absolute; left: .2em; color: #0f6b4c; font-weight: 700; }
.cit { text-align: center; font-style: italic; font-weight: 600; color: #0f6b4c; margin: .35em .4em .55em; }
.bulle { font-style: italic; font-weight: 600; text-align: center; margin: .5em .6em .6em; padding: .55em .8em;
         border: 1.5pt solid #c9a54c; border-radius: 14pt; background: #fbf6e8; color: #0f3b2e; }
.ref { display: block; margin: .25em auto 0; width: max-content; max-width: 100%; font: 700 .72em 'Source Sans 3', sans-serif;
       font-style: normal; color: #fff; background: #c9a54c; border-radius: 3pt; padding: .05em .45em; }
.etoile { color: #a6242a; font-style: normal; font-weight: 700; }
.note { font-size: 7.4pt; line-height: 1.25; color: #5b6b62; border-top: .6pt solid #c9a54c; padding-top: 3pt; margin-top: 4pt; }
.credit { font-size: 7.6pt; line-height: 1.3; color: #0f3b2e; background: #f7f1e3; border: .6pt solid #c9a54c; border-radius: 4pt;
          padding: 4pt 6pt; margin-top: 4pt; text-align: center; }
.couv { background: #0f3b2e; color: #f7f1e3; }
.couv .contenu { top: 0; bottom: 0; left: 0; right: 0; }
.bandeau { display: flex; justify-content: space-between; align-items: center; margin-top: 230pt; background: #c9a54c; color: #0f3b2e;
           font: 700 10pt 'Source Sans 3', sans-serif; padding: 5pt 14pt; letter-spacing: .04em; }
.titre-couv { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700; color: #fff; text-align: center; font-size: 40pt;
              line-height: 1; margin: 0; padding: 0 18pt; position: absolute; top: 40pt; left: 0; right: 0; height: 180pt;
              display: flex; align-items: center; justify-content: center; text-transform: uppercase; }
.sous-couv { text-align: center; font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-weight: 600; font-size: 19pt;
             line-height: 1.2; color: #e3c77d; padding: 0 26pt; margin-top: 38pt; }
.ornement { text-align: center; color: #c9a54c; font-size: 40pt; margin-top: 30pt; }
.arabe { text-align: center; font-family: 'Amiri', serif; color: #c9a54c; font-size: 46pt; margin-top: 4pt; }
.pied-couv { position: absolute; bottom: 18pt; left: 18pt; right: 18pt; text-align: center; font-size: 8.6pt; line-height: 1.35; color: #f7f1e3; }
.pied-couv b { color: #e3c77d; }
"""

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


def bloc(b):
    t = e(b["texte"]) + (' <span class="etoile">*</span>' if b.get("sacre") else "")
    ref = f'<span class="ref">{e(b["ref"])}</span>' if b.get("ref") else ""
    return {"titre": f"<h2>{t}</h2>", "sous_titre": f"<h3>{t}</h3>", "para": f"<p>{t}</p>", "puce": f'<p class="puce">{t}</p>',
            "citation": f'<p class="cit">{t}{ref}</p>', "bulle": f'<div class="bulle">{t}{ref}</div>'}[b["type"]]


def page_html(d):
    c = d["couverture"]
    morceaux = [f"""<div class="p couv"><div class="contenu">
  <h1 class="titre-couv">{e(c["titre"])}</h1>
  <div class="bandeau"><span>CATALÀ</span><span>CÒPIA GRATUÏTA</span></div>
  <div class="sous-couv">{e(c.get("sous_titre", ""))}</div>
  <div class="ornement">✦</div>
  <div class="pied-couv"><b>The Message — الرسالة</b> · message.clicvia.com<br>{e(CREDIT)}</div>
</div></div>"""]
    for i, blocs in enumerate(d["panneaux"], 1):
        sacre = any(b.get("sacre") for b in blocs)
        bas = (f'<div class="note">{e(NOTE)}</div>' if sacre else "") + (f'<div class="credit">{e(CREDIT)}<br><b>The Message</b> · message.clicvia.com</div>' if i == 5 else "")
        morceaux.append(f'<div class="p"><span class="num">{i}</span><div class="contenu"><div class="texte">'
                        + "".join(bloc(b) for b in blocs) + f"</div>{bas}</div></div>")
    return f"""<!doctype html><html lang="ca"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,600&display=block" rel="stylesheet">
<style>{CSS}</style><title>…</title></head><body>{"".join(morceaux)}{AJUSTE}</body></html>"""


def fabriquer(id_es):
    src = os.path.join(ORIGINAUX, id_es, "texte-ca.json")
    d = json.load(open(src, encoding="utf-8"))
    assert len(d["panneaux"]) == 5, f"{id_es} : {len(d['panneaux'])} panneaux"
    id_ca = id_es[:-3] + "-ca" if id_es.endswith("-es") else id_es + "-ca"
    dossier = os.path.join(ORIGINAUX, id_ca)
    os.makedirs(dossier, exist_ok=True)
    tmp = tempfile.mkdtemp()
    page = os.path.join(tmp, "flyer.html")
    with open(page, "w", encoding="utf-8", newline="\n") as f:
        f.write(page_html(d))
    profil = os.path.join(tmp, "profil")
    titre = subprocess.run([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={profil}", "--virtual-time-budget=15000",
                            "--dump-dom", "file:///" + page.replace("\\", "/")], capture_output=True, text=True, encoding="utf-8").stdout
    etat = titre.split("<title>")[1].split("</title>")[0] if "<title>" in titre else "?"
    if not etat.startswith("OK"):
        sys.exit(f"{id_es} : texte trop long pour le(s) panneau(x) {etat} — à raccourcir dans texte-ca.json")
    pdf = os.path.join(dossier, "original.pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={profil}", "--virtual-time-budget=15000",
                    "--no-pdf-header-footer", f"--print-to-pdf={pdf}", "file:///" + page.replace("\\", "/")], capture_output=True)
    doc = pymupdf.open(pdf)
    assert len(doc) == 6 and all(round(p.rect.width) == LP and round(p.rect.height) == HP for p in doc), \
        f"{id_ca} : PDF de {len(doc)} pages ({[(round(p.rect.width), round(p.rect.height)) for p in doc]}) — 6 pages de {LP}×{HP} attendues"
    for k, p in enumerate(doc, 1):
        p.get_pixmap(dpi=200).save(os.path.join(dossier, f"page-{k}.jpg"), jpg_quality=88)
    shutil.copyfile(src, os.path.join(dossier, "texte-ca.json"))
    shutil.rmtree(tmp, ignore_errors=True)
    return id_ca, etat


if __name__ == "__main__":
    if not CHROME:
        sys.exit("Chrome introuvable")
    for i in sys.argv[1:]:
        id_ca, etat = fabriquer(i)
        print(f"{id_ca} : 6 panneaux, tailles du texte (pt) {etat[3:]}")

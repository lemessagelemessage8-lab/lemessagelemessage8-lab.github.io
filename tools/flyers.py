"""Flyers : tampon « message.clicvia.com » + QR code sur chaque page (demande d'Ahmed, 25/10/2026).

Part des ORIGINAUX (jamais modifiés), rangés hors du site dans le dépôt privé projets-ahmed :
    Le message/flyers originaux/<id>/original.pdf  +  page-1.jpg, page-2.jpg, … (une image par page)
et fabrique dans flyers/ :
    flyer-<id>.pdf                       PDF : chaque page + une bande sous la page (rien du flyer n'est caché)
    flyer-<id>-recto.jpg / -verso.jpg    pages 1 et 2 (+ « -mini » pour les vignettes)
    flyer-<id>-p3.jpg … -pN.jpg          pages suivantes (flyers de plus de 2 pages)
    tampons.json                         liste des fichiers tamponnés (taille), vérifiée par tools/test_site.mjs

La bande est AJOUTÉE sous chaque page (le flyer d'un autre éditeur reste entier, logos et contacts compris).
Usage (sur le PC, depuis site/) : python tools/flyers.py [id …]     (sans id : tous les flyers des originaux)
Besoin : Pillow, PyMuPDF (pymupdf), segno.
"""
import io
import json
import os
import sys

import pymupdf
import segno
from PIL import Image, ImageDraw, ImageFont

ICI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ICI)
ORIGINAUX = os.path.join(os.path.dirname(SITE), "flyers originaux")
SORTIE = os.path.join(SITE, "flyers")
ADRESSE = "message.clicvia.com"
URL = "https://message.clicvia.com/"
VERT, OR, BLANC = (15, 59, 46), (201, 165, 76), (255, 255, 255)
MINI_LARGEUR = 495
LARGEUR_PANNEAU = 900
POLICES = [r"C:\Windows\Fonts\segoeuib.ttf", r"C:\Windows\Fonts\arialbd.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]


def police(taille):
    for p in POLICES:
        if os.path.exists(p):
            return ImageFont.truetype(p, taille)
    return ImageFont.load_default()


def qr_image(cote):
    tampon = io.BytesIO()
    segno.make(URL, error="m").save(tampon, kind="png", scale=10, border=2, dark="#0f3b2e", light="#ffffff")
    return Image.open(io.BytesIO(tampon.getvalue())).convert("RGB").resize((cote, cote), Image.NEAREST)


def hauteur_bande(l, h):
    return max(60, round(0.075 * min(l, h)))


def bande(largeur, haut):
    """Bande verte : QR code + « message.clicvia.com » (blanc) + filet doré, centrés."""
    b = Image.new("RGB", (largeur, haut), VERT)
    d = ImageDraw.Draw(b)
    d.rectangle([0, 0, largeur, max(2, haut // 22)], fill=OR)
    marge = round(haut * 0.12)
    qr = qr_image(haut - 2 * marge)
    taille = round(haut * 0.42)
    f = police(taille)
    while d.textlength(ADRESSE, font=f) + qr.width + marge * 3 > largeur * 0.92 and taille > 10:
        taille -= 2
        f = police(taille)
    lt = d.textlength(ADRESSE, font=f)
    x = round((largeur - (qr.width + marge + lt)) / 2)
    b.paste(qr, (x, marge))
    asc, desc = f.getmetrics()
    d.text((x + qr.width + marge, round((haut - (asc + desc)) / 2) + round(haut * 0.02)), ADRESSE, font=f, fill=BLANC)
    return b


def tamponner_image(src, dst):
    im = Image.open(src).convert("RGB")
    if im.height > im.width and im.width > LARGEUR_PANNEAU:      # panneau de dépliant : assez lisible à 900 px, 2 fois plus léger
        im = im.resize((LARGEUR_PANNEAU, round(im.height * LARGEUR_PANNEAU / im.width)), Image.LANCZOS)
    h = hauteur_bande(*im.size)
    out = Image.new("RGB", (im.width, im.height + h), BLANC)
    out.paste(im, (0, 0))
    out.paste(bande(im.width, h), (0, im.height))
    out.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
    return out


def tamponner_pdf(src, dst):
    s = pymupdf.open(src)
    o = pymupdf.open()
    for i, p in enumerate(s):
        w, h = p.rect.width, p.rect.height
        hb = hauteur_bande(w, h)
        np_ = o.new_page(width=w, height=h + hb)
        np_.show_pdf_page(pymupdf.Rect(0, 0, w, h), s, i)
        img = bande(round(w * 4), round(hb * 4))          # dessinée en grand pour rester nette à l'impression
        tampon = io.BytesIO()
        img.save(tampon, "PNG")
        np_.insert_image(pymupdf.Rect(0, h, w, h + hb), stream=tampon.getvalue())
        np_.insert_link({"kind": pymupdf.LINK_URI, "from": pymupdf.Rect(0, h, w, h + hb), "uri": URL})
    o.save(dst, garbage=3, deflate=True)


def nom_page(fid, n):
    return f"flyer-{fid}-" + ({1: "recto", 2: "verso"}.get(n) or f"p{n}") + ".jpg"


def fabriquer(fid):
    dossier = os.path.join(ORIGINAUX, fid)
    pages = sorted((f for f in os.listdir(dossier) if f.startswith("page-") and f.endswith(".jpg")),
                   key=lambda f: int(f[5:-4]))
    faits = []
    for k, f in enumerate(pages, 1):
        dst = os.path.join(SORTIE, nom_page(fid, k))
        im = tamponner_image(os.path.join(dossier, f), dst)
        faits.append(os.path.basename(dst))
        if k <= 2:
            mini = im.resize((MINI_LARGEUR, round(im.height * MINI_LARGEUR / im.width)), Image.LANCZOS)
            dm = dst.replace(".jpg", "-mini.jpg")
            mini.save(dm, "JPEG", quality=80, optimize=True)
            faits.append(os.path.basename(dm))
    pdf = os.path.join(SORTIE, f"flyer-{fid}.pdf")
    tamponner_pdf(os.path.join(dossier, "original.pdf"), pdf)
    faits.append(os.path.basename(pdf))
    return len(pages), faits


def main():
    if not os.path.isdir(ORIGINAUX):
        sys.exit(f"Originaux introuvables : {ORIGINAUX} (dépôt privé projets-ahmed, dossier « Le message/flyers originaux »)")
    ids = sys.argv[1:] or sorted(d for d in os.listdir(ORIGINAUX) if os.path.isdir(os.path.join(ORIGINAUX, d)))
    chemin = os.path.join(SORTIE, "tampons.json")
    manifeste = json.load(open(chemin, encoding="utf-8")) if os.path.exists(chemin) else {}
    for fid in ids:
        n, faits = fabriquer(fid)
        for f in faits:
            manifeste[f] = os.path.getsize(os.path.join(SORTIE, f))
        print(f"{fid} : {n} page(s) tamponnée(s)")
    with open(chemin, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(dict(sorted(manifeste.items())), fh, ensure_ascii=False, indent=1)
        fh.write("\n")


if __name__ == "__main__":
    main()

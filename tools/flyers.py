"""Flyers : tampon « message.clicvia.com » + QR code sur chaque page (demande d'Ahmed, 25/10/2026).

Part des ORIGINAUX (jamais modifiés), rangés hors du site dans le dépôt privé projets-ahmed :
    Le message/flyers originaux/<id>/original.pdf  +  page-1.jpg, page-2.jpg, … (une image par page)
et fabrique dans flyers/ :
    flyer-<id>.pdf                       PDF : chaque page + une bande sous la page (rien du flyer n'est caché)
    flyer-<id>-recto.jpg / -verso.jpg    pages 1 et 2 (+ « -mini » pour les vignettes)
    flyer-<id>-p3.jpg … -pN.jpg          pages suivantes (flyers de plus de 2 pages)
    flyer-<id>-a4.pdf                    TOUS les flyers : 2 feuilles A4 paysage exactes, prêtes à imprimer en recto-verso puis
                                         plier en trois (c'est le PDF proposé sur le site ; règle d'Ahmed du 25/10/2026) ;
                                         dépliant de 6 panneaux : 3 panneaux par face
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


A4_L, A4_H = 842, 595                 # feuille A4 en paysage (points PDF)
# Dépliant de 6 panneaux (couverture + pages 1 à 5) : ordre de l'éditeur pour un pli roulé en trois, comme sur ses dépliants
# imprimés (scans anglais du 13-14/10/2026) : face extérieure « 4 | 5 | couverture », face intérieure « 1 | 2 | 3 ».
# Numéros des pages de original.pdf (1 = couverture, 2 = page « 1 », … 6 = page « 5 »).
IMPOSITION_6 = [(5, 6, 1), (2, 3, 4)]


def bande_feuille(largeur, haut, largeur_panneau):
    """Bande verte de toute la largeur des 3 panneaux ; QR code et adresse dans le panneau du milieu (dos du dépliant
    sur la face extérieure), pour ne pas être coupés par les plis."""
    b = Image.new("RGB", (largeur, haut), VERT)
    ImageDraw.Draw(b).rectangle([0, 0, largeur, max(2, haut // 22)], fill=OR)
    b.paste(bande(largeur_panneau, haut), (round((largeur - largeur_panneau) / 2), 0))
    return b


def imprimer_a4(fid, dst):
    """RÈGLE D'AHMED (25/10/2026) : tout flyer proposé au téléchargement est IMPRIMABLE sur A4 recto-verso.
    PDF de 2 feuilles A4 paysage exactes (842 × 595 pt), à imprimer en recto-verso « retourner sur le bord court » puis plier
    en trois ; tampon message.clicvia.com + QR code en bas de chaque feuille, DANS la feuille. Les pages de l'éditeur sont
    réduites à l'échelle, jamais coupées ni déformées.
    - flyer de 2 pages (recto + verso, format Letter ou A4) : une page par feuille ;
    - dépliant de 6 panneaux (couverture + pages 1 à 5) : 3 panneaux par face, dans l'ordre IMPOSITION_6.
    Tout autre nombre de pages : erreur (le flyer n'est pas publié tant qu'on ne sait pas l'imprimer)."""
    s = pymupdf.open(os.path.join(ORIGINAUX, fid, "original.pdf"))
    if len(s) == 6:
        faces = [list(f) for f in IMPOSITION_6]
    elif len(s) == 2:
        faces = [[1], [2]]
    else:
        raise SystemExit(f"{fid} : {len(s)} pages — ni recto/verso (2) ni dépliant (6) : dire à Ahmed comment l'imprimer")
    pw, ph = s[0].rect.width, s[0].rect.height
    hb, marge = 34, 8                                          # bande en bas, petite marge en haut
    n = len(faces[0])                                          # panneaux par face (1 ou 3)
    k = min((A4_H - hb - marge) / ph, (A4_L - 2 * marge) / (n * pw))   # même échelle pour toutes les pages
    lp, hp = pw * k, ph * k
    x0 = (A4_L - n * lp) / 2
    o = pymupdf.open()
    for face in faces:
        page = o.new_page(width=A4_L, height=A4_H)
        for j, num in enumerate(face):
            page.show_pdf_page(pymupdf.Rect(x0 + j * lp, marge, x0 + (j + 1) * lp, marge + hp), s, num - 1)
        largeur = n * lp
        img = bande_feuille(round(largeur * 4), round(hb * 4), round(largeur / 3 * 4))   # QR dans le tiers du milieu (dos plié)
        tampon = io.BytesIO()
        img.save(tampon, "PNG")
        r = pymupdf.Rect(x0, A4_H - hb, x0 + largeur, A4_H)
        page.insert_image(r, stream=tampon.getvalue())
        page.insert_link({"kind": pymupdf.LINK_URI, "from": r, "uri": URL})
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
    a4 = os.path.join(SORTIE, f"flyer-{fid}-a4.pdf")           # version à imprimer, A4 recto-verso : POUR TOUS (règle d'Ahmed, 25/10/2026)
    imprimer_a4(fid, a4)
    faits.append(os.path.basename(a4))
    if len(pages) == 6:
        # dépliant : images des 2 FEUILLES A4 (vignettes et lecteur du site), pour que le visiteur voie ce qu'il imprime
        # (Ahmed, 26/10/2026 : les 6 panneaux en hauteur faisaient croire que le PDF n'était pas en A4 recto-verso)
        for k, p in enumerate(pymupdf.open(a4), 1):
            dst = os.path.join(SORTIE, f"flyer-{fid}-a4-{k}.jpg")
            pix = p.get_pixmap(dpi=150)
            im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            im.save(dst, "JPEG", quality=85, optimize=True)
            mini = im.resize((MINI_LARGEUR * 2, round(im.height * MINI_LARGEUR * 2 / im.width)), Image.LANCZOS)
            mini.save(dst.replace(".jpg", "-mini.jpg"), "JPEG", quality=80, optimize=True)
            faits += [os.path.basename(dst), os.path.basename(dst.replace(".jpg", "-mini.jpg"))]
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

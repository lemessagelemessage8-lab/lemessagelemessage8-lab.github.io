"""Extrait le texte d'un dépliant de l'Islamic Information Center (6 panneaux) en blocs structurés, pour le traduire.

Sortie : « Le message/flyers originaux/<id>/texte.json » (dépôt privé) :
  {"id": …, "langue": "es", "couverture": {"titre", "sous_titre", "numero"}, "panneaux": [[{"type", "texte", "ref"?}, …] × 5]}
Types : titre (grand titre vert), sous_titre (rouge), para, puce, citation (verset ou parole citée, avec "ref"), bulle (citation
en encadré rond, avec "ref"). Le contact de l'éditeur (dernier panneau, en bas) n'est pas extrait : il est remis tel quel.
Usage : python tools/flyers_texte.py <id> […]"""
import json
import os
import sys

import pymupdf

ICI = os.path.dirname(os.path.abspath(__file__))
ORIGINAUX = os.path.join(os.path.dirname(os.path.dirname(ICI)), "flyers originaux")
VERT, ROUGE, BLANC = 0x196131, 0xA6242A, 0xFFFFFF


def lignes(page):
    out = []
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            t = "".join(s["text"] for s in l["spans"]).strip()
            if t:
                s = l["spans"][0]
                out.append({"t": t, "taille": round(s["size"]), "coul": s["color"], "gras": bool(s["flags"] & 16),
                            "ital": bool(s["flags"] & 2), "x": l["bbox"][0], "y": l["bbox"][1]})
    return out


def genre(l):
    if l["coul"] == BLANC and l["taille"] <= 11:
        return "ref"
    if l["taille"] >= 24 and l["coul"] == VERT:
        return "titre"
    if l["taille"] >= 17 and l["coul"] == ROUGE:
        return "sous_titre"
    if l["ital"] and l["gras"] and l["taille"] <= 13:
        return "bulle"
    if l["ital"] and l["coul"] == VERT:
        return "citation"
    if l["t"] == "•":
        return "puce"
    return "para"


def panneau(page, largeur):
    blocs, puce = [], False
    for l in lignes(page):
        if l["taille"] <= 11 and l["t"].isdigit() and l["x"] > largeur * 0.8:      # numéro de page
            continue
        if l["y"] > page.rect.height * 0.86 and l["taille"] <= 14 and genre(l) == "para" and any(
                k in l["t"] for k in ("HOTLINE", "islamicic", "+971", "@")):        # contact de l'éditeur
            continue
        g = genre(l)
        if g == "puce":
            puce = True
            continue
        if g == "ref":
            for b in reversed(blocs):
                if b["type"] in ("citation", "bulle") and "ref" not in b:
                    b["ref"] = l["t"]
                    break
            continue
        if puce and g == "para":
            blocs.append({"type": "puce", "texte": l["t"]})
            puce = False
            continue
        prec = blocs[-1] if blocs else None
        if prec and prec["type"] == g and "ref" not in prec and (g != "para" or not prec["texte"].endswith((".", ":", "?", "!")) or l["x"] - 2 > 0):
            colle = prec["texte"].endswith("-")
            prec["texte"] = (prec["texte"][:-1] if colle else prec["texte"] + " ") + l["t"]
            continue
        if prec and prec["type"] == "puce" and g == "para" and l["x"] > 40:            # suite d'une puce (retrait)
            prec["texte"] += " " + l["t"]
            continue
        blocs.append({"type": g, "texte": l["t"]})
    return blocs


def extraire(fid):
    d = pymupdf.open(os.path.join(ORIGINAUX, fid, "original.pdf"))
    assert len(d) == 6, f"{fid} : {len(d)} pages"
    c = lignes(d[0])
    grands = sorted((l for l in c if l["taille"] >= 30), key=lambda l: l["y"])
    sous = [l["t"] for l in sorted(c, key=lambda l: l["y"]) if 16 <= l["taille"] < 30 and l["coul"] == BLANC]
    num = next((l["t"] for l in c if l["t"].startswith("(") and "/" in l["t"]), "")
    couverture = {"titre": " ".join(l["t"] for l in grands), "sous_titre": " ".join(sous), "numero": num}
    panneaux = [panneau(d[i], d[i].rect.width) for i in range(1, 6)]
    sortie = {"id": fid, "langue": "es", "couverture": couverture, "panneaux": panneaux}
    with open(os.path.join(ORIGINAUX, fid, "texte.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(sortie, f, ensure_ascii=False, indent=1)
        f.write("\n")
    return sortie


if __name__ == "__main__":
    for fid in sys.argv[1:]:
        s = extraire(fid)
        print(fid, "|", s["couverture"], "|", [len(p) for p in s["panneaux"]], "blocs")

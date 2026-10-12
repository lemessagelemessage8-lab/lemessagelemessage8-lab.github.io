"""Met le même numéro de version (?v=…) sur tous les fichiers CSS et JS du site, dans chaque page.
Sans lui, le navigateur d'un visiteur peut garder d'anciens fichiers après une mise à jour.

Usage :  python tools/version.py 20261012c     (à lancer avant chaque publication qui modifie css/ ou js/)"""
import pathlib, re, sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
PAGES = ["index.html", "paroles-du-prophete/index.html"]


def main():
    v = sys.argv[1]
    assert re.fullmatch(r"\d{8}[a-z]", v), "version attendue : AAAAMMJJ + une lettre, ex. 20261012c"
    for page in PAGES:
        p = RACINE / page
        s = p.read_text(encoding="utf-8")
        s, n = re.subn(r'((?:href|src)="(?:\.\./)?(?:css|js)/[\w.-]+\.(?:css|js))(?:\?v=\w+)?"', lambda m: m.group(1) + "?v=" + v + '"', s)
        p.write_text(s, encoding="utf-8", newline="")
        print(page, ":", n, "fichiers en version", v)


if __name__ == "__main__":
    main()

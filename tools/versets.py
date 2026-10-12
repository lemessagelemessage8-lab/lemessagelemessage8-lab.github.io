"""Fabrique js/versets.js : les versets du site, pris MOT POUR MOT dans une traduction officielle du Coran pour chaque langue
(Encyclopédie du Noble Coran, QuranEnc.com). Demande d'Ahmed (12/10/2026) : ne pas traduire les versets nous-mêmes.

Usage :  python tools/versets.py            (réutilise tools/versets.json)
         python tools/versets.py --telecharger   (retélécharge les versets depuis QuranEnc.com)
Seules libertés prises : les numéros de notes et de versets sont retirés, et un verset long est coupé avec « … »."""
import json, pathlib, re, sys, time, urllib.request

ICI = pathlib.Path(__file__).resolve().parent
# langue : (clé QuranEnc, nom affiché de la traduction, langue de la page QuranEnc)
SOURCES = {
    "en": ("english_saheeh", "Saheeh International (Noor International Center)", "en"),
    "fr": ("french_montada", "Noor International Center (Dr Nabil Ridwan)", "fr"),
    "es": ("spanish_garcia", "Muhammad Isa García", "es"),
    "de": ("german_bubenheim", "Frank Bubenheim & Dr. Nadeem Elyas", "de"),
    "it": ("italian_rwwad", "Rowwad Translation Center", "it"),
    "pt": ("portuguese_nasr", "Dr. Helmi Nasr", "pt"),
    "nl": ("dutch_center", "Rowwad Translation Center / Nederlands Islamitisch Centrum", "nl"),
    "zh": ("chinese_makin", "马坚 (Muhammad Makeen)", "zh"),
    "ja": ("japanese_saeedsato", "サイード佐藤 (Saeed Sato)", "ja"),
    "ko": ("korean_hamid", "최영길 (Hamid Choi)", "ko"),
    "hi": ("hindi_omari", "अज़ीज़ुल हक़ अल-उमरी (Azizul Haq Al-Omari)", "hi"),
}
VERSETS = [(1, 1), (21, 107), (51, 56), (112, 1), (112, 2), (112, 3), (112, 4), (2, 2), (68, 4), (7, 156), (49, 13), (16, 97), (17, 23), (2, 256), (16, 125)]
GUILLEMETS = {"en": "“”", "fr": ("« ", " »"), "es": "«»", "de": "„“", "it": "«»", "pt": "«»", "nl": "‘’", "zh": "“”", "ja": "「」", "ko": "“”", "hi": "“”"}

# Passage retenu quand le verset est long : (début, fin) recopiés du texte officiel. None = verset entier.
EXTRAITS = {
    "en": {"7:156": ("My mercy encompasses", "all things"), "49:13": ("made you peoples", "most righteous of you"), "16:97": (None, "good life"),
           "17:23": (None, "good treatment"), "2:256": (None, "the religion"), "16:125": (None, "good instruction")},
    "fr": {"7:156": ("Ma miséricorde", "toute chose"), "49:13": ("Nous avons fait de vous des nations", "est le plus pieux"), "16:97": (None, "vie heureuse"),
           "17:23": ("N’adorez que Lui", "vos deux parents"), "2:256": (None, "en religion !"), "16:125": (None, "bonne exhortation")},
    "es": {"7:156": ("Mi misericordia lo abarca todo", "Mi misericordia lo abarca todo"), "49:13": ("los congregué en pueblos", "el de más piedad"),
           "16:97": (None, "una vida buena"), "17:23": (None, "honren a sus padres"), "2:256": (None, "creer en la religión"), "16:125": (None, "bellas palabras")},
    "de": {"7:156": ("Meine Barmherzigkeit umfaßt alles", "Meine Barmherzigkeit umfaßt alles"), "49:13": ("Wir haben euch zu Völkern", "der Gottesfürchtigste von euch"),
           "16:97": (None, "leben lassen"), "17:23": (None, "gütig sein sollt"), "2:256": (None, "Zwang im Glauben"), "16:125": (None, "schöner Ermahnung")},
    "it": {"7:156": ("la Mia misericordia abbraccia tutto", "la Mia misericordia abbraccia tutto"), "49:13": ("vi abbiamo diviso in popoli", "il più devoto"),
           "16:97": (None, "una vita agiata"), "17:23": (None, "trattiate bene i genitori"), "2:256": (None, "nella fede!"), "16:125": (None, "il buon consiglio")},
    "pt": {"7:156": ("Minha misericórdia", "todas as cousas"), "49:13": ("vos fizemos como nações", "é o mais piedoso"), "16:97": (None, "vida benigna"),
           "17:23": (None, "para com os pais"), "2:256": (None, "na religião!"), "16:125": (None, "bela exortação")},
    "nl": {"51:56": (None, "Mij te aanbidden"), "112:1": (None, "de Enige"), "112:2": (None, "de Onafhankelijke"), "112:4": (None, "te vergelijken is"),
           "7:156": ("Mijn genade omvat alles", "Mijn genade omvat alles"), "49:13": ("Wij hebben jullie uit een man", "het meest vrezen"),
           "16:97": (None, "een begerenswaardig leven"), "17:23": (None, "naar jullie ouders toe"), "2:256": (None, "dwang in de godsdienst"),
           "16:125": (None, "weloverwogen bewoordingen")},
    "zh": {"7:156": ("我的慈恩是包罗万物的", "我的慈恩是包罗万物的"), "49:13": ("我使你们成为许多民族和部落", "是你们中最敬畏者"), "16:97": (None, "美满的生活"),
           "17:23": (None, "应当孝敬父母"), "2:256": (None, "绝无强迫"), "16:125": (None, "劝人遵循主道")},
    "ja": {"112:1": ("言え", None), "7:156": ("わが慈悲は", "広く及んでいる"), "49:13": ("あなた方が知り合うべく", "最も敬虔な者なのである"), "16:97": (None, "送らせよう"),
           "17:23": (None, "と命じられた"), "2:256": (None, "宗教に強制はない"), "16:125": (None, "主の道へと招き")},
    "ko": {"7:156": ("나의 자비가 모든 것을 포용하나니", "나의 자비가 모든 것을 포용하나니"), "49:13": ("종 족과 부족을", "가장 의로운 자로"), "16:97": (None, "부여할 것이며"),
           "17:23": (None, "효도하라 하셨으니"), "2:256": (None, "강요가 없나니"), "16:125": (None, "인도하되")},
    "hi": {"7:156": ("मेरी दया", "घेरे हुए है"), "49:13": ("हमने तुम्हें जातियों", "तक़्वा वाला है"), "16:97": (None, "व्यतीत कराएँगे"),
           "17:23": (None, "अच्छा व्यवहार करो"), "2:256": (None, "ज़ोर-ज़बरदस्ती नहीं"), "16:125": (None, "के साथ बुलाएँ")},
}
BORDS = "\"“”«»„‘’「」『』  "


def telecharger():
    R = {}
    for l, (cle, _, _) in SOURCES.items():
        R[l] = {}
        for s, a in VERSETS:
            u = f"https://quranenc.com/api/v1/translation/aya/{cle}/{s}/{a}"
            for _ in range(3):
                try:
                    r = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30))["result"]
                    R[l][f"{s}:{a}"] = r["translation"]; break
                except Exception:
                    time.sleep(2)
            else:
                raise SystemExit(f"verset introuvable : {l} {s}:{a}")
    (ICI / "versets.json").write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8")
    return R


def propre(t):
    t = re.sub(r"\[\d+\]", "", t).replace("*", "")            # appels de notes
    t = re.sub(r"^\s*\d+\.\s*", "", t)                         # numéro du verset en tête
    t = re.sub(r"\s*﴿[^﴾]*﴾", "", t)                          # rappel du texte arabe dans la traduction italienne
    return re.sub(r"\s+", " ", t).strip()


def extrait(l, ref, brut, colle=False):
    t = propre(brut)
    debut, fin = EXTRAITS[l].get(ref, (None, None))
    a = 0 if debut is None else t.index(debut)
    b = len(t) if fin is None else t.index(fin, a) + len(fin)
    morceau = t[a:b].strip()
    coupe_avant, coupe_apres = a > 0, b < len(t.rstrip(" -,;:،，"))
    if not colle:
        morceau = morceau.strip(BORDS).rstrip(" -,;:،，")
    avant = "…" if l in ("zh", "ja") else "… "
    return (avant if coupe_avant else "") + morceau + ("…" if coupe_apres else "")


def main():
    R = telecharger() if "--telecharger" in sys.argv else json.loads((ICI / "versets.json").read_text(encoding="utf-8"))
    sortie = {}
    for l, (cle, nom, page) in SOURCES.items():
        g = GUILLEMETS[l]
        entre = lambda x: g[0] + x + g[1]
        v = {ref: extrait(l, ref, R[l][ref]) for ref in ["21:107", "51:56", "2:2", "68:4", "7:156", "49:13", "16:97", "17:23", "2:256", "16:125"]}
        # sourate 112 : les 4 versets à la suite ; les guillemets intérieurs sont retirés (ils s'ouvrent au verset 1 et se ferment au verset 4)
        parts = [re.sub("[\"“”«»„「」『』]", "", extrait(l, f"112:{i}", R[l][f"112:{i}"], colle=True)).strip() for i in (1, 2, 3, 4)]
        v["112:1-4"] = re.sub(r"\s+", " ", " ".join(parts) if l not in ("zh", "ja") else "".join(parts))
        sortie[l] = {
            "source": nom, "url": f"https://quranenc.com/{page}/browse/{cle}",
            "basmala": propre(R[l]["1:1"]).rstrip(".。।। "),
            "versets": {ref: entre(x) for ref, x in v.items()},
        }
    js = ("// FICHIER FABRIQUÉ par tools/versets.py — ne pas modifier à la main.\n"
          "// Versets cités mot pour mot d'après une traduction officielle du Coran pour chaque langue (QuranEnc.com).\n"
          "window.VERSETS = " + json.dumps(sortie, ensure_ascii=False, indent=1) + ";\n")
    (ICI.parent / "js" / "versets.js").write_text(js, encoding="utf-8", newline="\n")
    for l in sortie:
        print("#", l, "|", sortie[l]["source"], "|", sortie[l]["basmala"])
        for ref, x in sortie[l]["versets"].items(): print("  ", ref, x)


if __name__ == "__main__":
    main()

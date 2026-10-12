"""Fabrique js/paroles.js : les données de la page « Paroles du Prophète » (Marie ; ceux qui embrassent l'Islam).

Règle d'Ahmed (12/10/2026) : ne pas traduire nous-mêmes les textes sacrés.
- Versets : traduction officielle du Coran de chaque langue (QuranEnc.com), mot pour mot, verset entier.
- Hadiths : traduction officielle de l'Encyclopédie des hadiths prophétiques traduits (HadeethEnc.com) quand elle existe
  dans la langue ; sinon traduction « maison » (dictionnaire MAISON ci-dessous), marquée officiel = False : la page affiche alors
  clairement que ce n'est qu'une traduction non officielle et renvoie à la source officielle.

Usage :  python tools/paroles.py                 (réutilise tools/paroles.json)
         python tools/paroles.py --telecharger   (retélécharge depuis QuranEnc.com et HadeethEnc.com)"""
import json, pathlib, re, sys, time, urllib.request
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from versets import SOURCES, propre

ICI = pathlib.Path(__file__).resolve().parent
LANGUES = list(SOURCES)
VERSETS = {"marie": [(3, 42), (3, 45), (66, 12)], "islam": [(39, 53)]}
HADITHS = {"marie": [11179, 10994], "islam": [65016, 65002, 65006, 10098]}
LANGUES_HADITHS = ["en", "fr", "es", "de", "it", "pt", "nl", "zh", "ja", "hi"]      # langues proposées par HadeethEnc (pas de coréen)

# Traductions NON officielles, faites à partir de la traduction anglaise officielle de HadeethEnc.com, seulement là où
# HadeethEnc n'a pas (encore) la langue. À remplacer par la version officielle dès qu'elle existe (relancer --telecharger).
AUTH_BM = {"es": "Auténtico — transmitido por Al-Bujari y Muslim", "de": "Authentisch – überliefert von al-Buchari und Muslim",
           "it": "Autentico — riportato da al-Bukhari e Muslim", "pt": "Autêntico — narrado por al-Bukhari e Muslim",
           "nl": "Authentiek — overgeleverd door al-Boechari en Moeslim", "ja": "真正（サヒーフ） — ブハーリーとムスリムによる伝承",
           "ko": "진정(사히흐) — 부카리와 무슬림 전승"}
MAISON = {
    11179: {
        "de": "Abu Musa (möge Allah mit ihm zufrieden sein) berichtete: Der Gesandte Allahs (Allahs Segen und Frieden auf ihm) sagte: „Viele Männer haben Vollkommenheit erlangt, von den Frauen aber haben nur Asiya, die Frau des Pharao, und Maryam (Maria), die Tochter Imrans, Vollkommenheit erlangt. Und der Vorzug Aischas gegenüber den anderen Frauen ist wie der Vorzug des Tharid (eines Gerichts aus Brot und Fleisch) gegenüber den anderen Speisen.“",
        "it": "Abu Musa (che Allah sia soddisfatto di lui) riferì: Il Messaggero di Allah (pace e benedizioni di Allah su di lui) disse: «Molti uomini hanno raggiunto la perfezione, ma tra le donne non l'hanno raggiunta che Asiya, moglie del Faraone, e Maryam (Maria), figlia di ‘Imran. E la superiorità di ‘A'isha sulle altre donne è come la superiorità del tharid (un piatto di pane e carne) sugli altri cibi.»",
        "pt": "Abu Mussa (que Allah esteja satisfeito com ele) relatou: O Mensageiro de Allah (que a paz e as bênçãos de Allah estejam sobre ele) disse: «Muitos homens alcançaram a perfeição, mas, entre as mulheres, só a alcançaram Ássia, esposa do Faraó, e Maryam (Maria), filha de ‘Imran. E a superioridade de ‘Aisha sobre as outras mulheres é como a superioridade do tharid (um prato de pão e carne) sobre os outros alimentos.»",
        "nl": "Abu Moesa (moge Allah tevreden met hem zijn) verhaalde: De Boodschapper van Allah (vrede en zegeningen van Allah zij met hem) zei: ‘Veel mannen hebben de volmaaktheid bereikt, maar van de vrouwen hebben alleen Asiya, de vrouw van Farao, en Maryam (Maria), de dochter van ‘Imraan, de volmaaktheid bereikt. En de voortreffelijkheid van ‘Aisha boven de andere vrouwen is als de voortreffelijkheid van tharied (een gerecht van brood en vlees) boven de andere gerechten.’",
        "ja": "アブー・ムーサー（アッラーが彼にご満悦あらんことを）は伝えている。アッラーの使徒（アッラーの祝福と平安あれ）は言った。「男性で完全さに達した者は多い。しかし女性で完全さに達したのは、フィルアウン（ファラオ）の妻アースィヤと、イムラーンの娘マルヤム（マリア）だけである。そして他の女性に対するアーイシャの優越は、他の食べ物に対するサリード（パンと肉の料理）の優越のようなものである。」",
        "ko": "아부 무사(하나님께서 그를 기뻐하시기를)가 전하기를, 하나님의 사도(그분께 하나님의 축복과 평화가 있기를)께서 말씀하셨다. “남자들 가운데는 완전함에 이른 이가 많으나, 여자들 가운데 완전함에 이른 이는 파라오의 아내 아시야와 이므란의 딸 마르얌(마리아)뿐이다. 그리고 다른 여인들에 대한 아이샤의 뛰어남은 다른 음식에 대한 타리드(빵과 고기로 만든 음식)의 뛰어남과 같다.”",
    },
    10994: {
        "es": "Abu Hurairah (que Al-lah esté complacido con él) relató que oyó al Mensajero de Al-lah (que la paz y las bendiciones de Al-lah sean con él) decir: «No nace ningún niño sin que el demonio lo toque al nacer, y por eso rompe a llorar con fuerza, a causa de ese toque del demonio; excepto Maryam (María) y su hijo.» Luego Abu Hurairah recitó la aleya 36 de la sura Al ‘Imran (3:36).",
        "de": "Abu Huraira (möge Allah mit ihm zufrieden sein) berichtete, dass er den Gesandten Allahs (Allahs Segen und Frieden auf ihm) sagen hörte: „Kein Kind wird geboren, ohne dass der Satan es bei seiner Geburt berührt, sodass es wegen dieser Berührung laut zu schreien beginnt – außer Maryam (Maria) und ihr Sohn.“ Danach rezitierte Abu Huraira den Vers 36 der Sure Al ‘Imran (3:36).",
        "it": "Abu Hurayra (che Allah sia soddisfatto di lui) riferì di aver sentito il Messaggero di Allah (pace e benedizioni di Allah su di lui) dire: «Non nasce bambino senza che il demonio lo tocchi alla nascita, ed egli allora scoppia a piangere forte per quel tocco del demonio; tranne Maryam (Maria) e suo figlio.» Poi Abu Hurayra recitò il versetto 36 della sura Al ‘Imran (3:36).",
        "pt": "Abu Huraira (que Allah esteja satisfeito com ele) relatou ter ouvido o Mensageiro de Allah (que a paz e as bênçãos de Allah estejam sobre ele) dizer: «Não nasce criança alguma sem que o demônio a toque ao nascer, e por isso ela começa a chorar alto, por causa desse toque do demônio; exceto Maryam (Maria) e o seu filho.» Em seguida, Abu Huraira recitou o versículo 36 da sura Al ‘Imran (3:36).",
        "nl": "Abu Hoerayra (moge Allah tevreden met hem zijn) verhaalde dat hij de Boodschapper van Allah (vrede en zegeningen van Allah zij met hem) hoorde zeggen: ‘Er wordt geen kind geboren of de duivel raakt het bij de geboorte aan, waarna het luid begint te huilen vanwege die aanraking van de duivel; behalve Maryam (Maria) en haar zoon.’ Daarna reciteerde Abu Hoerayra vers 36 van soera Aal ‘Imraan (3:36).",
        "ja": "アブー・フライラ（アッラーが彼にご満悦あらんことを）は、アッラーの使徒（アッラーの祝福と平安あれ）がこう言うのを聞いたと伝えている。「生まれてくる子どもは誰でも、生まれるときに悪魔に触れられ、そのために大声で泣き出す。ただしマルヤム（マリア）とその息子は別である。」その後アブー・フライラは、イムラーン家章36節（3:36）を読み上げた。",
        "ko": "아부 후라이라(하나님께서 그를 기뻐하시기를)는 하나님의 사도(그분께 하나님의 축복과 평화가 있기를)께서 이렇게 말씀하시는 것을 들었다고 전한다. “태어나는 아이는 누구나 태어날 때 사탄이 건드리며, 그 때문에 크게 울음을 터뜨린다. 다만 마르얌(마리아)과 그녀의 아들은 예외이다.” 그런 다음 아부 후라이라는 이므란 가문 장 36절(3:36)을 낭송했다.",
    },
    65016: {"ko": "하킴 이븐 히잠(하나님께서 그를 기뻐하시기를)이 전하기를, 내가 말했다. “하나님의 사도시여, 저는 이슬람을 받아들이기 전에 자선을 베풀고, 노예를 해방하고, 친족 관계를 잇는 것과 같은 선행을 하곤 했습니다. 그 행위들에 대해 보상을 받게 됩니까?” 예언자(그분께 하나님의 축복과 평화가 있기를)께서 대답하셨다. “그대는 지난날의 선행과 함께 이슬람을 받아들인 것이다.”"},
    65002: {"ko": "이븐 마스우드(하나님께서 그를 기뻐하시기를)가 전하기를, 한 남자가 말했다. “하나님의 사도시여, 우리가 자힐리야(이슬람 이전의 무지 시대)에 한 일 때문에 벌을 받게 됩니까?” 그분께서 말씀하셨다. “이슬람 안에서 선을 행하는 사람은 자힐리야 때 한 일로 벌을 받지 않는다. 그러나 이슬람 안에서 악을 행하는 사람은 이전의 일과 이후의 일 모두로 벌을 받는다.”"},
    65006: {"ko": "아나스(하나님께서 그를 기뻐하시기를)가 전하기를, 한 남자가 예언자(그분께 하나님의 축복과 평화가 있기를)께 와서 말했다. “하나님의 사도시여, 저는 작은 죄든 큰 죄든 저지르지 않은 것이 없습니다.” 그분께서 말씀하셨다. “그대는 하나님 외에는 신이 없으며 무함마드는 하나님의 사도임을 증언하지 않는가?” 그분께서는 이 질문을 세 번 되풀이하셨다. 그가 대답했다. “예, 증언합니다.” 예언자(그분께 하나님의 축복과 평화가 있기를)께서 말씀하셨다. “이것이 그것을 이긴다.”"},
    10098: {"ko": "아나스 이븐 말리크(하나님께서 그를 기뻐하시기를)가 전하기를, 예언자(그분께 하나님의 축복과 평화가 있기를)께서 무아드를 뒤에 태우고 탈것을 타고 가시다가 말씀하셨다. “무아드 이븐 자발이여!” 그가 대답했다. “하나님의 사도시여, 분부만 내리십시오.” 그분께서 다시 말씀하셨다. “무아드여!” 그가 대답했다. “하나님의 사도시여, 분부만 내리십시오.” 이렇게 세 번 되풀이되었다. 그런 다음 예언자(그분께 하나님의 축복과 평화가 있기를)께서 말씀하셨다. “하나님 외에는 신이 없으며 무함마드는 그분의 종이자 사도임을 마음에서 우러나 진실하게 증언하는 사람은 누구든지, 하나님께서 그를 지옥불에 들어가지 못하게 하신다.” 그가 말했다. “하나님의 사도시여, 사람들이 기뻐하도록 이것을 알려도 되겠습니까?” 그분께서 대답하셨다. “그러면 그들은 이것에만 의지하게 될 것이다.” 무아드는 지식을 감추는 죄를 피하려고 임종 때에 이 하디스를 전했다."},
}
SOURCE_MAISON = {  # degré d'authenticité et recueils, pour les traductions maison
    11179: AUTH_BM, 10994: AUTH_BM,
    65016: {"ko": "진정(사히흐) — 부카리와 무슬림 공통 전승"}, 65002: {"ko": "진정(사히흐) — 부카리와 무슬림 공통 전승"},
    65006: {"ko": "진정(사히흐) — 아부 얄라, 타바라니, 디야 알마크디시 전승"}, 10098: {"ko": "진정(사히흐) — 부카리와 무슬림 공통 전승"},
}


def lire(u):
    for _ in range(3):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=40))
        except Exception:
            time.sleep(2)
    return None


def telecharger():
    R = {"versets": {}, "hadiths": {}}
    for l, (cle, _, _) in SOURCES.items():
        R["versets"][l] = {}
        for s, a in sum(VERSETS.values(), []):
            d = lire(f"https://quranenc.com/api/v1/translation/aya/{cle}/{s}/{a}")
            if not d: raise SystemExit(f"verset introuvable : {l} {s}:{a}")
            R["versets"][l][f"{s}:{a}"] = d["result"]["translation"]
    for i in sum(HADITHS.values(), []):
        R["hadiths"][str(i)] = {}
        ar = lire(f"https://hadeethenc.com/api/v1/hadeeths/one/?language=ar&id={i}")
        R["hadiths"][str(i)]["ar"] = {"hadeeth": ar["hadeeth"]} if ar else None
        for l in LANGUES_HADITHS:
            d = lire(f"https://hadeethenc.com/api/v1/hadeeths/one/?language={l}&id={i}")
            R["hadiths"][str(i)][l] = {k: d.get(k) for k in ("hadeeth", "attribution", "grade")} if d and d.get("hadeeth") else None
    (ICI / "paroles.json").write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8")
    return R


def main():
    R = telecharger() if "--telecharger" in sys.argv else json.loads((ICI / "paroles.json").read_text(encoding="utf-8"))
    S = {}
    for l in LANGUES:
        S[l] = {"versets": {}, "hadiths": {}}
        for partie, refs in VERSETS.items():
            for s, a in refs:
                S[l]["versets"][f"{s}:{a}"] = propre(R["versets"][l][f"{s}:{a}"])
        for partie, ids in HADITHS.items():
            for i in ids:
                off = R["hadiths"][str(i)].get(l)
                if off:
                    src = " — ".join(x for x in (off.get("grade"), off.get("attribution")) if x)
                    if re.search(r"[\u0600-\u06FF]", src):      # libellés restés en arabe (japonais…) : libellé anglais officiel
                        en = R["hadiths"][str(i)]["en"]; src = " — ".join(x for x in (en.get("grade"), en.get("attribution")) if x)
                    S[l]["hadiths"][str(i)] = {"texte": re.sub(r"\s+", " ", off["hadeeth"]).strip(), "source": src,
                                               "officiel": True, "url": f"https://hadeethenc.com/{l}/browse/hadith/{i}"}
                else:
                    S[l]["hadiths"][str(i)] = {"texte": MAISON[i][l], "source": SOURCE_MAISON[i][l], "officiel": False,
                                               "url": f"https://hadeethenc.com/en/browse/hadith/{i}"}
    plan = {"versets": {k: [f"{s}:{a}" for s, a in v] for k, v in VERSETS.items()}, "hadiths": {k: [str(i) for i in v] for k, v in HADITHS.items()}}
    arabe = {str(i): re.sub(r"\s+", " ", R["hadiths"][str(i)]["ar"]["hadeeth"]).strip() for i in sum(HADITHS.values(), []) if R["hadiths"][str(i)].get("ar")}
    js = ("// FICHIER FABRIQUÉ par tools/paroles.py — ne pas modifier à la main.\n"
          "// Versets : traduction officielle du Coran (QuranEnc.com). Hadiths : traduction officielle HadeethEnc.com quand « officiel » est vrai,\n"
          "// sinon traduction non officielle faite pour ce site (la page l'indique sous le texte).\n"
          "window.PAROLES = " + json.dumps({"plan": plan, "arabe": arabe, "langues": S}, ensure_ascii=False, indent=1) + ";\n")
    (ICI.parent / "js" / "paroles.js").write_text(js, encoding="utf-8", newline="\n")
    for l in LANGUES:
        non = [i for i, h in S[l]["hadiths"].items() if not h["officiel"]]
        print(l, "| hadiths officiels :", len(S[l]["hadiths"]) - len(non), "/", len(S[l]["hadiths"]), "| non officiels :", ",".join(non) or "aucun")


if __name__ == "__main__":
    main()

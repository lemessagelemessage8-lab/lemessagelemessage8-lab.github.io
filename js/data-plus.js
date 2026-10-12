// Complément de js/data.js pour les langues ajoutées le 12/10/2026 (it, pt, nl, zh, ja, ko, hi) :
// descriptions des cartes, titres des flyers, Corans traduits dans ces langues, adresses par langue.
(function () {
  var D = window.SITE_DATA, T = window.I18N;
  var L = ["it", "pt", "nl", "zh", "ja", "ko", "hi"];   // ordre des textes dans les listes ci-dessous

  // ───────── Textes : une ligne par carte, dans l'ordre it, pt, nl, zh, ja, ko, hi ─────────
  var X = {
    f_mercy: ["Perché siamo stati creati? Che cos'è l'Islam? Il miracolo del latte e la misericordia nell'Islam.", "Por que fomos criados? O que é o Islã? O milagre do leite e a misericórdia no Islã.", "Waarom zijn wij geschapen? Wat is de islam? Het wonder van de melk en barmhartigheid in de islam.", "我们为什么被创造？什么是伊斯兰教？乳汁的奇迹，以及伊斯兰教中的仁慈。", "私たちはなぜ創られたのか。イスラームとは何か。乳の奇跡と、イスラームにおける慈悲。", "우리는 왜 창조되었는가? 이슬람이란 무엇인가? 젖의 기적과 이슬람의 자비.", "हमें क्यों पैदा किया गया? इस्लाम क्या है? दूध का चमत्कार और इस्लाम में दया।"],
    f_woman: ["Che cos'è l'Islam? Il posto e i diritti della donna nell'Islam.", "O que é o Islã? O lugar e os direitos da mulher no Islã.", "Wat is de islam? De plaats en de rechten van de vrouw in de islam.", "什么是伊斯兰教？女性在伊斯兰教中的地位与权利。", "イスラームとは何か。イスラームにおける女性の地位と権利。", "이슬람이란 무엇인가? 이슬람에서 여성의 지위와 권리.", "इस्लाम क्या है? इस्लाम में स्त्री का स्थान और उसके अधिकार।"],
    f_parents: ["Chi è Muhammad ﷺ? Chi è Dio? Che cos'è il Corano? I diritti dei genitori e degli anziani.", "Quem é Muhammad ﷺ? Quem é Deus? O que é o Alcorão? Os direitos dos pais e dos idosos.", "Wie is Mohammed ﷺ? Wie is God? Wat is de Koran? De rechten van ouders en ouderen.", "穆罕默德 ﷺ 是谁？真主是谁？《古兰经》是什么？父母与长者的权利。", "ムハンマド ﷺ とは。神とは。クルアーンとは。両親と年長者の権利。", "무함마드 ﷺ 는 누구인가? 하나님은 누구신가? 꾸란이란 무엇인가? 부모와 어르신의 권리.", "मुहम्मद ﷺ कौन हैं? ईश्वर कौन है? क़ुरआन क्या है? माता-पिता और बुज़ुर्गों के अधिकार।"],
    f_morals: ["Che cos'è l'Islam? Il miracolo dell'embriologia nel Corano e il nobile carattere del Profeta ﷺ.", "O que é o Islã? O milagre da embriologia no Alcorão e o nobre caráter do Profeta ﷺ.", "Wat is de islam? Het wonder van de embryologie in de Koran en het edele karakter van de Profeet ﷺ.", "什么是伊斯兰教？《古兰经》中的胚胎学奇迹，以及先知 ﷺ 的高尚品格。", "イスラームとは何か。クルアーンにある発生学の奇跡と、預言者 ﷺ の高潔な人格。", "이슬람이란 무엇인가? 꾸란 속 발생학의 기적과 예언자 ﷺ 의 고귀한 성품.", "इस्लाम क्या है? क़ुरआन में भ्रूण-विज्ञान का चमत्कार और पैग़ंबर ﷺ का उच्च चरित्र।"],

    q_qurancom: ["Leggi e ascolta il Corano con traduzioni in più di 50 lingue.", "Leia e ouça o Alcorão com traduções em mais de 50 idiomas.", "Lees en beluister de Koran met vertalingen in meer dan 50 talen.", "阅读和聆听《古兰经》，提供 50 多种语言的译本。", "50以上の言語の翻訳とともに、クルアーンを読み、聴くことができます。", "50개가 넘는 언어의 번역과 함께 꾸란을 읽고 들을 수 있습니다.", "50 से अधिक भाषाओं के अनुवादों के साथ क़ुरआन पढ़िए और सुनिए।"],
    q_enc: ["Traduzioni verificate dei significati del Corano in decine di lingue, scaricabili in PDF.", "Traduções verificadas dos significados do Alcorão em dezenas de idiomas, com PDF para baixar.", "Geverifieerde vertalingen van de betekenissen van de Koran in tientallen talen, ook als pdf.", "数十种语言的《古兰经》经义审定译本，可下载 PDF。", "数十の言語による、検証済みのクルアーンの意味の翻訳。PDFもあります。", "수십 개 언어로 된 검증된 꾸란 의미 번역본. PDF로도 받을 수 있습니다.", "दर्जनों भाषाओं में क़ुरआन के अर्थों के प्रमाणित अनुवाद, PDF सहित।"],
    q_tanzil: ["Testo arabo verificato e molte traduzioni da scaricare.", "Texto árabe verificado e muitas traduções para baixar.", "Geverifieerde Arabische tekst en veel vertalingen om te downloaden.", "经过校对的阿拉伯语原文，以及多种可下载的译本。", "検証済みのアラビア語原文と、ダウンロードできる多数の翻訳。", "검증된 아랍어 원문과 내려받을 수 있는 다양한 번역본.", "प्रमाणित अरबी पाठ और डाउनलोड के लिए कई अनुवाद।"],
    q_fahd: ["Il complesso ufficiale di stampa di Medina: Corano e traduzioni in molte lingue.", "O complexo oficial de impressão de Medina: Alcorão e traduções em muitos idiomas.", "Het officiële drukkerijcomplex in Medina: Koran en vertalingen in vele talen.", "麦地那的官方印经院：《古兰经》及多种语言的译本。", "マディーナの公式印刷所：クルアーンと多くの言語の翻訳。", "메디나의 공식 꾸란 인쇄 기관: 꾸란과 여러 언어의 번역본.", "मदीना का आधिकारिक मुद्रण परिसर: क़ुरआन और कई भाषाओं में अनुवाद।"],
    q_lecoran: ["Il Corano in arabo e francese, con recitazione.", "O Alcorão em árabe e francês, com recitação.", "De Koran in het Arabisch en Frans, met recitatie.", "阿拉伯语与法语对照的《古兰经》，附诵读。", "アラビア語とフランス語のクルアーン。朗誦つき。", "아랍어와 프랑스어로 된 꾸란. 낭송 포함.", "अरबी और फ़्रेंच में क़ुरआन, तिलावत के साथ।"],
    q_forall: ["Il Corano con traduzione in spagnolo e in altre lingue.", "O Alcorão com tradução em espanhol e em outros idiomas.", "De Koran met vertaling in het Spaans en andere talen.", "附西班牙语及其他语言译文的《古兰经》。", "スペイン語などの翻訳つきクルアーン。", "스페인어와 다른 언어 번역이 있는 꾸란.", "स्पेनिश और अन्य भाषाओं के अनुवाद के साथ क़ुरआन।"],
    q_audio: ["Ascolta la traduzione dei significati del Corano.", "Ouça a tradução dos significados do Alcorão.", "Beluister de vertaling van de betekenissen van de Koran.", "聆听《古兰经》经义的译文。", "クルアーンの意味の翻訳を音声で聴くことができます。", "꾸란 의미 번역을 음성으로 들을 수 있습니다.", "क़ुरआन के अर्थों का अनुवाद सुनिए।"],
    q_mp3: ["Centinaia di recitatori e radio del Corano in diretta.", "Centenas de recitadores e rádios do Alcorão ao vivo.", "Honderden recitatoren en live Koranradio.", "数百位诵经家，以及《古兰经》广播直播。", "数百人の朗誦家と、クルアーンのライブ放送。", "수백 명의 낭송가와 꾸란 생방송 라디오.", "सैकड़ों क़ारी और क़ुरआन के लाइव रेडियो।"],

    m_qradio: ["Recitazione continua del Corano da parte di recitatori rinomati.", "Recitação contínua do Alcorão por recitadores renomados.", "Doorlopende Koranrecitatie door bekende recitatoren.", "著名诵经家不间断诵读《古兰经》。", "著名な朗誦家によるクルアーンの連続朗誦。", "유명 낭송가들의 꾸란 연속 낭송.", "प्रसिद्ध क़ारियों द्वारा क़ुरआन की निरंतर तिलावत।"],
    m_radioislam: ["Radio di Johannesburg, ascoltabile in tutto il mondo: conferenze, notizie e programmi islamici (in inglese).", "Rádio de Joanesburgo, transmitida para o mundo todo: palestras, notícias e programas islâmicos (em inglês).", "Radio uit Johannesburg, wereldwijd te beluisteren: lezingen, nieuws en islamitische programma's (in het Engels).", "来自约翰内斯堡、面向全球的电台：讲座、新闻和伊斯兰节目（英语）。", "ヨハネスブルグから世界に放送するラジオ：講話、ニュース、イスラーム番組（英語）。", "요하네스버그에서 전 세계로 방송하는 라디오: 강연, 뉴스, 이슬람 프로그램(영어).", "जोहान्सबर्ग का रेडियो, दुनिया भर में सुना जाता है: भाषण, समाचार और इस्लामी कार्यक्रम (अंग्रेज़ी में)।"],
    m_cii: ["Radio islamica in inglese dal Sudafrica.", "Rádio islâmica em inglês, da África do Sul.", "Engelstalige islamitische radio uit Zuid-Afrika.", "来自南非的英语伊斯兰电台。", "南アフリカの英語イスラーム・ラジオ。", "남아프리카공화국의 영어 이슬람 라디오.", "दक्षिण अफ़्रीका का अंग्रेज़ी इस्लामी रेडियो।"],
    m_huda: ["TV islamica in inglese, 24 ore su 24, con programmi per chi vuole conoscere l'Islam.", "TV islâmica em inglês, 24 horas, com programas para quem quer conhecer o Islã.", "Islamitische tv in het Engels, dag en nacht, met programma's voor wie de islam wil leren kennen.", "全天候英语伊斯兰电视台，设有面向想了解伊斯兰教者的节目。", "24時間放送の英語イスラーム・テレビ。イスラームを知りたい人向けの番組もあります。", "24시간 방송하는 영어 이슬람 TV. 이슬람을 알고 싶은 사람을 위한 프로그램도 있습니다.", "अंग्रेज़ी में चौबीसों घंटे इस्लामी टीवी, इस्लाम जानने के इच्छुक लोगों के लिए कार्यक्रमों सहित।"],
    m_islamchannel: ["Canale televisivo islamico britannico, in inglese.", "Canal de televisão islâmico britânico, em inglês.", "Britse islamitische televisiezender, in het Engels.", "英国的伊斯兰电视频道（英语）。", "イギリスのイスラーム・テレビ局（英語）。", "영국의 이슬람 TV 채널(영어).", "ब्रिटेन का इस्लामी टीवी चैनल (अंग्रेज़ी में)।"],
    m_zamzam: ["Web radio musulmana in francese: il Corano recitato 24 ore su 24.", "Rádio muçulmana pela internet, em francês: o Alcorão recitado 24 horas.", "Franstalige islamitische webradio: de Koran dag en nacht gereciteerd.", "法语穆斯林网络电台：全天候诵读《古兰经》。", "フランス語のムスリム向けウェブラジオ：クルアーンを24時間朗誦。", "프랑스어 무슬림 웹 라디오: 24시간 꾸란 낭송.", "फ़्रेंच भाषा का मुस्लिम वेब रेडियो: चौबीसों घंटे क़ुरआन की तिलावत।"],
    m_snrt: ["La radio marocchina del Sacro Corano (arabo e francese).", "A rádio marroquina do Sagrado Alcorão (árabe e francês).", "De Marokkaanse radio van de Heilige Koran (Arabisch en Frans).", "摩洛哥的《古兰经》电台（阿拉伯语和法语）。", "モロッコの聖クルアーン・ラジオ（アラビア語とフランス語）。", "모로코의 성 꾸란 라디오(아랍어와 프랑스어).", "मोरक्को का पवित्र क़ुरआन रेडियो (अरबी और फ़्रेंच)।"],
    m_islamico: ["Insegnamenti islamici in spagnolo, 24 ore su 24.", "Ensinamentos islâmicos em espanhol, 24 horas.", "Islamitische lessen in het Spaans, dag en nacht.", "全天候西班牙语伊斯兰教义讲解。", "スペイン語によるイスラームの教え。24時間放送。", "스페인어로 듣는 이슬람의 가르침, 24시간.", "स्पेनिश में इस्लामी शिक्षाएँ, चौबीसों घंटे।"],
    m_mp3radios: ["Più di 100 radio del Corano in diretta, alcune con traduzione.", "Mais de 100 rádios do Alcorão ao vivo, algumas com tradução.", "Meer dan 100 live Koranradiozenders, sommige met vertaling.", "100 多个《古兰经》直播电台，部分附有译文。", "100を超えるクルアーンのライブ放送。翻訳つきのチャンネルもあります。", "100개가 넘는 꾸란 생방송 라디오. 일부는 번역 포함.", "100 से अधिक लाइव क़ुरआन रेडियो, कुछ अनुवाद के साथ।"],

    l_mosq: ["Il nostro sito gemello: le moschee su una mappa e la storia delle grandi moschee della Tunisia, con foto.", "O nosso site irmão: as mesquitas em um mapa e a história das grandes mesquitas da Tunísia, com fotos.", "Onze zustersite: moskeeën op een kaart en de geschiedenis van de grote moskeeën van Tunesië, met foto's.", "我们的姊妹网站：地图上的清真寺，以及突尼斯各大清真寺的历史与照片。", "姉妹サイト：地図で見るモスクと、チュニジアの大モスクの歴史と写真。", "자매 사이트: 지도로 보는 모스크와 튀니지 대모스크들의 역사와 사진.", "हमारी सहयोगी साइट: नक्शे पर मस्जिदें और ट्यूनीशिया की बड़ी मस्जिदों का इतिहास, तस्वीरों के साथ।"],
    l_islamreligion: ["Articoli e video che spiegano l'Islam ai non musulmani, in molte lingue.", "Artigos e vídeos que explicam o Islã aos não muçulmanos, em muitos idiomas.", "Artikelen en video's die de islam uitleggen aan niet-moslims, in vele talen.", "以多种语言向非穆斯林介绍伊斯兰教的文章和视频。", "ムスリムでない人にイスラームを説明する記事と動画。多くの言語に対応。", "무슬림이 아닌 사람들에게 이슬람을 설명하는 글과 영상. 여러 언어 지원.", "ग़ैर-मुस्लिमों को इस्लाम समझाने वाले लेख और वीडियो, कई भाषाओं में।"],
    l_islamhouse: ["Libri, audio e video gratuiti sull'Islam in più di 100 lingue.", "Livros, áudios e vídeos gratuitos sobre o Islã em mais de 100 idiomas.", "Gratis boeken, audio en video's over de islam in meer dan 100 talen.", "100 多种语言的免费伊斯兰书籍、音频和视频。", "100以上の言語による、イスラームについての無料の本、音声、動画。", "100개가 넘는 언어로 된 이슬람 관련 무료 책, 오디오, 영상.", "100 से अधिक भाषाओं में इस्लाम पर मुफ़्त किताबें, ऑडियो और वीडियो।"],
    l_whyislam: ["Risposte alle domande più frequenti sull'Islam (in inglese).", "Respostas às perguntas mais frequentes sobre o Islã (em inglês).", "Antwoorden op veelgestelde vragen over de islam (in het Engels).", "关于伊斯兰教常见问题的解答（英语）。", "イスラームについてのよくある質問への答え（英語）。", "이슬람에 대해 자주 묻는 질문과 답변(영어).", "इस्लाम के बारे में आम सवालों के जवाब (अंग्रेज़ी में)।"],
    l_newmuslims: ["Lezioni passo dopo passo per chi ha appena abbracciato l'Islam (in inglese).", "Lições passo a passo para quem acabou de abraçar o Islã (em inglês).", "Lessen stap voor stap voor wie zich net tot de islam heeft bekeerd (in het Engels).", "为刚刚皈依伊斯兰教的人准备的循序渐进课程（英语）。", "イスラームに入信したばかりの人のための、段階的なレッスン（英語）。", "막 이슬람을 받아들인 사람을 위한 단계별 강의(영어).", "हाल ही में इस्लाम अपनाने वालों के लिए क़दम-दर-क़दम पाठ (अंग्रेज़ी में)।"],
    l_sunnah: ["I detti del Profeta ﷺ (hadith), in arabo e inglese.", "Os ditos do Profeta ﷺ (hadith), em árabe e inglês.", "De uitspraken van de Profeet ﷺ (hadith), in het Arabisch en Engels.", "先知 ﷺ 的言行录（圣训），阿拉伯语和英语。", "預言者 ﷺ の言葉（ハディース）。アラビア語と英語。", "예언자 ﷺ 의 말씀(하디스). 아랍어와 영어.", "पैग़ंबर ﷺ के कथन (हदीस), अरबी और अंग्रेज़ी में।"],
    l_islamweb: ["Articoli e risposte alle domande, in diverse lingue.", "Artigos e respostas a perguntas, em vários idiomas.", "Artikelen en antwoorden op vragen, in meerdere talen.", "多种语言的文章与问题解答。", "記事と質問への回答。複数の言語に対応。", "여러 언어로 된 글과 질문 답변.", "लेख और सवालों के जवाब, कई भाषाओं में।"],
    l_islamde: ["Informazioni sull'Islam e sui musulmani in Germania (in tedesco).", "Informações sobre o Islã e os muçulmanos na Alemanha (em alemão).", "Informatie over de islam en moslims in Duitsland (in het Duits).", "关于伊斯兰教和德国穆斯林的信息（德语）。", "イスラームとドイツのムスリムについての情報（ドイツ語）。", "이슬람과 독일의 무슬림에 관한 정보(독일어).", "इस्लाम और जर्मनी के मुसलमानों के बारे में जानकारी (जर्मन में)।"],
    l_islamiq: ["Portale di notizie e informazioni sull'Islam (in tedesco).", "Portal de notícias e informações sobre o Islã (em alemão).", "Nieuws- en informatieportaal over de islam (in het Duits).", "关于伊斯兰教的新闻与资讯门户（德语）。", "イスラームについてのニュースと情報のポータル（ドイツ語）。", "이슬람 관련 뉴스와 정보 포털(독일어).", "इस्लाम पर समाचार और जानकारी का पोर्टल (जर्मन में)।"]
  };
  // Titres des flyers (le nom de la langue du flyer est ajouté entre parenthèses)
  var TITRES = {
    mercy: ["La misericordia", "A misericórdia", "Barmhartigheid", "仁慈", "慈悲", "자비", "दया"],
    smile: ["Sorriso e compassione", "Sorriso e compaixão", "Glimlach en mededogen", "微笑与怜悯", "微笑みと思いやり", "미소와 연민", "मुस्कान और करुणा"],
    woman: ["La donna nell'Islam", "A mulher no Islã", "De vrouw in de islam", "伊斯兰教中的女性", "イスラームにおける女性", "이슬람에서의 여성", "इस्लाम में स्त्री"],
    parents: ["I genitori e gli anziani", "Os pais e os idosos", "Ouders en ouderen", "父母与长者", "両親と年長者", "부모와 어르신", "माता-पिता और बुज़ुर्ग"],
    morals: ["Il nobile carattere", "O nobre caráter", "Het edele karakter", "高尚的品格", "高潔な人格", "고귀한 성품", "उच्च चरित्र"]
  };
  // carte (nom ou identifiant) → [texte, titre de flyer]
  var CARTES = {
    "misericorde-fr": ["f_mercy", "mercy"], "mercy-en": ["f_mercy", "mercy"], "sonrisa-es": ["f_mercy", "smile"],
    "femme-fr": ["f_woman", "woman"], "mujer-es": ["f_woman", "woman"], "parents-fr": ["f_parents", "parents"],
    "haute-moralite-fr": ["f_morals", "morals"], "alta-moralidad-es": ["f_morals", "morals"],
    "Quran.com": ["q_qurancom"], "QuranEnc — Encyclopedia of translations": ["q_enc"], "Tanzil — translations": ["q_tanzil"],
    "King Fahd Quran Complex": ["q_fahd"], "Le-Coran.com": ["q_lecoran"], "Quran.com — Français": ["q_qurancom"],
    "Quran.com — Español": ["q_qurancom"], "Quran for All": ["q_forall"], "Audio — English translation": ["q_audio"],
    "Audio — Traduction française": ["q_audio"], "Audio — Traducción española": ["q_audio"], "Audio — Deutsche Übersetzung": ["q_audio"],
    "MP3 Quran": ["q_mp3"],
    "Quran.com Radio": ["m_qradio"], "Radio Islam International": ["m_radioislam"], "Channel Islam International": ["m_cii"],
    "Huda TV": ["m_huda"], "Islam Channel": ["m_islamchannel"], "Radio ZamZam": ["m_zamzam"],
    "SNRT Live — Radio Mohammed VI du Saint Coran": ["m_snrt"], "Radio Islámico": ["m_islamico"], "Koran-Audio auf Deutsch": ["q_audio"],
    "MP3 Quran Radios": ["m_mp3radios"],
    "Mosquées de Tunisie et du monde": ["l_mosq"], "IslamReligion.com": ["l_islamreligion"], "IslamHouse": ["l_islamhouse"],
    "WhyIslam": ["l_whyislam"], "NewMuslims.com": ["l_newmuslims"], "Sunnah.com": ["l_sunnah"], "IslamWeb": ["l_islamweb"],
    "Zentralrat der Muslime — islam.de": ["l_islamde"], "IslamiQ": ["l_islamiq"]
  };
  ["flyers", "quran", "media", "links"].forEach(function (s) {
    D[s].forEach(function (c) {
      var k = CARTES[c.name || c.id];
      if (!k) return;
      L.forEach(function (l, i) {
        if (!c.desc[l]) c.desc[l] = X[k[0]][i];
        if (k[1] && c.title && !c.title[l]) c.title[l] = TITRES[k[1]][i] + " (" + T[l].langNames[c.lang] + ")";
      });
    });
  });

  // ───────── Le Coran traduit dans chacune des nouvelles langues (liens vérifiés le 12/10/2026) ─────────
  [
    ["it", "Il Corano — traduzione italiana", "it/browse/italian_rwwad"],
    ["pt", "O Alcorão — tradução portuguesa", "pt/browse/portuguese_nasr"],
    ["nl", "De Koran — Nederlandse vertaling", "nl/browse/dutch_center"],
    ["zh", "古兰经 — 中文译解", "en/browse/chinese_makin"],
    ["ja", "クルアーン — 日本語訳", "en/browse/japanese_saeedsato"],
    ["ko", "꾸란 — 한국어 번역", "en/browse/korean_rwwad"],
    ["hi", "क़ुरआन — हिंदी अनुवाद", "en/browse/hindi_omari"]
  ].forEach(function (q) {
    D.quran.push({ name: q[1], url: "https://quranenc.com/" + q[2], lang: q[0], kind: "read", descKey: "quranTransDesc" });
  });

  // ───────── Adresse du même site dans la langue du visiteur, quand elle existe (vérifié le 12/10/2026) ─────────
  function adresses(nom, urls) {
    ["quran", "links"].forEach(function (s) {
      D[s].forEach(function (c) { if (c.name === nom) c.localUrl = Object.assign(c.localUrl || {}, urls); });
    });
  }
  adresses("Quran.com", { fr: "https://quran.com/fr", es: "https://quran.com/es", it: "https://quran.com/it", pt: "https://quran.com/pt", nl: "https://quran.com/nl", zh: "https://quran.com/zh" });
  adresses("IslamHouse", { it: "https://islamhouse.com/it/", pt: "https://islamhouse.com/pt/", nl: "https://islamhouse.com/nl/", zh: "https://islamhouse.com/zh/", ja: "https://islamhouse.com/ja/", ko: "https://islamhouse.com/ko/", hi: "https://islamhouse.com/hi/" });
  adresses("IslamReligion.com", { it: "https://www.islamreligion.com/it/", pt: "https://www.islamreligion.com/pt/", zh: "https://www.islamreligion.com/cn/", ja: "https://www.islamreligion.com/jp/", hi: "https://www.islamreligion.com/hi/" });
})();

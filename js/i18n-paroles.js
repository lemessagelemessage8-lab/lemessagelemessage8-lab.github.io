// Textes de la page « Paroles du Prophète » (paroles-du-prophete/) et de sa carte sur l'accueil, dans les 11 langues.
// Ce sont nos textes de présentation ; les versets et les hadiths, eux, viennent de js/paroles.js (traductions officielles).
(function () {
  var T = window.I18N;
  var L = ["en", "fr", "es", "de", "it", "pt", "nl", "zh", "ja", "ko", "hi"];   // ordre des textes dans chaque liste
  var X = {
    navProphet: ["The Prophet's words", "Paroles du Prophète", "Palabras del Profeta", "Worte des Propheten", "Parole del Profeta", "Palavras do Profeta", "Woorden van de Profeet", "先知的话", "預言者の言葉", "예언자의 말씀", "पैग़ंबर के वचन"],
    pTitle: ["Words of the Prophet ﷺ", "Paroles du Prophète ﷺ", "Palabras del Profeta ﷺ", "Worte des Propheten ﷺ", "Parole del Profeta ﷺ", "Palavras do Profeta ﷺ", "Woorden van de Profeet ﷺ", "先知 ﷺ 的话", "預言者 ﷺ の言葉", "예언자 ﷺ 의 말씀", "पैग़ंबर ﷺ के वचन"],
    pLead: [
      "What the Prophet Muhammad ﷺ said about Mary, the mother of Jesus, and about those who embrace Islam — with the sources.",
      "Ce que le Prophète Muhammad ﷺ a dit de Marie, la mère de Jésus, et de celles et ceux qui embrassent l'Islam — avec les sources.",
      "Lo que el Profeta Muhammad ﷺ dijo sobre María, la madre de Jesús, y sobre quienes abrazan el Islam — con las fuentes.",
      "Was der Prophet Muhammad ﷺ über Maria, die Mutter Jesu, und über jene gesagt hat, die den Islam annehmen – mit Quellen.",
      "Ciò che il Profeta Muhammad ﷺ ha detto di Maria, la madre di Gesù, e di coloro che abbracciano l'Islam — con le fonti.",
      "O que o Profeta Muhammad ﷺ disse sobre Maria, a mãe de Jesus, e sobre aqueles que abraçam o Islã — com as fontes.",
      "Wat de profeet Mohammed ﷺ heeft gezegd over Maria, de moeder van Jezus, en over wie de islam aanneemt — met de bronnen.",
      "先知穆罕默德 ﷺ 关于尔撒（耶稣）之母麦尔彦（马利亚）以及皈依伊斯兰教者所说的话——附出处。",
      "預言者ムハンマド ﷺ が、イエスの母マリアについて、そしてイスラームを受け入れる人々について語った言葉。出典つき。",
      "예언자 무함마드 ﷺ 가 예수의 어머니 마리아에 대해, 그리고 이슬람을 받아들이는 사람들에 대해 하신 말씀. 출처와 함께.",
      "पैग़ंबर मुहम्मद ﷺ ने ईसा की माँ मरयम के बारे में और इस्लाम अपनाने वालों के बारे में क्या कहा — स्रोतों के साथ।"
    ],
    pMaryTitle: ["Mary (Maryam), mother of Jesus", "Marie (Maryam), mère de Jésus", "María (Maryam), madre de Jesús", "Maria (Maryam), die Mutter Jesu", "Maria (Maryam), madre di Gesù", "Maria (Maryam), mãe de Jesus", "Maria (Maryam), de moeder van Jezus", "麦尔彦（马利亚），尔撒（耶稣）之母", "マルヤム（マリア）、イエスの母", "마르얌(마리아), 예수의 어머니", "मरयम, ईसा की माँ"],
    pMaryIntro: [
      "Mary (Maryam in Arabic) is the most honoured woman in Islam. An entire chapter of the Quran bears her name, and she is the only woman the Quran mentions by name. Muslims believe in the miraculous birth of her son Jesus, whom they recognise as a great prophet and the Messiah.",
      "Marie (Maryam en arabe) est la femme la plus honorée de l'Islam. Une sourate entière du Coran porte son nom, et elle est la seule femme que le Coran cite par son nom. Les musulmans croient à la naissance miraculeuse de son fils Jésus, qu'ils reconnaissent comme un grand prophète et comme le Messie.",
      "María (Maryam en árabe) es la mujer más honrada del Islam. Un capítulo entero del Corán lleva su nombre, y es la única mujer a la que el Corán menciona por su nombre. Los musulmanes creen en el nacimiento milagroso de su hijo Jesús, a quien reconocen como un gran profeta y como el Mesías.",
      "Maria (arabisch Maryam) ist die am meisten geehrte Frau im Islam. Eine ganze Sure des Korans trägt ihren Namen, und sie ist die einzige Frau, die der Koran beim Namen nennt. Muslime glauben an die wundersame Geburt ihres Sohnes Jesus, den sie als großen Propheten und als den Messias anerkennen.",
      "Maria (Maryam in arabo) è la donna più onorata dell'Islam. Un intero capitolo del Corano porta il suo nome, ed è l'unica donna che il Corano cita per nome. I musulmani credono nella nascita miracolosa di suo figlio Gesù, che riconoscono come un grande profeta e come il Messia.",
      "Maria (Maryam em árabe) é a mulher mais honrada do Islã. Um capítulo inteiro do Alcorão leva o seu nome, e ela é a única mulher que o Alcorão menciona pelo nome. Os muçulmanos creem no nascimento milagroso do seu filho Jesus, a quem reconhecem como um grande profeta e como o Messias.",
      "Maria (Maryam in het Arabisch) is de meest geëerde vrouw in de islam. Een heel hoofdstuk van de Koran draagt haar naam, en zij is de enige vrouw die de Koran bij naam noemt. Moslims geloven in de wonderbaarlijke geboorte van haar zoon Jezus, die zij erkennen als een groot profeet en als de Messias.",
      "麦尔彦（阿拉伯语对马利亚的称呼）是伊斯兰教中最受尊崇的女性。《古兰经》中有一整章以她的名字命名，她也是《古兰经》中唯一被提到名字的女性。穆斯林相信她的儿子尔撒（耶稣）是奇迹般诞生的，并承认他是一位伟大的先知，是麦西哈（弥赛亚）。",
      "マルヤム（アラビア語でマリアのこと）は、イスラームで最も尊ばれている女性です。クルアーンには彼女の名を冠した章があり、クルアーンが名前を挙げている唯一の女性でもあります。ムスリムは、その息子イエスの奇跡的な誕生を信じ、イエスを偉大な預言者、そしてメシアと認めています。",
      "마르얌(아랍어로 마리아)은 이슬람에서 가장 존경받는 여성입니다. 꾸란에는 그녀의 이름을 딴 장이 있으며, 꾸란이 이름을 밝혀 언급하는 유일한 여성이기도 합니다. 무슬림은 그녀의 아들 예수의 기적적인 탄생을 믿으며, 예수를 위대한 예언자이자 메시아로 인정합니다.",
      "मरयम इस्लाम में सबसे अधिक सम्मानित महिला हैं। क़ुरआन की एक पूरी सूरह उनके नाम पर है, और वे अकेली महिला हैं जिनका क़ुरआन में नाम लेकर ज़िक्र हुआ है। मुसलमान उनके बेटे ईसा के चमत्कारी जन्म पर ईमान रखते हैं और उन्हें एक महान पैग़ंबर और मसीह मानते हैं।"
    ],
    pQuranSays: ["What the Quran says", "Ce que dit le Coran", "Lo que dice el Corán", "Was der Koran sagt", "Che cosa dice il Corano", "O que diz o Alcorão", "Wat de Koran zegt", "《古兰经》怎么说", "クルアーンの言葉", "꾸란의 말씀", "क़ुरआन क्या कहता है"],
    pProphetSays: ["What the Prophet ﷺ said", "Ce qu'a dit le Prophète ﷺ", "Lo que dijo el Profeta ﷺ", "Was der Prophet ﷺ gesagt hat", "Che cosa ha detto il Profeta ﷺ", "O que disse o Profeta ﷺ", "Wat de Profeet ﷺ heeft gezegd", "先知 ﷺ 怎么说", "預言者 ﷺ の言葉", "예언자 ﷺ 의 말씀", "पैग़ंबर ﷺ ने क्या कहा"],
    pConvTitle: ["For those who embrace Islam", "Pour ceux qui embrassent l'Islam", "Para quienes abrazan el Islam", "Für alle, die den Islam annehmen", "Per chi abbraccia l'Islam", "Para quem abraça o Islã", "Voor wie de islam aanneemt", "致皈依伊斯兰教的人", "イスラームを受け入れる人へ", "이슬람을 받아들이는 분들께", "इस्लाम अपनाने वालों के लिए"],
    pConvIntro: [
      "Embracing Islam is a fresh start: past wrongs are forgiven, and the good already done is kept.",
      "Embrasser l'Islam, c'est commencer une page blanche : les fautes passées sont pardonnées, et le bien déjà accompli est conservé.",
      "Abrazar el Islam es empezar una página en blanco: las faltas pasadas quedan perdonadas y el bien ya realizado se conserva.",
      "Den Islam anzunehmen ist ein Neuanfang: Vergangene Verfehlungen werden vergeben, und das bereits getane Gute bleibt erhalten.",
      "Abbracciare l'Islam è cominciare una pagina bianca: le colpe passate sono perdonate e il bene già compiuto viene conservato.",
      "Abraçar o Islã é começar uma página em branco: as faltas do passado são perdoadas e o bem já praticado é preservado.",
      "De islam aannemen is een nieuw begin: de fouten uit het verleden worden vergeven en het goede dat al gedaan is, blijft behouden.",
      "皈依伊斯兰教是一个全新的开始：过去的过错得到饶恕，已经做过的善事依然保留。",
      "イスラームを受け入れることは、新しい出発です。過去の過ちは赦され、すでに行った善い行いはそのまま残ります。",
      "이슬람을 받아들이는 것은 새로운 시작입니다. 지난 잘못은 용서받고, 이미 행한 선은 그대로 남습니다.",
      "इस्लाम अपनाना एक नई शुरुआत है: पिछली ग़लतियाँ माफ़ कर दी जाती हैं और जो भलाई पहले की गई थी वह बाक़ी रहती है।"
    ],
    pHowTitle: ["How does one become a Muslim?", "Comment devient-on musulman ?", "¿Cómo se hace uno musulmán?", "Wie wird man Muslim?", "Come si diventa musulmani?", "Como alguém se torna muçulmano?", "Hoe word je moslim?", "怎样成为穆斯林？", "ムスリムになるには", "어떻게 무슬림이 되나요?", "कोई मुसलमान कैसे बनता है?"],
    pHowText: [
      "A person becomes a Muslim by saying the testimony of faith, sincerely and by conviction:",
      "On devient musulman en prononçant l'attestation de foi, sincèrement et par conviction :",
      "Uno se hace musulmán al pronunciar el testimonio de fe, con sinceridad y por convicción:",
      "Man wird Muslim, indem man das Glaubensbekenntnis aufrichtig und aus Überzeugung spricht:",
      "Si diventa musulmani pronunciando la testimonianza di fede, con sincerità e per convinzione:",
      "Alguém se torna muçulmano ao pronunciar o testemunho de fé, com sinceridade e por convicção:",
      "Je wordt moslim door de geloofsgetuigenis oprecht en uit overtuiging uit te spreken:",
      "一个人真诚而坚信地念出作证词，就成为了穆斯林：",
      "信仰告白を、心から確信をもって唱えることで、人はムスリムになります。",
      "신앙 고백을 진심으로, 확신을 가지고 말하면 무슬림이 됩니다.",
      "जब कोई व्यक्ति सच्चे दिल और पूरे यक़ीन के साथ गवाही के ये शब्द कहता है, तो वह मुसलमान बन जाता है:"
    ],
    pShahada: [
      "“I bear witness that there is no god but God, and I bear witness that Muhammad is the Messenger of God.”",
      "« J'atteste qu'il n'y a de dieu que Dieu, et j'atteste que Muhammad est le Messager de Dieu. »",
      "«Atestiguo que no hay más dios que Dios, y atestiguo que Muhammad es el Mensajero de Dios.»",
      "„Ich bezeuge, dass es keinen Gott gibt außer Gott, und ich bezeuge, dass Muhammad der Gesandte Gottes ist.“",
      "«Attesto che non c'è altro dio all'infuori di Dio, e attesto che Muhammad è il Messaggero di Dio.»",
      "«Testemunho que não há outro deus além de Deus, e testemunho que Muhammad é o Mensageiro de Deus.»",
      "‘Ik getuig dat er geen god is dan God, en ik getuig dat Mohammed de Boodschapper van God is.’",
      "“我作证：除真主外，绝无应受崇拜的；我又作证：穆罕默德是真主的使者。”",
      "「私は証言します。アッラーのほかに神はないと。また私は証言します。ムハンマドはアッラーの使徒であると。」",
      "“저는 하나님 외에는 신이 없음을 증언하며, 무함마드는 하나님의 사도임을 증언합니다.”",
      "“मैं गवाही देता हूँ कि अल्लाह के सिवा कोई पूज्य नहीं, और मैं गवाही देता हूँ कि मुहम्मद अल्लाह के रसूल हैं।”"
    ],
    pOfficial: ["Official translation — HadeethEnc.com", "Traduction officielle — HadeethEnc.com", "Traducción oficial — HadeethEnc.com", "Offizielle Übersetzung – HadeethEnc.com", "Traduzione ufficiale — HadeethEnc.com", "Tradução oficial — HadeethEnc.com", "Officiële vertaling — HadeethEnc.com", "正式译文 — HadeethEnc.com", "公式翻訳 — HadeethEnc.com", "공식 번역 — HadeethEnc.com", "आधिकारिक अनुवाद — HadeethEnc.com"],
    pUnofficial: [
      "Unofficial translation made for this site from the official English translation. It is only a translation: please refer to the official source.",
      "Traduction non officielle, faite pour ce site à partir de la traduction anglaise officielle. Ce n'est qu'une traduction : reportez-vous à la source officielle.",
      "Traducción no oficial, hecha para este sitio a partir de la traducción inglesa oficial. Es solo una traducción: consulta la fuente oficial.",
      "Inoffizielle Übersetzung, für diese Website aus der offiziellen englischen Übersetzung angefertigt. Es ist nur eine Übersetzung: Bitte ziehen Sie die offizielle Quelle heran.",
      "Traduzione non ufficiale, realizzata per questo sito a partire dalla traduzione inglese ufficiale. È solo una traduzione: fai riferimento alla fonte ufficiale.",
      "Tradução não oficial, feita para este site a partir da tradução inglesa oficial. É apenas uma tradução: consulte a fonte oficial.",
      "Niet-officiële vertaling, voor deze website gemaakt op basis van de officiële Engelse vertaling. Het is slechts een vertaling: raadpleeg de officiële bron.",
      "非正式译文，由本站根据正式英文译本翻译而成。这仅仅是一种翻译，请以正式来源为准。",
      "非公式の翻訳です。公式の英語訳をもとに、このサイトのために訳したものです。あくまで翻訳ですので、公式の出典をご確認ください。",
      "비공식 번역입니다. 공식 영어 번역을 바탕으로 이 사이트를 위해 옮긴 것입니다. 번역일 뿐이므로 공식 출처를 확인해 주세요.",
      "अनौपचारिक अनुवाद, जो इस साइट के लिए आधिकारिक अंग्रेज़ी अनुवाद से किया गया है। यह केवल एक अनुवाद है: कृपया आधिकारिक स्रोत देखें।"
    ],
    pSeeSource: ["See the official source", "Voir la source officielle", "Ver la fuente oficial", "Zur offiziellen Quelle", "Vedi la fonte ufficiale", "Ver a fonte oficial", "Naar de officiële bron", "查看正式来源", "公式の出典を見る", "공식 출처 보기", "आधिकारिक स्रोत देखें"],
    pBack: ["Back to the home page", "Retour à l'accueil", "Volver al inicio", "Zurück zur Startseite", "Torna alla pagina iniziale", "Voltar ao início", "Terug naar de startpagina", "返回首页", "ホームに戻る", "처음으로 돌아가기", "मुख्य पृष्ठ पर वापस"],
    pAsk: ["A question? Write to us", "Une question ? Écrivez-nous", "¿Una pregunta? Escríbenos", "Eine Frage? Schreiben Sie uns", "Una domanda? Scrivici", "Uma pergunta? Escreva para nós", "Een vraag? Schrijf ons", "有疑问？请给我们留言", "ご質問はこちらへ", "질문이 있으신가요? 글을 남겨 주세요", "कोई प्रश्न? हमें लिखिए"],
    pCardText: [
      "Mary, the mother of Jesus, in the Quran and in the words of the Prophet ﷺ — and the good news for those who embrace Islam.",
      "Marie, la mère de Jésus, dans le Coran et dans les paroles du Prophète ﷺ — et la bonne nouvelle pour ceux qui embrassent l'Islam.",
      "María, la madre de Jesús, en el Corán y en las palabras del Profeta ﷺ — y la buena noticia para quienes abrazan el Islam.",
      "Maria, die Mutter Jesu, im Koran und in den Worten des Propheten ﷺ – und die frohe Botschaft für alle, die den Islam annehmen.",
      "Maria, la madre di Gesù, nel Corano e nelle parole del Profeta ﷺ — e la buona notizia per chi abbraccia l'Islam.",
      "Maria, a mãe de Jesus, no Alcorão e nas palavras do Profeta ﷺ — e a boa notícia para quem abraça o Islã.",
      "Maria, de moeder van Jezus, in de Koran en in de woorden van de Profeet ﷺ — en het goede nieuws voor wie de islam aanneemt.",
      "《古兰经》和先知 ﷺ 的话中的麦尔彦（马利亚）——以及给皈依伊斯兰教者的喜讯。",
      "クルアーンと預言者 ﷺ の言葉に見るマリア。そして、イスラームを受け入れる人への良い知らせ。",
      "꾸란과 예언자 ﷺ 의 말씀 속 마리아, 그리고 이슬람을 받아들이는 분들을 위한 기쁜 소식.",
      "क़ुरआन और पैग़ंबर ﷺ के वचनों में मरयम — और इस्लाम अपनाने वालों के लिए ख़ुशख़बरी।"
    ]
  };
  L.forEach(function (l, i) { Object.keys(X).forEach(function (k) { T[l][k] = X[k][i]; }); });
})();

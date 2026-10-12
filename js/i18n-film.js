// Textes de la section « Le film The Message (1976) » dans les 11 langues.
(function () {
  var T = window.I18N;
  var L = ["en", "fr", "es", "de", "it", "pt", "nl", "zh", "ja", "ko", "hi"];
  var X = {
    navFilm: ["The film", "Le film", "La película", "Der Film", "Il film", "O filme", "De film", "电影", "映画", "영화", "फ़िल्म"],
    filmTitle: ["The film “The Message” (1976)", "Le film « The Message » (1976)", "La película «The Message» (1976)", "Der Film „The Message“ (1976)", "Il film «The Message» (1976)", "O filme «The Message» (1976)", "De film ‘The Message’ (1976)", "电影《The Message》（1976）", "映画『The Message』（1976年）", "영화 <The Message> (1976)", "फ़िल्म “The Message” (1976)"],
    filmText: [
      "Moustapha Akkad's film tells the story of the birth of Islam and of the message brought by the Prophet Muhammad ﷺ. Out of respect, the Prophet is never shown or heard in it. The English version stars Anthony Quinn and Irene Papas; the film was restored in 4K in 2018, and this site takes its name from it.",
      "Le film de Moustapha Akkad raconte la naissance de l'Islam et le message apporté par le Prophète Muhammad ﷺ. Par respect, le Prophète n'y est jamais montré ni entendu. La version anglaise est jouée par Anthony Quinn et Irène Papas ; le film a été restauré en 4K en 2018, et ce site lui doit son nom.",
      "La película de Moustapha Akkad cuenta el nacimiento del Islam y el mensaje que trajo el Profeta Muhammad ﷺ. Por respeto, el Profeta nunca aparece ni se le oye. La versión inglesa está interpretada por Anthony Quinn e Irene Papas; la película fue restaurada en 4K en 2018, y este sitio le debe su nombre.",
      "Der Film von Moustapha Akkad erzählt von der Entstehung des Islam und von der Botschaft, die der Prophet Muhammad ﷺ gebracht hat. Aus Respekt ist der Prophet darin weder zu sehen noch zu hören. In der englischen Fassung spielen Anthony Quinn und Irene Papas; der Film wurde 2018 in 4K restauriert, und diese Website verdankt ihm ihren Namen.",
      "Il film di Moustapha Akkad racconta la nascita dell'Islam e il messaggio portato dal Profeta Muhammad ﷺ. Per rispetto, il Profeta non vi è mai mostrato né si sente la sua voce. La versione inglese è interpretata da Anthony Quinn e Irene Papas; il film è stato restaurato in 4K nel 2018, e questo sito gli deve il nome.",
      "O filme de Moustapha Akkad conta o nascimento do Islã e a mensagem trazida pelo Profeta Muhammad ﷺ. Por respeito, o Profeta nunca é mostrado nem ouvido. A versão inglesa é interpretada por Anthony Quinn e Irene Papas; o filme foi restaurado em 4K em 2018, e este site deve a ele o seu nome.",
      "De film van Moustapha Akkad vertelt over het ontstaan van de islam en de boodschap die de profeet Mohammed ﷺ bracht. Uit respect is de Profeet er nooit in te zien of te horen. In de Engelse versie spelen Anthony Quinn en Irene Papas; de film is in 2018 in 4K gerestaureerd, en deze website dankt er haar naam aan.",
      "穆斯塔法·阿卡德执导的这部电影讲述了伊斯兰教的诞生，以及先知穆罕默德 ﷺ 带来的讯息。出于尊重，影片中从不出现先知的形象和声音。英语版由安东尼·奎恩和艾琳·帕帕斯主演；影片于 2018 年完成 4K 修复，本站的名字正是来自这部电影。",
      "ムスタファ・アッカド監督のこの映画は、イスラームの誕生と、預言者ムハンマド ﷺ がもたらしたメッセージを描いています。敬意から、預言者の姿も声も作中には一切登場しません。英語版の主演はアンソニー・クインとイレーネ・パパス。2018年に4Kで修復されました。このサイトの名前は、この映画に由来します。",
      "무스타파 아카드 감독의 이 영화는 이슬람의 탄생과 예언자 무함마드 ﷺ 가 전한 메시지를 그립니다. 존경의 뜻으로, 영화에는 예언자의 모습도 목소리도 나오지 않습니다. 영어판에는 앤서니 퀸과 이레네 파파스가 출연하며, 2018년에 4K로 복원되었습니다. 이 사이트의 이름도 이 영화에서 따왔습니다.",
      "मुस्तफ़ा अक़्क़ाद की यह फ़िल्म इस्लाम के आरंभ और पैग़ंबर मुहम्मद ﷺ के लाए हुए संदेश की कहानी कहती है। सम्मान के कारण फ़िल्म में पैग़ंबर को न कभी दिखाया गया है और न उनकी आवाज़ सुनाई गई है। अंग्रेज़ी संस्करण में एंथनी क्विन और आइरीन पापास हैं; फ़िल्म को 2018 में 4K में दोबारा तैयार किया गया, और इस साइट का नाम इसी फ़िल्म से लिया गया है।"
    ],
    filmFull: ["Watch the full film, free (in English)", "Voir le film complet, gratuit (en anglais)", "Ver la película completa, gratis (en inglés)", "Den ganzen Film kostenlos ansehen (auf Englisch)", "Guarda il film completo, gratis (in inglese)", "Assistir ao filme completo, grátis (em inglês)", "Bekijk de hele film gratis (in het Engels)", "免费观看完整影片（英语）", "全編を無料で見る（英語）", "전체 영화 무료로 보기 (영어)", "पूरी फ़िल्म मुफ़्त देखें (अंग्रेज़ी में)"],
    filmFullLocal: ["", "", "", "", "", "", "", "", "", "", "पूरी फ़िल्म हिंदी में मुफ़्त देखें"],
    filmTrailer: ["Official trailer", "Bande-annonce officielle", "Tráiler oficial", "Offizieller Trailer", "Trailer ufficiale", "Trailer oficial", "Officiële trailer", "官方预告片", "公式予告編", "공식 예고편", "आधिकारिक ट्रेलर"],
    filmSearchEn: ["Search for the full film in English on YouTube", "Chercher le film complet en anglais sur YouTube", "Buscar la película completa en inglés en YouTube", "Den ganzen Film auf Englisch bei YouTube suchen", "Cerca il film completo in inglese su YouTube", "Procurar o filme completo em inglês no YouTube", "Zoek de hele film in het Engels op YouTube", "在 YouTube 上搜索英语完整版", "YouTubeで英語版の全編を探す", "YouTube에서 영어판 전체 영화 찾기", "YouTube पर अंग्रेज़ी में पूरी फ़िल्म खोजें"],
    filmSearchLocal: ["", "Chercher la version française sur YouTube", "Buscar la versión en español en YouTube", "Die deutsche Fassung bei YouTube suchen", "Cerca la versione italiana su YouTube", "Procurar a versão em português no YouTube", "", "", "", "", "YouTube पर हिंदी संस्करण खोजें"],
    filmNote: [
      "The film is free to watch on YouTube (2 h 53). If the video no longer works, use the search button.",
      "Le film est gratuit sur YouTube (2 h 53). Si la vidéo ne marche plus, utilisez le bouton de recherche.",
      "La película es gratuita en YouTube (2 h 53). Si el vídeo deja de funcionar, usa el botón de búsqueda.",
      "Der Film ist kostenlos auf YouTube zu sehen (2 Std. 53 Min.). Falls das Video nicht mehr funktioniert, nutzen Sie die Suchschaltfläche.",
      "Il film è gratuito su YouTube (2 h 53). Se il video non funziona più, usa il pulsante di ricerca.",
      "O filme é gratuito no YouTube (2 h 53). Se o vídeo deixar de funcionar, use o botão de busca.",
      "De film is gratis te zien op YouTube (2 u 53). Werkt de video niet meer, gebruik dan de zoekknop.",
      "影片可在 YouTube 上免费观看（2 小时 53 分钟）。如果视频无法播放，请使用搜索按钮。",
      "映画はYouTubeで無料で見られます（2時間53分）。動画が再生できない場合は、検索ボタンをご利用ください。",
      "영화는 YouTube에서 무료로 볼 수 있습니다(2시간 53분). 영상이 재생되지 않으면 검색 버튼을 이용해 주세요.",
      "फ़िल्म YouTube पर मुफ़्त देखी जा सकती है (2 घंटे 53 मिनट)। अगर वीडियो न चले, तो खोज बटन का उपयोग करें।"
    ]
  };
  L.forEach(function (l, i) { Object.keys(X).forEach(function (k) { T[l][k] = X[k][i]; }); });
})();

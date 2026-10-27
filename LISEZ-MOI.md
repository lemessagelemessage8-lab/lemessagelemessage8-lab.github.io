# Le Message — الرسالة

Site statique (HTML/CSS/JS, aucun serveur ni base de données) pour présenter l'Islam et le message du Coran
aux non-musulmans, en anglais, français, espagnol et allemand.

## Voir le site
Double-cliquez sur `index.html`. Pour le mettre en ligne gratuitement : glissez le dossier `site/` sur
https://app.netlify.com/drop (ou GitHub Pages / Cloudflare Pages).

## Ce qu'il faut modifier
| Quoi | Où |
|---|---|
| E-mail de contact, formulaire, musique | `js/config.js` |
| Flyers, Corans, radios/médias, liens utiles | `js/data.js` |
| Tous les textes (4 langues) et les thèmes | `js/i18n.js` |
| Couleurs / mise en page | `css/style.css` |

### Musique d'accueil
La musique est la vidéo YouTube officielle « The Message » de Maurice Jarre (publiée par Trancas
International Films, la société de Moustapha Akkad). Elle se lance quand le visiteur clique sur
« Entrer avec la musique » ; un petit lecteur apparaît en bas à droite (YouTube exige qu'il reste visible).
Le bouton ♪ en haut lance/arrête la musique. Pour changer de vidéo : `youtubeVideoId` dans `js/config.js`.

⚠ YouTube refuse de jouer quand on ouvre `index.html` en double-cliquant (adresse `file://`).
La musique marche une fois le site en ligne, ou en local avec : `python -m http.server` dans le dossier
`site/`, puis http://localhost:8000

### Formulaire « Questions & suggestions »
Sans réglage, il ouvre la messagerie du visiteur vers `contactEmail`.
Pour recevoir les messages directement : créez un formulaire gratuit sur https://formspree.io
et collez son adresse dans `formEndpoint`.

### Ajouter un flyer (25/10/2026 : tampon « message.clicvia.com » + QR code obligatoire)
1. Rangez l'ORIGINAL hors du site, dans le dépôt privé projets-ahmed : `Le message/flyers originaux/<id>/original.pdf`
   + une image par page `page-1.jpg`, `page-2.jpg`… (pour un Excel : Fichier › Exporter › PDF, « Ajuster la feuille sur une page »).
2. Sur le PC, dans `site/` : `python tools/flyers.py <id>` → fabrique dans `flyers/` les pages et le PDF TAMPONNÉS (une bande verte
   avec le QR code et l'adresse du site est ajoutée SOUS chaque page : rien du flyer n'est caché) et met à jour `flyers/tampons.json`.
3. Ajoutez une entrée dans `flyers:` de `js/data.js` (`lang` = langue du flyer ; `pages` = liste des images si plus de 2 pages ;
   `source` si ce n'est pas notre flyer ; titre et description dans les 19 langues).
4. `node tools/test_site.mjs` : refuse un flyer sans tampon (taille différente de tampons.json) ou une page manquante.
Le site range les flyers PAR LANGUE (un titre par langue, la langue du visiteur d'abord) ; le lecteur fait défiler toutes les pages.

### Flyers espagnols ajoutés le 25/10/2026
10 dépliants de 6 pages de l'Islamic Information Center (Dubaï), série « L.25 SPANISH » (janvier 2026, « FREE COPY ») :
https://iicelibrary.com/wp-content/uploads/L25_SPANISH_AboutIslamFlyers-Web.pdf — chaque page du PDF montre à gauche une colonne
« CONTENTS » (vignettes des autres flyers) : elle est coupée (x ≥ 202 pt) ; les 10 flyers sont dans `flyers originaux/<id>-es/`.

### Ajouter une langue (arabe, italien, turc…)
Copiez un bloc de `js/i18n.js` (ex. `fr`), changez la clé, traduisez, et ajoutez l'option
dans les deux sélecteurs de langue de `index.html`. Pour l'arabe, ajouter aussi `dir="rtl"`.

### Partage
Chaque thème, flyer, Coran et radio a un bouton « Partager » (partage natif sur téléphone ;
WhatsApp, Facebook, X, Telegram, e-mail ou copie du lien sur ordinateur). Le lien partagé
ouvre le site directement sur l'élément, dans la bonne langue.

## Adresse, visibilité et tests (12/10/2026)
- Adresse du site : https://message.clicvia.com/ (fichier `CNAME` ; l'ancienne adresse github.io redirige).
- Pour Google : `robots.txt`, `sitemap.xml`, titres et descriptions par langue (`pageTitle`, `metaDesc` dans `js/i18n.js`),
  questions-réponses (FAQ) et image d'aperçu de partage `assets/og-image-v1.jpg` dans `index.html`.
- Bouton rond « Partager » dans l'en-tête ; statistiques GoatCounter (sans cookies), rangées sous `/le-message`.
- Tests : `node tools/test_site.mjs` (relancés par GitHub à chaque envoi, `.github/workflows/tests.yml`).

## 11 langues (12/10/2026)
Le site s'appelle « The Message » dans toutes les langues (nom arabe الرسالة à côté). Il s'adresse aux non-musulmans : pas de version arabe.
Langues : anglais, français, espagnol, allemand (`js/i18n.js`), italien, portugais, néerlandais (`js/i18n-plus.js`),
chinois, japonais, coréen, hindi (`js/i18n-asie.js`). Descriptions des cartes pour ces 7 langues : `js/data-plus.js`.
Ajouter une langue : un bloc de textes, une colonne dans `js/data-plus.js`, puis le bouton, l'option et le lien `hreflang`
dans `index.html`, une ligne dans `sitemap.xml` et le code dans `LANGUES` de `tools/test_site.mjs`.
Les traductions ont été écrites par Claude : à faire relire par une personne dont c'est la langue.

## 19 langues (13/10/2026, demande d'Ahmed)
Ajout de 8 langues : turc, indonésien, russe, vietnamien, thaï, filipino, suédois, roumain — les mêmes que nos sites Mosquées et
Points d'eau, **sans l'arabe ni l'ourdou** (choix d'Ahmed : le site s'adresse d'abord aux non-musulmans).
- Textes : `js/i18n-monde-1.js` (tr, id), `-2.js` (ru, vi), `-3.js` (th, tl), `-4.js` (sv, ro). Chaque langue a UN bloc avec tout :
  textes du site, film, page « Paroles du Prophète », puis `cartes` (descriptions des cartes), `titres` (flyers) et `coran`.
  `js/data-monde.js` pose ces textes sur les cartes de `js/data.js` (à charger après `js/data-plus.js`).
- Versets : traduction officielle QuranEnc de chaque langue (`tools/versets.py` : turkish_shaban, indonesian_affairs, russian_rwwad,
  vietnamese_rwwad, thai_rwwad, tagalog_rwwad, swedish_rwwad, romanian_project). Dans les blocs de textes, les versets sont les
  textes exacts de `js/versets.js` (le test le vérifie) : ne jamais les réécrire à la main.
- Hadiths : officiels HadeethEnc pour les 8 langues, sauf les deux hadiths sur Marie (11179, 10994) qui n'existent pas encore en
  tr, vi, th, tl, sv, ro : traduction non officielle signalée sur la page (`MAISON` dans `tools/paroles.py`) ; relancer
  `python tools/paroles.py --telecharger` de temps en temps pour prendre la version officielle quand elle paraît.
- Ajouter une langue maintenant : un bloc dans un fichier `js/i18n-monde-*.js` (et son code dans la liste à la fin de `-4.js` et dans
  `L` de `js/data-monde.js`), les noms de langue (`PLUS` de `-1.js` + `langNames` de chaque bloc), `SOURCES`/`EXTRAITS`/`GUILLEMETS`
  de `tools/versets.py`, puis bouton, option et `hreflang` dans les deux pages, `sitemap.xml`, `LANGUES` de `tools/test_site.mjs`,
  et `python tools/version.py <version>`.

## Versets : traductions officielles (12/10/2026, demande d'Ahmed)
Les versets ne sont JAMAIS traduits par nous. Ils sont copiés mot pour mot d'une traduction officielle du Coran pour chaque
langue (Encyclopédie du Noble Coran, QuranEnc.com) : `tools/versets.py` (liste des traductions, passages retenus) fabrique
`js/versets.js` à partir de `tools/versets.json`. Le nom de la traduction et son lien sont affichés sous les versets, et le Coran
officiel de chaque langue est en tête de la section Coran. Ajouter ou changer un verset : modifier `tools/versets.py`, puis
`python tools/versets.py --telecharger`.

## Page « Paroles du Prophète » (12/10/2026)
`paroles-du-prophete/` : Marie (Maryam) et ceux qui embrassent l'Islam. Versets : traduction officielle (QuranEnc.com).
Hadiths : traduction officielle de HadeethEnc.com quand elle existe dans la langue (bandeau vert) ; sinon traduction faite pour
le site, signalée par un bandeau orange « traduction non officielle » avec le lien vers la source (tout le coréen, et les deux
hadiths sur Marie en espagnol/allemand/italien/portugais/néerlandais/japonais). Données : `tools/paroles.py` → `js/paroles.js`
(`python tools/paroles.py --telecharger` pour reprendre les versions officielles quand elles sortent). Textes de présentation :
`js/i18n-paroles.js`. Les thèmes de l'accueil ne citent plus de parole du Prophète non sourcée.

## Section « Le film » (12/10/2026)
Film complet GRATUIT sur YouTube, dans le lecteur de la page (se charge au clic) : anglais (chaîne « Hollywood Action ») et
hindi (« Dimension On Demand ») ; Ahmed ne veut pas de lien payant. Bande-annonce officielle (Front Row Filmed Entertainment) et
recherche YouTube par langue en complément. Si YouTube retire une vidéo, changer son identifiant dans `filmFull` de
`js/config.js`. Textes : `js/i18n-film.js`.

## Numéro de version des fichiers
Avant chaque publication qui change `css/` ou `js/` : `python tools/version.py AAAAMMJJx` (ex. `20261012c`). Le test vérifie
que toutes les pages utilisent la même version ; sans cela, un visiteur peut garder d'anciens fichiers après une mise à jour.

### Flyers ajoutés le 13/10/2026
Deux flyers en anglais de l'Islamic Information Center (Dubaï), envoyés par l'ami d'Ahmed en images scannées (`archive/WhatsApp Image…`) :
« The Qur'an: the final revelation to mankind » (`quran-en`) et « Jesus, a prophet of God » (`jesus-en`). Ce ne sont pas nos flyers :
la source est citée dans la description, et le flyer est laissé tel quel (logos et contacts de l'éditeur). PDF fabriqué à partir des scans.
Titre et description écrits dans les 19 langues directement dans `js/data.js`.

### Flyers ajoutés le 14/10/2026
Deux autres flyers anglais de la même série (Islamic Information Center, Dubaï), scans `archive/WhatsApp Image 2026-10-14…` :
« The Concept of God in Islam » (`concept-god-en`) et « Misconceptions about Islam » (`misconceptions-en`). Même méthode :
recto = côté couverture, verso = intérieur, PDF A4 paysage de 2 pages, titres et descriptions dans les 19 langues dans `js/data.js`.

## RÈGLE : tout flyer téléchargeable est imprimable sur A4 recto-verso (règle d'Ahmed, 25/10/2026)
Le PDF proposé par le bouton « PDF » et par le lecteur est TOUJOURS `flyers/flyer-<id>-a4.pdf`, fabriqué par `tools/flyers.py` :
exactement 2 feuilles A4 paysage (842 × 595 pt), à imprimer en recto-verso « retourner sur le bord court » puis plier en trois,
tampon message.clicvia.com + QR code en bas de chaque feuille (dans la feuille). Pages de l'éditeur réduites à l'échelle, jamais
coupées. Flyer de 2 pages (Letter ou A4) : une page par feuille. Dépliant de 6 panneaux (les 10 espagnols de l'Islamic Information
Center, format A3) : 3 panneaux par face dans l'ordre de l'éditeur, extérieur « 4 | 5 | couverture », intérieur « 1 | 2 | 3 ».
Un flyer d'un autre nombre de pages arrête l'outil : demander à Ahmed comment l'imprimer avant de le publier.
Le test refuse un flyer dont le PDF proposé n'a pas exactement 2 feuilles A4 paysage. Nouveau flyer : `python tools/flyers.py <id>`.

## Catalan, 20e langue (26/10/2026, demande d'Ahmed après la demande d'un visiteur)
Bloc unique `js/i18n-ca.js` (textes du site, film, page « Paroles du Prophète », cartes, titres des flyers), branché comme les langues
du 13/10 (`js/data-monde.js`, boutons et options des deux pages, `sitemap.xml`, test). Il n'existe AUCUNE traduction officielle du
Coran ni des hadiths en catalan : le catalan affiche les textes officiels EN CASTILLAN (García pour le Coran, HadeethEnc pour les
hadiths), avec une phrase en catalan qui le dit ; nous ne traduisons jamais les versets (`tools/versets.py` et `tools/paroles.py` :
« ca » = copie du castillan, vérifié par le test). Textes de l'interface écrits par Claude : à faire relire par un natif.

## Flyers en catalan (26/10/2026)
Les 10 dépliants espagnols de l'Islamic Information Center sont traduits en catalan (`<id>-ca`, langue « ca ») :
1. `python tools/flyers_texte.py <id>-es` : texte espagnol de chaque panneau (dépôt privé, `flyers originaux/<id>-es/`) ;
2. traduction en `flyers originaux/<id>-es/texte-ca.json` (blocs : titre, sous_titre, para, puce, citation, bulle ; `sacre` = verset ou
   parole du Prophète) ;
3. `python tools/flyers_ca.py <id>-es` : mise en page HTML de 6 panneaux au format des originaux (taille du texte ajustée seule),
   imprimée par Chrome dans `flyers originaux/<id>-ca/` (original.pdf + page-N.jpg) ;
4. `python tools/flyers.py <id>-ca` : tampon, vignettes, PDF A4 recto-verso ; fiches dans `js/data.js` (titres et descriptions en 20 langues).
Versets et paroles du Prophète : astérisque + note « traducció no oficial » (aucune traduction officielle en catalan) + lien vers la
traduction officielle castillane ; éditeur d'origine cité sur la couverture et sur le dernier panneau. Traduction faite par Claude :
à faire relire par un natif. Points relevés à la traduction : quelques références de l'original douteuses (ex. Coran 2:185 pour un
verset qui est 39:1, « Corán 20–21 » corrigé en 51:20-21), coquilles de l'espagnol corrigées dans le sens.

## Flyers traduits : outil commun (allemand, 26/10/2026 — demande d'un visiteur germanophone)
`python tools/flyers_traduits.py <langue> <id-es> […]` remplace `flyers_ca.py` pour TOUTES les langues (réglages dans `LANGUES` :
bandeau de couverture, note, crédit ; mise en page commune `tools/flyers_traduits.css`). Traduction dans
`flyers originaux/<id>-es/texte-<langue>.json`, résultat dans `flyers originaux/<id>-<langue>/`, puis `python tools/flyers.py <id>-<langue>`.
- **Langue avec un Coran officiel (allemand : Bubenheim & Elyas, QuranEnc)** : chaque verset référencé (« Koran 2:163 ») et le verset
  de couverture sont REMPLACÉS par le texte officiel (gardé dans `tools/flyers_versets.json`), note « offizielle Übersetzung » ; seules
  les paroles du Prophète et les citations libres gardent l'astérisque « inoffizielle Übersetzung ».
- Références fausses de l'original corrigées dans `CORRECTIONS` (coran : 1re « 2:185 » = 39:1 ; proposito-vida « 19:36 » = paraphrase).
- Un texte trop long pour un panneau (police < 8,5 pt) arrête l'outil : raccourcir la traduction.

## Dépliants : les vignettes montrent les feuilles A4 (26/10/2026)
Pour un dépliant de 6 panneaux, `tools/flyers.py` fabrique aussi `flyer-<id>-a4-1.jpg` / `-a4-2.jpg` (+ `-mini`) : les 2 feuilles A4
recto-verso telles qu'imprimées. Dans `js/data.js`, `front`/`back` = ces 2 feuilles et `pages` = [feuille 1, feuille 2, puis les 6
panneaux]. Raison : les 6 panneaux en hauteur faisaient croire que le PDF n'était pas en A4 (Ahmed). Vérifié par `tools/test_site.mjs`.

## Flyers pliables en trois (27/10/2026, Ahmed : « on ne peut pas plier en trois »)
Avant : les 3 volets étaient réduits ensemble et centrés -> grandes marges vides à gauche et à droite, les plis ne tombaient pas
entre les volets. Maintenant (`tools/flyers.py`, `imprimer_a4`) : chaque VOLET occupe exactement son tiers de la feuille A4
(plis à 1/3 et 2/3), agrandi au maximum sans être coupé ni déformé ; les flyers de 2 pages paysage (Letter ou A4) sont coupés en
3 volets égaux. Tampon message.clicvia.com + QR : seulement sous le volet du milieu de la face extérieure (dos du dépliant plié).
Imprimer en recto-verso « retourner sur le bord court », taille réelle (100 %).


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

### Ajouter un flyer
1. Exportez le fichier Excel en PDF (Fichier › Exporter › PDF, « Ajuster la feuille sur une page »).
2. Mettez le PDF et deux images (recto, verso) dans `flyers/`.
3. Ajoutez une entrée dans `flyers:` de `js/data.js`.

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

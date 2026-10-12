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

# Rata Iti 🛶 — Boîte aux lettres virtuelle (démo)

**Rata Iti** (« petite lettre ») est une démo d'application : l'usager sait sur son téléphone s'il a du courrier ou un colis dans sa boîte postale **avant de se déplacer**.

Interface en **français** et en **reo tahiti** (bouton FR / TAH en haut), thème polynésien (lagon, va'a, tapa).

> Prototype indépendant de démonstration, préparé pour être présenté à un opérateur postal. **Non affilié à l'OPT ni à Fare Rata.**

## Fonctions

### Côté usager 📱
- Boîte virtuelle : 📭 vide / 📬 courrier, nombre et type d'envois, photo de l'enveloppe
- **Vérification de la BP** : un code à 6 chiffres est déposé dans la vraie boîte ; seul le titulaire de la clé peut activer le service
- **Code de retrait (QR)** pour les colis et recommandés : plus besoin de l'avis de passage papier
- **Prolonger le délai de garde** de 7 jours
- **« Je ne l'ai pas trouvé »** : signaler un courrier annoncé mais absent
- **Notifications au choix** : tout de suite, résumé une fois par jour, ou rien — séparément pour colis/recommandés, lettres, publicités ; option SMS ; grands caractères
- « J'ai relevé ma boîte » et historique ; suppression automatique après 7 jours

### Côté agent postal 📮
- **Dépôt** : scan du QR de la case (ou saisie), type d'envoi, photo de l'extérieur, quantité, colis à retirer au guichet
- **Mode hors ligne** : sans réseau, les dépôts sont gardés sur le téléphone et envoyés au retour du réseau (bouton « Simuler hors ligne » pour la démo)
- **Codes** : liste des codes de vérification à déposer chez les nouveaux abonnés
- **Guichet** : scan du code de retrait de l'usager, liste des envois en attente, signalements des usagers
- **Étiquettes** : génération et impression d'autocollants QR pour chaque case de BP

## Essayer la démo

1. Ouvrez l'app et appuyez sur **Charger des exemples** (BP 1234 — Pirae, déjà vérifiée).
2. Ouvrez un **deuxième onglet** → **Je suis agent postal**.
3. Déposez un envoi dans la BP `1234` / `98716` : il apparaît **en direct** chez l'usager.

Pour tester la vérification : créez une nouvelle boîte côté usager, puis dans l'onglet agent → **Codes** → « Code déposé », et saisissez le code côté usager.

Le scan par caméra fonctionne sur **Chrome Android**. Sur ordinateur, saisissez le code à la main, ou touchez une étiquette dans l'onglet **Étiquettes** pour simuler un scan.

## Publier sur GitHub Pages

1. Créez un dépôt (ex. `rata-iti`) et envoyez-y tous les fichiers.
2. **Settings → Pages** → branche `main`, dossier `/ (root)`.
3. L'app sera à `https://<votre-compte>.github.io/rata-iti/`.
4. Sur Android : ouvrir dans Chrome → **Ajouter à l'écran d'accueil**.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Les écrans |
| `style.css` | Thème polynésien |
| `app.js` | Logique de la démo |
| `i18n.js` | **Tous les textes**, en français et en reo tahiti |
| `qrcode.js` | Génération des QR codes (bibliothèque MIT de Kazuhiko Arase) |
| `manifest.json`, `sw.js` | Installation sur téléphone, hors ligne |
| `icon.svg`, `vaa.svg`, `tapa.svg`, `pattern.svg` | Icône et motifs |

## ⚠️ Reo tahiti à faire relire

Les textes en tahitien sont une **première proposition**. Faites-les relire par un locuteur natif ou par l'**Académie tahitienne (Fare Vānaʻa)** avant de présenter l'app. Tout se corrige dans `i18n.js`, section `ty:`. Les textes longs non encore traduits s'affichent en français.

## Limites de la démo

- Données stockées **sur l'appareil** : le « en direct » marche entre deux onglets du même navigateur.
- Le SMS est simulé (message à l'écran).
- Tarifs donnés à titre d'exemple.

## Pour une vraie version

- Serveur sécurisé (ex. Supabase) : comptes, notifications push réelles, envoi de SMS
- Accès agents authentifié
- Lecture automatique du numéro de BP sur l'enveloppe (OCR)
- Raccordement au suivi colis de l'opérateur
- Version « Rata Iti Maison » avec capteur dans les boîtes aux lettres à domicile

## Licence

Code de l'app : tous droits réservés — Brian Brigato, 2026.
`qrcode.js` : licence MIT, © Kazuhiko Arase.

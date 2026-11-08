/* =========================================================
   Textes de l'application — Français (fr) et Reo Tahiti (ty)

   ⚠️ Les traductions en reo tahiti sont une PREMIÈRE PROPOSITION.
   Elles doivent être relues par un locuteur natif (ou par
   l'Académie tahitienne — Fare Vānaʻa) avant toute présentation.
   Toute clé absente en tahitien s'affiche en français.
   ========================================================= */

const I18N = {
  fr: {
    'sub.home': 'Boîte aux lettres virtuelle',
    'sub.user-login': 'Espace usager',
    'sub.user-verify': 'Vérification',
    'sub.user': 'Ma boîte',
    'sub.postman': 'Espace agent postal',
    'sub.plans': 'Formules',

    'home.title': 'Ia ora na !',
    'home.lead': 'Sachez si vous avez du courrier ou un colis <strong>avant</strong> de vous déplacer jusqu\'à votre boîte.',
    'home.user': 'Je suis usager',
    'home.userSub': 'Voir ma boîte virtuelle',
    'home.postman': 'Je suis agent postal',
    'home.postmanSub': 'Déposer, vérifier, remettre au guichet',
    'home.plans': 'Formules d\'abonnement',
    'home.plansSub': 'Exemples de tarifs',
    'home.tip': '💡 <strong>Pour la démo :</strong> ouvrez l\'app dans deux onglets — l\'un en « agent postal », l\'autre en « usager ». Le courrier déposé apparaît en direct chez l\'usager.',
    'home.seed': 'Charger des exemples',
    'home.reset': 'Tout effacer',
    'home.disclaimer': 'Prototype indépendant de démonstration. Non affilié à l\'OPT ni à Fare Rata. Les données restent sur cet appareil.',

    'login.title': 'Ma boîte',
    'login.lead': 'Saisissez votre numéro de boîte postale (BP) et votre bureau.',
    'login.name': 'Nom',
    'login.namePh': 'ex. Teva Tapu',
    'login.bp': 'Numéro de BP',
    'login.cp': 'Code postal / bureau',
    'login.submit': 'Ouvrir ma boîte',

    'verify.title': 'Vérifions que c\'est bien votre boîte',
    'verify.lead': 'Pour protéger votre courrier, un <strong>code à 6 chiffres</strong> va être déposé <strong>dans votre vraie boîte postale</strong> par l\'agent. Seul le titulaire de la clé peut le lire.',
    'verify.code': 'Code reçu dans ma BP',
    'verify.submit': 'Valider',
    'verify.tip': '🧪 <strong>Démo :</strong> dans l\'onglet « agent postal », ouvrez « Codes » pour voir le code à déposer.',
    'verify.bad': 'Code incorrect. Vérifiez le papier déposé dans votre boîte.',
    'verify.ok': 'Boîte vérifiée. Māuruuru !',
    'verify.waiting': 'En attente : l\'agent n\'a pas encore déposé le code.',
    'verify.deposited': '✔ Le code a été déposé dans votre boîte.',

    'filter.all': 'Tout',
    'type.lettre': 'Lettre',
    'type.colis': 'Colis',
    'type.recommande': 'Recommandé',
    'type.recommandeShort': 'Recom­mandé',
    'type.pub': 'Publicité',

    'user.collected': '✅ J\'ai relevé ma boîte',
    'user.history': 'Historique (courrier déjà relevé)',
    'user.logout': 'Changer de boîte',
    'user.privacy': 'Par confidentialité, seules les enveloppes (extérieur) sont photographiées. Les images sont supprimées automatiquement après 7 jours.',
    'user.noMail': 'Aucun courrier',
    'user.waitingN': '{n} envoi(s) en attente',
    'user.noNeed': 'Pas besoin de vous déplacer 🏝️',
    'user.counterNeeded': 'passage au guichet nécessaire',
    'user.empty': 'Votre boîte est vide.',
    'user.emptyCat': 'Rien dans cette catégorie.',
    'user.noHistory': 'Aucun historique.',
    'user.collectedToast': 'Boîte relevée. Māuruuru !',
    'user.nothing': 'Rien à relever.',
    'user.countLetters': '{n} lettre(s)',
    'user.countColis': '{n} colis',
    'user.countReco': '{n} recommandé(s)',
    'user.countPub': '{n} publicité(s)',

    'item.today': 'Aujourd\'hui à {h}',
    'item.yesterday': 'Hier à {h}',
    'item.tracking': 'Suivi : {t}',
    'item.counter': 'À retirer au guichet',
    'item.signature': 'Signature au guichet',
    'item.pickupCode': '📲 Code de retrait',
    'item.deadline': 'Gardé jusqu\'au {d}',
    'item.extend': '⏳ Prolonger de 7 jours',
    'item.extended': 'Délai prolongé',
    'item.report': 'Je ne l\'ai pas trouvé',
    'item.reported': '⚠️ Signalé à la poste',
    'item.handed': 'Remis au guichet',
    'item.pickupTitle': 'Code de retrait',
    'item.pickupHelp': 'Présentez ce code au guichet : l\'agent le scanne et vous remet votre envoi. Plus besoin de l\'avis de passage papier.',
    'item.newMail': 'Nouveau : {what}',
    'item.from': 'de {s}',

    'prefs.title': '🔔 Mes notifications',
    'prefs.urgent': 'Colis et recommandés',
    'prefs.letters': 'Lettres',
    'prefs.pub': 'Publicités',
    'prefs.now': 'Tout de suite',
    'prefs.summary': 'Résumé une fois par jour',
    'prefs.off': 'Ne pas prévenir',
    'prefs.sms': 'Recevoir aussi un SMS (pour téléphone simple)',
    'prefs.phone': 'Numéro de téléphone',
    'prefs.large': 'Grands caractères',
    'prefs.enablePush': 'Activer les notifications du téléphone',
    'prefs.pushOn': '🔔 Notifications du téléphone activées',
    'prefs.showSummary': 'Voir le résumé du jour',
    'prefs.saved': 'Préférences enregistrées.',
    'prefs.smsDemo': '📩 SMS (démo) envoyé au {p} : {m}',
    'summary.title': 'Résumé du jour',
    'summary.none': 'Rien de nouveau aujourd\'hui.',

    'post.simOffline': 'Simuler « hors ligne »',
    'post.online': '🟢 En ligne',
    'post.offline': '🔴 Hors ligne — les dépôts sont gardés et envoyés au retour du réseau',
    'post.tabDeposit': 'Dépôt',
    'post.tabCodes': 'Codes',
    'post.tabCounter': 'Guichet',
    'post.tabLabels': 'Étiquettes',
    'post.scanBp': '📷 Scanner le QR de la case',
    'post.bp': 'Boîte postale destinataire',
    'post.type': 'Type d\'envoi',
    'post.guichet': 'À retirer au guichet (avis d\'instance)',
    'post.tracking': 'N° de suivi (facultatif)',
    'post.sender': 'Expéditeur (facultatif)',
    'post.senderPh': 'ex. CPS, EDT, Banque…',
    'post.photo': '📷 Photographier l\'enveloppe',
    'post.photoRetake': '📷 Reprendre la photo',
    'post.photoHint': 'Photographier uniquement l\'extérieur de l\'enveloppe.',
    'post.qty': 'Quantité',
    'post.submit': '📥 Déposer dans la boîte',
    'post.today': 'Dépôts du jour',
    'post.noToday': 'Aucun dépôt aujourd\'hui.',
    'post.subscriber': '✔ Abonné : {name}',
    'post.subscriberUnverified': '⏳ {name} — vérification en attente',
    'post.notSubscriber': 'Cette BP n\'a pas (encore) activé Rata Iti.',
    'post.deposited': 'Déposé en BP {bp}',
    'post.notified': '{name} est prévenu(e)',
    'post.queued': '{n} dépôt(s) en attente d\'envoi',
    'post.queuedToast': 'Hors ligne : dépôt gardé sur le téléphone.',
    'post.synced': 'Réseau revenu : {n} dépôt(s) envoyé(s).',
    'post.codesLead': 'Nouveaux abonnés : imprimez ou recopiez le code et glissez-le dans leur boîte postale. C\'est ainsi qu\'on vérifie que l\'abonné possède bien la clé de la boîte.',
    'post.noCodes': 'Aucun code à déposer.',
    'post.codeFor': 'BP {bp} — {cp} · {name}',
    'post.markDeposited': 'Code déposé ✔',
    'post.codeDone': 'Déposé',
    'post.counterLead': 'Quand l\'usager se présente, scannez le code de retrait affiché sur son téléphone.',
    'post.scanPickup': '📷 Scanner un code de retrait',
    'post.waitingCounter': 'Envois en attente au guichet',
    'post.noCounter': 'Aucun envoi en attente.',
    'post.reports': 'Signalements des usagers',
    'post.noReports': 'Aucun signalement.',
    'post.handedOver': '✔ Envoi remis à {name}.',
    'post.unknownCode': 'Code inconnu.',
    'post.alreadyCollected': 'Cet envoi a déjà été remis.',
    'post.labelsLead': 'Un autocollant QR à l\'arrière de chaque case : l\'agent le scanne et la BP se remplit toute seule, sans rien taper.',
    'post.from': 'De la BP',
    'post.to': 'à la BP',
    'post.makeLabels': 'Créer les étiquettes',
    'post.print': '🖨️ Imprimer',
    'post.tooMany': '60 étiquettes maximum à la fois.',
    'post.bpScanned': 'BP {bp} sélectionnée.',

    'scan.manual': 'Ou saisir le code',
    'scan.ok': 'Valider',
    'scan.close': 'Fermer',
    'scan.titleBp': 'Scanner le QR de la case',
    'scan.titlePickup': 'Scanner le code de retrait',
    'scan.hintCamera': 'Visez le QR code avec l\'appareil photo.',
    'scan.hintNoCamera': 'Lecture par caméra non disponible sur ce navigateur (essayez Chrome sur Android). Saisissez le code à la main.',

    'plans.title': 'Formules',
    'plans.lead': 'Tarifs indicatifs pour la démonstration.',
    'plans.free': 'Gratuit',
    'plans.month': '/mois',
    'plans.iti': ['Compteur : « vous avez du courrier »', 'Nombre de lettres et de colis', 'Notification à chaque dépôt'],
    'plans.rahi': ['Tout de la formule Iti', 'Photo de chaque enveloppe', 'Type de courrier et expéditeur', 'Code de retrait et prolongation du délai de garde', 'Historique 7 jours'],
    'plans.pro': ['Tout de la formule Rahi', 'Jusqu\'à 5 personnes sur la même BP', 'Plusieurs BP (associations, entreprises)', 'Alertes SMS'],
    'plans.tip': 'Autre modèle possible : service inclus dans la location de la boîte postale, ou financé par l\'opérateur postal.',

    'toast.seeded': 'Exemples chargés : BP 1234 — Pirae (Teva Tapu).',
    'toast.reset': 'Toutes les données de démo ont été effacées.',
    'toast.resetConfirm': 'Appuyez encore une fois pour tout effacer.',
    'toast.storageFull': 'Mémoire pleine : effacez les données de démo.',
    'toast.photoError': 'Impossible de lire la photo.',
    'toast.pushDenied': 'Notifications refusées.',
    'toast.pushNA': 'Notifications non disponibles sur ce navigateur.',
    'notif.title': 'Rata Iti — Vous avez du courrier',
  },

  ty: {
    'sub.home': 'ʻĀfata rata i roto i te niuniu',
    'sub.user-login': 'No te fatu ʻāfata',
    'sub.user-verify': 'Haʻapāpūraʻa',
    'sub.user': 'Tōʻu ʻāfata rata',
    'sub.postman': 'No te taʻata ʻohipa rata',
    'sub.plans': 'Te mau hoʻo',

    'home.title': 'Ia ora na !',
    'home.lead': 'ʻIte mātāmua ē, tē vai ra te rata ānei i roto i tōʻu ʻāfata, <strong>hou</strong> a haere ai.',
    'home.user': 'O vau te fatu ʻāfata',
    'home.userSub': 'Hiʻo i tōʻu ʻāfata rata',
    'home.postman': 'Taʻata ʻohipa no te fare rata',
    'home.postmanSub': 'Tuʻu i te rata, hōroʻa i te pūʻohu',
    'home.plans': 'Te mau hoʻo',
    'home.plansSub': 'Hiʻo i te mau hoʻo',
    'home.seed': 'Tuʻu i te mau hiʻoraʻa',
    'home.reset': 'Faʻaore i te mau mea atoa',

    'login.title': 'Tōʻu ʻāfata rata',
    'login.lead': 'Pāpaʻi i te nūmera o tōʻu ʻāfata (BP) e te fare rata.',
    'login.name': 'Iʻoa',
    'login.namePh': 'ei hiʻoraʻa : Teva Tapu',
    'login.bp': 'Nūmera BP',
    'login.cp': 'Fare rata',
    'login.submit': 'Iriti i tōʻu ʻāfata',

    'verify.title': 'Haʻapāpū i tōʻu ʻāfata',
    'verify.code': 'Tāpaʻo huna i roto i tōʻu ʻāfata',
    'verify.submit': 'Haʻapāpū',
    'verify.bad': 'ʻAita i tano te tāpaʻo huna.',
    'verify.ok': 'Ua haʻapāpūhia. Māuruuru !',
    'verify.deposited': '✔ Ua tuʻuhia te tāpaʻo huna i roto i tōʻu ʻāfata.',

    'filter.all': 'Pauroa',
    'type.lettre': 'Rata',
    'type.colis': 'Pūʻohu',
    'type.recommande': 'Rata tāpaʻo',
    'type.recommandeShort': 'Rata tāpaʻo',
    'type.pub': 'Poroʻi hoʻo',

    'user.collected': '✅ Ua rave au i tōʻu rata',
    'user.history': 'Te mau rata tahito',
    'user.logout': 'Taui i te ʻāfata',
    'user.noMail': 'ʻAita e rata',
    'user.waitingN': '{n} rata tē tiaʻi ra',
    'user.noNeed': 'ʻAita e tītauhia ia haere 🏝️',
    'user.counterNeeded': 'e haere i te fare rata',
    'user.empty': 'ʻAita e rata i roto i te ʻāfata.',
    'user.emptyCat': 'ʻAita e mea.',
    'user.noHistory': 'ʻAita e mea.',
    'user.collectedToast': 'Ua rave ʻoe i tō rata. Māuruuru !',
    'user.nothing': 'ʻAita e rata.',
    'user.countLetters': '{n} rata',
    'user.countColis': '{n} pūʻohu',
    'user.countReco': '{n} rata tāpaʻo',
    'user.countPub': '{n} poroʻi hoʻo',

    'item.today': 'I teie mahana, {h}',
    'item.yesterday': 'Inanahi, {h}',
    'item.tracking': 'Nūmera : {t}',
    'item.counter': 'E rave i te fare rata',
    'item.signature': 'E tāpaʻo i te fare rata',
    'item.pickupCode': '📲 Tāpaʻo no te rave',
    'item.deadline': 'E tiaʻi te fare rata e tae roa i te {d}',
    'item.extend': '⏳ Faʻaroa i te taime (7 mahana)',
    'item.extended': 'Ua faʻaroahia te taime',
    'item.report': 'ʻAita i ʻitehia',
    'item.reported': '⚠️ Ua faʻaʻitehia i te fare rata',
    'item.handed': 'Ua hōroʻahia',
    'item.pickupTitle': 'Tāpaʻo no te rave',
    'item.newMail': 'Rata ʻāpī : {what}',
    'item.from': 'na {s}',

    'prefs.title': '🔔 Te mau faʻaʻiteraʻa',
    'prefs.urgent': 'Pūʻohu e rata tāpaʻo',
    'prefs.letters': 'Rata',
    'prefs.pub': 'Poroʻi hoʻo',
    'prefs.now': 'Oioi',
    'prefs.summary': 'Hōʻē taime i te mahana',
    'prefs.off': 'ʻAita',
    'prefs.phone': 'Nūmera niuniu',
    'prefs.large': 'Mau reta rarahi',
    'prefs.showSummary': 'Hiʻo i te mau rata o teie mahana',
    'summary.title': 'I teie mahana',
    'summary.none': 'ʻAita e mea ʻāpī i teie mahana.',

    'post.tabDeposit': 'Tuʻu',
    'post.tabCodes': 'Tāpaʻo huna',
    'post.tabCounter': 'Fare rata',
    'post.tabLabels': 'Tāpaʻo QR',
    'post.bp': 'ʻĀfata rata (BP)',
    'post.type': 'Te huru',
    'post.sender': 'Te taʻata nāna i tono',
    'post.photo': '📷 Pāpaʻi i te hōhoʻa',
    'post.photoRetake': '📷 Pāpaʻi faʻahou',
    'post.qty': 'E hia ?',
    'post.submit': '📥 Tuʻu i roto i te ʻāfata',
    'post.today': 'I teie mahana',
    'post.deposited': 'Ua tuʻuhia i roto i te BP {bp}',
    'post.markDeposited': 'Ua tuʻuhia ✔',
    'post.codeDone': 'Ua tuʻuhia',
    'post.from': 'Mai te BP',
    'post.to': 'e tae atu i te BP',

    'scan.ok': 'Haʻapāpū',
    'scan.close': 'ʻOpani',

    'plans.title': 'Te mau hoʻo',
    'plans.free': 'Ma te moni ʻore',
    'plans.month': '/ʻāvaʻe',

    'toast.seeded': 'Ua tuʻuhia te mau hiʻoraʻa : BP 1234 — Pirae (Teva Tapu).',
    'notif.title': 'Rata Iti — Rata ʻāpī !',
  },
};

let LANG = 'fr';
try { LANG = localStorage.getItem('rataiti.lang') || 'fr'; } catch (e) {}

/** Renvoie le texte traduit (repli en français), avec remplacement {variables}. */
function t(key, vars) {
  let s = (I18N[LANG] && I18N[LANG][key] !== undefined) ? I18N[LANG][key] : I18N.fr[key];
  if (s === undefined) return key;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  return s;
}

/** Applique les traductions aux éléments marqués dans la page. */
function applyI18n() {
  document.documentElement.lang = LANG === 'ty' ? 'ty' : 'fr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-list]').forEach(el => {
    const items = t(el.dataset.i18nList);
    el.innerHTML = Array.isArray(items) ? items.map(x => `<li>${x}</li>`).join('') : '';
  });
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === LANG));
}

function setLang(l) {
  LANG = l;
  try { localStorage.setItem('rataiti.lang', l); } catch (e) {}
  applyI18n();
}

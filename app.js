/* =========================================================
   Rata Iti — démo de boîte aux lettres virtuelle
   Tout est stocké localement (localStorage) pour la démo.
   Dans une vraie version, ces données passeraient par un
   serveur sécurisé (ex. Supabase) géré avec l'opérateur postal.
   ========================================================= */

const STORE_KEY = 'rataiti.v2';
const QUEUE_KEY = 'rataiti.queue';
const SESSION_KEY = 'rataiti.session';
const OFFLINE_KEY = 'rataiti.simOffline';
const LARGE_KEY = 'rataiti.large';
const KEEP_DAYS = 7;
const HOLD_DAYS = 15;   // délai de garde au guichet
const EXTEND_DAYS = 7;

const TYPE_ICONS = { lettre: '✉️', colis: '📦', recommande: '🔏', pub: '📰' };

const BUREAUX = {
  '98713': 'Papeete', '98716': 'Pirae', '98718': 'Punaauia', '98701': 'Arue',
  '98702': "Faa'a", '98711': 'Paea', '98709': 'Mahina', '98728': 'Moorea',
  '98730': 'Bora Bora', '98735': 'Uturoa (Raiatea)', '98731': 'Huahine',
};

const DEFAULT_PREFS = { urgent: 'now', letters: 'summary', pub: 'summary', sms: false, phone: '' };

/* ---------- Stockage (avec garde-fous) ---------- */
function loadStore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORE_KEY));
    if (data && data.items && data.boxes) return data;
  } catch (e) { /* stockage indisponible ou corrompu */ }
  return { boxes: {}, items: [] };
}
function saveStore(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); return true; }
  catch (e) { toast(t('toast.storageFull')); return false; }
}
function loadQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; }
}
function saveQueue(q) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) { toast(t('toast.storageFull')); }
}
function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null; } catch (e) { return null; }
}
function saveSession(s) {
  try { s ? sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)) : sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
}
function getFlag(key, store = sessionStorage) { try { return store.getItem(key) === '1'; } catch (e) { return false; } }
function setFlag(key, on, store = sessionStorage) { try { store.setItem(key, on ? '1' : '0'); } catch (e) {} }

const boxKey = (bp, cp) => `${String(bp).trim()}-${cp}`;
const needsCounter = i => i.guichet || i.type === 'recommande';

/* Supprime le vieux courrier (confidentialité) */
function purgeOld() {
  const data = loadStore();
  const now = Date.now();
  const limit = now - KEEP_DAYS * 864e5;
  const before = data.items.length;
  data.items = data.items.filter(i => (i.deadline && !i.collected) ? i.deadline > now : i.date >= limit);
  if (data.items.length !== before) saveStore(data);
}

/* ---------- Outils ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const randomCode = () => String(Math.floor(100000 + Math.random() * 900000));
const randomToken = () => 'RI-' + Math.random().toString(36).slice(2, 8).toUpperCase();

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function typeLabel(type) { return t('type.' + type); }

function formatDate(ms) {
  const d = new Date(ms), today = new Date(), hier = new Date();
  hier.setDate(today.getDate() - 1);
  const h = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === today.toDateString()) return t('item.today', { h });
  if (d.toDateString() === hier.toDateString()) return t('item.yesterday', { h });
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + h;
}
const shortDate = ms => new Date(ms).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });

let toastTimer;
function toast(msg, ms = 3200) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
}

function showPhoto(src) {
  const v = document.createElement('div');
  v.className = 'viewer';
  v.innerHTML = `<img src="${src}" alt="">`;
  v.addEventListener('click', () => v.remove());
  document.body.appendChild(v);
}

function openModal(html) { $('#modalBody').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
$('#btnModalClose').addEventListener('click', closeModal);

function qrSvg(text, cell = 4) {
  try {
    const q = qrcode(0, 'M');
    q.addData(text);
    q.make();
    return q.createSvgTag(cell, 2);
  } catch (e) { return `<div class="pickup-code">${esc(text)}</div>`; }
}

/* Réduit la photo pour qu'elle tienne dans le stockage */
function compressImage(file, maxSize = 720, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* Dessine une fausse enveloppe (pour les exemples) */
function fakeEnvelope(sender, name, bp, cp, color = '#ffffff', stamp = '#e8664a') {
  const c = document.createElement('canvas');
  c.width = 480; c.height = 300;
  const g = c.getContext('2d');
  g.fillStyle = '#d9d2c3'; g.fillRect(0, 0, 480, 300);
  g.fillStyle = color; g.fillRect(14, 14, 452, 272);
  g.fillStyle = stamp; g.fillRect(380, 30, 66, 78);
  g.strokeStyle = '#fff'; g.setLineDash([4, 3]); g.lineWidth = 3; g.strokeRect(384, 34, 58, 70); g.setLineDash([]);
  g.fillStyle = '#555'; g.font = 'bold 20px sans-serif'; g.fillText(sender, 36, 58);
  g.fillStyle = '#222'; g.font = '22px serif';
  g.fillText(name, 190, 190);
  g.fillText(`BP ${bp}`, 190, 220);
  g.fillText(`${cp} ${(BUREAUX[cp] || '').toUpperCase()}`, 190, 250);
  return c.toDataURL('image/jpeg', 0.6);
}

/* Listes de bureaux de poste */
function fillCpSelects() {
  $$('.cp-select').forEach(sel => {
    const short = sel.classList.contains('cp-short');
    const val = sel.value || '98716';
    sel.innerHTML = Object.entries(BUREAUX)
      .map(([cp, name]) => `<option value="${cp}">${short ? cp : cp + ' — ' + name}</option>`).join('');
    sel.value = val;
  });
}

/* ---------- Navigation ---------- */
const SCREENS = ['home', 'user-login', 'user-verify', 'user', 'postman', 'plans'];
let current = 'home';

function go(name) {
  if (name === 'user' || name === 'user-verify') {
    const s = loadSession();
    if (!s) name = 'user-login';
    else {
      const box = loadStore().boxes[boxKey(s.bp, s.cp)];
      if (!box) { saveSession(null); name = 'user-login'; }
      else name = box.verified ? 'user' : 'user-verify';
    }
  }
  SCREENS.forEach(s => $(`#screen-${s}`).classList.toggle('hidden', s !== name));
  current = name;
  $('#btnBack').classList.toggle('hidden', name === 'home');
  $('#subtitle').textContent = t('sub.' + name);
  render();
  window.scrollTo(0, 0);
}

function render() {
  if (current === 'user') renderUser();
  if (current === 'user-verify') renderVerify();
  if (current === 'postman') renderPostman();
}

$('#btnBack').addEventListener('click', () => go('home'));
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
$$('[data-lang]').forEach(b => b.addEventListener('click', () => {
  setLang(b.dataset.lang);
  $('#subtitle').textContent = t('sub.' + current);
  render();
}));

/* =========================================================
   USAGER
   ========================================================= */
let filter = 'all';
const seenIds = new Set();

$('#formLogin').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#loginName').value.trim();
  const bp = $('#loginBp').value.trim();
  const cp = $('#loginCp').value;
  const data = loadStore();
  const key = boxKey(bp, cp);
  if (!data.boxes[key]) {
    data.boxes[key] = { name, bp, cp, code: randomCode(), verified: false, codeDeposited: false, prefs: { ...DEFAULT_PREFS } };
    saveStore(data);
  }
  saveSession({ bp, cp });
  seenIds.clear();
  go('user');
});

/* ---- Vérification par code déposé dans la BP ---- */
function renderVerify() {
  const s = loadSession();
  const box = s && loadStore().boxes[boxKey(s.bp, s.cp)];
  if (!box) return;
  $('#verifyStatus').textContent = box.codeDeposited ? t('verify.deposited') : t('verify.waiting');
}

$('#formVerify').addEventListener('submit', e => {
  e.preventDefault();
  const s = loadSession();
  const data = loadStore();
  const box = data.boxes[boxKey(s.bp, s.cp)];
  if (box && $('#verifyCode').value.trim() === box.code) {
    box.verified = true;
    saveStore(data);
    $('#verifyCode').value = '';
    toast(t('verify.ok'));
    go('user');
  } else {
    toast(t('verify.bad'));
  }
});

$('#btnVerifyLogout').addEventListener('click', () => { saveSession(null); go('user-login'); });
$('#btnLogout').addEventListener('click', () => { saveSession(null); go('user-login'); });

/* ---- Filtres ---- */
$$('#filterChips .chip').forEach(ch => ch.addEventListener('click', () => {
  filter = ch.dataset.filter;
  $$('#filterChips .chip').forEach(c => c.classList.toggle('active', c === ch));
  renderUser();
}));

/* ---- Carte d'un envoi ---- */
function itemHtml(i, { isNew = false, actions = false, senderOverride = null } = {}) {
  const icon = TYPE_ICONS[i.type] || '✉️';
  const thumb = i.photo
    ? `<div class="mail-thumb" data-photo="${i.id}"><img src="${i.photo}" alt=""></div>`
    : `<div class="mail-thumb">${icon}</div>`;
  const qty = i.qty > 1 ? ` ×${i.qty}` : '';
  const who = senderOverride ?? i.sender;
  const sender = who ? ` · ${esc(who)}` : '';
  const flags = [];
  if (i.handed) flags.push(`<span class="mail-flag ok">${t('item.handed')}</span>`);
  else if (i.guichet) flags.push(`<span class="mail-flag">${t('item.counter')}</span>`);
  else if (i.type === 'recommande') flags.push(`<span class="mail-flag">${t('item.signature')}</span>`);
  if (i.reported) flags.push(`<span class="mail-flag">${t('item.reported')}</span>`);

  let meta = `<div class="mail-meta">${formatDate(i.date)}</div>`;
  if (i.tracking) meta += `<div class="mail-meta">${t('item.tracking', { t: esc(i.tracking) })}</div>`;
  if (i.deadline && !i.collected) {
    meta += `<div class="mail-meta">${t('item.deadline', { d: shortDate(i.deadline) })}${i.extended ? ' · ' + t('item.extended') : ''}</div>`;
  }

  let acts = '';
  if (actions && !i.collected) {
    const b = [];
    if (needsCounter(i)) {
      b.push(`<button class="btn mini corail" data-act="pickup" data-id="${i.id}">${t('item.pickupCode')}</button>`);
      if (!i.extended) b.push(`<button class="btn mini ghost" data-act="extend" data-id="${i.id}">${t('item.extend')}</button>`);
    }
    if (!i.reported) b.push(`<button class="btn mini ghost" data-act="report" data-id="${i.id}">${t('item.report')}</button>`);
    acts = `<div class="mail-actions">${b.join('')}</div>`;
  }

  return `<div class="mail-item ${isNew ? 'new' : ''} ${i.reported ? 'reported' : ''}">
      ${thumb}
      <div class="mail-info">
        <div class="mail-type">${icon} ${typeLabel(i.type)}${qty}${sender}</div>
        ${meta}${flags.join(' ')}${acts}
      </div>
    </div>`;
}

function bindItems(container, items) {
  container.querySelectorAll('[data-photo]').forEach(el => el.addEventListener('click', () => {
    const it = items.find(x => x.id === el.dataset.photo);
    if (it && it.photo) showPhoto(it.photo);
  }));
  container.querySelectorAll('[data-act]').forEach(el => el.addEventListener('click', () => itemAction(el.dataset.act, el.dataset.id)));
}

function itemAction(act, id) {
  const data = loadStore();
  const it = data.items.find(x => x.id === id);
  if (!it) return;
  if (act === 'pickup') {
    openModal(`<h3>${t('item.pickupTitle')}</h3>
      <div class="pickup-qr">${qrSvg(it.pickupToken, 6)}<div class="pickup-code">${esc(it.pickupToken)}</div></div>
      <p class="muted small">${TYPE_ICONS[it.type]} ${typeLabel(it.type)}${it.sender ? ' · ' + esc(it.sender) : ''}${it.tracking ? ' · ' + esc(it.tracking) : ''}</p>
      <p class="small">${t('item.pickupHelp')}</p>`);
    return;
  }
  if (act === 'extend' && !it.extended) {
    it.deadline += EXTEND_DAYS * 864e5;
    it.extended = true;
    saveStore(data);
    toast(t('item.deadline', { d: shortDate(it.deadline) }));
  }
  if (act === 'report') {
    it.reported = true;
    it.reportedAt = Date.now();
    saveStore(data);
    toast(t('item.reported'));
  }
  renderUser();
}

/* ---- Écran principal usager ---- */
function renderUser() {
  const s = loadSession();
  if (!s) return;
  const data = loadStore();
  const key = boxKey(s.bp, s.cp);
  const box = data.boxes[key];
  if (!box) return;
  const mine = data.items.filter(i => boxKey(i.bp, i.cp) === key).sort((a, b) => b.date - a.date);
  const waiting = mine.filter(i => !i.collected);
  const done = mine.filter(i => i.collected);

  const count = type => waiting.filter(i => i.type === type).reduce((n, i) => n + (i.qty || 1), 0);
  const total = waiting.reduce((n, i) => n + (i.qty || 1), 0);
  $('#boxTitle').textContent = `${box.name} — BP ${box.bp}, ${box.cp} ${BUREAUX[box.cp] || ''}`;
  $('#boxCount').textContent = total === 0 ? t('user.noMail') : t('user.waitingN', { n: total });
  const parts = [];
  if (count('lettre')) parts.push(t('user.countLetters', { n: count('lettre') }));
  if (count('colis')) parts.push(t('user.countColis', { n: count('colis') }));
  if (count('recommande')) parts.push(t('user.countReco', { n: count('recommande') }));
  if (count('pub')) parts.push(t('user.countPub', { n: count('pub') }));
  const counter = waiting.some(needsCounter);
  $('#boxDetail').textContent = total === 0 ? t('user.noNeed') : parts.join(' · ') + (counter ? ' — ' + t('user.counterNeeded') : '');
  $('#mailboxVisual').textContent = total === 0 ? '📭' : '📬';
  $('#boxStatus').classList.toggle('has-mail', total > 0);

  const shown = filter === 'all' ? waiting : waiting.filter(i => i.type === filter);
  const list = $('#mailList');
  list.innerHTML = shown.length
    ? shown.map(i => itemHtml(i, { isNew: !seenIds.has(i.id), actions: true })).join('')
    : `<div class="empty">${waiting.length ? t('user.emptyCat') : t('user.empty')}</div>`;
  bindItems(list, shown);
  $('#btnCollected').classList.toggle('hidden', !waiting.some(i => !needsCounter(i)));

  const hist = $('#historyList');
  hist.innerHTML = done.length ? done.map(i => itemHtml(i)).join('') : `<div class="empty">${t('user.noHistory')}</div>`;
  bindItems(hist, done);

  renderPrefs(box);
  setTimeout(() => mine.forEach(i => seenIds.add(i.id)), 4000);
}

/* "J'ai relevé ma boîte" : les envois à retirer au guichet restent en attente */
$('#btnCollected').addEventListener('click', () => {
  const s = loadSession();
  const data = loadStore();
  const key = boxKey(s.bp, s.cp);
  let n = 0;
  data.items.forEach(i => {
    if (boxKey(i.bp, i.cp) === key && !i.collected && !needsCounter(i)) { i.collected = true; i.collectedAt = Date.now(); n++; }
  });
  saveStore(data);
  toast(n ? t('user.collectedToast') : t('user.nothing'));
  renderUser();
});

/* ---- Préférences de notification ---- */
function renderPrefs(box) {
  const p = { ...DEFAULT_PREFS, ...(box.prefs || {}) };
  $('#prefUrgent').value = p.urgent;
  $('#prefLetters').value = p.letters;
  $('#prefPub').value = p.pub;
  $('#prefSms').checked = p.sms;
  $('#prefPhone').value = p.phone || '';
  $('#prefPhoneWrap').classList.toggle('hidden', !p.sms);
  $('#prefLarge').checked = getFlag(LARGE_KEY, localStorage);
  const nb = $('#btnNotif');
  if (!('Notification' in window)) nb.classList.add('hidden');
  else nb.textContent = Notification.permission === 'granted' ? t('prefs.pushOn') : t('prefs.enablePush');
}

function savePrefs() {
  const s = loadSession();
  const data = loadStore();
  const box = data.boxes[boxKey(s.bp, s.cp)];
  if (!box) return;
  box.prefs = {
    urgent: $('#prefUrgent').value,
    letters: $('#prefLetters').value,
    pub: $('#prefPub').value,
    sms: $('#prefSms').checked,
    phone: $('#prefPhone').value.trim(),
  };
  saveStore(data);
  $('#prefPhoneWrap').classList.toggle('hidden', !box.prefs.sms);
  toast(t('prefs.saved'), 1500);
}
['#prefUrgent', '#prefLetters', '#prefPub', '#prefSms', '#prefPhone'].forEach(id => $(id).addEventListener('change', savePrefs));

$('#prefLarge').addEventListener('change', e => {
  setFlag(LARGE_KEY, e.target.checked, localStorage);
  document.body.classList.toggle('large', e.target.checked);
});

$('#btnNotif').addEventListener('click', async () => {
  if (!('Notification' in window)) return toast(t('toast.pushNA'));
  const p = await Notification.requestPermission();
  toast(p === 'granted' ? t('prefs.pushOn') : t('toast.pushDenied'));
  renderUser();
});

$('#btnSummary').addEventListener('click', () => {
  const s = loadSession();
  const today = new Date().toDateString();
  const items = loadStore().items
    .filter(i => boxKey(i.bp, i.cp) === boxKey(s.bp, s.cp) && new Date(i.date).toDateString() === today)
    .sort((a, b) => b.date - a.date);
  openModal(`<h3>🛶 ${t('summary.title')}</h3>
    <div class="mail-list compact">${items.length ? items.map(i => itemHtml(i)).join('') : `<div class="empty">${t('summary.none')}</div>`}</div>`);
});

async function pushNotify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) reg.showNotification(title, { body, icon: 'icon.svg', badge: 'icon.svg', tag: 'rata-iti' });
    else new Notification(title, { body, icon: 'icon.svg' });
  } catch (e) { /* ignore */ }
}

/* Quand un dépôt arrive : prévenir selon les préférences de l'usager */
function alertFresh(fresh, box) {
  const p = { ...DEFAULT_PREFS, ...(box.prefs || {}) };
  const mode = i => needsCounter(i) || i.type === 'colis' ? p.urgent : i.type === 'pub' ? p.pub : p.letters;
  const now = fresh.filter(i => mode(i) === 'now');
  if (!now.length) return;
  const i = now[now.length - 1];
  const what = `${TYPE_ICONS[i.type]} ${typeLabel(i.type).toLowerCase()}${i.sender ? ' ' + t('item.from', { s: i.sender }) : ''}`;
  const msg = t('item.newMail', { what });
  toast(msg);
  pushNotify(t('notif.title'), msg);
  if (p.sms && p.phone) setTimeout(() => toast(t('prefs.smsDemo', { p: p.phone, m: msg }), 4000), 3400);
  const mv = $('#mailboxVisual');
  mv.classList.remove('bump'); void mv.offsetWidth; mv.classList.add('bump');
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
}

/* =========================================================
   AGENT POSTAL
   ========================================================= */
let pendingPhoto = null;
let currentTab = 'deposit';

function isOffline() { return getFlag(OFFLINE_KEY) || !navigator.onLine; }

$$('.tab').forEach(tb => tb.addEventListener('click', () => {
  currentTab = tb.dataset.tab;
  $$('.tab').forEach(x => x.classList.toggle('active', x === tb));
  $$('.tab-panel').forEach(p => p.classList.toggle('hidden', p.id !== 'tab-' + currentTab));
  renderPostman();
}));

function renderPostman() {
  const data = loadStore();
  const off = isOffline();
  $('#simOffline').checked = getFlag(OFFLINE_KEY);
  $('#netStatus').textContent = off ? t('post.offline') : t('post.online');
  $('#netBar').classList.toggle('offline', off);

  // Badge des codes à déposer
  const pendingCodes = Object.values(data.boxes).filter(b => !b.verified && !b.codeDeposited);
  $('#codesBadge').textContent = pendingCodes.length;
  $('#codesBadge').classList.toggle('hidden', pendingCodes.length === 0);

  if (currentTab === 'deposit') renderDeposit(data);
  if (currentTab === 'codes') renderCodes(data);
  if (currentTab === 'counter') renderCounter(data);
}

function ownerLabel(data, bp, cp) {
  const b = data.boxes[boxKey(bp, cp)];
  return b ? b.name : '—';
}

function renderDeposit(data) {
  $('#knownBps').innerHTML = Object.values(data.boxes)
    .map(b => `<option value="${esc(b.bp)}">${esc(b.name)} — ${esc(b.cp)}</option>`).join('');
  updateOwner();

  // File d'attente hors ligne
  const q = loadQueue();
  $('#queueBox').classList.toggle('hidden', q.length === 0);
  $('#queueText').textContent = t('post.queued', { n: q.length });
  $('#queueList').innerHTML = q.map(i => itemHtml(i, { senderOverride: `BP ${i.bp}` })).join('');

  const today = new Date().toDateString();
  const todays = data.items.filter(i => new Date(i.date).toDateString() === today).sort((a, b) => b.date - a.date);
  $('#todayCount').textContent = todays.reduce((n, i) => n + (i.qty || 1), 0);
  const log = $('#depositLog');
  log.innerHTML = todays.length
    ? todays.map(i => itemHtml(i, { senderOverride: `BP ${i.bp} (${ownerLabel(data, i.bp, i.cp)})` })).join('')
    : `<div class="empty">${t('post.noToday')}</div>`;
  bindItems(log, todays);
}

function updateOwner() {
  const bp = $('#depBp').value.trim();
  const box = loadStore().boxes[boxKey(bp, $('#depCp').value)];
  $('#bpOwner').textContent = !bp ? ''
    : !box ? t('post.notSubscriber')
    : box.verified ? t('post.subscriber', { name: box.name })
    : t('post.subscriberUnverified', { name: box.name });
}
$('#depBp').addEventListener('input', updateOwner);
$('#depCp').addEventListener('change', updateOwner);

$$('input[name=type]').forEach(r => r.addEventListener('change', () => {
  const tp = document.querySelector('input[name=type]:checked').value;
  $('#colisOptions').classList.toggle('hidden', tp !== 'colis' && tp !== 'recommande');
}));

$('#btnPhoto').addEventListener('click', () => $('#depPhoto').click());
$('#depPhoto').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    pendingPhoto = await compressImage(f);
    $('#photoPreview').src = pendingPhoto;
    $('#photoPreview').classList.remove('hidden');
    $('#btnPhoto').textContent = t('post.photoRetake');
  } catch (err) { toast(t('toast.photoError')); }
});

$('#qtyMinus').addEventListener('click', () => { const q = $('#depQty'); q.value = Math.max(1, (+q.value || 1) - 1); });
$('#qtyPlus').addEventListener('click', () => { const q = $('#depQty'); q.value = Math.min(50, (+q.value || 1) + 1); });

$('#formDeposit').addEventListener('submit', e => {
  e.preventDefault();
  const type = document.querySelector('input[name=type]:checked').value;
  const now = Date.now();
  const item = {
    id: uid(),
    bp: $('#depBp').value.trim(),
    cp: $('#depCp').value,
    type,
    sender: $('#depSender').value.trim(),
    tracking: (type === 'colis' || type === 'recommande') ? $('#depTracking').value.trim() : '',
    guichet: type === 'colis' ? $('#depGuichet').checked : false,
    qty: Math.max(1, Math.min(50, parseInt($('#depQty').value, 10) || 1)),
    photo: pendingPhoto,
    date: now,
    collected: false,
  };
  if (needsCounter(item)) {
    item.deadline = now + HOLD_DAYS * 864e5;
    item.pickupToken = randomToken();
    item.extended = false;
  }

  if (isOffline()) {
    const q = loadQueue(); q.push(item); saveQueue(q);
    toast(t('post.queuedToast'));
  } else {
    const data = loadStore();
    data.items.push(item);
    if (!saveStore(data)) return;
    const owner = data.boxes[boxKey(item.bp, item.cp)];
    toast(`${TYPE_ICONS[type]} ${t('post.deposited', { bp: item.bp })}${owner && owner.verified ? ' — ' + t('post.notified', { name: owner.name }) : ''}`);
  }

  // Réinitialise le formulaire mais garde la BP (plusieurs envois pour la même boîte)
  pendingPhoto = null;
  $('#photoPreview').classList.add('hidden');
  $('#btnPhoto').textContent = t('post.photo');
  $('#depPhoto').value = '';
  $('#depSender').value = '';
  $('#depTracking').value = '';
  $('#depGuichet').checked = false;
  $('#depQty').value = 1;
  renderPostman();
});

/* ---- Mode hors ligne : envoi de la file au retour du réseau ---- */
function flushQueue() {
  if (isOffline()) return;
  const q = loadQueue();
  if (!q.length) return;
  const data = loadStore();
  data.items.push(...q);
  if (saveStore(data)) {
    saveQueue([]);
    toast(t('post.synced', { n: q.length }));
  }
  renderPostman();
}
$('#simOffline').addEventListener('change', e => {
  setFlag(OFFLINE_KEY, e.target.checked);
  if (!e.target.checked) flushQueue();
  renderPostman();
});
window.addEventListener('online', () => { flushQueue(); renderPostman(); });
window.addEventListener('offline', renderPostman);

/* ---- Codes de vérification à déposer ---- */
function renderCodes(data) {
  const boxes = Object.values(data.boxes).filter(b => !b.verified);
  const list = $('#codesList');
  list.innerHTML = boxes.length ? boxes.map(b => `
    <div class="code-card">
      <div>
        <div class="mail-meta">${esc(t('post.codeFor', { bp: b.bp, cp: b.cp, name: b.name }))}</div>
        <div class="code-value">${esc(b.code)}</div>
      </div>
      ${b.codeDeposited
        ? `<span class="mail-flag ok">${t('post.codeDone')}</span>`
        : `<button class="btn mini corail" data-code="${esc(boxKey(b.bp, b.cp))}">${t('post.markDeposited')}</button>`}
    </div>`).join('') : `<div class="empty">${t('post.noCodes')}</div>`;
  list.querySelectorAll('[data-code]').forEach(btn => btn.addEventListener('click', () => {
    const d = loadStore();
    const b = d.boxes[btn.dataset.code];
    if (b) { b.codeDeposited = true; saveStore(d); }
    renderPostman();
  }));
}

/* ---- Guichet ---- */
function renderCounter(data) {
  const waiting = data.items.filter(i => needsCounter(i) && !i.collected).sort((a, b) => a.deadline - b.deadline);
  const cl = $('#counterList');
  cl.innerHTML = waiting.length
    ? waiting.map(i => itemHtml(i, { senderOverride: `BP ${i.bp} (${ownerLabel(data, i.bp, i.cp)})` }) ).join('')
    : `<div class="empty">${t('post.noCounter')}</div>`;
  bindItems(cl, waiting);

  const reports = data.items.filter(i => i.reported).sort((a, b) => b.reportedAt - a.reportedAt);
  const rl = $('#reportList');
  rl.innerHTML = reports.length
    ? reports.map(i => itemHtml(i, { senderOverride: `BP ${i.bp} (${ownerLabel(data, i.bp, i.cp)})${i.sender ? ' · ' + i.sender : ''}` })).join('')
    : `<div class="empty">${t('post.noReports')}</div>`;
  bindItems(rl, reports);
}

function handOver(token) {
  const data = loadStore();
  const it = data.items.find(i => i.pickupToken && i.pickupToken.toUpperCase() === token.trim().toUpperCase());
  if (!it) return toast(t('post.unknownCode'));
  if (it.collected) return toast(t('post.alreadyCollected'));
  it.collected = true; it.handed = true; it.collectedAt = Date.now();
  saveStore(data);
  toast(t('post.handedOver', { name: ownerLabel(data, it.bp, it.cp) }));
  renderPostman();
}

/* ---- Étiquettes QR des cases ---- */
const bpQrText = (bp, cp) => `RATAITI:BP:${bp}:${cp}`;

$('#formLabels').addEventListener('submit', e => {
  e.preventDefault();
  let from = parseInt($('#lblFrom').value, 10), to = parseInt($('#lblTo').value, 10);
  if (!from || !to) return;
  if (to < from) [from, to] = [to, from];
  if (to - from >= 60) { toast(t('post.tooMany')); to = from + 59; }
  const cp = $('#lblCp').value;
  let html = '';
  for (let bp = from; bp <= to; bp++) {
    html += `<div class="label" data-bp="${bp}" data-cp="${cp}">
      ${qrSvg(bpQrText(bp, cp), 3)}
      <div>BP ${bp} · ${cp}</div><div class="lbl-brand">Rata Iti 🛶</div></div>`;
  }
  $('#labelsSheet').innerHTML = html;
  $('#btnPrintLabels').classList.remove('hidden');
  // Démo sur ordinateur : toucher une étiquette = la scanner
  $$('#labelsSheet .label').forEach(l => l.addEventListener('click', () => selectBp(l.dataset.bp, l.dataset.cp)));
});
$('#btnPrintLabels').addEventListener('click', () => window.print());

function selectBp(bp, cp) {
  $('#depBp').value = bp;
  if (cp) $('#depCp').value = cp;
  document.querySelector('.tab[data-tab="deposit"]').click();
  updateOwner();
  toast(t('post.bpScanned', { bp }));
}

/* =========================================================
   SCANNER (QR) — caméra si disponible, sinon saisie manuelle
   ========================================================= */
let scanMode = null, scanStream = null, scanTimer = null;

async function openScanner(mode) {
  scanMode = mode;
  $('#scanTitle').textContent = mode === 'bp' ? t('scan.titleBp') : t('scan.titlePickup');
  $('#scanManual').value = '';
  $('#scanManual').placeholder = mode === 'bp' ? '1234' : 'RI-XXXXXX';
  $('#scanner').classList.remove('hidden');
  const video = $('#scanVideo');
  const canDetect = 'BarcodeDetector' in window && navigator.mediaDevices?.getUserMedia;
  if (!canDetect) {
    video.classList.add('hidden');
    $('#scanHint').textContent = t('scan.hintNoCamera');
    return;
  }
  try {
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = scanStream;
    video.classList.remove('hidden');
    await video.play();
    $('#scanHint').textContent = t('scan.hintCamera');
    scanTimer = setInterval(async () => {
      try {
        const codes = await detector.detect(video);
        if (codes.length) handleScan(codes[0].rawValue);
      } catch (e) {}
    }, 300);
  } catch (e) {
    video.classList.add('hidden');
    $('#scanHint').textContent = t('scan.hintNoCamera');
  }
}

function closeScanner() {
  clearInterval(scanTimer);
  if (scanStream) scanStream.getTracks().forEach(tr => tr.stop());
  scanStream = null;
  $('#scanner').classList.add('hidden');
}

function handleScan(value) {
  const v = String(value).trim();
  if (!v) return;
  const mode = scanMode;
  closeScanner();
  if (mode === 'bp') {
    const m = v.match(/^RATAITI:BP:(\d+):(\d{5})$/);
    if (m) selectBp(m[1], m[2]);
    else if (/^\d{1,6}$/.test(v)) selectBp(v, null);
    else toast(t('post.unknownCode'));
  } else {
    handOver(v);
  }
}

$('#btnScanBp').addEventListener('click', () => openScanner('bp'));
$('#btnScanPickup').addEventListener('click', () => openScanner('pickup'));
$('#btnScanClose').addEventListener('click', closeScanner);
$('#formScanManual').addEventListener('submit', e => { e.preventDefault(); handleScan($('#scanManual').value); });

/* =========================================================
   Synchronisation entre onglets (démo en direct)
   ========================================================= */
window.addEventListener('storage', e => {
  if (e.key !== STORE_KEY) return;
  if (current === 'postman') { renderPostman(); return; }
  if (current === 'user-verify') { renderVerify(); return; }
  if (current !== 'user') return;

  const s = loadSession();
  if (!s) return;
  let oldItems = [];
  try { oldItems = JSON.parse(e.oldValue || '{}').items || []; } catch (err) {}
  const oldIds = new Set(oldItems.map(i => i.id));
  const data = loadStore();
  const key = boxKey(s.bp, s.cp);
  const fresh = data.items.filter(i => !oldIds.has(i.id) && boxKey(i.bp, i.cp) === key);
  renderUser();
  if (fresh.length && data.boxes[key]) alertFresh(fresh, data.boxes[key]);
});

/* =========================================================
   Données d'exemple / remise à zéro
   ========================================================= */
$('#btnSeed').addEventListener('click', () => {
  const data = loadStore();
  const bp = '1234', cp = '98716', name = 'Teva Tapu';
  data.boxes[boxKey(bp, cp)] = { name, bp, cp, code: randomCode(), verified: true, codeDeposited: true, prefs: { ...DEFAULT_PREFS } };
  data.boxes[boxKey('5678', '98713')] = { name: 'Hinano Teriitahi', bp: '5678', cp: '98713', code: randomCode(), verified: false, codeDeposited: false, prefs: { ...DEFAULT_PREFS } };
  const now = Date.now();
  const ex = [
    { type: 'lettre', sender: 'CPS', photo: fakeEnvelope('CPS', name.toUpperCase(), bp, cp), date: now - 2 * 3600e3 },
    { type: 'lettre', sender: 'EDT Engie', photo: fakeEnvelope('EDT ENGIE', name.toUpperCase(), bp, cp, '#f4f9ff', '#2a7fd4'), date: now - 3 * 3600e3 },
    { type: 'colis', sender: 'Amazon', tracking: 'CP482913376FR', guichet: true, date: now - 26 * 3600e3, deadline: now - 26 * 3600e3 + HOLD_DAYS * 864e5, pickupToken: randomToken(), extended: false },
    { type: 'pub', sender: 'Supermarché', qty: 2, date: now - 27 * 3600e3 },
    { type: 'recommande', sender: 'Trésor public', tracking: '1A02345678912', photo: fakeEnvelope('TRÉSOR PUBLIC', name.toUpperCase(), bp, cp, '#fffbe8', '#7a5c00'), date: now - 50 * 3600e3, collected: true, handed: true, collectedAt: now - 30 * 3600e3, pickupToken: randomToken() },
  ];
  ex.forEach(x => data.items.push({ id: uid(), bp, cp, qty: 1, guichet: false, tracking: '', photo: null, collected: false, ...x }));
  saveStore(data);
  saveSession({ bp, cp });
  toast(t('toast.seeded'));
  go('user');
});

let resetArmed = 0;
$('#btnReset').addEventListener('click', () => {
  if (Date.now() - resetArmed > 3000) { resetArmed = Date.now(); return toast(t('toast.resetConfirm')); }
  resetArmed = 0;
  try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(QUEUE_KEY); } catch (e) {}
  saveSession(null);
  toast(t('toast.reset'));
});

/* ---------- Démarrage ---------- */
applyI18n();
fillCpSelects();
document.body.classList.toggle('large', getFlag(LARGE_KEY, localStorage));
purgeOld();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
go('home');

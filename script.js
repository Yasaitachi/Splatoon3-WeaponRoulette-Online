// --- Firebase Configuration / Firebase設定 -----------------------------------------------

// ▼▼▼ PASTE FIREBASE CONFIG HERE / Firebase設定をここに貼り付け ▼▼▼
// WARNING: Do not commit this file with your actual API key to a public repository. Google may disable the key for security reasons.
// 警告: 実際のAPIキーを含むこのファイルを公開リポジトリにコミットしないでください。セキュリティ上の理由からGoogleがキーを無効にする可能性があります。
// Consider using environment variables or a git-ignored configuration file for production applications.
// 本番環境では、環境変数やgit-ignoreした設定ファイルの使用を検討してください。
// For Firebase JS SDK v7.20.0 and later, measurementId is optional / Firebase JS SDK v7.20.0以降、measurementIdはオプションです
const firebaseConfig = {
  apiKey: "AIzaSyDU1_EpLI3SXLYIiDdC52OJf8f6EcaVDgs",
  authDomain: "splatoon3-weapon-roulette1.firebaseapp.com",
  databaseURL: "https://splatoon3-weapon-roulette1-default-rtdb.firebaseio.com",
  projectId: "splatoon3-weapon-roulette1",
  storageBucket: "splatoon3-weapon-roulette1.firebasestorage.app",
  messagingSenderId: "403751873324",
  appId: "1:403751873324:web:c1517d7238801b1c431a89",
  measurementId: "G-RSNY1FGMW8"
};
// ▲▲▲ PASTE FIREBASE CONFIG HERE / Firebase設定はここまで ▲▲▲

// --- Admin Settings / 管理者設定 ---------------------------------------------------------
// Add persistent IDs of administrators here. Multiple IDs can be specified. / ここに管理者の永続IDを追加してください。IDは複数指定可能です。
// You can check your own ID by running localStorage.getItem('persistentUserId') in the developer tools. / 自分のIDは開発者ツールで localStorage.getItem('persistentUserId') を実行して確認できます。
const ADMIN_USER_IDS = ['32dc0cf4-6acd-4078-b16a-f3a56e0fac72'];

// --- Global Variables / グローバル変数 ---------------------------------------------------------
const APP_VERSION = '1.2.5'; // Application version. Change this number when updating. / アプリケーションのバージョン。更新時にこの数値を変更する。
const RESET_TIMEOUT_MS = 10000; // 10 seconds / 10秒
const ROOM_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes / 10分
const ROOM_LIFETIME_MS = 3 * 60 * 60 * 1000; // 3 hours / 3時間
const state = {
  running: false,
  resetTimer: null,
  pool: [],
  history: [],
  lastPick: null,
  interval: 50,
  // Firebase state / Firebase関連の状態
  db: null,
  roomRef: null,
  playerRef: null,
  roomId: null,
  isHost: false,
  playerName: '',
  activityTimer: null,
  lang: 'ja',
  theme: 'system',
  roomPassword: null,
  roomHasPassword: false,
  voiceChannelInvite: null,
  roomExpiryTimer: null,
  notifications: [],
  unreadNotifications: 0,
  mutedUsers: {},
  isBanned: false,
  globalMuteInfo: null,
  // ▼▼▼ Added from here / ここから追加 ▼▼▼
  publicRooms: [],
  publicRoomHostNames: {},
  publicRoomsListener: null,
  publicRoomsQuery: null,
  // ▲▲▲ Added up to here / ここまで追加 ▲▲▲
};

let channelState = {
  currentChannel: null,
  members: [],
  memberDataListeners: {},
  channelListener: null,
  invitationListener: null,
};

const ICONS = {
  FULLSCREEN: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  EXIT_FULLSCREEN: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0-2-2h-3M3 16h3a2 2 0 0 0 2-2v-3"/></svg>`,
  CROWN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M5 16h14"></path></svg>`,
  MIC_OFF: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
  MORE_VERTICAL: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>`,
  LOCK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const historyEl = $('#history');
const historyCount = $('#historyCount');
const noRepeat = $('#noRepeat');
const playerCountInput = $('#playerCount');
const resultContainer = $('#resultContainer');
const fullscreenBtn = $('#fullscreenBtn');
const joinVoiceChannelBtn = $('#joinVoiceChannelBtn');
const setVcLinkBtn = $('#setVcLinkBtn');
const settingsBtn = $('#settingsBtn');
const settingsModal = $('#settingsModal');
const closeSettingsBtn = $('#closeSettingsBtn');
const copyInviteLinkBtn = $('#copyInviteLinkBtn');
const roomTimer = $('#room-timer');
const createRoomBtn = $('#createRoomBtn');
const leaveRoomBtn = $('#leaveRoomBtn');
const roomPasswordDisplay = $('#roomPasswordDisplay');
const roomInfoUi = $('#room-info-ui');
const roomIdDisplay = $('#roomIdDisplay');
const hostBadge = $('#host-badge');
const playerSettingsBtn = $('#playerSettingsBtn');
const playerSettingsModal = $('#playerSettingsModal');
const closePlayerSettingsBtn = $('#closePlayerSettingsBtn');
const settingsPlayerNameInput = $('#settingsPlayerNameInput');
const confirmPlayerSettingsBtn = $('#confirmPlayerSettingsBtn');
const playerShortIdDisplay = $('#playerShortIdDisplay');
const loaderOverlay = $('#loader-overlay');
const loaderText = $('#loader-text');
const playerListContainer = $('#player-list-container');
const playerListEl = $('#player-list');
const playerCountDisplay = $('#playerCountDisplay');
const chatContainer = $('#chat-container');
const chatMessagesEl = $('#chat-messages');
const chatInput = $('#chatInput');
const chatSendBtn = $('#chatSendBtn');
const voiceInputBtn = $('#voiceInputBtn');
const streamerModeToggle = $('#streamerMode');
const preventSleepToggle = $('#preventSleep');
const adminLink = $('#adminLink');
const channelBtn = $('#channelBtn');
const channelModal = $('#channelModal');
const closeChannelModalBtn = $('#closeChannelModalBtn');
const inviteChannelMembersBtn = $('#inviteChannelMembersBtn');
const notifyChannelBtn = $('#notifyChannelBtn');
const inviteContainer = $('#invite-container');
const inviteBtn = $('#inviteBtn');
const inviteMenu = $('#invite-menu');
const realtimeModal = $('#realtimeModal');
const notificationBadge = $('#notification-badge');
const notificationsListEl = $('#notifications-list');
const fullscreenStatusBar = $('#fullscreen-status-bar');

// --- Application Logic / アプリケーションロジック ----------------------------------------------

function getWeaponName(weapon) {
  return state.lang === 'en' && weapon.name_en ? weapon.name_en : weapon.name;
}

/**
 * Escapes HTML to prevent XSS attacks.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

/**
 * Synchronizes player name between state, localStorage, and UI.
 * @param {string} newName - The new player name. / 新しいプレイヤー名
 */
function syncAndSavePlayerName(newName) {
  const trimmedName = newName.trim();
  state.playerName = trimmedName;
  localStorage.setItem('splaRoulettePlayerName', trimmedName);
  if (settingsPlayerNameInput.value !== trimmedName) {
    settingsPlayerNameInput.value = trimmedName;
  }
}

/**
 * Generates a UUID v4.
 * @returns {string} The generated UUID. / 生成されたUUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Gets or generates a persistent user ID from localStorage.
 * @returns {string} The persistent user ID. / 永続的なユーザーID
 */
function getPersistentUserId() {
  let userId = localStorage.getItem('persistentUserId');
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem('persistentUserId', userId);
  }
  return userId;
}

/**
 * Gets or creates a user's shortId.
 * @param {string} persistentUserId - The user's persistent ID. / ユーザーの永続ID
 * @param {string} playerName - The user's current player name. / ユーザーの現在のプレイヤー名
 * @returns {Promise<string>} The user's shortId. / ユーザーのshortId
 */
async function getOrCreateUserShortId(persistentUserId, playerName) {
  const userRef = firebase.database().ref(`users/${persistentUserId}`);
  const userSnapshot = await userRef.once('value');
  const userData = userSnapshot.val();

  // If user data exists and the name is the same, return the existing ID. / ユーザーデータがあり、名前も同じなら既存のIDを返す
  if (userData && userData.shortId && userData.name === playerName) {
    return userData.shortId;
  }

  // If the name is different or it's the first time, regenerate the ID.
  // If an old ID exists, release it first.
  // 名前が違う、または初めての場合、IDを再生成する。もし古いIDが存在すれば、まずそれを解放する。
  if (userData && userData.shortId) {
    const oldShortId = userData.shortId;
    // Remove the old ID from shortIdMap. Continue even if it fails. / shortIdMapから古いIDを削除。失敗しても処理は続行する。
    await firebase.database().ref(`shortIdMap/${oldShortId}`).remove().catch(e => console.warn("Could not remove old shortId from map:", e));
  }

  // Logic to generate a new ID. / 新しいIDを生成するロジック
  const shortIdMapRef = firebase.database().ref('shortIdMap');
  let newShortId;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (attempts < MAX_ATTEMPTS) {
    newShortId = Math.floor(10000 + Math.random() * 90000).toString();
    const { committed } = await shortIdMapRef.child(newShortId).transaction(currentData => (currentData === null ? persistentUserId : undefined));
    if (committed) {
      // Overwrite (or create) user info with the new name and ID. / ユーザー情報を新しい名前とIDで上書き（または新規作成）
      await userRef.set({ name: playerName, shortId: newShortId, createdAt: firebase.database.ServerValue.TIMESTAMP });
      return newShortId;
    }
    attempts++;
  }
  throw new Error(`Failed to generate a unique shortId after ${MAX_ATTEMPTS} attempts.`);
}

const MAX_NOTIFICATIONS = 30;

function addNotification(notification) {
  // Avoid duplicate notifications for the same room within a short time frame
  if (state.notifications.some(n => n.roomId === notification.roomId && n.timestamp > Date.now() - 60000)) {
    return;
  }

  notification.id = generateUUID(); // Give it a unique ID for dismissal
  notification.read = false;
  state.notifications.unshift(notification);

  // Limit the number of stored notifications
  if (state.notifications.length > MAX_NOTIFICATIONS) {
    state.notifications.pop();
  }

  state.unreadNotifications++;
  updateNotificationBadge();
}

function updateNotificationBadge() {
  if (!notificationBadge || !channelBtn) return;

  if (state.unreadNotifications > 0) {
    notificationBadge.textContent = state.unreadNotifications > 9 ? '9+' : state.unreadNotifications;
    notificationBadge.style.display = 'flex';
    channelBtn.title = t('notification-badge-title', { count: state.unreadNotifications });
  } else {
    notificationBadge.style.display = 'none';
    channelBtn.title = t('channel-title');
  }
}

function renderNotifications() {
  if (!notificationsListEl) return;

  if (state.notifications.length === 0) {
    notificationsListEl.innerHTML = `<div class="empty" data-i18n-key="notifications-empty">${t('notifications-empty')}</div>`;
    return;
  }

  notificationsListEl.innerHTML = state.notifications.map(n => {
    const timestamp = new Date(n.timestamp).toLocaleString();
    const typeText = n.type === 'direct' ? t('notification-type-direct') : t('notification-type-channel');
    let bodyText = '';
    if (n.type === 'direct') {
      bodyText = t('direct-invitation-received', { hostName: n.hostName });
    } else {
      bodyText = t('channel-invitation-received', { hostName: n.hostName, channelName: n.channelName });
    }

    return `
      <div class="notification-item ${n.read ? '' : 'unread'}" data-notification-id="${n.id}">
        <div class="notification-header">
          <span class="notification-type">${typeText}</span>
          <span class="notification-timestamp">${timestamp}</span>
        </div>
        <div class="notification-body">${escapeHTML(bodyText)}</div>
        <div class="notification-actions">
          <button class="btn secondary" data-action="dismiss-notification">${t('notification-dismiss-btn')}</button>
          <button class="btn" data-action="join-from-notification">${t('notification-join-btn')}</button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Shows the loading overlay.
 * @param {string} text - The text to display. / 表示するテキスト
 */
function showLoader(text = '') {
  if (!loaderOverlay) return;
  if (loaderText) {
    loaderText.textContent = text;
  }
  loaderOverlay.classList.add('visible');
}

/**
 * Hides the loading overlay.
 */
function hideLoader() {
  if (!loaderOverlay) return;
  loaderOverlay.classList.remove('visible');
}

/**
 * Logs a server error to the console and notifies the user with a toast.
 * @param {string} message - The message to display to the user. / ユーザーに表示するメッセージ
 * @param {Error} error - The caught error object. / キャッチしたエラーオブジェクト
 */
function showServerError(message, error) {
  console.error(message, error);
  const displayMessage = error && error.message ? `${message} (${error.message})` : message;
  if (typeof showToast === 'function') {
    showToast(displayMessage, 'error', 8000);
  }
}

/**
 * Updates the server connection status indicator in the UI.
 * @param {string} status - The connection status ('connecting', 'connected', 'disconnected', 'error'). / 接続ステータス ('connecting', 'connected', 'disconnected', 'error')
 */
function updateServerStatusIndicator(status) {
  const indicator = $('#server-status');
  if (!indicator) return;

  indicator.style.display = 'inline-flex';
  indicator.className = `status-indicator status-item ${status}`;
}

/**
 * Manages the user's online status in Firebase.
 */
function manageUserPresence() {
  const myId = getPersistentUserId();
  if (!myId || !state.db) return;

  const userStatusRef = state.db.ref(`users/${myId}/status`);
  const connectedRef = state.db.ref('.info/connected');

  connectedRef.on('value', (snap) => {
    if (snap.val() !== true) {
      return;
    }
    // onDisconnect needs to be re-established every time a connection is made. / onDisconnectは接続が確立されるたびに再設定する必要がある
    userStatusRef.onDisconnect().set({
      isOnline: false,
      lastSeen: firebase.database.ServerValue.TIMESTAMP,
      // ▼▼▼ Added from here / ここから追加 ▼▼▼
      roomId: null,
      hasPassword: null,
      roomVisibility: null,
      // ▲▲▲ Added up to here / ここまで追加 ▲▲▲
    }).then(() => {
      // Set online status after onDisconnect is set. / onDisconnect設定後にオンライン状態をセット
      userStatusRef.update({ isOnline: true, lastSeen: firebase.database.ServerValue.TIMESTAMP }); // Changed from set to update / setからupdateに変更
    });
  });
}

/**
 * Updates the player name and ID and reflects it in the UI.
 */
async function updatePlayerNameAndId() {
  const newName = settingsPlayerNameInput.value.trim();
  if (!newName) {
    showToast(t('player-name-required'), 'error');
    return;
  }

  showLoader(t('player-settings-updating'));
  try {
    syncAndSavePlayerName(newName);
    const persistentUserId = getPersistentUserId();
    const shortId = await getOrCreateUserShortId(persistentUserId, newName);
    playerShortIdDisplay.textContent = `#${shortId}`;
    showToast(t('player-settings-updated'), 'success');
    playerSettingsModal.style.display = 'none';
    updateAdminUI();
  } catch (error) {
    showServerError(t('player-settings-update-failed'), error);
  } finally {
    hideLoader();
  }
}

/**
 * Displays a toast notification.
 * @param {string} message - The message to display. / 表示するメッセージ
 * @param {string} [type='info'] - The type of toast ('success', 'error', 'info'). / トーストの種類 ('success', 'error', 'info')
 * @param {number} [duration=3000] - The display duration in milliseconds. / 表示時間 (ミリ秒)
 */
function showToast(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Add a progress bar. / プログレスバーを追加
  const progressBar = document.createElement('div');
  progressBar.className = 'toast-progress-bar';
  progressBar.style.animationDuration = `${duration}ms`; // Sync with toast display time / トーストの表示時間と同期
  toast.appendChild(progressBar);

  toastContainer.appendChild(toast);

  // Add 'show' class after a short delay to trigger CSS transition. / 少し遅らせて 'show' クラスを追加し、CSSトランジションを発火させる
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove 'show' class after the specified duration to fade out. / 指定時間後に 'show' クラスを削除し、フェードアウトさせる
  setTimeout(() => {
    toast.classList.remove('show');
    // Remove the element from the DOM after the transition ends. / トランジション完了後に要素をDOMから削除
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

/**
 * Formats and displays server-related errors to the user.
 * @param {string} userMessage - The message to display to the user (translated). / ユーザーに表示するメッセージ (翻訳済み)
 * @param {Error} error - The error object that occurred. / 発生したエラーオブジェクト
 */
function showServerError(userMessage, error) {
  console.error(`${userMessage}:`, error); // 開発者向けにコンソールに詳細なエラーを出力
  const errorCode = error.code ? ` (Code: ${error.code})` : '';
  showToast(`${userMessage}${errorCode}`, 'error', 6000); // エラーは少し長めに表示
}

function getActivePool() {
  const enabledClass = $$('input[data-class]:checked').map(i => i.getAttribute('data-class'));
  const enabledSub = $$('input[data-sub]:checked').map(i => i.getAttribute('data-sub'));
  const enabledSp = $$('input[data-sp]:checked').map(i => i.getAttribute('data-sp'));
  return weapons.filter(w =>
    enabledClass.includes(w.class) &&
    enabledSub.includes(w.sub) &&
    enabledSp.includes(w.sp)
  );
}

function updatePool() {
  const base = getActivePool();
  const pool = noRepeat.checked ? base.filter(w => !state.history.some(h => h.name === w.name)) : base;
  state.pool = pool.length ? pool : base;
  updateProbText();
  renderProbTable();
}

function updateProbText() {
  const n = state.pool.length;
  const prob = n ? (100 / n) : 0;
  const resultDetailsEl = $('#resultDetails');

  // Determine by the presence of i18n key to avoid overwriting class display during result display. / 結果表示中はクラス表示を上書きしないように、i18nキーの有無で判定
  if (resultDetailsEl && resultDetailsEl.hasAttribute('data-i18n-key')) {
    if (n) {
      resultDetailsEl.textContent = t('current-candidates', { n: n, prob: prob.toFixed(1) });
    } else {
      resultDetailsEl.textContent = t('no-candidates-filter');
    }
  }
}

/**
 * Adds one draw result to the history and updates the UI.
 * @param {Object} weapon - The drawn weapon object. / 抽選されたブキオブジェクト
 * @param {string} batchTime - The timestamp of the draw group. / 抽選グループのタイムスタンプ
 * @param {number} playerNum - The player number. / プレイヤー番号
 * @param {number} totalPlayers - The total number of players. / 合計プレイヤー数
 */
function pushHistoryItem(weapon, batchTime, playerNum, totalPlayers) {
  const historyItem = {
    ...weapon,
    time: batchTime,
    playerNum,
    totalPlayers,
  };
  state.history.push(historyItem);
  renderHistory(); // Update history display / 履歴の表示を更新
}

function renderHistory() {
  const isOnline = !!state.roomRef;
  const historyArray = [...state.history].sort((a, b) => a.time.localeCompare(b.time));
  const totalItems = historyArray.length;
  const batchIds = new Set(historyArray.map(h => h.time));
  historyCount.textContent = t('history-count-value', { batches: batchIds.size, total: totalItems });

  if (!totalItems) {
    historyEl.innerHTML = `<div class="empty" data-i18n-key="history-empty">${t('history-empty')}</div>`;
    return;
  }
  historyEl.innerHTML = historyArray.map((h, index) => {
    const time = new Date(h.time);
    
    // Separate draws from the same session with a line. / 同じ回の抽選は線で区切る
    const isNewBatch = (index === 0) || (h.time !== historyArray[index - 1].time);
    const batchClass = isNewBatch && index > 0 ? 'new-batch-separator' : '';

    // Display player number only for multiplayer. / 複数人プレイの場合のみプレイヤー番号を表示
    const playerLabel = h.totalPlayers > 1 ? `P${h.playerNum}: ` : '';

    let deleteButton = '';
    if (isOnline && state.isHost) {
        deleteButton = `<button class="btn secondary icon" data-delete-key="${h.key}" data-i18n-title="history-delete-item" title="${t('history-delete-item')}">×</button>`;
    } else if (!isOnline) {
        // In local mode, delete by index. / ローカルモードではインデックスで削除
        const localIndex = state.history.findIndex(localItem => localItem.time === h.time && localItem.name === h.name);
        deleteButton = `<button class="btn secondary icon" data-delete-index="${localIndex}" data-i18n-title="history-delete-item" title="${t('history-delete-item')}">×</button>`;
    }

    return `
      <div class="history-item ${batchClass}">
        <div class="history-item__main">
          <div class="history-weapon-name">${playerLabel}${getWeaponName(h)}</div>
          <div class="history-weapon-details muted">${t(h.class)} / ${t(h.sub)} / ${t(h.sp)}</div>
        </div>
        <div class="history-item__aside">
          <div class="history-item__meta muted">
            <div>${time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
          </div>
          ${deleteButton}
        </div>
      </div>
    `;
  }).join('');
  // Scroll to the bottom when history is added. / 履歴が追加されたら一番下までスクロールする
  historyEl.scrollTop = historyEl.scrollHeight;
}

function handleDeleteHistoryItem(e) {
  const target = e.target.closest('[data-delete-key], [data-delete-index]');
  if (!target) return;

  // Online mode: host can delete by key. / オンラインモード: ホストはキーで削除可能
  if (state.roomRef && state.isHost) {
    const key = target.dataset.deleteKey;
    if (key) {
      state.roomRef.child('history').child(key).remove();
      // The 'value' listener on history will re-render. / historyの'value'リスナーが再描画します
      return;
    }
  }

  // Local mode: delete by index. / ローカルモード: インデックスで削除
  if (!state.roomRef) {
    const index = parseInt(target.dataset.deleteIndex, 10);
    if (!isNaN(index)) {
      state.history.splice(index, 1);
      renderHistory();
      saveHistory();
      updatePool();
    }
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const getInteractiveControls = () => [
  ...$$('.main-controls button:not(#fullscreenBtn), .main-controls input, #history button'),
  ...$$('#classFilters input, #classFilters button')
];

function setControlsDisabled(disabled) {
  if (disabled) {
    getInteractiveControls().forEach(c => c.disabled = true);
    return;
  }

  // When enabling, first re-enable all controls. / 有効化する際は、まず全てのコントロールを有効に戻す
  getInteractiveControls().forEach(c => c.disabled = false);
  // Then, if in a room, re-apply restrictions based on role. / その後、ルーム内にいる場合は、役割に応じて再度制限をかける
  if (state.roomRef) {
    setRealtimeUiState(state.isHost ? 'in_room_host' : 'in_room_viewer');
  }
}

/**
 * Runs a single draw animation and returns the resulting weapon object.
 * @param {Array} pool - The array of weapons to draw from. / 抽選対象のブキ配列
 * @param {Object|null} finalPickOverride - The weapon that should be ultimately selected (specified by the server). / 最終的に選択されるべきブキ（サーバーから指定）
 * @returns {Promise<Object|null>} - The drawn weapon object. / 抽選されたブキオブジェクト
 */
function runSingleAnimation(pool, finalPickOverride = null) {
    return new Promise((resolve) => {
        if (!pool || pool.length === 0) {
            resolve(null);
            return;
        }

        let t = 0;
        let interval = 40;
        // Set a random duration between 5 and 7.5 seconds. / 5秒から7.5秒の間でランダムな時間を設定
        const duration = Math.random() * 2500 + 5000;
        const start = performance.now();
        let lastPickForAnim;

        const tick = (now) => {
            if (!state.running) {
                resolve(null);
                return;
            }

            if (now - t >= interval) {
                t = now;
                const w = pickRandom(pool);
                lastPickForAnim = w;
                showSpinningText(w);

                const progress = Math.min(1, (now - start) / duration);
                interval = 40 + progress * 180;

                if (progress >= 1) {
                    // If a weapon is specified by the server, use it; otherwise, use the last animated weapon as the final result.
                    const finalPick = finalPickOverride ?? lastPickForAnim ?? pickRandom(pool);
                    // Ensure the last frame of the animation displays the correct final weapon.
                    // アニメーションの最後のフレームが、正しい最終結果のブキを表示するようにする
                    showSpinningText(finalPick);
                    // Wait a moment for the final frame to render before resolving the promise.
                    // プロミスを解決する前に、最終フレームが描画されるのを少し待つ
                    setTimeout(() => resolve(finalPick), 100);
                } else {
                    requestAnimationFrame(tick);
                }
            } else {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    });
}

/**
 * Generates draw results (common logic for online/local).
 * @returns {Array<Object>|null} An array of weapon objects for the results, or null if conditions are not met. / 抽選結果のブキ配列、または条件を満たさない場合はnull
 */
function getDrawResults() {
  const playerCount = parseInt(playerCountInput.value, 10);
  if (noRepeat.checked && state.pool.length < playerCount) {
    showToast(t('no-candidates-alert', { poolCount: state.pool.length, playerCount: playerCount }), 'error');
    return null;
  }
  if (state.pool.length === 0) {
    showToast(t('no-candidates-alert-title'), 'error');
    return null;
  }

const finalResults = [];
const tempPool = [...state.pool];
for (let i = 0; i < playerCount; i++) {
  if (tempPool.length === 0) break;
  const result = pickRandom(tempPool);
  if (result) {
    finalResults.push(result);
    if (noRepeat.checked) {
      const index = tempPool.findIndex(item => item.name === result.name);
      if (index > -1) tempPool.splice(index, 1);
    }
  }
}
return finalResults;
}

/**
 * Persists the draw results (saves to history and sends Discord notification).
 * @param {Array<Object>} finalResults - An array of the draw results. / 抽選結果の配列
 * @param {string} drawTime - The ISO string of the draw time. / 抽選時刻のISO文字列
 */
async function persistResults(finalResults, drawTime) {
    const isOnline = !!state.roomRef;
    if (isOnline) {
        if (state.isHost) {
            const historyRef = state.roomRef.child('history');
            const updates = {};
            finalResults.forEach((result, i) => {
                const newKey = historyRef.push().key;
                updates[newKey] = { ...result, time: drawTime, playerNum: i + 1, totalPlayers: finalResults.length };
            });
            await historyRef.update(updates);
        }
    } else {
        finalResults.forEach((result, i) => {
            pushHistoryItem(result, drawTime, i + 1, finalResults.length);
        });
        saveHistory();
    }
}

/**
 * Displays the spin result on the screen.
 * @param {Array<Object>} finalResults - An array of weapon objects for the results. / 抽選結果のブキ配列
 * @param {Array<Object>} pool - The pool used for the draw. / 抽選に使われたプール
 */
async function displaySpinResult(finalResults, pool) {
  if (state.running) return;
  clearTimeout(state.resetTimer);

  state.running = true;
  setControlsDisabled(true);

  const playerCount = finalResults.length;
  const isOnline = !!state.roomRef;

  if (playerCount === 1) {
      const result = finalResults[0];
      await runSingleAnimation(pool, result);
      await showFinalResult([result]);
  } else {
      for (let i = 0; i < playerCount; i++) {
          resultContainer.innerHTML = `
              <div id="resultName" class="name">${t('player-draw', { playerNum: i + 1 })}</div>
              <div id="resultDetails" class="details">${t('player-draw-wait')}</div>
          `;
          await new Promise(resolve => setTimeout(resolve, 1200));

          const result = finalResults[i];
          if (!result) break;

          await runSingleAnimation(pool, result);
          await showFinalResult([result]);
          await new Promise(resolve => setTimeout(resolve, 1500));
      }
      if (finalResults.length > 0) { // 1つずつ結果を更新
          await showFinalResult(finalResults);
      }
  }

  if (finalResults.length > 0) {
      const drawTime = new Date().toISOString();
      await persistResults(finalResults, drawTime);
      if ($('#autoCopy')?.checked) {
          await copyResultToClipboard(finalResults);
      }

      state.resetTimer = setTimeout(() => {
          resultContainer.innerHTML = `
        <div id="resultName" class="name" data-i18n-key="reset-display-name">${t('reset-display-name')}</div>
        <div id="resultDetails" class="details" data-i18n-key="reset-display-class">${t('reset-display-class')}</div>
      `;
      }, RESET_TIMEOUT_MS);
  }

  state.running = false;
  setControlsDisabled(false);
  updatePool();
}

async function performDraw() {
  if (state.running || !state.isHost || !state.roomRef) return;

  updatePool();
  const finalResults = getDrawResults();
  if (!finalResults) return;

  // Write results to Firebase. / 結果をFirebaseに書き込む
  state.roomRef.child('spinResult').set({
    finalResults: finalResults,
    pool: state.pool, // Also pass the original pool for animation. / アニメーション用に元のプールも渡す
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

async function startSpin() {
  if (state.running) return;

  if (state.roomRef) {
    // Online mode: only the host can perform the draw. / オンラインモード: ホストのみが抽選を実行
    if (state.isHost) {
      await performDraw();
    }
  } else {
    // Local mode. / ローカルモード
    updatePool();
    const finalResults = getDrawResults();
    if (finalResults) {
      await displaySpinResult(finalResults, state.pool);
    }
  }
}

function showSpinningText(weapon) {
    if (!weapon) return;

    let nameEl = $('#resultName');
    let detailsEl = $('#resultDetails');

    // If elements don't exist (e.g., after showing multi-player list), recreate them.
    if (!nameEl || !detailsEl) {
        resultContainer.innerHTML = `
            <div id="resultName" class="name"></div>
            <div id="resultDetails" class="details"></div>
        `;
        nameEl = $('#resultName');
        detailsEl = $('#resultDetails');
    }

    // Add animation classes
    nameEl.classList.add('spin-out');
    detailsEl.classList.add('spin-out');

    // After the 'out' animation, change the text and trigger the 'in' animation
    setTimeout(() => {
        nameEl.textContent = getWeaponName(weapon);
        detailsEl.innerHTML = `
            <span>${t(weapon.class)}</span><span class="separator">/</span><span>${t(weapon.sub)}</span><span class="separator">/</span><span>${t(weapon.sp)}</span>
        `;
        nameEl.classList.remove('spin-out');
        detailsEl.classList.remove('spin-out');
        nameEl.classList.add('spin-in');
        detailsEl.classList.add('spin-in');
    }, 80); // This duration should be slightly less than the animation time
}

/**
 * Displays the final draw results on the screen.
 * @param {Array<Object>} results - An array of weapon objects to display. / 表示するブキオブジェクトの配列
 */
async function showFinalResult(results) {
  if (!results || results.length === 0) {
    resultContainer.innerHTML = `
      <div id="resultName" class="name">${t('error')}</div>
      <div id="resultDetails" class="details">${t('error-failed-draw')}</div>
    `;
    return;
  }

  if (results.length === 1) {
    const w = results[0];
    let nameEl = $('#resultName');
    let detailsEl = $('#resultDetails');

    if (!nameEl || !detailsEl) {
        resultContainer.innerHTML = `
            <div id="resultName" class="name"></div>
            <div id="resultDetails" class="details"></div>
        `;
        nameEl = $('#resultName');
        detailsEl = $('#resultDetails');
    }

    // Final result animation
    nameEl.classList.add('final-result');
    detailsEl.classList.add('final-result');

    nameEl.textContent = getWeaponName(w);
    detailsEl.innerHTML = `<span>${t(w.class)}</span><span class="separator">/</span><span>${t(w.sub)}</span><span class="separator">/</span><span>${t(w.sp)}</span>`;

  } else {
    resultContainer.innerHTML = `<ul class="result-list"></ul>`;
    const listEl = resultContainer.querySelector('.result-list');

    // Display placeholders first. / まずはプレースホルダーを表示
    results.forEach((w, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="player-label">${t('player-result-list', { i: i + 1 })}</span>
        <div class="weapon-details">
          <div class="weapon-name">...</div>
          <div class="weapon-sub-sp muted">...</div>
        </div>
      `;
      listEl.appendChild(li);
    });

    // Update results one by one. / 1つずつ結果を更新
    for (let i = 0; i < results.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Wait for 0.3 seconds / 0.3秒待つ
      const resultItem = listEl.children[i];
      const nameEl = resultItem.querySelector('.weapon-name');
      const subSpEl = resultItem.querySelector('.weapon-sub-sp');
      const w = results[i];
      nameEl.textContent = getWeaponName(w);
      subSpEl.textContent = `${t(w.class)} / ${t(w.sub)} / ${t(w.sp)}`;
    }
  }
}

/**
 * Copies the draw results to the clipboard.
 * @param {Array<Object>} results - An array of weapon objects from the draw results. / 抽選結果のブキオブジェクトの配列
 */
async function copyResultToClipboard(results) {
  if (!results || results.length === 0) return;

  const textToCopy = results.map((w, i) => {
    const playerLabel = results.length > 1 ? `${t('player-result-list', { i: i + 1 })}: ` : '';
    const weaponName = getWeaponName(w);
    const details = `${t(w.class)} / ${t(w.sub)} / ${t(w.sp)}`;
    return `${playerLabel}${weaponName}\n${details}`;
  }).join('\n\n');

  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast(t('results-copied-to-clipboard'), 'success');
  } catch (err) {
    console.error('Failed to copy result to clipboard:', err);
    showToast(t('copy-failed'), 'error');
  }
}

function resetAll() {
  state.running = false;
  clearTimeout(state.resetTimer);

  noRepeat.checked = false;
  
  $$('#classFilters input[type="checkbox"]').forEach(i => i.checked = true);

  if (state.isHost && state.roomRef) {
    state.roomRef.child('history').remove();
  } else if (!state.roomRef) { // ローカルモードの場合のみ
    state.history = [];
    renderHistory();
    saveHistory();
  }

  resultContainer.innerHTML = `
    <div id="resultName" class="name" data-i18n-key="reset-display-name">${t('reset-display-name')}</div>
    <div id="resultDetails" class="details" data-i18n-key="reset-display-class">${t('reset-display-class')}</div>
  `;
  
  updatePool();
  saveSettings();
}

function renderProbTable() {
  const probTable = document.getElementById('probTable');
  const pool = state.pool;
  if (!probTable) return;
  if (!pool.length) {
    probTable.innerHTML = `<tr><td class="muted prob-table-empty" data-i18n-key="prob-no-candidates">${t('prob-no-candidates')}</td></tr>`;
    return;
  }
  const prob = 100 / pool.length;
  probTable.innerHTML =
    `<tr class="prob-table-header">
      <th data-i18n-key="prob-weapon-name">${t('prob-weapon-name')}</th>
      <th data-i18n-key="prob-class">${t('prob-class')}</th>
      <th data-i18n-key="prob-sub">${t('prob-sub')}</th>
      <th data-i18n-key="prob-special">${t('prob-special')}</th>
      <th class="prob-value" data-i18n-key="prob-value">${t('prob-value')}</th>
    </tr>` +
    pool.map(w =>
      `<tr>
        <td>${getWeaponName(w)}</td>
        <td>${t(w.class)}</td>
        <td>${t(w.sub)}</td>
        <td>${t(w.sp)}</td>
        <td class="prob-value">${prob.toFixed(2)}%</td>
      </tr>`
    ).join('');
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      showToast(`${t('fullscreen-error')}: ${err.message}`, 'error');
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function updateFullscreenButton() {
  if (!fullscreenBtn) return;
  if (document.fullscreenElement) {
    fullscreenBtn.innerHTML = ICONS.EXIT_FULLSCREEN;
    fullscreenBtn.title = t('exit-fullscreen'); // Use translation key 'exit-fullscreen' / 翻訳キー 'exit-fullscreen' を使用
    fullscreenBtn.setAttribute('aria-label', t('exit-fullscreen')); // Use translation key 'exit-fullscreen' / 翻訳キー 'exit-fullscreen' を使用
    // ▼▼▼ Added from here / ここから追加 ▼▼▼
    if (fullscreenStatusBar) {
      fullscreenStatusBar.style.display = 'flex';
      updateBatteryStatus();
    }
    // ▲▲▲ Added up to here / ここまで追加 ▲▲▲
  } else {
    fullscreenBtn.innerHTML = ICONS.FULLSCREEN;
    fullscreenBtn.title = t('fullscreen'); // Use translation key 'fullscreen' / 翻訳キー 'fullscreen' を使用
    fullscreenBtn.setAttribute('aria-label', t('fullscreen-toggle')); // Use translation key 'fullscreen-toggle' / 翻訳キー 'fullscreen-toggle' を使用
    // ▼▼▼ Added from here / ここから追加 ▼▼▼
    if (fullscreenStatusBar) {
      fullscreenStatusBar.style.display = 'none';
    }
    // ▲▲▲ Added up to here / ここまで追加 ▲▲▲
  }
}

// --- Wake Lock Feature / Wake Lock 機能 ----------------------------------------------------
let wakeLockSentinel = null;

// ▼▼▼ Added from here / ここから追加 ▼▼▼
/**
 * Reflects the battery status in the UI.
 */
async function updateBatteryStatus() {
  const batteryStatusEl = $('#battery-status');
  if (!batteryStatusEl || !('getBattery' in navigator)) {
    if (batteryStatusEl) batteryStatusEl.style.display = 'none';
    return;
  }

  try {
    batteryStatusEl.style.display = 'flex';
    const battery = await navigator.getBattery();
    const level = Math.floor(battery.level * 100);
    const isCharging = battery.charging;

    $('#battery-level').textContent = `${level}%`;
    const iconEl = $('#battery-icon');
    iconEl.style.setProperty('--battery-level', battery.level);

    batteryStatusEl.classList.toggle('low', level <= 20);
    batteryStatusEl.classList.toggle('charging', isCharging);
    $('#battery-icon-charging').style.display = isCharging ? 'inline-block' : 'none';
  } catch (err) {
    console.error('Could not get battery status:', err);
    batteryStatusEl.style.display = 'none';
  }
}

// ▲▲▲ Added up to here / ここまで追加 ▲▲▲

const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => { // センチネルがシステムによって解放された場合
        console.log('Screen Wake Lock was released');
        wakeLockSentinel = null;
      });
      console.log('Screen Wake Lock is active');
      showToast(t('wake-lock-acquired'), 'success');
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
      showToast(t('wake-lock-failed'), 'error');
    }
  }
};

const releaseWakeLock = async () => {
  if (wakeLockSentinel !== null) {
    await wakeLockSentinel.release();
    wakeLockSentinel = null;
  }
};

const handleVisibilityChange = async () => {
  if (preventSleepToggle.checked && wakeLockSentinel === null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

// --- Settings and History Save/Restore / 設定と履歴の保存・復元 ----------------------------------------------

function saveSettings() {
  try {
    const settings = {
      class: $$('input[data-class]').reduce((acc, cb) => ({ ...acc, [cb.dataset.class]: cb.checked }), {}),
      sub: $$('input[data-sub]').reduce((acc, cb) => ({ ...acc, [cb.dataset.sub]: cb.checked }), {}),
      sp: $$('input[data-sp]').reduce((acc, cb) => ({ ...acc, [cb.dataset.sp]: cb.checked }), {}),
      noRepeat: noRepeat.checked,
      playerCount: playerCountInput.value,
      lang: state.lang,
      theme: state.theme,
      autoCopy: $('#autoCopy')?.checked ?? false,
      preventSleep: preventSleepToggle.checked,
      streamerMode: streamerModeToggle.checked,
    };
    localStorage.setItem('splaRouletteSettings', JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

function loadAndApplySettings() {
  const saved = localStorage.getItem('splaRouletteSettings');
  if (!saved) return;
  try {
    const settings = JSON.parse(saved);
    $$('input[data-class]').forEach(cb => { if (settings.class?.[cb.dataset.class] !== undefined) cb.checked = settings.class[cb.dataset.class]; });
    $$('input[data-sub]').forEach(cb => { if (settings.sub?.[cb.dataset.sub] !== undefined) cb.checked = settings.sub[cb.dataset.sub]; });
    $$('input[data-sp]').forEach(cb => { if (settings.sp?.[cb.dataset.sp] !== undefined) cb.checked = settings.sp[cb.dataset.sp]; });
    noRepeat.checked = settings.noRepeat ?? false;
    playerCountInput.value = settings.playerCount ?? 1;
    setLanguage(settings.lang || navigator.language.startsWith('ja') ? 'ja' : 'en');
    applyTheme(settings.theme || 'system');
    const autoCopy = $('#autoCopy');
    if (autoCopy) {
      autoCopy.checked = settings.autoCopy ?? false;
    }
    if ('preventSleep' in settings && 'wakeLock' in navigator) {
      preventSleepToggle.checked = settings.preventSleep;
      if (preventSleepToggle.checked) {
        requestWakeLock();
      }
    }
    if ('streamerMode' in settings) {
      streamerModeToggle.checked = settings.streamerMode;
    }
    applyStreamerMode();
  } catch (e) {
    console.error("Failed to load settings:", e);
    localStorage.removeItem('splaRouletteSettings');
  }
}

/**
 * Masks the display of Room ID and Password based on the state of Streamer Mode.
 */
function applyStreamerMode() {
  const isStreamerMode = streamerModeToggle.checked;
  const inRoom = !!state.roomId;

  if (inRoom) {
    if (isStreamerMode) {
      roomIdDisplay.textContent = '************'.slice(0, state.roomId?.length ?? 12);
      if (state.isHost) roomPasswordDisplay.textContent = '****';
    } else {
      roomIdDisplay.textContent = state.roomId;
      if (state.isHost) roomPasswordDisplay.textContent = state.roomPassword || '';
    }
  }
}

function saveHistory() {
  try {
    localStorage.setItem('splaRouletteHistory', JSON.stringify(state.history));
  } catch (e) {
    console.error("Failed to save history:", e);
  }
}

function loadHistory() {
  const saved = localStorage.getItem('splaRouletteHistory');
  if (!saved) return;
  try {
    state.history = JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load history:", e);
    localStorage.removeItem('splaRouletteHistory');
  }
}

// --- Internationalization (i18n) / 国際化 (i18n) ----------------------------------------------------

function t(key, replacements = {}) {
  let text = translations[state.lang]?.[key] || translations['en']?.[key] || key;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

function updateUIText() {
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    const target = el.dataset.i18nTarget || 'textContent';
    if (target === 'innerHTML') {
      el.innerHTML = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Also update text for dynamically generated UI. / 動的に生成されるUIのテキストも更新
  updateProbText();
  renderHistory();
  renderProbTable();
  updateFullscreenButton();
}

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  const radio = $(`input[name="language"][value="${lang}"]`);
  // Also update the language setting for speech recognition. / 音声認識の言語設定も更新
  if (state.recognition) {
    state.recognition.lang = lang;
  }
  if (radio) radio.checked = true;
  updateUIText();
  saveSettings();
}

// --- Theme Management / テーマ管理 ---------------------------------------------------------

const systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  state.theme = theme;
  const radio = $(`input[name="theme"][value="${theme}"]`);
  if (radio) radio.checked = true;

  if (theme === 'system') {
    document.documentElement.dataset.theme = systemThemeListener.matches ? 'dark' : 'light';
  } else {
    document.documentElement.dataset.theme = theme;
  }
  saveSettings();
}

function handleSystemThemeChange(e) {
  if (state.theme === 'system') {
    document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
  }
}

/**
 * Adds a chat message to the UI.
 * @param {object} data - The message data. / メッセージデータ
 * @param {string} [data.name] - The sender's name. / 送信者名
 * @param {string} data.message - The message body. / メッセージ本文
 * @param {boolean} [data.isSystem=false] - Whether it is a system message. / システムメッセージか否か
 * @param {number} data.timestamp - The timestamp. / タイムスタンプ
 * @param {boolean} [data.isAdminMessage=false] - Whether it is a system message from an admin. / 管理者からのシステムメッセージか否か
 */
function addChatMessage({ name, message, isSystem = false, isAdminMessage = false, timestamp }) {
  // Prevent forced scrolling when a new message arrives while the user is scrolling through chat history. / ユーザーがチャット履歴を遡っている最中に、新しいメッセージが来ても強制スクロールしないようにする
  const shouldScroll = chatMessagesEl.scrollTop + chatMessagesEl.clientHeight >= chatMessagesEl.scrollHeight - 20;

  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message';

  // Compare with the previous message to determine if it's a consecutive post. / 直前のメッセージと比較して、連続投稿かどうかを判定
  const lastMessageEl = chatMessagesEl.lastElementChild;
  if (lastMessageEl && !isSystem && lastMessageEl.dataset.authorName === name) {
    messageEl.classList.add('consecutive');
  }

  // Save the sender's name in a data attribute for the next comparison. / 次の比較のために、送信者名をdata属性に保存
  messageEl.dataset.authorName = name;

  if (isSystem) {
    messageEl.classList.add('system');
    if (isAdminMessage) {
      messageEl.classList.add('admin-message');
    }
    messageEl.textContent = message;
  } else {
    // Regular messages (own or others). / 通常のメッセージ（自分または他人）
    if (name === state.playerName) {
      messageEl.classList.add('own');
    }

    // Check for mentions and add a highlight class. / メンションをチェックしてハイライトクラスを追加
    const me = state.players?.find(p => p.id === state.playerRef?.key);
    if (me) {
      const myName = me.name;
      const myShortId = me.shortId;
      const mentionByName = myName && message.includes(`@${myName}`);
      const mentionById = myShortId && message.includes(`@#${myShortId}`);
      if (mentionByName || mentionById) {
        messageEl.classList.add('mention');
      }
    }

    const contentEl = document.createElement('div');
    contentEl.className = 'chat-content';

    if (!isSystem) {
      const nameEl = document.createElement('strong');
      nameEl.className = 'chat-author';
      nameEl.textContent = name;
      contentEl.appendChild(nameEl);
    }

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'chat-bubble';
    bubbleEl.textContent = message;
    contentEl.appendChild(bubbleEl);

    const metaEl = document.createElement('div');
    metaEl.className = 'chat-meta';
    if (timestamp) {
      const timeEl = document.createElement('span');
      timeEl.className = 'chat-timestamp';
      timeEl.textContent = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      metaEl.appendChild(timeEl);
    }

    messageEl.appendChild(contentEl);
    messageEl.appendChild(metaEl);
  }

  chatMessagesEl.appendChild(messageEl);

  if (shouldScroll) {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}

function updatePlayerList(players) {
  playerCountDisplay.textContent = t('player-list-count', { count: players.length });
  if (!players || players.length === 0) {
    playerListEl.innerHTML = `<div class="empty" data-i18n-key="player-list-empty">${t('player-list-empty')}</div>`;
    return;
  }
  const myId = getPersistentUserId();
  const isAdmin = myId && ADMIN_USER_IDS.map(id => id.toLowerCase()).includes(myId.toLowerCase()); // 管理者用のUIの表示状態を更新する
  playerListEl.innerHTML = players.map(player => {
    const isMe = state.playerRef && player.id === state.playerRef.key;
    const hostIndicator = player.isHost ? `<span class="player-list-icon host-icon" title="${t('realtime-host')}">${ICONS.CROWN}</span>` : '';
    const meIndicator = isMe ? ` <span class="muted">(${t('you')})</span>` : '';
    const displayId = player.shortId ? `#${player.shortId}` : '#----';

    const isMuted = state.mutedUsers && state.mutedUsers[player.id];
    const mutedIndicator = isMuted ? `<span class="player-list-icon muted-icon" title="${t('player-muted-indicator')}">${ICONS.MIC_OFF}</span>` : '';

    let actionButtons = '';
    if (!isMe) {
      const reportButton = `<button class="btn-kick report" data-action="report-player" data-player-id="${player.id}" data-player-name="${escapeHTML(player.name)}" title="${t('report-button-title', { name: escapeHTML(player.name) })}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
        </button>`;
      const adminMenuButton = isAdmin ? `<button class="btn-kick menu" data-action="admin-menu" data-player-id="${player.id}" data-player-name="${player.name}" title="${t('realtime-admin-menu')}">${ICONS.MORE_VERTICAL}</button>` : '';
      actionButtons = `<div class="player-actions">${reportButton}${adminMenuButton}</div>`;
    }

    return `
    <div class="player-item">
        <div class="player-name" data-player-name="${player.name}" title="${t('chat-mention-tooltip', { name: player.name })}">
          <span class="player-id-display">${displayId}</span>
          <span>${escapeHTML(player.name)}${hostIndicator}${mutedIndicator}</span>
          ${meIndicator}
        </div>
        ${actionButtons}
    </div>
    `;
  }).join('');
}

async function submitReport() {
  const reportModal = $('#reportModal');
  const submitBtn = $('#submitReportBtn');
  const reason = $('#reportReason').value.trim();
  const reportedUserId = submitBtn.dataset.reportedUserId;
  const reportedUserName = submitBtn.dataset.reportedUserName;

  if (!reason) {
    showToast(t('report-reason-required'), 'error');
    return;
  }

  const reporterId = getPersistentUserId();
  const reporterName = state.playerName;

  const reportData = {
    reporterId,
    reporterName,
    reportedUserId,
    reportedUserName,
    reason,
    roomId: state.roomId,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    status: 'new', // 'new', 'reviewed'
  };

  try {
    await state.db.ref('reports').push(reportData);
    showToast(t('report-submitted-success'), 'success');
    reportModal.style.display = 'none';
    $('#reportReason').value = '';
  } catch (error) {
    showServerError(t('report-submitted-fail'), error);
  }
}

/**
 * Saves the current filter settings to Firebase (host only).
 */
function updateFiltersOnFirebase() {
  if (!state.isHost || !state.roomRef) return;

  const filters = {
    class: $$('input[data-class]').reduce((acc, cb) => ({ ...acc, [cb.dataset.class]: cb.checked }), {}),
    sub: $$('input[data-sub]').reduce((acc, cb) => ({ ...acc, [cb.dataset.sub]: cb.checked }), {}),
    sp: $$('input[data-sp]').reduce((acc, cb) => ({ ...acc, [cb.dataset.sp]: cb.checked }), {}),
    noRepeat: noRepeat.checked,
  };

  state.roomRef.child('filters').set(filters);
}

/**
 * Applies filter settings obtained from Firebase to the UI (viewers only).
 * @param {Object} filters - The filter settings obtained from Firebase. / Firebaseから取得したフィルター設定
 */
function applyFiltersFromFirebase(filters) {
  if (!filters || state.isHost) return;

  // Update the state of each filter's checkbox. / 各フィルターのチェックボックスの状態を更新
  if (filters.class) {
    $$('input[data-class]').forEach(cb => {
      if (filters.class[cb.dataset.class] !== undefined) cb.checked = filters.class[cb.dataset.class];
    });
  }
  if (filters.sub) {
    $$('input[data-sub]').forEach(cb => {
      if (filters.sub[cb.dataset.sub] !== undefined) cb.checked = filters.sub[cb.dataset.sub];
    });
  }
  if (filters.sp) {
    $$('input[data-sp]').forEach(cb => {
      if (filters.sp[cb.dataset.sp] !== undefined) cb.checked = filters.sp[cb.dataset.sp];
    });
  }

  if (filters.noRepeat !== undefined) noRepeat.checked = filters.noRepeat;

  updatePool();
}

// --- Real-time Sync (Firebase) / リアルタイム連携 (Firebase) ------------------------------------

function initFirebase() {
  try {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
      showToast(t('firebase-not-configured'), 'error', 10000);
      setRealtimeUiState('error');
      updateServerStatusIndicator('error');
      return;
    }
    // Prevent re-initialization. / 再初期化を防止
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    state.db = firebase.database();
    setRealtimeUiState('disconnected');
    updateServerStatusIndicator('connecting');

    // Listen for connection status changes to update the UI indicator.
    const connectedRef = state.db.ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        updateServerStatusIndicator('connected');
      } else {
        updateServerStatusIndicator('disconnected');
      }
    });

    // Read room ID and password from URL for auto-join. / URLからルームIDとパスワードを読み取って自動入力
    const params = new URLSearchParams(window.location.search);
    const roomIdFromUrl = params.get('room');
    const passwordFromUrl = params.get('password');

    // If both parameters exist, attempt to auto-join. / 両方のパラメータが存在する場合、自動参加を試みる
    if (roomIdFromUrl) {
      // Wait a bit before starting the join process to allow the UI to get ready. / 少し待ってから参加処理を開始することで、UIの準備が整うのを待つ
      setTimeout(async () => {
        // If player name is loaded from localStorage, etc., execute auto-join. / プレイヤー名がlocalStorageなどから読み込まれていれば、自動で参加処理を実行
            if (state.playerName.trim()) {
          await joinRoom(roomIdFromUrl, passwordFromUrl || '');
        } else {
          // If player name is not entered, prompt for input. / プレイヤー名が未入力の場合は、入力を促す
          showToast(t('realtime-autojoin-name-required'), 'info');
              playerSettingsModal.style.display = 'flex';
              settingsPlayerNameInput.focus();
        }
      }, 500); // 500msの遅延
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    const userMessage = t('firebase-init-failed');
    showServerError(userMessage, error);
    setRealtimeUiState('error');
    updateServerStatusIndicator('error');
  }
}

function showAdminMenu(targetButton) {
  closeAdminMenu(); // Close any other open menu. / 他に開いているメニューを閉じる

  const { playerId, playerName } = targetButton.dataset;
  const menu = document.createElement('div');
  menu.className = 'admin-menu';
  menu.id = 'active-admin-menu';
  // Store which button opened this menu to handle toggling. / このメニューを開いたボタンを保存してトグルを処理する
  menu.dataset.openerPlayerId = playerId;

  menu.innerHTML = `
    <button class="admin-menu-item" data-action="kick" data-player-id="${playerId}" data-player-name="${playerName}">${t('realtime-kick-player')}</button>
    <button class="admin-menu-item block" data-action="block" data-player-id="${playerId}" data-player-name="${playerName}">${t('realtime-block-player')}</button>
    <div class="admin-menu-divider"></div>
    <button class="admin-menu-item ban" data-action="ban" data-player-id="${playerId}" data-player-name="${playerName}">${t('realtime-ban-player')}</button>
  `;

  document.body.appendChild(menu);

  const rect = targetButton.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 2}px`;
  menu.style.left = `${rect.right + window.scrollX - menu.offsetWidth}px`;
}

function closeAdminMenu() {
  const existingMenu = document.getElementById('active-admin-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
}

function kickPlayer(playerId, playerName) {
    const myId = getPersistentUserId();
    const isAdmin = myId && ADMIN_USER_IDS.map(id => id.toLowerCase()).includes(myId.toLowerCase());
    if (!isAdmin || !state.roomRef) return; // プレイヤーにキックされたことを通知
    state.roomRef.child('notifications').child(playerId).set({
        type: 'kick',
        hostName: state.playerName,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    const message = t('system-player-kicked', { name: playerName, host: state.playerName });
    state.roomRef.child('chat').push({ name: null, message, isSystem: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
    state.roomRef.child('clients').child(playerId).remove();
}

function blockPlayer(playerId, playerName) {
    const myId = getPersistentUserId();
    const isAdmin = myId && ADMIN_USER_IDS.map(id => id.toLowerCase()).includes(myId.toLowerCase());
    if (!isAdmin || !state.roomRef) return;

    // Notify the player they were kicked (blocking also implies a kick). / プレイヤーにキックされたことを通知 (ブロックはキックも兼ねる)
    state.roomRef.child('notifications').child(playerId).set({
        type: 'kick',
        hostName: state.playerName,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    state.roomRef.child('blockedNames').push(playerName);
    const message = t('system-player-blocked', { name: playerName, host: state.playerName });
    state.roomRef.child('chat').push({ name: null, message, isSystem: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
    state.roomRef.child('clients').child(playerId).remove();
}

function banPlayer(playerId, playerName) {
    const myId = getPersistentUserId();
    const isAdmin = myId && ADMIN_USER_IDS.map(id => id.toLowerCase()).includes(myId.toLowerCase());
    if (!isAdmin || !state.roomRef) return;
    const playerToBan = state.players.find(p => p.id === playerId);
    if (!playerToBan) return; // Should not happen if UI is correct. / UIが正しければ起こらないはず

    // Notify the player they were banned. / プレイヤーにBANされたことを通知
    state.roomRef.child('notifications').child(playerId).set({
        type: 'ban',
        hostName: state.playerName,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    state.roomRef.child('blockedNames').push(playerName); // BANは名前ブロックも兼ねる
    const message = t('system-player-banned', { name: playerName, host: state.playerName });
    state.roomRef.child('chat').push({ name: null, message, isSystem: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
    state.roomRef.child('clients').child(playerId).remove();
}

async function createRoom() { // Update UI state to give user feedback that it's processing. / UIの状態を更新して、処理中であることをユーザーにフィードバック
    if (state.isBanned) {
        showToast(t('realtime-error-banned-globally'), 'error');
        return;
    }
    createRoomBtn.disabled = true;
    $$('#public-rooms-table button[data-action="join-from-list"]').forEach(btn => btn.disabled = true);
    createRoomBtn.textContent = t('realtime-creating-btn');
    const name = state.playerName;

    showLoader(t('realtime-creating-btn'));

    try {
        if (!state.db) { throw new Error(t('db-not-connected-error')); }
        if (!name) {
            showToast(t('player-name-required'), 'error');
            playerSettingsModal.style.display = 'flex';
            settingsPlayerNameInput.focus();
            return; // Reset button state in the finally block. / finallyブロックでボタンの状態をリセット
        }
        const persistentUserId = getPersistentUserId();

        const roomsRef = state.db.ref('rooms');
        let newRoomId;
        let roomExists = true;
        while (roomExists) {
            newRoomId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            const snapshot = await roomsRef.child(newRoomId).once('value');
            roomExists = snapshot.exists();
        }

        const visibility = $('input[name="roomVisibility"]:checked').value;
        const withPassword = $('#createRoomWithPassword').checked;
        const password = withPassword ? Math.floor(10000000 + Math.random() * 90000000).toString() : null;
        const isPublic = visibility === 'public';

        state.roomId = newRoomId;
        state.roomRef = roomsRef.child(state.roomId);
        state.roomHasPassword = !!password;

        const playerShortId = await getOrCreateUserShortId(persistentUserId, name);

        await state.roomRef.set({
            visibility: visibility,
            isPublic: isPublic, // for query
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            lastActivity: firebase.database.ServerValue.TIMESTAMP,
            password: password,
            hostId: persistentUserId,
        });
        state.playerRef = state.roomRef.child('clients').child(persistentUserId);
        await state.playerRef.set({
            name: state.playerName,
            shortId: playerShortId,
            joinedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        const myStatusRef = state.db.ref(`users/${persistentUserId}/status`);
        await myStatusRef.update({
            roomId: state.roomId,
            hasPassword: !!password,
            roomVisibility: visibility,
        });

        state.roomRef.onDisconnect().remove();
        listenToRoomChanges();
        $('#realtimeModal').style.display = 'none';
        updateFiltersOnFirebase();
    } catch (error) {
        console.error("Error creating room:", error);
        showServerError(t('realtime-error-create'), error);
    } finally {
        hideLoader();
        createRoomBtn.disabled = false;
        $$('#public-rooms-table button[data-action="join-from-list"]').forEach(btn => btn.disabled = false);
        createRoomBtn.textContent = t('realtime-create-btn');
    }
}

async function joinRoom(roomId, password) {
  if (state.isBanned) {
    showToast(t('realtime-error-banned-globally'), 'error');
    return;
  }
  if (createRoomBtn) createRoomBtn.disabled = true; // Visually disable join buttons in the public list
  $$('#public-rooms-table button[data-action="join-from-list"]').forEach(btn => btn.disabled = true);

  let joinedSuccessfully = false;

  showLoader(t('realtime-joining-room'));

  try {
    if (!state.db) { throw new Error(t('db-not-connected-error')); }

    if (!roomId) {
      showToast(t('realtime-error-join-no-id'), 'error');
      return;
    }

    const playerNameForJoin = state.playerName.trim();
    if (!playerNameForJoin) {
      showToast(t('player-name-required'), 'error');
      playerSettingsModal.style.display = 'flex';
      settingsPlayerNameInput.focus();
      return;
    }

    state.roomId = roomId;
    state.roomRef = state.db.ref(`rooms/${state.roomId}`);

    const persistentUserId = getPersistentUserId();

    const snapshot = await state.roomRef.once('value');
    if (!snapshot.exists()) {
      showToast(t('realtime-error-connect'), 'error');
      return;
    }

    const roomData = snapshot.val();
    state.roomHasPassword = !!roomData.password;

    // ▼▼▼ Added from here / ここから追加 ▼▼▼
    const visibility = roomData.visibility || 'public'; // Fallback for old room data / 古いルームデータのためのフォールバック
    const hostId = roomData.hostId;
    const myId = getPersistentUserId();

    if (visibility === 'channel') {
      if (hostId !== myId) { // ホスト自身はいつでも入れる
        const hostChannelSnap = await state.db.ref(`users/${hostId}/currentChannel`).once('value');
        const hostChannel = hostChannelSnap.val();
        if (!hostChannel || hostChannel !== channelState.currentChannel) {
          showToast(t('realtime-error-channel-only'), 'error');
          return;
        }
      }
    }
    // Check password only for password-protected rooms. / パスワード付きルームの場合のみ、パスワードをチェック
    if (roomData.password && roomData.password !== password) {
      showToast(t('error-wrong-password'), 'error');
      return;
    }
    // Check for room expiration. / ルームの有効期限をチェック
    if (roomData.lastActivity && (Date.now() - roomData.lastActivity > ROOM_EXPIRATION_MS)) {
        showToast(t('realtime-room-expired'), 'error'); // Corrected translation key / 翻訳キーを修正
        return;
    }

    // Check if blocked by name. / 名前でブロックされているか確認
    const blockedNamesSnapshot = await state.roomRef.child('blockedNames').once('value');
    const blockedNames = Object.values(blockedNamesSnapshot.val() || {});
    if (blockedNames.includes(playerNameForJoin)) {
        showToast(t('realtime-error-blocked'), 'error', 6000);
        return;
    }

    // Check room's maximum capacity. / ルームの最大人数をチェック
    const clients = roomData.clients || {};
    const clientCount = Object.keys(clients).length; // Check capacity only if not a ghost entry. / ゴースト入室でない場合のみ人数チェックを行う
    if (clientCount >= 10) {
      // This message needs to be added to i18n.js. / このメッセージは i18n.js に追加する必要があります。
      showToast(t('realtime-error-full'), 'error');
      return;
    }

    const playerShortId = await getOrCreateUserShortId(persistentUserId, playerNameForJoin);

    state.playerRef = state.roomRef.child('clients').child(persistentUserId);
    await state.playerRef.set({
      name: playerNameForJoin,
      shortId: playerShortId,
      joinedAt: firebase.database.ServerValue.TIMESTAMP,
    });

    // ▼▼▼ Added from here / ここから追加 ▼▼▼
    const myStatusRef = state.db.ref(`users/${persistentUserId}/status`);
    await myStatusRef.update({
        roomId: state.roomId,
        hasPassword: !!roomData.password,
        roomVisibility: visibility,
    });
    state.playerRef.onDisconnect().remove();
    listenToRoomChanges();
    $('#realtimeModal').style.display = 'none';
    joinedSuccessfully = true;
  } catch (error) {
    console.error("Error joining room:", error.message);
    showServerError(t('realtime-error-join'), error);
  } finally {
    hideLoader();
    if (!joinedSuccessfully) { // 参加に失敗した場合のみUIと状態をリセット
      if (createRoomBtn) createRoomBtn.disabled = false;
      // Re-enable join buttons in the public list. / 公開リストの参加ボタンを再度有効にする
      $$('#public-rooms-table button[data-action="join-from-list"]').forEach(btn => btn.disabled = false);
      state.roomRef = null;
      state.roomId = null;
    }
  }
}

function startActivityHeartbeat() {
  if (state.activityTimer) {
    clearInterval(state.activityTimer);
  }
  const update = () => {
    if (state.roomRef) {
      state.roomRef.child('lastActivity').set(firebase.database.ServerValue.TIMESTAMP)
        .catch(err => console.error("Failed to update room activity:", err));
    }
  };
  update(); // Update once immediately. / すぐに一度更新
  // Keep the room alive by updating the timestamp every 5 minutes. / 5分ごとにタイムスタンプを更新してルームを維持する
  state.activityTimer = setInterval(update, 5 * 60 * 1000);
}

function stopActivityHeartbeat() {
  if (state.activityTimer) {
    clearInterval(state.activityTimer);
    state.activityTimer = null;
  }
}

function listenToRoomChanges() {
  if (!state.roomRef) return;

  // Start sending heartbeats to keep the room alive. / ルームを維持するためにハートビートの送信を開始
  startActivityHeartbeat();

  // Get room creation time and start the timer. / ルーム作成時刻を取得してタイマーを開始
  state.roomRef.child('createdAt').once('value', (tsSnapshot) => {
    if (tsSnapshot.exists()) {
      startRoomExpiryTimer(tsSnapshot.val());
    }
  });

  // Listen to muted users
  // ミュートされたユーザーをリッスン
  state.roomRef.child('mutedUsers').on('value', (snapshot) => {
      const mutedData = snapshot.val() || {};
      const now = Date.now();
      const activeMutes = {};

      // Check for expired mutes. / 期限切れのミュートを確認
      for (const userId in mutedData) {
          if (mutedData[userId].expiresAt > now) {
              activeMutes[userId] = mutedData[userId];
          } else {
              // Mute has expired, remove it from DB if host. / ミュートが期限切れになった場合、ホストならDBから削除
              if (state.isHost) {
                  state.roomRef.child('mutedUsers').child(userId).remove();
                  // Find player name for unmute message. / ミュート解除メッセージのためにプレイヤー名を探す
                  const unmutedPlayer = state.players.find(p => p.id === userId);
                  if (unmutedPlayer) {
                      const message = t('system-player-unmuted', { name: unmutedPlayer.name });
                      state.roomRef.child('chat').push({ name: null, message, isSystem: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
                  }
              }
          }
      }
      state.mutedUsers = activeMutes;
      // Re-render player list to show/hide mute icon. / プレイヤーリストを再描画してミュートアイコンの表示/非表示を切り替える
      if (state.players) updatePlayerList(state.players);
  });

  // Listen for notifications to self (kick, ban, etc.). / 自分への通知（キック、BANなど）をリッスン
  const notificationRef = state.roomRef.child('notifications').child(state.playerRef.key);
  notificationRef.on('value', (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    const { type, hostName, message: warningMessage } = snapshot.val();
    let messageKey = '';
    let toastMessage = '';

    if (type === 'kick') {
      messageKey = 'system-you-were-kicked';
      toastMessage = t(messageKey, { host: hostName });
    } else if (type === 'ban') {
      messageKey = 'system-you-were-banned';
      toastMessage = t(messageKey, { host: hostName });
    } else if (type === 'warn') {
      // For warnings, don't leave the room, just display the message. / 警告の場合はルームから退出させず、メッセージのみ表示
      toastMessage = `${t('system-you-were-warned-title')}: ${warningMessage}`;
      showToast(toastMessage, 'error', 10000); // Show warning for 10 seconds / 警告は10秒間表示
      notificationRef.remove(); // Delete the notification / 通知を削除
      return; // End processing / 処理を終了
    }

    if (messageKey) {
      // Once a notification is received, delete it from the DB immediately to prevent re-firing. / 通知を受け取ったら、すぐにDBから削除して再発火を防ぐ
      notificationRef.remove();

      // Notify the user. / ユーザーに通知
      showToast(toastMessage, 'error', 8000);

      // Reset the UI to the state of having left the room.
      // In this case, suppress the room dissolution toast as it's unnecessary.
      // UIをリセットし、ルームから退出した状態にする。この場合、ルーム解散のトーストは不要なので抑制する。
      handleLeaveRoom(false, { suppressToast: true });
    }
  });
  let previousPlayers = {};
  let isInitialLoad = true;

  // Get hostId once, then listen to client changes.
  // This assumes host doesn't change. / ホストは変更されないと仮定
  state.roomRef.child('hostId').once('value', (hostSnapshot) => { // Listen for changes in the participant list / 参加者リストの変更をリッスン
    const hostId = hostSnapshot.val();

    // Listen for changes in the participant list. / 参加者リストの変更をリッスン
    state.roomRef.child('clients').on('value', (snapshot) => {
      const clients = snapshot.val() || {};

      // Send a message if host and after initial load, or if a non-ghost player changes. / ホストかつ初回ロード後、またはゴーストでないプレイヤーの変更があった場合にメッセージを送信
      if (!isInitialLoad && state.isHost) {
        handlePlayerChanges(clients, previousPlayers);
      }
      previousPlayers = clients;
      isInitialLoad = false;

      const playerArray = Object.entries(clients)
        .sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
        .map(([key, val]) => ({
          id: key,
          name: val.name,
          shortId: val.shortId,
          isHost: key === hostId,
        }));

      state.players = playerArray;
      updatePlayerList(playerArray);

      const me = playerArray.find(p => p.id === state.playerRef?.key);
      if (me) {
        state.isHost = me.isHost;

        if (state.isHost) {
          state.roomRef.child('password').once('value').then(passSnapshot => {
            // `val()` returns null if the password is null, which is correct. / パスワードがnullの場合も `val()` はnullを返す。これで正しい。
            state.roomPassword = passSnapshot.val();
            if (state.roomPassword) {
              roomPasswordDisplay.textContent = state.roomPassword;
            }
            setRealtimeUiState('in_room_host');
          });
        } else {
          state.roomPassword = null; // Viewers do not have password information. / 視聴者はパスワード情報を持たない
          setRealtimeUiState('in_room_viewer');
        }
      } else {
        // Can't find self = kicked, left voluntarily, or blocked. / 自分が見つからない = キックされたか、自ら退出したか、ブロックされた
        handleLeaveRoom(false); // UIリセットのみ
      }
    });
  });

  // Listen for voice channel invite
  state.roomRef.child('voiceChannelInvite').on('value', (snapshot) => {
    const inviteUrl = snapshot.val();
    state.voiceChannelInvite = inviteUrl;
    if (inviteUrl) {
      joinVoiceChannelBtn.style.display = 'inline-flex';
      joinVoiceChannelBtn.onclick = () => window.open(inviteUrl, '_blank', 'noopener,noreferrer');
    } else {
      joinVoiceChannelBtn.style.display = 'none';
      joinVoiceChannelBtn.onclick = null;
    }
  });


  // Listen for changes in draw results. / 抽選結果の変更をリッスン
  state.roomRef.child('spinResult').on('value', (snapshot) => {
    if (!snapshot.exists()) return;
    const { finalResults, pool, timestamp } = snapshot.val();
    // Only display results newer than my own draw. / 自分の抽選より新しい結果のみ表示
    if (timestamp > (state.lastSpinTimestamp || 0)) {
      state.lastSpinTimestamp = timestamp;
      displaySpinResult(finalResults, pool);
    }
  });

  // --- Fetch Chat History and Monitor for New Messages / チャット履歴の取得と新規メッセージの監視 ---
  (async () => {
    // Detach existing chat listeners to prevent duplicates. / 既存のチャットリスナーをデタッチして、重複を防ぐ
    state.roomRef.child('chat').off();

    chatMessagesEl.innerHTML = ''; // チャット表示をクリア
    let lastMessageTimestamp = 0;

    // Get the last 50 messages. / 過去50件のメッセージを取得
    const CHAT_HISTORY_LIMIT = 50;
    const chatHistoryQuery = state.roomRef.child('chat').limitToLast(CHAT_HISTORY_LIMIT);
    const historySnapshot = await chatHistoryQuery.once('value');
    if (historySnapshot.exists()) {
      const messages = historySnapshot.val();
      // Firebase returns an object, we need to sort by timestamp. / Firebaseはオブジェクトを返すので、タイムスタンプでソートする必要がある
      const sortedMessages = Object.values(messages).sort((a, b) => a.timestamp - b.timestamp);
      sortedMessages.forEach(messageData => {
        if (messageData && messageData.timestamp) {
          addChatMessage(messageData);
          lastMessageTimestamp = messageData.timestamp; // Update the last timestamp / 最後のタイムスタンプを更新
        }
      });
    }

    // Attach a listener for new messages after fetching history. / 履歴取得後に新規メッセージのリスナーをアタッチ
    state.roomRef.child('chat').orderByChild('timestamp').startAt(lastMessageTimestamp + 1).on('child_added', (snapshot) => {
      const messageData = snapshot.val();
      if (messageData && messageData.timestamp) {
        addChatMessage(messageData);
      }
    });
  })();

  // Listen for filter info changes (viewers only). / フィルター情報の変更をリッスン（視聴者のみ）
  state.roomRef.child('filters').on('value', (snapshot) => {
    if (snapshot.exists()) {
      applyFiltersFromFirebase(snapshot.val());
    }
  });

  // Listen for history changes. / 履歴の変更をリッスン
  state.roomRef.child('history').on('value', (snapshot) => {
      const historyData = snapshot.val() || {};
      state.history = Object.entries(historyData).map(([key, value]) => ({
          ...value,
          key: key,
      }));
      renderHistory();
      updatePool();
  });

  roomIdDisplay.textContent = state.roomId;
  const url = new URL(window.location);
  url.searchParams.set('room', state.roomId);
  window.history.pushState({}, '', url);
}

function handlePlayerChanges(currentPlayers, previousPlayers) {
  if (!state.roomRef) return;
  const currentPlayerIds = Object.keys(currentPlayers);
  const previousPlayerIds = Object.keys(previousPlayers);

  const newPlayerIds = currentPlayerIds.filter(id => !previousPlayerIds.includes(id));
  newPlayerIds.forEach(id => {
    const message = t('system-player-joined', { name: currentPlayers[id].name });
    state.roomRef.child('chat').push({ name: null, message, isSystem: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
  });

  const leftPlayerIds = previousPlayerIds.filter(id => !currentPlayerIds.includes(id));
  leftPlayerIds.forEach(id => {
    const message = t('system-player-left', { name: previousPlayers[id].name });
    state.roomRef.child('chat').push({ name: null, message, isSystem: true, timestamp: firebase.database.ServerValue.TIMESTAMP });
  });
}

// --- Real-time Sync (Firebase) / リアルタイム連携 (Firebase) ------------------------------------

function setRealtimeUiState(uiState) {
    const inRoom = uiState.startsWith('in_room');
    const isHost = uiState === 'in_room_host';
    const roomTimerContainer = $('#room-timer-container');
    const isViewer = uiState === 'in_room_viewer';
    $('#openRealtimeBtn').style.display = inRoom ? 'none' : 'inline-flex'; channelBtn.style.display = state.playerName ? 'inline-flex' : 'none';
    roomInfoUi.style.display = inRoom ? 'flex' : 'none';
    playerListContainer.style.display = inRoom ? 'block' : 'none';
    const isError = uiState === 'error';
    // Display only when in a room and the timer is active.
    if (inRoom && state.roomExpiryTimer) {
      roomTimerContainer.style.display = 'inline-flex';
    } else {
      roomTimerContainer.style.display = 'none';
    }
    inviteContainer.style.display = isHost ? 'inline-block' : 'none';

    // Add/remove class to body for CSS control. / CSSで制御するため、bodyにクラスを付与/削除する
    if (inRoom) {
      document.body.classList.add('in-room');
    } else {
      document.body.classList.remove('in-room');
    }

    if (uiState === 'disconnected') {
      chatMessagesEl.innerHTML = '';
    }
    hostBadge.style.display = isHost ? 'inline-block' : 'none';
    // Display password-related UI to the host only if a password exists. / パスワードが存在する場合のみ、ホストにパスワード関連UIを表示
    const hasPassword = !!state.roomPassword;
    roomPasswordDisplay.style.display = isHost && hasPassword ? 'inline-block' : 'none';
    $('#roomPasswordLabel').style.display = isHost && hasPassword ? 'inline-block' : 'none';

    if (isHost) {
        setVcLinkBtn.style.display = 'inline-block';
        if (state.voiceChannelInvite) {
            setVcLinkBtn.textContent = t('realtime-change-vc-link');
            setVcLinkBtn.setAttribute('data-i18n-key', 'realtime-change-vc-link');
        } else {
            setVcLinkBtn.textContent = t('realtime-set-vc-link');
            setVcLinkBtn.setAttribute('data-i18n-key', 'realtime-set-vc-link');
        }
    } else {
        setVcLinkBtn.style.display = 'none';
    }

    // Disable operations on error. / エラー時は操作させない
    createRoomBtn.disabled = isError;

    // isViewer is true for viewers in a room, false for local mode or host.
    // Use this to bulk-set the enabled/disabled state of host-only controls.
    // isViewerは、ルーム内の視聴者である場合にtrue。ローカルモードやホストの場合はfalse。これを使ってホスト専用コントロールの有効/無効を一括で設定する。
    const hideHostControls = isViewer;

    // Show/hide host-only controls (spin, reset, player count, no duplicates). / ホスト専用コントロール（スピン、リセット、人数設定、重複なし）を非表示/表示
    $$('.host-control').forEach(el => {
      // `display: ''` removes the inline style and reverts to the CSS-defined style. / `display: ''` はインラインスタイルを削除し、CSSで定義されたスタイルに戻す
      el.style.display = hideHostControls ? 'none' : '';
    });
    // Disable the filter UI instead of hiding it, so viewers can see the settings. / フィルターUIは閲覧者が設定を確認できるように、非表示ではなく無効化する
    $$('#classFilters input, #classFilters button').forEach(el => {
      el.disabled = hideHostControls;
    });

    applyStreamerMode();
}

function handleLeaveRoom(removeFromDb = true, options = {}) {
  const { suppressToast = false } = options;
  const wasInRoom = !!state.roomRef; // Capture the state at the beginning of the function call. / 関数呼び出しの最初に状態をキャプチャ

  if (removeFromDb && wasInRoom) {
    if (state.isHost && state.roomRef) {
      // If host, cancel the room's onDisconnect and remove the room. / ホストの場合、ルーム全体のonDisconnectをキャンセルし、ルームを削除
      state.roomRef.onDisconnect().cancel();
      state.roomRef.remove();
    } else if (state.playerRef) {
      // If viewer, cancel own onDisconnect and remove only own info. / 視聴者の場合、自分のonDisconnectをキャンセルし、自分の情報のみを削除
      state.playerRef.onDisconnect().cancel();
      state.playerRef.remove();
    }
    // ▼▼▼ Added from here / ここから追加 ▼▼▼
    // Remove room info from own status. / 自分のステータスからルーム情報を削除
    const myId = getPersistentUserId();
    if (myId && state.db) {
        state.db.ref(`users/${myId}/status`).update({
            roomId: null,
            hasPassword: null,
            roomVisibility: null,
        });
    }
  }

  if (state.roomRef) {
    state.roomRef.off(); // Detach all listeners. / 全てのリスナーを解除
  }

  // Stop sending heartbeats. / ハートビートの送信を停止
  stopActivityHeartbeat();

  // Stop the timer. / タイマーを停止
  if (state.roomExpiryTimer) {
    clearInterval(state.roomExpiryTimer);
    state.roomExpiryTimer = null;
  }

  state.roomRef = null;
  state.playerRef = null;
  state.roomId = null;
  state.isHost = false;
  state.roomPassword = null;
  state.roomHasPassword = false;
  // Reset voice channel state. / ボイスチャンネルの状態をリセット
  joinVoiceChannelBtn.style.display = 'none';
  joinVoiceChannelBtn.onclick = null;
  state.voiceChannelInvite = null;
  // Reset the state of the join/create buttons to ensure they are correct when the UI is redisplayed. / 参加/作成ボタンの状態をリセットし、UIが再表示されたときに正しい状態にする
  createRoomBtn.disabled = false;
  createRoomBtn.textContent = t('realtime-create-btn');

  setRealtimeUiState('disconnected');
  updatePlayerList([]);

  // Clear online history and load local history. / オンライン履歴をクリアしてローカル履歴を読み込む
  state.history = [];
  loadHistory();
  renderHistory();
  updatePool();

  const url = new URL(window.location);
  url.searchParams.delete('room');
  window.history.pushState({}, '', url);

  // Notify if unintentionally forced to leave, not by pressing the leave button.
  // (e.g., host dissolves the room, kick, ban)
  // Kick/ban notifications are handled by a dedicated listener, so this mainly catches dissolution by the host.
  // 自分で退出ボタンを押したのではなく、意図せず退出させられた場合に通知。(例: ホストがルームを解散、キック、BAN)。キック/BANの通知は専用リスナーが処理するので、これは主にホストによる解散を捕捉する。
  if (wasInRoom && !removeFromDb && !suppressToast) {
    showToast(t('system-room-dissolved-by-host'), 'info', 5000);
  }
}

function sendChatMessage() {
  const message = chatInput.value.trim();
  if (message && state.roomRef) {
    const now = Date.now();
    const myId = state.playerRef.key;

    // Check for global mute first. / まずグローバルミュートをチェック
    if (state.globalMuteInfo && state.globalMuteInfo.expiresAt > now) {
        const expiryTime = new Date(state.globalMuteInfo.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        showToast(t('chat-error-muted', { time: expiryTime }), 'error');
        return;
    }

    // Check if muted. / ミュートされているか確認
    const myMuteInfo = state.mutedUsers[myId];
    if (myMuteInfo && myMuteInfo.expiresAt > now) {
      const expiryTime = new Date(myMuteInfo.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      showToast(t('chat-error-muted', { time: expiryTime }), 'error');
      return;
    }

    state.roomRef.child('chat').push({
        name: state.playerName,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).catch(error => {
        showServerError(t('chat-send-fail'), error);
    });
    chatInput.value = '';
    chatInput.focus(); // Keep focus on the input field after sending. / 送信後も入力欄にフォーカスを維持
  }
}

/**
 * Updates the display state of the admin UI.
 */
function updateAdminUI() {
  const myId = getPersistentUserId();
  const isAdmin = myId && ADMIN_USER_IDS.map(id => id.toLowerCase()).includes(myId.toLowerCase());

  if (adminLink) {
    adminLink.style.display = isAdmin ? 'inline-flex' : 'none';
  }
}

async function renderPublicRoomsList() {
  const tbody = $('#public-rooms-table tbody');
  if (!tbody) return;

  if (state.publicRooms.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty" data-i18n-key="public-rooms-list-empty">${t('public-rooms-list-empty')}</td></tr>`;
    return;
  }

  // Show loader while fetching host names. / ホスト名取得中はローダーを表示
  tbody.innerHTML = `<tr><td colspan="3" class="empty"><div class="loader-spinner" style="margin: 1rem auto; width: 30px; height: 30px;"></div></td></tr>`;

  // Fetch host names for rooms that we don't have the name for yet. / まだ名前を取得していないルームのホスト名を取得する
  const newHostIds = state.publicRooms
    .map(room => room.hostId)
    .filter(id => id && !state.publicRoomHostNames[id]);

  if (newHostIds.length > 0) {
    try {
      const hostPromises = newHostIds.map(id =>
        state.db.ref(`users/${id}/name`).once('value').then(snap => ({ id, name: snap.val() }))
      );
      const hostResults = await Promise.all(hostPromises);
      hostResults.forEach(({ id, name }) => {
        state.publicRoomHostNames[id] = name || 'Unknown';
      });
    } catch (error) {
      console.error("Failed to fetch some host names for public room list:", error);
    }
  }

  // Re-check if the list became empty after the async operation. / 非同期処理後にリストが空になった可能性を再チェック
  if (state.publicRooms.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty" data-i18n-key="public-rooms-list-empty">${t('public-rooms-list-empty')}</td></tr>`;
    return;
  }

  // Render the table after fetching host names. / ホスト名を取得した後にテーブルをレンダリング
  tbody.innerHTML = state.publicRooms.map(room => {
    const hostName = state.publicRoomHostNames[room.hostId] || '...';
    const playerCount = room.clients ? Object.keys(room.clients).length : 0;
    const isFull = playerCount >= 10;
    const hasPassword = !!room.password;
    const passwordIcon = hasPassword ? `<span class="player-list-icon password-icon" title="${t('password-protected-room')}">${ICONS.LOCK}</span>` : '';

    return `
      <tr data-room-id="${room.id}" data-has-password="${hasPassword}">
        <td>${escapeHTML(hostName)}${passwordIcon}</td>
        <td>${playerCount} / 10</td>
        <td>
          <button class="btn secondary" data-action="join-from-list" ${isFull ? 'disabled' : ''} style="padding: 4px 10px; font-size: 13px;">
            ${isFull ? t('room-full') : t('realtime-join-btn')}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function listenToPublicRooms() {
  if (state.publicRoomsListener || !state.db) return;

  state.publicRoomsQuery = state.db.ref('rooms').orderByChild('isPublic').equalTo(true);
  state.publicRoomsListener = state.publicRoomsQuery.on('value', snapshot => {
    const roomsData = snapshot.val() || {};
    const now = Date.now();
    state.publicRooms = Object.entries(roomsData)
      .map(([id, data]) => ({ id, ...data }))
      .filter(room => room.createdAt && (now - room.createdAt < ROOM_LIFETIME_MS)); // Filter out expired rooms. / 期限切れのルームを除外
    renderPublicRoomsList();
  }, error => {
    console.error("Error listening to public rooms:", error);
  });
}

function stopListenToPublicRooms() {
  if (state.publicRoomsListener && state.publicRoomsQuery) {
    state.publicRoomsQuery.off('value', state.publicRoomsListener);
    state.publicRoomsListener = null;
    state.publicRoomsQuery = null;
  }
}

async function setVoiceChannelLink() {
  if (!state.isHost || !state.roomRef) return;

  const currentLink = state.voiceChannelInvite || '';
  const newLink = prompt(t('realtime-set-vc-link-prompt'), currentLink);

  if (newLink === null) { // If the user cancels. / ユーザーがキャンセルした場合
    return;
  }

  const trimmedLink = newLink.trim();

  try {
    if (trimmedLink) {
      // Simple URL validation. / 簡単なURLバリデーション
      if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
        showToast(t('realtime-set-vc-link-invalid'), 'error');
        return;
      }
      await state.roomRef.child('voiceChannelInvite').set(trimmedLink);
      showToast(t('realtime-set-vc-link-success'), 'success');
    } else {
      await state.roomRef.child('voiceChannelInvite').remove();
      showToast(t('realtime-set-vc-link-removed'), 'info');
    }
  } catch (error) {
    showServerError(t('realtime-set-vc-link-fail'), error);
  }
}

async function joinChannel() {
  const channelNameInput = $('#channelNameInput');
  const channelName = channelNameInput.value.trim();
  if (!channelName) {
    showToast(t('channel-name-required'), 'error');
    return;
  }

  const myId = getPersistentUserId();
  if (!myId || !state.db) return;

  // If already in a channel, leave it first.
  if (channelState.currentChannel) {
    await leaveChannel(false); // Don't show toast on implicit leave
  }

  try {
    // Set current channel for the user
    await state.db.ref(`users/${myId}/currentChannel`).set(channelName);
    // Add user to the channel's member list
    await state.db.ref(`channels/${channelName}/members/${myId}`).set(true);

    channelState.currentChannel = channelName;
    showToast(t('channel-join-success', { channelName }), 'success');
    updateChannelModalUI();
    listenToChannelMembers();
  } catch (error) {
    showServerError('Failed to join channel', error);
  }
}

async function leaveChannel(showSuccessToast = true) {
  const myId = getPersistentUserId();
  const currentChannel = channelState.currentChannel;

  if (!myId || !state.db || !currentChannel) return;

  try {
    // Remove user from the channel's member list
    await state.db.ref(`channels/${currentChannel}/members/${myId}`).remove();
    // Remove current channel from the user's data
    await state.db.ref(`users/${myId}/currentChannel`).remove();

    if (showSuccessToast) {
      showToast(t('channel-leave-success'), 'info');
    }
  } catch (error) {
    showServerError('Failed to leave channel', error);
  } finally {
    // Clean up local state regardless of success/failure
    if (channelState.channelListener) {
      state.db.ref(`channels/${currentChannel}/members`).off('value', channelState.channelListener);
    }
    stopListenToChannelInvitations();
    Object.values(channelState.memberDataListeners).forEach(({ ref, listener }) => ref.off('value', listener));

    channelState.currentChannel = null;
    channelState.members = [];
    channelState.memberDataListeners = {};
    channelState.channelListener = null;
    updateChannelModalUI();
    renderChannelMembers();
  }
}

function updateChannelModalUI() {
  const channelNameInput = $('#channelNameInput');
  const joinBtn = $('#joinChannelBtn');
  const leaveBtn = $('#leaveChannelBtn');

  if (channelState.currentChannel) {
    channelNameInput.value = channelState.currentChannel;
    channelNameInput.disabled = true;
    joinBtn.style.display = 'none';
    leaveBtn.style.display = 'inline-flex';
  } else {
    channelNameInput.value = '';
    channelNameInput.disabled = false;
    joinBtn.style.display = 'inline-flex';
    leaveBtn.style.display = 'none';
  }
}

function listenToChannel() {
  const myId = getPersistentUserId();
  if (!myId || !state.db) return;

  const userChannelRef = state.db.ref(`users/${myId}/currentChannel`);
  userChannelRef.on('value', snapshot => {
    const channelName = snapshot.val();
    if (channelName) {
      if (channelName !== channelState.currentChannel) {
        channelState.currentChannel = channelName;
        listenToChannelMembers();
        listenToChannelInvitations(channelName);
      }
    } else if (channelState.currentChannel) {
      // Channel was removed remotely or by leaving
      leaveChannel(false);
    }
    updateChannelModalUI();
  });
}

function listenToChannelInvitations(channelName) {
  stopListenToChannelInvitations(); // Stop previous listener

  const invitationsRef = state.db.ref(`channels/${channelName}/invitations`);
  channelState.invitationListener = invitationsRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', (snapshot) => {
    const invitation = snapshot.val();
    const invitationId = snapshot.key;
    if (invitation && invitation.hostId !== getPersistentUserId()) {
      showChannelInvitationToast(invitation, invitationId, channelName);
    }
  });
}

function stopListenToChannelInvitations() {
  if (channelState.invitationListener && channelState.currentChannel) {
    const invitationsRef = state.db.ref(`channels/${channelState.currentChannel}/invitations`);
    invitationsRef.off('child_added', channelState.invitationListener);
    channelState.invitationListener = null;
  }
}

function listenToChannelMembers() {
  const channelName = channelState.currentChannel;
  if (!channelName) return;

  const membersRef = state.db.ref(`channels/${channelName}/members`);
  channelState.channelListener = membersRef.on('value', snapshot => {
    const memberIds = Object.keys(snapshot.val() || {});

    // Clean up listeners for members who left
    const currentListeners = Object.keys(channelState.memberDataListeners);
    currentListeners.filter(id => !memberIds.includes(id)).forEach(id => {
      const { ref, listener } = channelState.memberDataListeners[id];
      ref.off('value', listener);
      delete channelState.memberDataListeners[id];
    });

    channelState.members = channelState.members.filter(m => memberIds.includes(m.id));

    // Add listeners for new members
    memberIds.forEach(memberId => {
      if (!channelState.memberDataListeners[memberId]) {
        const memberUserRef = state.db.ref(`users/${memberId}`);
        const listener = memberUserRef.on('value', userSnap => {
          const userData = userSnap.val();
          if (!userData) return;

          const memberIndex = channelState.members.findIndex(m => m.id === memberId);
          const memberData = {
            id: memberId,
            name: userData.name,
            shortId: userData.shortId,
            status: userData.status,
          };

          if (memberIndex > -1) {
            channelState.members[memberIndex] = memberData;
          } else {
            channelState.members.push(memberData);
          }
          renderChannelMembers();
        });
        channelState.memberDataListeners[memberId] = { ref: memberUserRef, listener: listener };
      }
    });
    renderChannelMembers();
  });
}

function renderChannelMembers() {
  const container = $('#channel-members-container');
  const canInvite = !!state.roomId;

  if (channelState.members.length === 0) {
    container.innerHTML = `<div class="empty">${t('channel-empty')}</div>`;
    return;
  }

  container.innerHTML = channelState.members.map(member => {
    const isMe = member.id === getPersistentUserId();
    if (isMe) return ''; // Don't show self in the list

    const isOnline = member.status?.isOnline;
    const statusText = isOnline ? (member.status.roomId ? `ルーム: ${member.status.roomId}` : 'オンライン') : 'オフライン';
    const statusClass = isOnline ? 'online' : 'offline';

    let inviteBtn = '';
    if (canInvite && isOnline) {
      const isInMyRoom = state.players.some(p => p.id === member.id);
      if (!isInMyRoom) {
        inviteBtn = `<button class="btn" data-action="invite-member" data-member-id="${member.id}" data-member-name="${escapeHTML(member.name)}" style="padding: 4px 8px; font-size: 12px;">${t('channel-invite-to-room')}</button>`;
      }
    }

    return `
      <div class="channel-member-item">
        <div class="channel-member-info">
          <div class="channel-member-name">${escapeHTML(member.name)} <span class="muted">#${member.shortId}</span></div>
          <div class="channel-member-status">
            <span class="online-status ${statusClass}"></span>
            <span>${statusText}</span>
          </div>
        </div>
        <div class="channel-member-actions">
          ${inviteBtn}
        </div>
      </div>
    `;
  }).join('');
}

async function inviteChannelMemberToRoom(memberId, memberName) {
  if (!state.roomId) return;

  try {
    const invitationsRef = state.db.ref(`invitations/${memberId}`);
    const invitationData = {
      roomId: state.roomId,
      hostName: state.playerName,
      hasPassword: state.roomHasPassword,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    await invitationsRef.push(invitationData);
    showToast(t('channel-invite-sent', { name: memberName }), 'success');
  } catch (error) {
    showServerError(t('channel-invite-fail'), error);
  }
}

async function notifyChannelOfRoom() {
  if (!state.roomId || !state.isHost) return;
  if (!channelState.currentChannel) {
    showToast(t('channel-error-not-in-channel'), 'error');
    inviteMenu.classList.remove('show');
    return;
  }

  try {
    const channelInvitationsRef = state.db.ref(`channels/${channelState.currentChannel}/invitations`);
    const invitationData = {
      roomId: state.roomId,
      hostName: state.playerName,
      hostId: getPersistentUserId(),
      hasPassword: state.roomHasPassword,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    await channelInvitationsRef.push(invitationData);
    showToast(t('channel-notify-success', { channelName: channelState.currentChannel }), 'success');
  } catch (error) {
    showServerError(t('channel-notify-fail'), error);
  }
  inviteMenu.classList.remove('show');
}

function showDirectInvitationToast(invitation, invitationId) {
  const { roomId, hostName, hasPassword } = invitation;
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  // If a toast for this room is already visible, ignore the new invitation.
  if ($$(`.toast[data-room-id="${roomId}"]`).length > 0) {
    // Remove the processed invitation from the database.
    state.db.ref(`invitations/${getPersistentUserId()}/${invitationId}`).remove();
    return;
  }

  // Add to notification center
  addNotification({
    type: 'direct',
    roomId,
    hostName,
    hasPassword,
    timestamp: invitation.timestamp || Date.now(),
  });
  const toast = document.createElement('div');
  toast.className = 'toast info with-actions';
  toast.dataset.roomId = roomId;

  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = t('direct-invitation-received', { hostName: hostName });

  const actionsEl = document.createElement('div');
  actionsEl.className = 'toast-actions';

  let timeoutId = null;

  // Function to clean up the toast and the DB entry.
  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId);
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
    // Remove the processed invitation from the database.
    state.db.ref(`invitations/${getPersistentUserId()}/${invitationId}`).remove();
  };

  const joinBtn = document.createElement('button');
  joinBtn.className = 'btn';
  joinBtn.textContent = t('channel-invitation-join');
  joinBtn.onclick = async () => {
    cleanup();
    const password = hasPassword ? prompt(t('realtime-password-prompt')) : '';
    if (password !== null) await joinRoom(roomId, password);
  };

  const declineBtn = document.createElement('button');
  declineBtn.className = 'btn secondary';
  declineBtn.textContent = t('channel-invitation-decline');
  declineBtn.onclick = cleanup;

  actionsEl.appendChild(joinBtn);
  actionsEl.appendChild(declineBtn);
  toast.appendChild(messageEl);
  toast.appendChild(actionsEl);

  const duration = 30000; // 30 seconds
  const progressBar = document.createElement('div');
  progressBar.className = 'toast-progress-bar';
  progressBar.style.animationDuration = `${duration}ms`;
  toast.appendChild(progressBar);

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  timeoutId = setTimeout(cleanup, duration);
}

function showChannelInvitationToast(invitation, invitationId, channelName) {
  const { roomId, hostName, hasPassword } = invitation;
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  if ($$(`.toast[data-room-id="${roomId}"]`).length > 0) return;

  // Add to notification center
  addNotification({
    type: 'channel',
    roomId,
    hostName,
    hasPassword,
    channelName,
    timestamp: invitation.timestamp || Date.now(),
  });
  const toast = document.createElement('div');
  toast.className = 'toast info with-actions';
  toast.dataset.roomId = roomId;

  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = t('channel-invitation-received', { hostName: hostName, channelName: channelName });

  const actionsEl = document.createElement('div');
  actionsEl.className = 'toast-actions';

  let timeoutId = null;
  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId);
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  };

  const joinBtn = document.createElement('button');
  joinBtn.className = 'btn';
  joinBtn.textContent = t('channel-invitation-join');
  joinBtn.onclick = async () => {
    cleanup();
    const password = hasPassword ? prompt(t('realtime-password-prompt')) : '';
    if (password !== null) await joinRoom(roomId, password);
  };

  const declineBtn = document.createElement('button');
  declineBtn.className = 'btn secondary';
  declineBtn.textContent = t('channel-invitation-decline');
  declineBtn.onclick = cleanup;

  actionsEl.appendChild(joinBtn);
  actionsEl.appendChild(declineBtn);
  toast.appendChild(messageEl);
  toast.appendChild(actionsEl);

  const duration = 30000;
  const progressBar = document.createElement('div');
  progressBar.className = 'toast-progress-bar';
  progressBar.style.animationDuration = `${duration}ms`;
  toast.appendChild(progressBar);

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  timeoutId = setTimeout(cleanup, duration);
}

// --- Initialization and Event Listener Setup / 初期化とイベントリスナー設定 ------------------------------------

function buildFilterUI() {
  const allSubs = [...new Set(weapons.map(w => w.sub))].filter(Boolean).sort();
  const allSps = [...new Set(weapons.map(w => w.sp))].filter(Boolean).sort();
  const classFilters = $('#classFilters');
  // Note: Text content will be set by updateUIText(). / 注: テキストコンテンツはupdateUIText()によって設定されます
  classFilters.innerHTML = `
  <div class="filter-group">
    <div class="filter-header">
      <strong data-i18n-key="filter-class"></strong>
      <button type="button" class="btn-filter" data-toggle-all="class" data-i18n-key="filter-toggle"></button>
    </div>
    ${[...new Set(weapons.map(w => w.class))].sort().map(cls =>
      `<label class="chip"><input type="checkbox" data-class="${cls}" checked> <span data-i18n-key="${cls}">${cls}</span></label>`
    ).join('')}
  </div>
  <div class="filter-group">
    <div class="filter-header">
      <strong data-i18n-key="filter-sub"></strong>
      <button type="button" class="btn-filter" data-toggle-all="sub" data-i18n-key="filter-toggle"></button>
    </div>
    ${allSubs.map(sub =>
      `<label class="chip"><input type="checkbox" data-sub="${sub}" checked> <span data-i18n-key="${sub}">${sub}</span></label>`
    ).join('')}
  </div>
  <div class="filter-group">
    <div class="filter-header">
      <strong data-i18n-key="filter-special"></strong>
      <button type="button" class="btn-filter" data-toggle-all="sp" data-i18n-key="filter-toggle"></button>
    </div>
    ${allSps.map(sp =>
      `<label class="chip"><input type="checkbox" data-sp="${sp}" checked> <span data-i18n-key="${sp}">${sp}</span></label>`
    ).join('')}
  </div>
  `;
}

function setupEventListeners() {
  $('#spinBtn').addEventListener('click', startSpin);
  $('#resetBtn').addEventListener('click', resetAll);
  playerCountInput.addEventListener('change', saveSettings);

  // Realtime controls. / リアルタイムコントロール
  createRoomBtn.addEventListener('click', createRoom);
  leaveRoomBtn.addEventListener('click', () => {
    if (confirm(t('realtime-leave-confirm'))) {
      handleLeaveRoom(true);
    }
  });
  setVcLinkBtn.addEventListener('click', setVoiceChannelLink);
  // Player Settings Modal. / プレイヤー設定モーダル
  playerSettingsBtn.addEventListener('click', () => playerSettingsModal.style.display = 'flex');
  closePlayerSettingsBtn.addEventListener('click', () => playerSettingsModal.style.display = 'none');
  playerSettingsModal.addEventListener('click', (e) => {
    if (e.target === playerSettingsModal) playerSettingsModal.style.display = 'none';
  });
  confirmPlayerSettingsBtn.addEventListener('click', updatePlayerNameAndId);
  settingsPlayerNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmPlayerSettingsBtn.click(); });

  copyInviteLinkBtn.addEventListener('click', async () => {
    if (!state.isHost || !state.roomId) return;
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('room', state.roomId);
    if (state.roomPassword) {
      url.searchParams.set('password', state.roomPassword);
    }
    try {
      inviteMenu.classList.remove('show');
      await navigator.clipboard.writeText(url.href);
      showToast(t('copied-invite-link'), 'success');
    } catch (err) {
      console.error('Failed to copy invite URL:', err);
      showToast(t('copy-failed'), 'error');
    }
  });

  roomIdDisplay.addEventListener('click', () => navigator.clipboard.writeText(state.roomId));
  chatSendBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission. / フォームのデフォルト送信を防止
      sendChatMessage();
    }
  });

  playerListEl.addEventListener('click', (e) => {
    // Handle mention click. / メンションクリックの処理
    const mentionTarget = e.target.closest('.player-name[data-player-name]');
    if (mentionTarget) {
      const playerName = mentionTarget.dataset.playerName;
      e.stopPropagation();
      const separator = (chatInput.value.length > 0 && !chatInput.value.endsWith(' ')) ? ' ' : '';
      chatInput.value += `${separator}@${playerName} `;
      chatInput.focus();
      return; // Mention action is exclusive, so we stop here. / メンションアクションは排他的なので、ここで停止します
    }

    // Handle report button click. / 通報ボタンクリックの処理
    const reportBtn = e.target.closest('[data-action="report-player"]');
    if (reportBtn) {
      const { playerId, playerName } = reportBtn.dataset;
      const reportModal = $('#reportModal');
      $('#reportTargetName').textContent = playerName;
      $('#submitReportBtn').dataset.reportedUserId = playerId;
      $('#submitReportBtn').dataset.reportedUserName = playerName;
      reportModal.style.display = 'flex';
    }
  });

  // Admin menu and actions handler. / 管理者メニューとアクションハンドラ
  document.addEventListener('click', (e) => {
    const menuButton = e.target.closest('[data-action="admin-menu"]');
    const menuItem = e.target.closest('.admin-menu-item');
    const openMenu = document.getElementById('active-admin-menu');

    const myId = getPersistentUserId();
    const isAdmin = myId && ADMIN_USER_IDS.map(id => id.toLowerCase()).includes(myId.toLowerCase());

    // If a menu button is clicked. / メニューボタンがクリックされた場合
    if (menuButton) {
        e.stopPropagation();
        if (!isAdmin) return;

        // If a menu is open for this button, close it. Otherwise, open it. / このボタンのメニューが開いている場合は閉じ、そうでない場合は開きます
        if (openMenu && openMenu.dataset.openerPlayerId === menuButton.dataset.playerId) {
            closeAdminMenu();
        } else {
            showAdminMenu(menuButton);
        }
        return; // Stop other processing when an admin menu button is clicked. / 管理者メニューボタンのクリック時は、他の処理を中断
    }

    // If a menu item is clicked. / メニュー項目がクリックされた場合
    if (menuItem) {
        if (!isAdmin) return;
        const { action, playerId, playerName } = menuItem.dataset;
        
        if (action === 'kick') {
            if (confirm(t('realtime-kick-confirm', { name: playerName }))) kickPlayer(playerId, playerName);
        } else if (action === 'block') {
            if (confirm(t('realtime-block-confirm', { name: playerName }))) blockPlayer(playerId, playerName);
        } else if (action === 'ban') {
            if (confirm(t('realtime-ban-confirm', { name: playerName }))) banPlayer(playerId, playerName);
        }
        closeAdminMenu();
        return; // Stop other processing when an admin menu item is clicked. / 管理者メニューアイテムのクリック時は、他の処理を中断
    }

    // If clicked anywhere else, close the menu. / 他の場所がクリックされた場合はメニューを閉じる
    if (openMenu && !e.target.closest('.admin-menu')) {
        closeAdminMenu();
    }
  });

  fullscreenBtn?.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButton);

  // Settings Modal. / 設定モーダル
  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
  });
  closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
  });
  $$('input[name="theme"]').forEach(radio => radio.addEventListener('change', (e) => applyTheme(e.target.value)));
  $$('input[name="language"]').forEach(radio => radio.addEventListener('change', (e) => setLanguage(e.target.value)));

  $('#autoCopy')?.addEventListener('change', saveSettings);

  // Wake Lock Toggle. / Wake Lockのトグル
  if ('wakeLock' in navigator) {
    preventSleepToggle.addEventListener('change', async (e) => {
      if (e.target.checked) { // When trying to turn ON. / ONにしようとした時
        if ('getBattery' in navigator) {
          try {
            const battery = await navigator.getBattery();
            if (battery.level <= 0.2 && !battery.charging) {
              e.target.checked = false; // Force the switch back to OFF. / スイッチを強制的にOFFに戻す
              showToast(t('battery-low-prevent-sleep'), 'error');
              return; // Abort processing. / 処理を中断
            }
          } catch (err) {
            console.warn('Could not get battery status.', err);
          }
        }
        requestWakeLock(); // Turn on only if battery check passes. / バッテリーチェックを通過した場合のみONにする
      } else { // When turned OFF. / OFFにした時
        releaseWakeLock();
      }
      saveSettings();
    });
  }

  streamerModeToggle.addEventListener('change', () => {
    applyStreamerMode();
    saveSettings();
  });

  systemThemeListener.addEventListener('change', handleSystemThemeChange);

  historyEl.addEventListener('click', handleDeleteHistoryItem);

  // Listener for when individual filter checkboxes are changed. / フィルターのチェックボックス（個別）が変更されたときのリスナー
  $('#classFilters').addEventListener('change', handleFilterChange);
  // Listener for when "No Duplicates" checkbox is changed. / 「重複なし」チェックボックスが変更されたときのリスナー
  noRepeat.addEventListener('change', handleFilterChange);

  // Listener for when the "Select/Deselect All" button for filters is clicked. / フィルターの「すべて選択/解除」ボタンがクリックされたときのリスナー
  $('#classFilters').addEventListener('click', e => {
    const toggleType = e.target.dataset.toggleAll;
    if (toggleType) {
      const checkboxes = $$(`input[data-${toggleType}]`);
      if (checkboxes.length === 0) return;

      const allCurrentlyChecked = checkboxes.every(cb => cb.checked);
      const newCheckedState = !allCurrentlyChecked;

      checkboxes.forEach(cb => cb.checked = newCheckedState);
      handleFilterChange(); // Apply changes / 変更を適用
    }
  });

  document.addEventListener('click', (e) => {
    if (!inviteContainer.contains(e.target)) {
      inviteMenu.classList.remove('show');
    }
  });

  // Invite dropdown menu. / 招待ドロップダウンメニュー
  inviteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    inviteMenu.classList.toggle('show');
  });

  // Channel & Notifications Modal
  channelBtn.addEventListener('click', () => {
    renderNotifications(); // Render notification list
    channelModal.style.display = 'flex';
    // Mark notifications as read when opening the modal.
    state.unreadNotifications = 0;
    state.notifications.forEach(n => n.read = true);
    updateNotificationBadge();
  });
  closeChannelModalBtn.addEventListener('click', () => channelModal.style.display = 'none');
  channelModal.addEventListener('click', e => {
    if (e.target === channelModal) channelModal.style.display = 'none';
  });
  $('#joinChannelBtn').addEventListener('click', joinChannel);
  $('#leaveChannelBtn').addEventListener('click', () => leaveChannel(true));
  $('#channelNameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('#joinChannelBtn').click();
  });

  inviteChannelMembersBtn.addEventListener('click', () => {
    if (!channelState.currentChannel) {
      showToast(t('channel-error-not-in-channel'), 'error');
      return;
    }
    channelModal.style.display = 'flex';
  });

  if (notifyChannelBtn) {
    notifyChannelBtn.addEventListener('click', notifyChannelOfRoom);
  }

  $('#channel-members-container').addEventListener('click', e => {
    const inviteBtn = e.target.closest('[data-action="invite-member"]');
    if (inviteBtn) inviteChannelMemberToRoom(inviteBtn.dataset.memberId, inviteBtn.dataset.memberName);
  });

  notificationsListEl.addEventListener('click', async (e) => {
    const dismissBtn = e.target.closest('[data-action="dismiss-notification"]');
    const joinBtn = e.target.closest('[data-action="join-from-notification"]');
    const itemEl = e.target.closest('.notification-item');
    if (!itemEl) return;

    const notificationId = itemEl.dataset.notificationId;
    const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex === -1) return;

    if (dismissBtn) {
      state.notifications.splice(notificationIndex, 1);
      renderNotifications();
    }

    if (joinBtn) {
      const notification = state.notifications[notificationIndex];
      channelModal.style.display = 'none'; // Close modal before joining
      const password = notification.hasPassword ? prompt(t('realtime-password-prompt')) : '';
      if (password !== null) {
        await joinRoom(notification.roomId, password);
      }
    }
  });

  // Realtime Modal. / リアルタイムモーダル
  $('#openRealtimeBtn').addEventListener('click', () => {
    listenToPublicRooms();
    realtimeModal.style.display = 'flex';
  });
  $('#closeRealtimeBtn').addEventListener('click', () => {
    stopListenToPublicRooms();
    realtimeModal.style.display = 'none';
  });
  realtimeModal.addEventListener('click', e => {
    if (e.target === realtimeModal) {
      stopListenToPublicRooms();
      realtimeModal.style.display = 'none';
    }
  });

  // Join from public room list. / 公開ルームリストから参加
  $('#public-rooms-table')?.addEventListener('click', async (e) => {
    const joinBtn = e.target.closest('[data-action="join-from-list"]');
    if (joinBtn) {
      const row = joinBtn.closest('tr');
      const roomId = row.dataset.roomId;
      const hasPassword = row.dataset.hasPassword === 'true';
      const password = hasPassword ? prompt(t('realtime-password-prompt')) : '';
      if (password === null) return; // User cancelled prompt
      await joinRoom(roomId, password);
    }
  });

  // Join by ID from modal
  const joinRoomByIdBtn = $('#joinRoomByIdBtn');
  if (joinRoomByIdBtn) {
      joinRoomByIdBtn.addEventListener('click', async () => {
          const roomIdInput = $('#joinRoomIdInput');
          const passwordInput = $('#joinRoomPasswordInput');
          const roomId = roomIdInput.value.trim();
          const password = passwordInput.value.trim();
          if (!roomId) {
              showToast(t('realtime-error-join-no-id'), 'error');
              roomIdInput.focus();
              return;
          }
          await joinRoom(roomId, password);
      });
  }

  // Report Modal. / 通報モーダル
  const reportModal = $('#reportModal');
  const closeReportModalBtn = $('#closeReportModalBtn');
  const submitReportBtn = $('#submitReportBtn');
  closeReportModalBtn.addEventListener('click', () => reportModal.style.display = 'none');
  reportModal.addEventListener('click', (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = 'none';
    }
  });
  submitReportBtn.addEventListener('click', submitReport);

  // Disable default fullscreen on F11 and replace with app's toggle function. / F11キーによるデフォルトの全画面表示を無効化し、アプリのトグル機能に置き換える
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
      e.preventDefault();
      // Call the application's custom fullscreen toggle function. / アプリケーションのカスタム全画面切り替え機能を呼び出す
      toggleFullscreen();
    }
  });

  // --- Voice Input Initialization / 音声入力の初期化 ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after recognizing one phrase. / 一つのフレーズを認識したら停止
    recognition.lang = state.lang;
    recognition.interimResults = false;

    state.recognition = recognition; // Keep in state. / stateに保持
    let isListening = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // If there is existing text, add a space and append. / 既存のテキストがあればスペースを挟んで追記
      chatInput.value += (chatInput.value.length > 0 ? ' ' : '') + transcript;
    };

    recognition.onerror = (event) => {
      let errorKey = 'chat-voice-error-unknown';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorKey = 'chat-voice-error-permission';
      } else if (event.error === 'no-speech') {
        errorKey = 'chat-voice-error-no-speech';
      }
      showToast(t(errorKey), 'error');
    };

    recognition.onstart = () => { isListening = true; voiceInputBtn.classList.add('listening'); voiceInputBtn.title = t('chat-voice-input-stop'); };
    recognition.onend = () => { isListening = false; voiceInputBtn.classList.remove('listening'); voiceInputBtn.title = t('chat-voice-input-start'); };

    voiceInputBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    voiceInputBtn.style.display = 'none'; // Hide button if API is not supported. / APIがサポートされていない場合はボタンを非表示
  }
}

/**
 * Handles filter changes, updates the UI, and syncs with Firebase.
 * @param {Event} [event] - The checkbox change event (optional). / チェックボックスの変更イベント（オプション）
 */
function handleFilterChange(event) {
  // If an event is passed, prevent the last checkbox from being turned off. / イベントが渡された場合、最後のチェックボックスがオフにされるのを防ぐ
  if (event && event.target && event.target.matches('input[type="checkbox"]')) {
    const group = event.target.dataset.class ? 'class' : event.target.dataset.sub ? 'sub' : 'sp';
    if (group) {
      const selector = `input[data-${group}]`;
      const checkboxes = $$(selector);
      const checkedCount = checkboxes.filter(cb => cb.checked).length;
      if (checkedCount === 0) {
        event.target.checked = true; // Revert the check. / チェックを元に戻す
      }
    }
  }

  updatePool();
  saveSettings();
  if (state.isHost) {
    updateFiltersOnFirebase();
  }
}

async function initializeBanListener() {
  const myId = getPersistentUserId();
  if (!myId || !state.db) return;

  const banRef = state.db.ref(`bannedUsers/${myId}`);

  let isInitialCall = true;

  const handleBan = (snapshot) => {
    const isCurrentlyBanned = snapshot.exists();

    // Enable/disable online feature buttons based on ban status. / BAN状態に応じてオンライン機能のボタンを無効化/有効化
    $('#openRealtimeBtn').disabled = isCurrentlyBanned;
    $('#channelBtn').disabled = isCurrentlyBanned;

    if (isCurrentlyBanned) {
      // If in a room when banned, force leave. / BANされたときにルームに参加している場合は退出させる
      if (state.roomRef && state.playerRef) {
        // By deleting player info from the DB, the 'clients' listener will detect the leave and handle it.
        // This ensures the order of operations and prevents the screen from freezing.
        // DBからプレイヤー情報を削除することで、'clients'リスナーが退出を検知して処理する。これにより、処理の順序が保証され、画面が固まるのを防ぐ。
        state.playerRef.onDisconnect().cancel();
        state.playerRef.remove();
        showToast(t('realtime-error-banned-globally'), 'error', 8000);
      }
      // Close any open online-related modals. / オンライン関連のモーダルが開いていれば閉じる
      if (realtimeModal.style.display !== 'none') realtimeModal.style.display = 'none';
      if (channelModal.style.display !== 'none') channelModal.style.display = 'none';
    } else if (state.isBanned && !isCurrentlyBanned && !isInitialCall) {
      // If unbanned (excluding the initial call). / BAN状態から解除された場合（初回呼び出しを除く）
      showToast(t('unbanned-reload-notification'), 'success', 5000);
      setTimeout(() => location.reload(), 5000);
    }

    state.isBanned = isCurrentlyBanned;
    isInitialCall = false;
  };

  // Listen for initial data and future changes. / 初期データと将来の変更をリッスンする
  banRef.on('value', handleBan);
}

function listenToAnnouncements() {
  if (!state.db) return;
  const announcementsRef = state.db.ref('announcements');
  const now = Date.now();

  // Listen for new announcements added after the page loaded. / ページ読み込み後に追加された新しいお知らせをリッスンする
  announcementsRef.orderByChild('timestamp').startAt(now).on('child_added', (snapshot) => {
    const announcement = snapshot.val();
    if (!announcement) return;

    // Use a more prominent format for announcements. / お知らせにはより目立つ形式を使用する
    const message = `📢 ${t('announcement-prefix')}\n\n${announcement.message}`;
    const toastType = announcement.level || 'info';
    showToast(message, toastType, announcement.duration || 15000);
  });
}

/**
 * Listen for global mutes applied to the current user.
 */
function listenToGlobalMute() {
    const myId = getPersistentUserId();
    if (!myId || !state.db) return;
    const muteRef = state.db.ref(`globalMutedUsers/${myId}`);
    muteRef.on('value', (snapshot) => {
        const muteInfo = snapshot.val();
        if (muteInfo && muteInfo.expiresAt > Date.now()) {
            state.globalMuteInfo = muteInfo;
        } else {
            state.globalMuteInfo = null;
            // If mute expired, remove it from DB. / ミュートが期限切れになった場合、DBから削除する
            if (muteInfo) {
                muteRef.remove();
            }
        }
    });
}

function listenToInvitations() {
  const myId = getPersistentUserId();
  if (!myId || !state.db) return;

  const invitationsRef = state.db.ref(`invitations/${myId}`);
  // Listen for new invitations added after the page loaded.
  invitationsRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', (snapshot) => {
    const invitation = snapshot.val();
    const invitationId = snapshot.key;
    if (invitation) {
      showDirectInvitationToast(invitation, invitationId);
    }
  });
}

function init() {
  // --- Version Check and Forced Reload / バージョンチェックと強制リロード ---
  // Compare the locally saved version with the current app version. / ローカルに保存されたバージョンと現在のアプリバージョンを比較
  const savedVersion = localStorage.getItem('splaRouletteVersion');
  if (savedVersion && savedVersion !== APP_VERSION) { // If versions differ, clear data and reload. / バージョンが異なったらデータをクリアしてリロード
    // If versions differ, clear old settings and history and force a reload
    // to prevent errors from incompatible changes.
    // バージョンが異なる場合、互換性のない変更によるエラーを防ぐため、古い設定と履歴をクリアしてページを強制的にリロードする。
    console.log(`App updated from ${savedVersion} to ${APP_VERSION}. Clearing data and reloading.`);
    localStorage.removeItem('splaRouletteSettings');
    localStorage.removeItem('splaRouletteHistory');
    localStorage.removeItem('splaRoulettePlayerName');
    localStorage.setItem('splaRouletteVersion', APP_VERSION); // Save the new version. / 新しいバージョンを保存
    location.reload(true); // Reload, ignoring cache. / キャッシュを無視してリロード
    return; // Abort further initialization because of reload. / リロードするため、以降の初期化処理は中断
  }
  // Save the current version to local storage. / 現在のバージョンをローカルストレージに保存
  localStorage.setItem('splaRouletteVersion', APP_VERSION);

  // The `weapons` variable is loaded into the global scope from `weapons.js`. / `weapons`変数は`weapons.js`からグローバルスコープに読み込まれている
  if (typeof weapons === 'undefined' || weapons.length === 0) {
    console.error('ブキデータが見つかりません。weapons.jsが正しく読み込まれているか確認してください。');
    // Set language to render error message correctly. / エラーメッセージを正しくレンダリングするために言語を設定する
    setLanguage(navigator.language.startsWith('ja') ? 'ja' : 'en');
    resultContainer.innerHTML = `
      <div id="resultName" class="name">${t('error')}</div>
      <div id="resultClass" class="class">${t('error-loading-weapons')}</div>
    `;
    return;
  }

  buildFilterUI();
  setupEventListeners();
  loadAndApplySettings();

  // ▼▼▼ Added from here / ここから追加 ▼▼▼
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      battery.addEventListener('levelchange', updateBatteryStatus);
      battery.addEventListener('chargingchange', updateBatteryStatus);
    });
  }
  // ▲▲▲ Added up to here / ここまで追加 ▲▲▲

  const params = new URLSearchParams(window.location.search);
  if (!params.has('room')) {
    // If there is no room ID in the URL (= started in local mode),
    // load local history.
    // URLにルームIDがない場合（＝ローカルモードで起動した場合）、ローカルの履歴を読み込む
    loadHistory();
    updatePool();
  }

  // Wake Lock UI display control. / Wake Lock UIの表示制御
  if ('wakeLock' in navigator) {
    $('#wakeLockSetting').style.display = 'flex';
    $('#wakeLockHelp').style.display = 'block';
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Add battery monitoring function. / バッテリー監視機能を追加
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const handleBatteryChange = () => {
          // If sleep prevention is active, battery is <= 20%, and not charging. / スリープ防止が有効な状態で、バッテリーが20%以下かつ充電中でない場合
          if (preventSleepToggle.checked && battery.level <= 0.2 && !battery.charging) {
            releaseWakeLock(); // Release WakeLock. / WakeLockを解放
            preventSleepToggle.checked = false; // Also turn off the UI switch. / UIのスイッチもOFFにする
            saveSettings(); // Save settings. / 設定を保存
            showToast(t('battery-low-prevent-sleep'), 'error');
          }
        };
        battery.addEventListener('levelchange', handleBatteryChange);
        battery.addEventListener('chargingchange', handleBatteryChange);
      }).catch(err => console.warn('Cannot monitor battery status.', err));
    }
  }

  // Load initial player name and ID. / 初期プレイヤー名とIDの読み込み
  const savedName = localStorage.getItem('splaRoulettePlayerName') || '';
  syncAndSavePlayerName(savedName);

  // Initialize Firebase. Doing this after the player name is loaded ensures auto-join works correctly. / Firebaseを初期化。プレイヤー名が読み込まれた後に行うことで、自動参加が正しく機能する。
  initFirebase();

  // Asynchronously load and display the initial ID. / 非同期で初期IDを読み込んで表示
  (async () => {
    if (state.playerName) {
      try {
        // Check ban status. If banned, some features will be restricted. / BAN状態をチェック。BANされている場合、一部機能が制限される。
        await initializeBanListener();
        listenToAnnouncements();
        listenToChannel();
        listenToInvitations();
        const persistentUserId = getPersistentUserId();
        const shortId = await getOrCreateUserShortId(persistentUserId, state.playerName);
        manageUserPresence();
        playerShortIdDisplay.textContent = `#${shortId}`;
      } catch (error) {
        // Initialization errors other than ban (e.g., DB connection failure). / BAN以外の初期化エラー（DB接続失敗など）
        showServerError(t('firebase-init-failed'), error);
      }
    }
  })();
}

init();

/**
 * Starts the automatic room dissolution timer.
 * @param {number} createdAt - The timestamp when the room was created. / ルームが作成されたタイムスタンプ
 */
function startRoomExpiryTimer(createdAt) {
  if (state.roomExpiryTimer) {
    clearInterval(state.roomExpiryTimer);
  }

  const expiryTime = createdAt + ROOM_LIFETIME_MS;

  roomTimerContainer.style.display = 'inline-flex';

  state.roomExpiryTimer = setInterval(() => {
    const now = Date.now();
    const remaining = expiryTime - now;

    if (remaining <= 0) {
      clearInterval(state.roomExpiryTimer);
      state.roomExpiryTimer = null;
      roomTimerContainer.style.display = 'none';
      if (state.isHost) {
        showToast(t('realtime-room-expired'), 'error');
        handleLeaveRoom(true); // Host dissolves the room. / ホストがルームを解散
      }
      return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000).toString().padStart(2, '0');

    roomTimer.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

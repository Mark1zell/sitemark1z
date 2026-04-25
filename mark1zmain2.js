(function () {
  const OWNER_UID = '8365dfe0-74c7-4443-9e3d-22de6fd10050';
  const SUPABASE_URL = 'https://jtokctxkrojiggjckwfn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_jDgy-GUNpSSnPjsp2FQXAA_-m5NIehW';

  const SUPPORT_CHAT_IDENTITY = {
    id: 'support_mark1z_design',
    username: 'Mark1z Design',
    avatar_url: '',
    bio: 'Официальный чат Mark1z Design',
    is_virtual_support: true
  };

  if (!window.supabase) {
    console.error('Supabase script not loaded');
    return;
  }

  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let loadingOverlay = null;

  function showLoading(message = 'Загрузка...') {
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'mkz-loading-overlay';
      loadingOverlay.innerHTML = `<div class="mkz-loading-spinner"></div><div class="mkz-loading-message">${escapeHtml(message)}</div>`;
      document.body.appendChild(loadingOverlay);
    }
    const messageEl = loadingOverlay.querySelector('.mkz-loading-message');
    if (messageEl) messageEl.textContent = message;
    loadingOverlay.style.display = 'flex';
  }

  function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `mkz-notification mkz-notification--${type}`;
    notification.innerHTML = `<div class="mkz-notification__content"><span class="mkz-notification__message">${escapeHtml(message)}</span><button class="mkz-notification__close">×</button></div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    notification.querySelector('.mkz-notification__close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function validateFile(file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']) {
    if (file.size > maxSizeMB * 1024 * 1024) throw new Error(`Файл не должен превышать ${maxSizeMB}MB`);
    if (!allowedTypes.includes(file.type)) throw new Error(`Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`);
    return true;
  }

  async function optimizeImage(file, maxWidth = 1200, quality = 0.8) {
    if (!file.type.startsWith('image/')) return file;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  const queryCache = new Map();

  async function cachedQuery(key, queryFn, ttl = 60000) {
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) return cached.data;
    const data = await queryFn();
    queryCache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  function clearCache(key) {
    if (key) queryCache.delete(key);
    else queryCache.clear();
  }

  async function uploadToBucket(bucket, file, prefix) {
    try {
      if (bucket !== 'avatars') validateFile(file, 10);
      else validateFile(file, 2);
      const optimizedFile = await optimizeImage(file);
      const ext = (optimizedFile.name.split('.').pop() || 'bin').toLowerCase();
      const path = `${prefix}_${Date.now()}.${ext}`;
      const { error } = await supabaseClient.storage.from(bucket).upload(path, optimizedFile, { upsert: true });
      if (error) throw error;
      const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
      return { path, publicUrl: data.publicUrl };
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    }
  }

  async function uploadMessengerAttachment(file) {
    const upload = await uploadToBucket('chat-files', file, `chat_${state.currentSession.user.id}`);
    return { attachment_url: upload.publicUrl, attachment_name: file.name || '', attachment_type: file.type || '' };
  }

  function escapeHtml(value) {
  if (!value) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, function(m) { return map[m]; });
}

  function safeText(value, fallback = '') {
    const prepared = String(value ?? '').trim();
    return prepared ? escapeHtml(prepared) : fallback;
  }

  function safeUrl(value) {
    const prepared = String(value ?? '').trim();
    if (!prepared) return '';
    return encodeURI(prepared);
  }

  function nl2brSafe(value) {
    return safeText(value || '', '').split(String.fromCharCode(10)).join('<br>');
  }

  function getInitial(name, fallback = 'Г') {
    return String(name || fallback).trim().charAt(0).toUpperCase() || fallback;
  }

  function formatDateTime(value) {
    if (!value) return 'Без даты';
    try { return new Date(value).toLocaleString('ru-RU'); } catch { return String(value); }
  }

  function formatDateOnly(value) {
    if (!value) return '—';
    try { return new Date(value).toLocaleDateString('ru-RU'); } catch { return String(value); }
  }

  function pluralRu(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function generateNumericId(uuid) {
    const uuidStr = String(uuid).replace(/-/g, '');
    const numericHash = Math.abs(parseInt(uuidStr.slice(-8), 16) % 10000000);
    return '#' + String(numericHash).padStart(7, '0');
  }

  function formatLastSeen(value) {
    if (!value) return 'Не в сети';
    const diffMs = Date.now() - new Date(value).getTime();
    const diffMin = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMin < 1) return 'Был(а) только что';
    if (diffMin < 60) return `Был(а) ${diffMin} ${pluralRu(diffMin, 'минуту', 'минуты', 'минут')} назад`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Был(а) ${diffHours} ${pluralRu(diffHours, 'час', 'часа', 'часов')} назад`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Был(а) ${diffDays} ${pluralRu(diffDays, 'день', 'дня', 'дней')} назад`;
    return `Был(а) ${formatDateOnly(value)}`;
  }

  function slugify(text) {
    return String(text || '').trim().toLowerCase().replace(/[^a-z0-9а-яё\s-]/gi, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  }

  function isOwner() {
    return !!(state.currentSession?.user?.id === OWNER_UID);
  }

  function isSupportConversation(conversationId) {
    return String(conversationId) === String(state.supportConversationId);
  }

  function getMessageAuthorIdentity(message) {
    if (message?.sender_mode === 'support_brand') return SUPPORT_CHAT_IDENTITY;
    return getProfileByUserId(message.user_id);
  }

  function setButtonState(button, loading, loadingText, defaultText) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? loadingText : defaultText;
  }

  function applyAvatar(el, avatarUrl, name) {
    if (!el) return;
    if (avatarUrl) {
      el.style.backgroundImage = `url('${avatarUrl}')`;
      el.textContent = '';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat = 'no-repeat';
    } else {
      el.style.backgroundImage = '';
      el.textContent = getInitial(name, 'Г');
    }
  }

  function buildPublicUserCode(profile, userId) {
    if (String(userId) === String(OWNER_UID)) return '#Mark1z';
    const existing = String(profile?.public_id || profile?.user_code || '').trim();
    if (existing && existing !== '#Mark1z') {
      return existing.startsWith('#') ? existing : '#' + existing;
    }
    if (profile?.email) {
      const emailHash = Math.abs(profile.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9000000);
      return '#' + String(emailHash + 1000000).slice(-7);
    }
    const numericId = Math.abs(parseInt(String(userId).replace(/\D/g, '').slice(-7)) || 1000000);
    return '#' + String(numericId).padStart(7, '0');
  }

  function getProfileByUserId(userId) {
    if (String(userId) === String(SUPPORT_CHAT_IDENTITY.id)) return SUPPORT_CHAT_IDENTITY;
    if (String(state.currentProfile?.id) === String(userId)) return state.currentProfile;
    const fromSearch = state.peopleSearchResults.find(p => String(p.id) === String(userId));
    if (fromSearch) return fromSearch;
    const fromCache = state.allProfilesCache.find(p => String(p.id) === String(userId));
    if (fromCache) return fromCache;
    const fromReviews = state.reviews.find(r => String(r.user_id) === String(userId))?.profile;
    if (fromReviews) return fromReviews;
    return null;
  }

  function isProfileFieldVisible(profile, field) {
    if (!profile) return false;
    if (String(profile.id) === String(state.currentSession?.user?.id)) return true;
    return profile[field] !== false;
  }

  function getVisiblePhone(profile) {
    if (!profile?.phone) return 'Телефон не указан';
    return isProfileFieldVisible(profile, 'show_phone') ? profile.phone : 'Телефон скрыт';
  }

  function getVisibleTelegram(profile) {
    if (!profile?.telegram_username) return 'Telegram не указан';
    return isProfileFieldVisible(profile, 'show_telegram') ? profile.telegram_username : 'Telegram скрыт';
  }

  function getVisibleLastSeen(profile) {
    if (!profile) return 'Не в сети';
    if (profile.is_virtual_support) return 'Официальный чат';
    if (!isProfileFieldVisible(profile, 'show_last_seen')) {
      return 'Статус скрыт';
    }
    if (profile.is_online) {
      return 'В сети';
    }
    if (profile.last_seen_at) {
      const lastSeen = new Date(profile.last_seen_at);
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 5) {
        return 'Был(а) только что';
      } else if (diffMins < 60) {
        return `Был(а) ${diffMins} ${pluralRu(diffMins, 'минуту', 'минуты', 'минут')} назад`;
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `Был(а) ${hours} ${pluralRu(hours, 'час', 'часа', 'часов')} назад`;
      } else {
        const days = Math.floor(diffMins / 1440);
        if (days < 7) {
          return `Был(а) ${days} ${pluralRu(days, 'день', 'дня', 'дней')} назад`;
        }
        return formatDateOnly(profile.last_seen_at);
      }
    }
    return 'Давно не был(а)';
  }

  // ========== DOM ЭЛЕМЕНТЫ ==========
  const screens = $$('.mkz-screen');
  const navButtons = $$('[data-screen-open]');
  const burger = $('#mkzBurger');
  const nav = $('#mkzNav');
  const userNameTop = $('#mkzUserNameTop');
  const inlineUsername = $('#mkzInlineUsername');
  const topAvatar = $('#mkzTopAvatar');
  const previewAvatar = $('#mkzPreviewAvatar');
  const previewName = $('#mkzPreviewName');
  const previewPhone = $('#mkzPreviewPhone');
  const previewUserId = $('#mkzPreviewUserId');
  const authBlock = $('#mkzAuthBlock');
  const loginForm = $('#mkzLoginForm');
  const registerForm = $('#mkzRegisterForm');
  const loginBtn = $('#mkzLoginBtn');
  const registerBtn = $('#mkzRegisterBtn');
  const showLoginBtn = $('#mkzShowLogin');
  const showRegisterBtn = $('#mkzShowRegister');
  const loginEmail = $('#mkzLoginEmail');
  const loginPassword = $('#mkzLoginPassword');
  const registerEmail = $('#mkzRegisterEmail');
  const registerPassword = $('#mkzRegisterPassword');
  const nameInput = $('#mkzNameInput');
  const phoneInput = $('#mkzPhoneInput');
  const avatarInput = $('#mkzAvatarInput');
  const telegramInput = $('#mkzTelegramInput');
  const updateBio = $('#mkzUpdateBio');
  const updateBioBtn = $('#mkzUpdateBioBtn');
  const vkInput = $('#mkzVkUsername');
  const socialError = $('#mkzSocialError');
  const accountActions = $('#mkzAccountActions');
  const logoutBtn = $('#mkzLogoutBtn');
  const updateProfileBtn = $('#mkzUpdateProfileBtn');
  const updateName = $('#mkzUpdateName');
  const updatePhone = $('#mkzUpdatePhone');
  const updateAvatar = $('#mkzUpdateAvatar');
  const updateTelegram = $('#mkzUpdateTelegram');
  const privacyShowPhone = $('#mkzPrivacyShowPhone');
  const privacyShowTelegram = $('#mkzPrivacyShowTelegram');
  const privacyShowLastSeen = $('#mkzPrivacyShowLastSeen');
  const reviewForm = $('#mkzReviewForm');
  const reviewLoginNote = $('#mkzReviewLoginNote');
  const reviewText = $('#mkzReviewText');
  const reviewImage = $('#mkzReviewImage');
  const reviewsList = $('#mkzReviewsList');
  const averageRating = $('#mkzAverageRating');
  const averageRatingTop = $('#mkzAverageRatingTop');
  const stars = $$('.mkz-star');
  const reviewSendBtn = $('#mkzReviewSendBtn');
  const faqAskForm = $('#mkzFaqAskForm');
  const faqAskName = $('#mkzFaqAskName');
  const faqAskContact = $('#mkzFaqAskContact');
  const faqAskQuestion = $('#mkzFaqAskQuestion');
  const faqAskBtn = $('#mkzFaqAskBtn');
  const faqQuestionsAdminWrap = $('#mkzFaqQuestionsAdminWrap');
  const faqQuestionsAdminList = $('#mkzFaqQuestionsAdminList');
  const faqFab = $('#mkzFaqFab');
  const portfolioCount = $('#mkzPortfolioCount');
  const folderGrid = $('#mkzFolderGrid');
  const folderBrowserList = $('#mkzFolderBrowserList');
  const folderInside = $('#mkzFolderInside');
  const backToFolders = $('#mkzBackToFolders');
  const currentFolderTitle = $('#mkzCurrentFolderTitle');
  const currentFolderWorks = $('#mkzCurrentFolderWorks');
  const quickAddFolderBtn = $('#mkzQuickAddFolder');
  const quickAddWorkBtn = $('#mkzQuickAddWork');
  const ownerPanel = $('#mkzOwnerPanel');
  const folderAdminForm = $('#mkzFolderAdminForm');
  const folderTitle = $('#mkzFolderTitle');
  const folderSlug = $('#mkzFolderSlug');
  const folderSortOrder = $('#mkzFolderSortOrder');
  const folderCover = $('#mkzFolderCover');
  const folderAddBtn = $('#mkzFolderAddBtn');
  const folderEditForm = $('#mkzFolderEditForm');
  const editFolderSelect = $('#mkzEditFolderSelect');
  const editFolderCover = $('#mkzEditFolderCover');
  const folderEditBtn = $('#mkzFolderEditBtn');
  const portfolioAdminForm = $('#mkzPortfolioAdminForm');
  const portfolioFolderSelect = $('#mkzPortfolioFolderSelect');
  const portfolioTitle = $('#mkzPortfolioTitle');
  const portfolioDescription = $('#mkzPortfolioDescription');
  const portfolioSortOrder = $('#mkzPortfolioSortOrder');
  const portfolioImage = $('#mkzPortfolioImage');
  const portfolioAddBtn = $('#mkzPortfolioAddBtn');
  const portfolioEditForm = $('#mkzPortfolioEditForm');
  const editWorkSelect = $('#mkzEditWorkSelect');
  const editWorkTitle = $('#mkzEditWorkTitle');
  const editWorkDescription = $('#mkzEditWorkDescription');
  const editWorkImage = $('#mkzEditWorkImage');
  const editWorkBtn = $('#mkzEditWorkBtn');
  const newsAdminPanel = $('#mkzNewsAdminPanel');
  const newsTitle = $('#mkzNewsTitle');
  const newsText = $('#mkzNewsText');
  const newsImage = $('#mkzNewsImage');
  const newsExtraFile = $('#mkzNewsExtraFile');
  const newsLinkText = $('#mkzNewsLinkText');
  const newsLinkUrl = $('#mkzNewsLinkUrl');
  const newsAddBtn = $('#mkzNewsAddBtn');
  const newsList = $('#mkzNewsList');
  const attachImageBtn = $('#mkzAttachImageBtn');
  const attachFileBtn = $('#mkzAttachFileBtn');
  const togglePollBtn = $('#mkzTogglePollBtn');
  const toggleContestBtn = $('#mkzToggleContestBtn');
  const toggleLinkBtn = $('#mkzToggleLinkBtn');
  const togglePinBtn = $('#mkzTogglePinBtn');
  const pollPanel = $('#mkzPollPanel');
  const contestPanel = $('#mkzContestPanel');
  const linkPanel = $('#mkzLinkPanel');
  const newsMetaPreview = $('#mkzNewsMetaPreview');
  const pollQuestion = $('#mkzPollQuestion');
  const pollOption1 = $('#mkzPollOption1');
  const pollOption2 = $('#mkzPollOption2');
  const pollOption3 = $('#mkzPollOption3');
  const contestTitle = $('#mkzContestTitle');
  const contestDescription = $('#mkzContestDescription');
  const contestPrize = $('#mkzContestPrize');
  const contestDeadline = $('#mkzContestDeadline');
  const peopleSearchInput = $('#mkzPeopleSearchInput');
  const peopleSearchBtn = $('#mkzPeopleSearchBtn');
  const peopleSearchResults = $('#mkzPeopleSearchResults');
  const publicProfileAvatar = $('#mkzPublicProfileAvatar');
  const publicProfileName = $('#mkzPublicProfileName');
  const publicProfileId = $('#mkzPublicProfileId');
  const publicProfileStatus = $('#mkzPublicProfileStatus');
  const publicProfileRegistered = $('#mkzPublicProfileRegistered');
  const publicProfilePhone = $('#mkzPublicProfilePhone');
  const publicProfileTelegram = $('#mkzPublicProfileTelegram');
  const publicProfileBio = $('#mkzPublicProfileBio');
  const publicProfileActivity = $('#mkzPublicProfileActivity');
  const openProfileMessengerBtn = $('#mkzOpenProfileMessengerBtn');
  const backToPeopleBtn = $('#mkzBackToPeopleBtn');
  const messengerSearch = $('#mkzMessengerSearch');
  const messengerDialogs = $('#mkzMessengerDialogs');
  const messengerTopAvatar = $('#mkzMessengerTopAvatar');
  const messengerTopName = $('#mkzMessengerTopName');
  const messengerTopSub = $('#mkzMessengerTopSub');
  const messengerMessages = $('#mkzMessengerMessages');
  const messengerForm = $('#mkzMessengerForm');
  const messengerInput = $('#mkzMessengerInput');
  const messengerSendBtn = $('#mkzMessengerSendBtn');
  const pinnedOwnerChatBtn = $('#mkzPinnedOwnerChatBtn');
  const pinnedOwnerAvatar = $('#mkzPinnedOwnerAvatar');
  const pinnedOwnerName = $('#mkzPinnedOwnerName');
  const pinnedOwnerTime = $('#mkzPinnedOwnerTime');
  const pinnedOwnerPreview = $('#mkzPinnedOwnerPreview');
  const pinnedOwnerUnread = $('#mkzPinnedOwnerUnread');
  const messengerAttachImageBtn = $('#mkzMessengerAttachImageBtn');
  const messengerAttachFileBtn = $('#mkzMessengerAttachFileBtn');
  const messengerImageInput = $('#mkzMessengerImageInput');
  const messengerFileInput = $('#mkzMessengerFileInput');
  const messengerAttachMeta = $('#mkzMessengerAttachMeta');
  const messengerEmptyState = $('#mkzMessengerEmptyState');
  const messengerOpenProfileBtn = $('#mkzMessengerOpenProfileBtn');
  const messengerRefreshBtn = $('#mkzMessengerRefreshBtn');
  const contestEntriesAdminList = $('#mkzContestEntriesAdminList');
  const participantsNavBtn = $('#mkzParticipantsNavBtn');
  const participantsBottomBtn = $('#mkzParticipantsBottomBtn');
  const orderModal = $('#mkzOrderModal');
  const orderBackdrop = $('#mkzOrderBackdrop');
  const openOrderModal = $('#mkzOpenOrderModal');
  const closeOrderModal = $('#mkzCloseOrderModal');
  const reviewPopup = $('#mkzReviewPopup');
  const reviewPopupBackdrop = $('#mkzReviewPopupBackdrop');
  const closeReviewPopup = $('#mkzCloseReviewPopup');
  const popupReviewContent = $('#mkzPopupReviewContent');
  const imageModal = $('#mkzImageModal');
  const imageModalBackdrop = $('#mkzImageModalBackdrop');
  const closeImageModal = $('#mkzCloseImageModal');
  const popupImageWrap = $('#mkzPopupImageWrap');
  const popupImageTitle = $('#mkzPopupImageTitle');
  const chatFab = $('#mkzChatFab');
  const userPillButton = $('#mkzUserPillButton');
  const aboutTabs = $$('[data-about-tab]');
  const aboutPanels = $$('[data-about-panel]');
  const messengerVoiceBtn = $('#mkzMessengerVoiceBtn');
  const messengerVoiceStopBtn = $('#mkzMessengerVoiceStopBtn');

  // ========== STATE ==========
  const state = {
    currentSession: null, currentProfile: null, currentRating: 5, currentOpenedFolderId: null,
    folders: [], items: [], reviews: [], reviewLikes: [], reviewReplies: [],
    newsPosts: [], newsLikes: [], newsComments: [], newsPolls: [], newsPollOptions: [], newsPollVotes: [], contests: [], contestEntries: [],
    faqQuestions: [], peopleSearchResults: [], allProfilesCache: [], openedProfile: null,
    conversations: [], conversationMembers: [], conversationMessages: [], currentConversationId: null, supportConversationId: null,
    userLikedPosts: new Set(), newsLikesMap: {}, newsCommentsMap: {},
    profileSyncInProgress: false, isPinnedDraft: false,
    pendingMessengerAttachment: null,  supportSendMode: 'brand', messengerPollingTimer: null, messagesChannel: null, messagesPolling: null, isSubscribed: false, messagesSubscription: null, knownMessageIds: new Set(), notificationsReady: false, initialMessagesHydrated: false,
    mediaRecorder: null, mediaChunks: [], voiceStream: null
  };

   // ========== ФУНКЦИИ РАБОТЫ С ПРОФИЛЕМ ==========
  async function readProfileByUserId(userId) {
    try {
      const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) return null;
      return data || null;
    } catch (e) { console.error('readProfileByUserId error:', e); return null; }
  }

  async function ensureProfileForCurrentUser(baseData) {
    if (!state.currentSession?.user) return null;
    if (state.profileSyncInProgress) return state.currentProfile || null;
    state.profileSyncInProgress = true;
    try {
      const userId = state.currentSession.user.id;
      const existing = await readProfileByUserId(userId);
      const fallbackName = baseData?.username || state.currentSession.user.user_metadata?.username || state.currentSession.user.email?.split('@')[0] || 'Пользователь';
      const numericId = generateNumericId(userId);
      const publicId = String(userId) === String(OWNER_UID) ? '#Mark1z' : (existing?.public_id || existing?.user_code || numericId);
      const now = new Date().toISOString();
      const payload = {
        id: userId,
        username: baseData?.username ?? existing?.username ?? fallbackName,
        full_name: baseData?.username ?? existing?.full_name ?? fallbackName,
        phone: baseData?.phone ?? existing?.phone ?? '',
        avatar_url: baseData?.avatar_url ?? existing?.avatar_url ?? '',
        email: state.currentSession.user.email || existing?.email || '',
        telegram_username: baseData?.telegram_username ?? existing?.telegram_username ?? '',
        bio: existing?.bio || '',
        public_id: publicId,
        user_code: publicId,
        is_admin: userId === OWNER_UID,
        is_online: false,
        last_seen_at: existing?.last_seen_at || now,
        show_phone: existing?.show_phone ?? true,
        show_telegram: existing?.show_telegram ?? true,
        show_last_seen: existing?.show_last_seen ?? true
      };
      const { error } = await supabaseClient.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) console.error('ensureProfileForCurrentUser upsert error', error);
      const afterInsert = await readProfileByUserId(userId);
      state.currentProfile = afterInsert || payload;
      return state.currentProfile;
    } finally { state.profileSyncInProgress = false; }
  }

  async function updatePresence(isOnline) {
    if (!state.currentSession?.user) return;
    try {
      await supabaseClient.from('profiles').update({ is_online: !!isOnline, last_seen_at: new Date().toISOString() }).eq('id', state.currentSession.user.id);
    } catch (e) { console.error('updatePresence error:', e); }
  }

  async function touchCurrentProfileActivity() {
    if (!state.currentSession?.user) return;
    try {
      const isOnline = !document.hidden;
      await supabaseClient.from('profiles').update({ is_online: isOnline, last_seen_at: new Date().toISOString() }).eq('id', state.currentSession.user.id);
    } catch (e) { console.error('touchCurrentProfileActivity error:', e); }
  }

  async function fetchSessionAndProfile(baseData) {
    try {
      const { data: sessionData, error } = await supabaseClient.auth.getSession();
      if (error) { state.currentSession = null; state.currentProfile = null; if (typeof renderProfile === 'function') renderProfile(); return; }
      state.currentSession = sessionData?.session || null;
      if (!state.currentSession) { state.currentProfile = null; if (typeof renderProfile === 'function') renderProfile(); return; }
      state.currentProfile = await ensureProfileForCurrentUser(baseData);
      if (typeof renderProfile === 'function') renderProfile();
      await touchCurrentProfileActivity();
    } catch (err) { console.error('fetchSessionAndProfile error:', err); if (typeof renderProfile === 'function') renderProfile(); }
  }

  async function cacheProfiles() {
    try {
      const { data } = await supabaseClient.from('profiles').select('*').order('created_at', { ascending: false });
      state.allProfilesCache = data || [];
    } catch (e) { console.error('cacheProfiles error:', e); state.allProfilesCache = []; }
  }

  async function loadUserBio() {
    if (!state.currentSession?.user) return;
    try {
      const { data, error } = await supabaseClient.from('profiles').select('bio').eq('id', state.currentSession.user.id).single();
      if (error) throw error;
      if (updateBio && data?.bio) updateBio.value = data.bio;
    } catch (err) { console.error('Error loading bio:', err); }
  }

  async function saveUserBio() {
    if (!state.currentSession?.user) { showNotification('Сначала войдите в аккаунт', 'warning'); return; }
    const bio = updateBio?.value.trim() || '';
    setButtonState(updateBioBtn, true, 'Сохранение...', 'Сохранить описание');
    try {
      const { error } = await supabaseClient.from('profiles').update({ bio: bio }).eq('id', state.currentSession.user.id);
      if (error) throw error;
      if (state.currentProfile) state.currentProfile.bio = bio;
      showNotification('Описание профиля обновлено', 'success');
    } catch (err) { console.error('Error saving bio:', err); showNotification('Ошибка сохранения описания', 'error');
    } finally { setButtonState(updateBioBtn, false, 'Сохранение...', 'Сохранить описание'); }
  }

  function validateSocialContacts(telegram, vk) {
    const hasTelegram = telegram && telegram.trim().length > 0;
    const hasVk = vk && vk.trim().length > 0;
    if (!hasTelegram && !hasVk) return { valid: false, message: 'Укажите хотя бы один контакт: Telegram или ВКонтакте' };
    if (hasTelegram) {
      let tg = telegram.trim();
      if (!tg.startsWith('@')) tg = '@' + tg.replace(/^@+/, '');
      if (!/^@[a-zA-Z0-9_]{5,32}$/.test(tg)) return { valid: false, message: 'Неверный формат Telegram username' };
    }
    return { valid: true, message: '' };
  }

  function renderProfile() {
    const profile = state.currentProfile;
    const name = profile?.username || state.currentSession?.user?.email?.split('@')[0] || 'Гость';
    const phone = profile?.phone || (state.currentSession ? 'Телефон не указан' : 'Не авторизован');
    const publicId = buildPublicUserCode(profile, state.currentSession?.user?.id);
    if (userNameTop) userNameTop.textContent = name;
    if (inlineUsername) inlineUsername.textContent = name;
    if (previewName) previewName.textContent = name;
    if (previewPhone) previewPhone.textContent = phone;
    if (previewUserId) previewUserId.textContent = `ID: ${publicId}`;
    applyAvatar(topAvatar, profile?.avatar_url, name);
    applyAvatar(previewAvatar, profile?.avatar_url, name);
    if (updateName) updateName.value = profile?.username || '';
    if (updatePhone) updatePhone.value = profile?.phone || '';
    if (updateTelegram) updateTelegram.value = profile?.telegram_username || '';
    if (updateBio) updateBio.value = profile?.bio || '';
    if (privacyShowPhone) privacyShowPhone.checked = profile?.show_phone !== false;
    if (privacyShowTelegram) privacyShowTelegram.checked = profile?.show_telegram !== false;
    if (privacyShowLastSeen) privacyShowLastSeen.checked = profile?.show_last_seen !== false;
    updateAuthUI();
  }

  function updateAuthUI() {
    const loggedIn = !!state.currentSession;
    const owner = isOwner();
    if (authBlock) authBlock.style.display = loggedIn ? 'none' : 'block';
    if (accountActions) accountActions.style.display = loggedIn ? 'grid' : 'none';
    if (reviewSendBtn) reviewSendBtn.disabled = !loggedIn;
    if (reviewLoginNote) reviewLoginNote.classList.toggle('is-visible', !loggedIn);
    if (ownerPanel) ownerPanel.style.display = owner ? 'block' : 'none';
    if (newsAdminPanel) newsAdminPanel.style.display = owner ? 'block' : 'none';
    if (faqQuestionsAdminWrap) faqQuestionsAdminWrap.style.display = owner ? 'block' : 'none';
    if (quickAddFolderBtn) quickAddFolderBtn.style.display = owner ? 'inline-flex' : 'none';
    if (quickAddWorkBtn) quickAddWorkBtn.style.display = owner && state.currentOpenedFolderId ? 'inline-flex' : 'none';
    if (participantsNavBtn) participantsNavBtn.style.display = owner ? 'inline-flex' : 'none';
    if (participantsBottomBtn) participantsBottomBtn.style.display = owner ? 'inline-flex' : 'none';
  }

  async function handleRegister() {
    if (!registerForm?.reportValidity()) return;
    const telegramUsername = telegramInput?.value.trim() || '';
    const vkUsername = vkInput?.value.trim() || '';
    const socialValidation = validateSocialContacts(telegramUsername, vkUsername);
    if (!socialValidation.valid) { if (socialError) socialError.textContent = socialValidation.message; showNotification(socialValidation.message, 'warning'); return; }
    if (socialError) socialError.textContent = '';
    setButtonState(registerBtn, true, 'Регистрация...', 'Зарегистрироваться');
    try {
      const username = nameInput?.value.trim() || '';
      const phone = phoneInput?.value.trim() || '';
      const avatarFile = avatarInput?.files?.[0];
      let formattedTelegram = telegramUsername;
      if (formattedTelegram && !formattedTelegram.startsWith('@')) formattedTelegram = '@' + formattedTelegram.replace(/^@+/, '');
      const { data, error } = await supabaseClient.auth.signUp({
        email: registerEmail.value.trim(), password: registerPassword.value.trim(),
        options: { data: { username, telegram_username: formattedTelegram, vk_username: vkUsername } }
      });
      if (error) { showNotification('Ошибка регистрации: ' + error.message, 'error'); return; }
      let avatarUrl = '';
      if (data?.user && avatarFile) { try { const upload = await uploadToBucket('avatars', avatarFile, data.user.id); avatarUrl = upload.publicUrl; } catch (err) { console.error(err); } }
      if (data?.session) { state.currentSession = data.session; } else { const { data: sessionData } = await supabaseClient.auth.getSession(); state.currentSession = sessionData?.session || null; }
      if (state.currentSession) {
        await ensureProfileForCurrentUser({ username, phone, avatar_url: avatarUrl, telegram_username: formattedTelegram, vk_username: vkUsername });
        state.currentProfile = (await readProfileByUserId(state.currentSession.user.id)) || state.currentProfile;
        renderProfile(); await cacheProfiles(); await searchPeople(); await loadUserBio(); openScreen('account');
        showNotification('Регистрация завершена', 'success');
      } else {
        showNotification('Аккаунт создан. Теперь войдите в него.', 'info');
        registerForm.reset(); if (vkInput) vkInput.value = ''; if (showLoginBtn) showLoginBtn.click();
      }
    } catch (err) { console.error(err); showNotification('Ошибка регистрации', 'error'); } finally { setButtonState(registerBtn, false, 'Регистрация...', 'Зарегистрироваться'); }
  }

  async function handleUpdateProfile() {
    if (!state.currentSession) return;
    setButtonState(updateProfileBtn, true, 'Сохранение...', 'Обновить профиль');
    try {
      let avatarUrl = state.currentProfile?.avatar_url || '';
      const file = updateAvatar?.files?.[0];
      if (file) { const upload = await uploadToBucket('avatars', file, state.currentSession.user.id); avatarUrl = upload.publicUrl; }
      let telegramUsername = updateTelegram?.value.trim() || '';
      if (telegramUsername && !telegramUsername.startsWith('@')) telegramUsername = '@' + telegramUsername.replace(/^@+/, '');
      const payload = {
        username: updateName?.value.trim() || state.currentProfile?.username || 'Пользователь',
        full_name: updateName?.value.trim() || state.currentProfile?.full_name || state.currentProfile?.username || 'Пользователь',
        phone: updatePhone?.value.trim() || state.currentProfile?.phone || '',
        telegram_username: telegramUsername, email: state.currentSession.user.email || state.currentProfile?.email || '',
        avatar_url: avatarUrl, bio: updateBio?.value.trim() || state.currentProfile?.bio || '',
        last_seen_at: new Date().toISOString(), show_phone: privacyShowPhone?.checked === true,
        show_telegram: privacyShowTelegram?.checked === true, show_last_seen: privacyShowLastSeen?.checked === true, is_online: !document.hidden
      };
      const { error } = await supabaseClient.from('profiles').update(payload).eq('id', state.currentSession.user.id);
      if (error) { showNotification(error.message, 'error'); return; }
      state.currentProfile = await readProfileByUserId(state.currentSession.user.id) || { ...state.currentProfile, ...payload };
      renderProfile(); await cacheProfiles(); await searchPeople(); showNotification('Профиль обновлён', 'success');
    } catch (err) { console.error(err); showNotification('Ошибка обновления профиля', 'error'); } finally { setButtonState(updateProfileBtn, false, 'Сохранение...', 'Обновить профиль'); }
  }

  async function handleLogin() {
    if (!loginForm?.reportValidity()) return;
    setButtonState(loginBtn, true, 'Вход...', 'Войти');
    try {
      const email = loginEmail?.value.trim() || '';
      const password = loginPassword?.value || '';
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) { showNotification('Ошибка входа: ' + error.message, 'error'); return; }
      state.currentSession = data?.session || null;
      if (!state.currentSession) { const { data: sessionData } = await supabaseClient.auth.getSession(); state.currentSession = sessionData?.session || null; }
      if (!state.currentSession) { showNotification('Сессия не создалась после входа', 'error'); return; }
      state.currentProfile = await ensureProfileForCurrentUser();
      renderProfile();
      await Promise.all([cacheProfiles(), renderPortfolio(), renderReviews(), renderNews(), renderFaqQuestions(), renderContestEntriesAdmin(), searchPeople(), renderMessengerDialogs()]);
      openScreen('account');
      showNotification('Вход выполнен', 'success');
    } catch (err) { console.error(err); showNotification('Ошибка входа', 'error'); } finally { setButtonState(loginBtn, false, 'Вход...', 'Войти'); }
  }

  async function handleLogout() {
    stopPresenceHeartbeat();

      // Останавливаем polling при выходе
  if (state.messagesPolling) {
    clearInterval(state.messagesPolling);
    state.messagesPolling = null;
  }
      
  if (state.messagesChannel) {
    try {
      await supabaseClient.removeChannel(state.messagesChannel);
    } catch(e) {}
    state.messagesChannel = null;
    state.isSubscribed = false;
  }
    
    if (state.currentSession?.user) {
      await supabaseClient.from('profiles').update({ is_online: false, last_seen_at: new Date().toISOString() }).eq('id', state.currentSession.user.id);
    }
    await supabaseClient.auth.signOut();
    state.currentSession = null;
    state.currentProfile = null;
    state.userLikedPosts = new Set();
    state.newsLikesMap = {};
    state.newsCommentsMap = {};
    state.currentConversationId = null;
    state.supportConversationId = null;
    state.openedProfile = null;
    state.knownMessageIds = new Set();
    state.initialMessagesHydrated = false;
    clearMessengerAttachment();
    renderProfile();
    await Promise.all([cacheProfiles(), renderPortfolio(), renderReviews(), renderNews(), renderFaqQuestions(), renderContestEntriesAdmin(), searchPeople(), renderMessengerDialogs()]);
    openScreen('account');
    showNotification('Вы вышли из аккаунта', 'info');
  }

    // ========== PRESENCE HEARTBEAT ==========
  function startPresenceHeartbeat() {
    if (state.messengerPollingTimer) return;
    
    state.messengerPollingTimer = setInterval(async () => {
      if (!state.currentSession?.user) return;
      
      await touchCurrentProfileActivity();
      await fetchMessengerData();
      await renderMessengerDialogs();
      
      if (state.currentConversationId) {
        await openConversation(state.currentConversationId, true);
      }
    }, 7000);
  }

  function stopPresenceHeartbeat() {
    if (state.messengerPollingTimer) {
      clearInterval(state.messengerPollingTimer);
      state.messengerPollingTimer = null;
    }
  }

  async function requestNotificationsIfNeeded() {
    if (!('Notification' in window)) return;
    if (state.notificationsReady) return;
    
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {}
    }
    
    state.notificationsReady = true;
  }

  // ========== ФУНКЦИИ ПОРТФОЛИО ==========
  function renderPortfolioSelects() {
    if (portfolioFolderSelect) portfolioFolderSelect.innerHTML = state.folders.map(folder => `<option value="${folder.id}">${safeText(folder.title, 'Папка')}</option>`).join('');
    if (editFolderSelect) editFolderSelect.innerHTML = state.folders.map(folder => `<option value="${folder.id}">${safeText(folder.title, 'Папка')}</option>`).join('');
    if (editWorkSelect) editWorkSelect.innerHTML = state.items.map(item => `<option value="${item.id}">${safeText(item.title || 'Работа', 'Работа')}</option>`).join('');
  }

  function showFoldersList() {
    state.currentOpenedFolderId = null;
    if (folderBrowserList) folderBrowserList.style.display = 'block';
    if (folderInside) folderInside.style.display = 'none';
    updateAuthUI();
  }

  function fillEditWorkForm(workId) {
    const work = state.items.find(item => String(item.id) === String(workId));
    if (!work) return;
    if (editWorkSelect) editWorkSelect.value = work.id;
    if (editWorkTitle) editWorkTitle.value = work.title || '';
    if (editWorkDescription) editWorkDescription.value = work.description || '';
    ownerPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotification('Работа подставлена в форму редактирования', 'info');
  }

  function openFolder(folderId) {
    state.currentOpenedFolderId = folderId;
    const folder = state.folders.find(item => String(item.id) === String(folderId));
    if (!folder) return;
    const works = state.items.filter(item => String(item.folder_id) === String(folder.id));
    if (currentFolderTitle) currentFolderTitle.textContent = folder.title || 'Папка';
    if (currentFolderWorks) {
      currentFolderWorks.innerHTML = works.length ? `<div class="mkz-portfolio-grid">${works.map(item => `<article class="mkz-work-card"><div class="mkz-work-card__image"><img src="${safeUrl(item.image_url || '')}" alt="${safeText(item.title || 'Работа', 'Работа')}">${isOwner() ? `<div class="mkz-work-card__admin-overlay"><button class="mkz-admin-icon" type="button" data-edit-work-inline="${item.id}">✎</button><button class="mkz-admin-icon" type="button" data-delete-work="${item.id}">✕</button></div>` : ''}</div><div class="mkz-work-card__body"><h3>${safeText(item.title || 'Без названия', 'Без названия')}</h3><p>${safeText(item.description || '', '')}</p></div></article>`).join('')}</div>` : `<div class="mkz-card"><p>В этой папке пока нет работ.</p></div>`;
    }
    if (folderBrowserList) folderBrowserList.style.display = 'none';
    if (folderInside) folderInside.style.display = 'block';
    updateAuthUI();
  }

  async function renderPortfolio() {
    try {
      showLoading('Загрузка портфолио...');
      const folders = await cachedQuery('portfolio_folders', async () => { const { data } = await supabaseClient.from('portfolio_folders').select('*').order('sort_order', { ascending: true }); return data || []; });
      const items = await cachedQuery('portfolio_items', async () => { const { data } = await supabaseClient.from('portfolio_items').select('*').order('sort_order', { ascending: true }); return data || []; });
      state.folders = folders; state.items = items;
      if (portfolioCount) portfolioCount.textContent = String(state.items.length);
      if (!folderGrid) return;
      if (!state.folders.length) { folderGrid.innerHTML = '<div class="mkz-card"><h3>Папок пока нет</h3><p>Портфолио скоро появится.</p></div>'; renderPortfolioSelects(); showFoldersList(); return; }
      folderGrid.innerHTML = state.folders.map(folder => { const worksCount = state.items.filter(item => String(item.folder_id) === String(folder.id)).length; const cover = safeUrl(folder.cover_image_url || ''); return `<button class="mkz-folder" type="button" data-folder-open="${folder.id}">${cover ? `<span class="mkz-folder__bg" style="background-image:url('${cover}')"></span>` : ''}<span class="mkz-folder__overlay"></span><span class="mkz-folder__content"><span class="mkz-folder__icon">📁</span><span class="mkz-folder__title">${safeText(folder.title, 'Папка')}</span><span class="mkz-folder__count">${worksCount} работ</span></span></button>`; }).join('');
      $$('[data-folder-open]', folderGrid).forEach(btn => { btn.addEventListener('click', () => openFolder(btn.dataset.folderOpen)); });
      renderPortfolioSelects();
      if (state.currentOpenedFolderId) openFolder(state.currentOpenedFolderId);
      else showFoldersList();
    } catch (err) { console.error('renderPortfolio error', err); showNotification('Ошибка загрузки портфолио', 'error'); } finally { hideLoading(); }
  }

  async function handleAddFolder() {
    if (!folderAdminForm?.reportValidity()) return;
    if (!isOwner()) return;
    setButtonState(folderAddBtn, true, 'Добавление...', 'Добавить папку');
    try {
      let coverImageUrl = '';
      const coverFile = folderCover?.files?.[0];
      if (coverFile) { const upload = await uploadToBucket('portfolio', coverFile, `folder_cover_${state.currentSession.user.id}`); coverImageUrl = upload.publicUrl; }
      const { error } = await supabaseClient.from('portfolio_folders').insert({ title: folderTitle?.value.trim() || '', slug: slugify(folderSlug?.value.trim() || folderTitle?.value.trim() || ''), sort_order: Number(folderSortOrder?.value || 0), cover_image_url: coverImageUrl });
      if (error) { showNotification(error.message || 'Не удалось создать папку', 'error'); return; }
      folderAdminForm.reset(); clearCache('portfolio_folders'); await renderPortfolio(); showNotification('Папка добавлена', 'success');
    } finally { setButtonState(folderAddBtn, false, 'Добавление...', 'Добавить папку'); }
  }

  async function handleEditFolderCover() {
    if (!isOwner()) return;
    if (!folderEditForm?.reportValidity()) return;
    const file = editFolderCover?.files?.[0];
    if (!file) { showNotification('Выбери новую обложку', 'warning'); return; }
    setButtonState(folderEditBtn, true, 'Сохраняю...', 'Обновить обложку');
    try {
      const upload = await uploadToBucket('portfolio', file, `folder_cover_edit_${state.currentSession.user.id}`);
      const { error } = await supabaseClient.from('portfolio_folders').update({ cover_image_url: upload.publicUrl }).eq('id', editFolderSelect.value);
      if (error) { showNotification(error.message, 'error'); return; }
      folderEditForm.reset(); clearCache('portfolio_folders'); await renderPortfolio(); showNotification('Обложка обновлена', 'success');
    } finally { setButtonState(folderEditBtn, false, 'Сохраняю...', 'Обновить обложку'); }
  }

  async function handleAddPortfolioItem() {
    if (!portfolioAdminForm?.reportValidity()) return;
    if (!isOwner()) return;
    setButtonState(portfolioAddBtn, true, 'Загрузка...', 'Добавить в портфолио');
    try {
      const file = portfolioImage?.files?.[0];
      if (!file) { showNotification('Выбери картинку', 'warning'); return; }
      const upload = await uploadToBucket('portfolio', file, `portfolio_${state.currentSession.user.id}`);
      const { error } = await supabaseClient.from('portfolio_items').insert({ folder_id: portfolioFolderSelect.value, title: portfolioTitle.value.trim(), description: portfolioDescription.value.trim(), image_url: upload.publicUrl, sort_order: Number(portfolioSortOrder.value || 0) });
      if (error) { showNotification(error.message || 'Не удалось добавить работу', 'error'); return; }
      portfolioAdminForm.reset(); clearCache('portfolio_items'); await renderPortfolio();
      if (state.currentOpenedFolderId) openFolder(state.currentOpenedFolderId);
      showNotification('Работа добавлена', 'success');
    } finally { setButtonState(portfolioAddBtn, false, 'Загрузка...', 'Добавить в портфолио'); }
  }

  async function handleEditWork() {
    if (!isOwner()) return;
    if (!portfolioEditForm?.reportValidity()) return;
    setButtonState(editWorkBtn, true, 'Сохраняю...', 'Сохранить изменения');
    try {
      const payload = { updated_at: new Date().toISOString(), title: editWorkTitle?.value.trim() || '', description: editWorkDescription?.value.trim() || '' };
      const file = editWorkImage?.files?.[0];
      if (file) { const upload = await uploadToBucket('portfolio', file, `portfolio_edit_${state.currentSession.user.id}`); payload.image_url = upload.publicUrl; }
      const { error } = await supabaseClient.from('portfolio_items').update(payload).eq('id', editWorkSelect.value);
      if (error) { showNotification(error.message, 'error'); return; }
      portfolioEditForm.reset(); clearCache('portfolio_items'); await renderPortfolio();
      if (state.currentOpenedFolderId) openFolder(state.currentOpenedFolderId);
      showNotification('Работа обновлена', 'success');
    } finally { setButtonState(editWorkBtn, false, 'Сохраняю...', 'Сохранить изменения'); }
  }

  async function handleDeleteWork(workId) {
    if (!isOwner()) return;
    if (!confirm('Удалить эту работу?')) return;
    const { error } = await supabaseClient.from('portfolio_items').delete().eq('id', workId);
    if (error) { showNotification(error.message || 'Не удалось удалить работу', 'error'); return; }
    clearCache('portfolio_items'); await renderPortfolio();
    if (state.currentOpenedFolderId) openFolder(state.currentOpenedFolderId);
    showNotification('Работа удалена', 'success');
  }

  // ========== ФУНКЦИИ ОТЗЫВОВ ==========
  async function renderReviews() {
    try {
      const { data: reviews } = await supabaseClient.from('reviews').select('*, profiles:user_id ( * )').order('created_at', { ascending: false });
      const { data: likes } = await supabaseClient.from('review_likes').select('*');
      const { data: replies } = await supabaseClient.from('review_replies').select('*').order('created_at', { ascending: true });
      state.reviews = (reviews || []).map(r => ({ ...r, profile: r.profiles }));
      state.reviewLikes = likes || [];
      state.reviewReplies = (replies || []).map(r => ({ ...r, profile: r.profiles }));
      if (!reviewsList) return;
      if (!state.reviews.length) { reviewsList.innerHTML = '<div class="mkz-card"><h3>Пока нет отзывов</h3><p>Стань первым, кто оставит отзыв.</p></div>'; if (averageRating) averageRating.textContent = '5.0'; if (averageRatingTop) averageRatingTop.textContent = '5.0'; return; }
      const avg = (state.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / state.reviews.length).toFixed(1);
      if (averageRating) averageRating.textContent = avg;
      if (averageRatingTop) averageRatingTop.textContent = avg;
      reviewsList.innerHTML = state.reviews.map(item => { const avatarUrl = safeUrl(item.profile?.avatar_url || ''); const username = safeText(item.profile?.username || 'Пользователь', 'Пользователь'); const text = nl2brSafe(item.text || ''); const imageUrl = safeUrl(item.image_url || ''); const likesCount = state.reviewLikes.filter(l => String(l.review_id) === String(item.id)).length; const likedByUser = !!(state.currentSession && state.reviewLikes.some(l => String(l.review_id) === String(item.id) && String(l.user_id) === String(state.currentSession.user.id))); const replies = state.reviewReplies.filter(r => String(r.review_id) === String(item.id)); return `<article class="mkz-review-card" data-review-id="${item.id}"><div class="mkz-review-author"><button class="mkz-review-author__avatar" type="button" data-open-profile="${item.user_id}" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">${avatarUrl ? '' : getInitial(item.profile?.username, 'П')}</button><div><div class="mkz-review-card__name">${username}</div><div class="mkz-review-card__stars">${'★'.repeat(Number(item.rating || 0))}${'☆'.repeat(5 - Number(item.rating || 0))}</div></div></div><div class="mkz-review-card__text">${text}</div>${imageUrl ? `<div class="mkz-review-card__image"><img src="${imageUrl}" alt="Отзыв" data-zoom-image="${imageUrl}" data-zoom-title="${username}"></div>` : ''}<div class="mkz-review-actions"><button class="mkz-like ${likedByUser ? 'is-active is-liked' : ''}" type="button" data-like-id="${item.id}">❤️ ${likesCount}</button><div class="mkz-review-card__date">${formatDateTime(item.created_at)}</div></div>${isOwner() ? `<div class="mkz-review-admin"><button class="mkz-btn mkz-btn--ghost" type="button" data-edit-review="${item.id}">Редактировать</button><button class="mkz-btn mkz-btn--danger" type="button" data-delete-review="${item.id}">Удалить</button></div>` : ''}<div class="mkz-review-replies">${replies.map(reply => `<div class="mkz-review-reply"><div class="mkz-review-reply__meta"><button class="mkz-user-inline" type="button" data-open-profile="${reply.user_id}">${safeText(reply.profile?.username || 'Пользователь', 'Пользователь')}</button><div class="mkz-review-reply__date">${formatDateTime(reply.created_at)}</div></div><div class="mkz-review-reply__text">${nl2brSafe(reply.text || '')}</div>${isOwner() ? `<div class="mkz-review-admin" style="margin-top:10px;"><button class="mkz-btn mkz-btn--danger" type="button" data-delete-review-reply="${reply.id}">Удалить ответ</button></div>` : ''}</div>`).join('')}</div><form class="mkz-review-reply-form" data-review-reply-form="${item.id}"><label class="mkz-field"><span>Ответить на отзыв</span><textarea class="mkz-textarea" data-review-reply-input="${item.id}" placeholder="Напиши ответ"></textarea></label><button class="mkz-btn mkz-btn--ghost" type="submit">Ответить</button></form></article>`; }).join('');
      $$('[data-review-reply-form]', reviewsList).forEach(form => { form.addEventListener('submit', async function (e) { e.preventDefault(); if (!state.currentSession) { showNotification('Сначала войди в аккаунт', 'warning'); openScreen('account'); return; } const reviewId = form.dataset.reviewReplyForm; const input = $(`[data-review-reply-input="${reviewId}"]`); const text = input?.value.trim() || ''; if (!text) { showNotification('Напиши ответ', 'warning'); return; } const { error } = await supabaseClient.from('review_replies').insert({ review_id: reviewId, user_id: state.currentSession.user.id, text }); if (error) { showNotification(error.message, 'error'); return; } input.value = ''; await renderReviews(); showNotification('Ответ добавлен', 'success'); }); });
      $$('[data-open-profile]', reviewsList).forEach(btn => { btn.addEventListener('click', async e => { e.stopPropagation(); await openPublicProfile(btn.dataset.openProfile); }); });
      $$('[data-zoom-image]', reviewsList).forEach(img => { img.addEventListener('click', e => { e.stopPropagation(); showImageModal(img.dataset.zoomImage, img.dataset.zoomTitle || ''); }); });
    } catch (err) { console.error('renderReviews error', err); showNotification('Ошибка загрузки отзывов', 'error'); }
  }

  async function likeReview(reviewId) {
    if (!state.currentSession) { showNotification('Сначала войди в аккаунт', 'warning'); openScreen('account'); return; }
    const existing = state.reviewLikes.find(l => String(l.review_id) === String(reviewId) && String(l.user_id) === String(state.currentSession.user.id));
    if (existing) { const { error } = await supabaseClient.from('review_likes').delete().eq('id', existing.id); if (error) { showNotification(error.message || 'Не удалось убрать лайк', 'error'); return; } }
    else { const { error } = await supabaseClient.from('review_likes').insert({ review_id: reviewId, user_id: state.currentSession.user.id }); if (error) { showNotification(error.message || 'Не удалось поставить лайк', 'error'); return; } }
    await renderReviews();
  }

  async function handleReviewSend() {
    if (!state.currentSession) { showNotification('Чтобы оставить отзыв, сначала войди в аккаунт', 'warning'); openScreen('account'); return; }
    if (!reviewForm?.reportValidity()) return;
    setButtonState(reviewSendBtn, true, 'Отправка...', 'Оставить отзыв');
    try {
      let imageUrl = '';
      const file = reviewImage?.files?.[0];
      if (file) { try { const upload = await uploadToBucket('reviews', file, state.currentSession.user.id); imageUrl = upload.publicUrl; } catch { throw new Error('Не удалось загрузить картинку к отзыву'); } }
      const { error } = await supabaseClient.from('reviews').insert({ user_id: state.currentSession.user.id, rating: state.currentRating, text: reviewText.value.trim(), image_url: imageUrl });
      if (error) throw new Error('Не удалось оставить отзыв: ' + error.message);
      reviewForm.reset(); state.currentRating = 5; renderStars(state.currentRating); await renderReviews(); showNotification('Отзыв опубликован', 'success');
    } catch (err) { console.error(err); showNotification(err.message, 'error'); } finally { setButtonState(reviewSendBtn, false, 'Отправка...', 'Оставить отзыв'); }
  }

  async function handleDeleteReview(reviewId) {
    if (!isOwner()) return;
    if (!confirm('Удалить отзыв?')) return;
    const { error } = await supabaseClient.from('reviews').delete().eq('id', reviewId);
    if (error) { showNotification(error.message || 'Не удалось удалить отзыв', 'error'); return; }
    await renderReviews(); showNotification('Отзыв удалён', 'success');
  }

  async function handleEditReview(reviewId) {
    if (!isOwner()) return;
    const review = state.reviews.find(r => String(r.id) === String(reviewId));
    if (!review) return;
    const newText = prompt('Новый текст отзыва:', review.text || '');
    if (newText === null) return;
    const newRatingRaw = prompt('Новая оценка от 1 до 5:', String(review.rating || 5));
    if (newRatingRaw === null) return;
    const newRating = Math.max(1, Math.min(5, Number(newRatingRaw || 5)));
    const { error } = await supabaseClient.from('reviews').update({ text: newText.trim(), rating: newRating, updated_at: new Date().toISOString() }).eq('id', reviewId);
    if (error) { showNotification(error.message, 'error'); return; }
    await renderReviews(); showNotification('Отзыв обновлён', 'success');
  }

  async function handleDeleteReviewReply(replyId) {
    if (!isOwner()) return;
    const { error } = await supabaseClient.from('review_replies').delete().eq('id', replyId);
    if (error) { showNotification(error.message || 'Не удалось удалить ответ', 'error'); return; }
    await renderReviews(); showNotification('Ответ удалён', 'success');
  }

  function renderStars(active) { stars.forEach(star => { star.classList.toggle('is-active', Number(star.dataset.rating) <= active); }); }

  // ========== ФУНКЦИИ МОДАЛЬНЫХ ОКОН ==========
  function showImageModal(src, title = '') { if (!imageModal || !popupImageWrap) return; popupImageWrap.innerHTML = `<img src="${safeUrl(src)}" alt="${safeText(title || 'Изображение', 'Изображение')}">`; if (popupImageTitle) popupImageTitle.textContent = title || ''; imageModal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function hideImageModal() { if (!imageModal) return; imageModal.classList.remove('is-open'); if (popupImageWrap) popupImageWrap.innerHTML = ''; if (popupImageTitle) popupImageTitle.textContent = ''; document.body.style.overflow = ''; }
  function showReviewPopup(review) { if (!reviewPopup || !popupReviewContent) return; const username = safeText(review.profile?.username || 'Пользователь', 'Пользователь'); const text = nl2brSafe(review.text || ''); const avatarUrl = safeUrl(review.profile?.avatar_url || ''); const imageUrl = safeUrl(review.image_url || ''); popupReviewContent.innerHTML = `<div class="mkz-popup-review__top"><div class="mkz-review-author__avatar" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">${avatarUrl ? '' : getInitial(review.profile?.username, 'Г')}</div><div><div class="mkz-popup-review__name">${username}</div><div class="mkz-popup-review__stars">${'★'.repeat(Number(review.rating || 0))}${'☆'.repeat(5 - Number(review.rating || 0))}</div></div></div><div class="mkz-popup-review__text">${text}</div>${imageUrl ? `<div class="mkz-popup-review__image"><img src="${imageUrl}" alt="Отзыв"></div>` : ''}`; reviewPopup.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function hideReviewPopup() { if (!reviewPopup) return; reviewPopup.classList.remove('is-open'); document.body.style.overflow = ''; }
  function openScreen(name) { screens.forEach(screen => { screen.classList.toggle('mkz-screen--active', screen.dataset.screen === name); }); $$('.mkz-nav__link, .mkz-bottom-nav__item').forEach(btn => { btn.classList.toggle('is-active', btn.dataset.screenOpen === name); }); if (nav) nav.classList.remove('is-open'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function showOrderModal() { if (!orderModal) return; orderModal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function hideOrderModal() { if (!orderModal) return; orderModal.classList.remove('is-open'); document.body.style.overflow = ''; }

   // ========== ФУНКЦИИ FAQ ==========
  async function renderFaqQuestions() {
    if (!isOwner()) { if (faqQuestionsAdminList) faqQuestionsAdminList.innerHTML = ''; return; }
    try {
      const { data } = await supabaseClient.from('faq_questions').select('*').order('created_at', { ascending: false });
      state.faqQuestions = data || [];
      if (!faqQuestionsAdminList) return;
      if (!state.faqQuestions.length) { faqQuestionsAdminList.innerHTML = '<div class="mkz-card"><p>Пока нет вопросов.</p></div>'; return; }
      faqQuestionsAdminList.innerHTML = state.faqQuestions.map(item => `<div class="mkz-admin-message"><div class="mkz-admin-message__head"><div><div class="mkz-admin-message__name">${safeText(item.name || 'Гость', 'Гость')}</div><div class="mkz-admin-message__contact">${safeText(item.contact || 'Контакт не указан', 'Контакт не указан')}</div></div><div class="mkz-admin-message__date">${formatDateTime(item.created_at)}</div></div><div class="mkz-admin-message__text" style="margin-bottom:12px;">${safeText(item.question || '', '')}</div><label class="mkz-field"><span>Ответ</span><textarea class="mkz-textarea" data-faq-answer-input="${item.id}">${escapeHtml(item.answer || '')}</textarea></label><button class="mkz-btn mkz-btn--primary" type="button" data-save-faq-answer="${item.id}">Сохранить ответ</button></div>`).join('');
      $$('[data-save-faq-answer]', faqQuestionsAdminList).forEach(btn => { btn.addEventListener('click', async () => { const id = btn.dataset.saveFaqAnswer; const input = $(`[data-faq-answer-input="${id}"]`); const answer = input?.value.trim() || ''; const { error } = await supabaseClient.from('faq_questions').update({ answer, answered_by: state.currentSession.user.id, answered_at: new Date().toISOString() }).eq('id', id); if (error) { showNotification(error.message, 'error'); return; } showNotification('Ответ сохранён', 'success'); await renderFaqQuestions(); }); });
    } catch (err) { console.error('renderFaqQuestions error', err); }
  }

  async function handleFaqAsk() {
    if (!faqAskForm?.reportValidity()) return;
    setButtonState(faqAskBtn, true, 'Отправка...', 'Отправить вопрос');
    try {
      const { error } = await supabaseClient.from('faq_questions').insert({ user_id: state.currentSession?.user?.id || null, name: faqAskName?.value.trim() || '', contact: faqAskContact?.value.trim() || '', question: faqAskQuestion?.value.trim() || '' });
      if (error) { showNotification(error.message, 'error'); return; }
      faqAskForm.reset(); await renderFaqQuestions(); showNotification('Вопрос отправлен', 'success');
    } finally { setButtonState(faqAskBtn, false, 'Отправка...', 'Отправить вопрос'); }
  }

  // ========== ФУНКЦИИ КОНКУРСОВ ==========
  async function renderContestEntriesAdmin() {
    if (!isOwner()) { if (contestEntriesAdminList) contestEntriesAdminList.innerHTML = ''; return; }
    try {
      const { data: entries } = await supabaseClient.from('contest_entries').select('*').order('id', { ascending: false });
      state.contestEntries = entries || [];
      if (!contestEntriesAdminList) return;
      if (!state.contestEntries.length) { contestEntriesAdminList.innerHTML = '<div class="mkz-card"><p>Пока нет участников.</p></div>'; return; }
      await cacheProfiles();
      contestEntriesAdminList.innerHTML = state.contestEntries.map(entry => { const profile = getProfileByUserId(entry.user_id); const contest = state.contests.find(c => String(c.id) === String(entry.contest_id)); return `<div class="mkz-admin-message"><div class="mkz-admin-message__head"><div><div class="mkz-admin-message__name">${safeText(profile?.username || 'Пользователь', 'Пользователь')}</div><div class="mkz-admin-message__contact">${safeText(profile?.email || 'Email не указан', 'Email не указан')}</div><div class="mkz-admin-message__contact">${safeText(profile?.telegram_username || 'Telegram не указан', 'Telegram не указан')}</div></div><div class="mkz-admin-message__date">${formatDateTime(entry.created_at)}</div></div><div class="mkz-admin-message__text">Конкурс: ${safeText(contest?.title || 'Без названия', 'Без названия')}</div></div>`; }).join('');
    } catch (err) { console.error('renderContestEntriesAdmin error', err); }
  }

    // ========== НОВОСТИ ==========
  async function renderNews() {
    try {
      if (!newsList) return;
      
      const { data: posts, error } = await supabaseClient
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      state.newsPosts = posts || [];
      
      if (!state.newsPosts.length) {
        newsList.innerHTML = '<div class="mkz-card"><p>Пока нет новостей.</p></div>';
        return;
      }
      
      newsList.innerHTML = state.newsPosts.map(post => `
        <div class="mkz-news-card">
          <h3>${safeText(post.title || 'Новость')}</h3>
          <div class="mkz-news-date">${formatDateTime(post.created_at)}</div>
          <div class="mkz-news-text">${nl2brSafe(post.text || '')}</div>
          ${post.image_url ? `<img src="${post.image_url}" style="max-width:100%; border-radius:12px; margin-top:12px;">` : ''}
          ${post.figma_url ? `<a href="${post.figma_url}" target="_blank" class="mkz-btn mkz-btn--ghost" style="margin-top:12px;">Открыть ссылку</a>` : ''}
        </div>
      `).join('');
    } catch (err) {
      console.error('renderNews error:', err);
      if (newsList) newsList.innerHTML = '<div class="mkz-card"><p>Ошибка загрузки новостей</p></div>';
    }
  }

  // Вспомогательные функции-заглушки для новостей (чтобы не было ошибок)
  async function handleAddNewsPost() {
    console.warn('handleAddNewsPost: функция не реализована');
  }
  
  async function handleDeleteNewsPost(postId) {
    console.warn('handleDeleteNewsPost: функция не реализована');
  }
  
  async function handleEditNewsPost(postId) {
    console.warn('handleEditNewsPost: функция не реализована');
  }
  
  async function handleDeleteNewsComment(commentId) {
    console.warn('handleDeleteNewsComment: функция не реализована');
  }

  // ========== ПОИСК ЛЮДЕЙ ==========
 async function searchPeople(query = '') {
  try {
    if (!peopleSearchResults) return;
    showLoading('Поиск пользователей...');
    await cacheProfiles();
    
    let list = [...state.allProfilesCache];
    const prepared = String(query || peopleSearchInput?.value || '').trim().toLowerCase();
    
    if (prepared) {
      list = list.filter(profile => {
        const username = String(profile.username || '').toLowerCase();
        const publicId = String(buildPublicUserCode(profile, profile.id) || '').toLowerCase();
        return username.includes(prepared) || publicId.includes(prepared);
      });
    }
    
    state.peopleSearchResults = list;
    
    if (!list.length) {
      peopleSearchResults.innerHTML = '<div class="mkz-card"><p>Никого не найдено.</p></div>';
      return;
    }
    
    peopleSearchResults.innerHTML = list.map(profile => {
      const avatarUrl = safeUrl(profile.avatar_url || '');
      const name = safeText(profile.username || 'Пользователь', 'Пользователь');
      const publicId = buildPublicUserCode(profile, profile.id);
      let statusText = '';
      let statusClass = '';
      
      if (!isProfileFieldVisible(profile, 'show_last_seen')) {
        statusText = 'Статус скрыт';
        statusClass = 'status-hidden';
      } else if (profile.is_online) {
        statusText = 'В сети';
        statusClass = 'status-online';
      } else if (profile.last_seen_at) {
        const lastSeen = new Date(profile.last_seen_at);
        const now = new Date();
        const diffDays = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((now - lastSeen) / (1000 * 60 * 60));
        const diffMins = Math.floor((now - lastSeen) / (1000 * 60));
        
        if (diffMins < 5) {
          statusText = 'Был(а) только что';
          statusClass = 'status-recent';
        } else if (diffHours < 1) {
          statusText = `Был(а) ${diffMins} ${pluralRu(diffMins, 'минуту', 'минуты', 'минут')} назад`;
          statusClass = 'status-recent';
        } else if (diffDays === 0 && diffHours < 24) {
          statusText = `Был(а) ${diffHours} ${pluralRu(diffHours, 'час', 'часа', 'часов')} назад`;
          statusClass = 'status-recent';
        } else if (diffDays < 7) {
          statusText = `Был(а) ${diffDays} ${pluralRu(diffDays, 'день', 'дня', 'дней')} назад`;
          statusClass = 'status-offline';
        } else {
          statusText = formatDateOnly(profile.last_seen_at);
          statusClass = 'status-offline';
        }
      } else {
        statusText = 'Давно не был(а)';
        statusClass = 'status-offline';
      }
      
      return `
        <button class="mkz-person-card" type="button" data-open-profile="${profile.id}">
          <div class="mkz-person-card__top">
            <div class="mkz-person-card__avatar" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">
              ${avatarUrl ? '' : getInitial(profile.username, 'U')}
            </div>
            <div class="mkz-person-card__meta">
              <div class="mkz-person-card__name">${name}</div>
              <div class="mkz-person-card__id">${publicId}</div>
              <div class="mkz-person-card__status ${statusClass}">
                <span class="mkz-status-indicator"></span>
                ${statusText}
              </div>
            </div>
          </div>
        </button>
      `;
    }).join('');
    
    $$('[data-open-profile]', peopleSearchResults).forEach(btn => {
      btn.addEventListener('click', async () => {
        await openPublicProfile(btn.dataset.openProfile);
      });
    });
    
  } catch (err) {
    console.error('searchPeople error:', err);
    showNotification('Ошибка при поиске пользователей', 'error');
  } finally {
    hideLoading();
  }
}

// ========== ПУБЛИЧНЫЙ ПРОФИЛЬ ==========
async function openPublicProfile(userId) {
  try {
    console.log('🔍 openPublicProfile вызван с userId:', userId);
    
    let profile = await readProfileByUserId(userId);
    if (!profile) profile = getProfileByUserId(userId);
    if (!profile) {
      console.error('❌ Профиль не найден для userId:', userId);
      return;
    }

    console.log('✅ Профиль загружен:', profile.username, profile.id);

    state.openedProfile = profile;

    const publicId = buildPublicUserCode(profile, profile.id);

    if (publicProfileName) publicProfileName.textContent = profile.username || 'Пользователь';
    if (publicProfileId) publicProfileId.textContent = publicId;
    if (publicProfileStatus) publicProfileStatus.textContent = getVisibleLastSeen(profile);
    if (publicProfileRegistered) publicProfileRegistered.textContent = formatDateOnly(profile.created_at);
    if (publicProfilePhone) publicProfilePhone.textContent = getVisiblePhone(profile);
    if (publicProfileTelegram) publicProfileTelegram.textContent = getVisibleTelegram(profile);
    if (publicProfileBio) publicProfileBio.textContent = profile.bio || 'Описание профиля пока не заполнено.';
    
    applyAvatar(publicProfileAvatar, profile.avatar_url, profile.username);
    
    // Сохраняем ID в кнопку "Написать"
    const messengerBtn = document.getElementById('mkzOpenProfileMessengerBtn');
    if (messengerBtn) {
      messengerBtn.setAttribute('data-user-id', profile.id);
      console.log('✅ ID сохранен в кнопку:', profile.id);
    } else {
      console.error('❌ Кнопка mkzOpenProfileMessengerBtn не найдена в DOM');
    }
    
    const userReviews = state.reviews.filter(r => String(r.user_id) === String(userId));
    const userComments = state.newsComments.filter(c => String(c.user_id) === String(userId));
    
    if (publicProfileActivity) {
      publicProfileActivity.innerHTML = `
        <div class="mkz-profile-stats">
          <div class="mkz-profile-stat">
            <strong>${userReviews.length}</strong>
            <span>Отзывов</span>
          </div>
          <div class="mkz-profile-stat">
            <strong>${userComments.length}</strong>
            <span>Комментариев</span>
          </div>
        </div>
      `;
    }
    
    openScreen('profile');
  } catch (err) {
    console.error('❌ openPublicProfile error:', err);
  }
}

    // ========== ПОИСК ЛЮДЕЙ ==========
  async function searchPeople(query = '') {
    try {
      if (!peopleSearchResults) return;
      showLoading('Поиск пользователей...');
      await cacheProfiles();

      let list = [...state.allProfilesCache];
      const prepared = String(query || peopleSearchInput?.value || '').trim().toLowerCase();

      if (prepared) {
        list = list.filter(profile => {
          const username = String(profile.username || '').toLowerCase();
          const publicId = String(buildPublicUserCode(profile, profile.id) || '').toLowerCase();
          return username.includes(prepared) || publicId.includes(prepared);
        });
      }

      state.peopleSearchResults = list;

      if (!list.length) {
        peopleSearchResults.innerHTML = '<div class="mkz-card"><p>Никого не найдено.</p></div>';
        return;
      }

      peopleSearchResults.innerHTML = list.map(profile => {
        const avatarUrl = safeUrl(profile.avatar_url || '');
        const name = safeText(profile.username || 'Пользователь', 'Пользователь');
        const publicId = buildPublicUserCode(profile, profile.id);
        let statusText = '';
        let statusClass = '';

        if (!isProfileFieldVisible(profile, 'show_last_seen')) {
          statusText = 'Статус скрыт';
          statusClass = 'status-hidden';
        } else if (profile.is_online) {
          statusText = 'В сети';
          statusClass = 'status-online';
        } else if (profile.last_seen_at) {
          const lastSeen = new Date(profile.last_seen_at);
          const now = new Date();
          const diffDays = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((now - lastSeen) / (1000 * 60 * 60));
          const diffMins = Math.floor((now - lastSeen) / (1000 * 60));

          if (diffMins < 5) {
            statusText = 'Был(а) только что';
            statusClass = 'status-recent';
          } else if (diffHours < 1) {
            statusText = `Был(а) ${diffMins} ${pluralRu(diffMins, 'минуту', 'минуты', 'минут')} назад`;
            statusClass = 'status-recent';
          } else if (diffDays === 0 && diffHours < 24) {
            statusText = `Был(а) ${diffHours} ${pluralRu(diffHours, 'час', 'часа', 'часов')} назад`;
            statusClass = 'status-recent';
          } else if (diffDays < 7) {
            statusText = `Был(а) ${diffDays} ${pluralRu(diffDays, 'день', 'дня', 'дней')} назад`;
            statusClass = 'status-offline';
          } else {
            statusText = formatDateOnly(profile.last_seen_at);
            statusClass = 'status-offline';
          }
        } else {
          statusText = 'Давно не был(а)';
          statusClass = 'status-offline';
        }

        return `
          <button class="mkz-person-card" type="button" data-open-profile="${profile.id}">
            <div class="mkz-person-card__top">
              <div class="mkz-person-card__avatar" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">
                ${avatarUrl ? '' : getInitial(profile.username, 'U')}
              </div>
              <div class="mkz-person-card__meta">
                <div class="mkz-person-card__name">${name}</div>
                <div class="mkz-person-card__id">${publicId}</div>
                <div class="mkz-person-card__status ${statusClass}">
                  <span class="mkz-status-indicator"></span>
                  ${statusText}
                </div>
              </div>
            </div>
          </button>
        `;
      }).join('');

      $$('[data-open-profile]', peopleSearchResults).forEach(btn => {
        btn.addEventListener('click', async () => {
          await openPublicProfile(btn.dataset.openProfile);
        });
      });

    } catch (err) {
      console.error('searchPeople error:', err);
      showNotification('Ошибка при поиске пользователей', 'error');
    } finally {
      hideLoading();
    }
  }

    // ========== ФУНКЦИИ МЕССЕНДЖЕРА ==========
  async function fetchMessengerData() {
    if (!state.currentSession?.user) {
      state.conversations = [];
      state.conversationMembers = [];
      state.conversationMessages = [];
      return;
    }
    try {
      const { data: members } = await supabaseClient
        .from('conversation_members')
        .select('*')
        .eq('user_id', state.currentSession.user.id);
      
      const memberRows = members || [];
      const conversationIds = memberRows.map(item => item.conversation_id);
      
      if (!conversationIds.length) {
        state.conversations = [];
        state.conversationMembers = [];
        state.conversationMessages = [];
        return;
      }
      
      const { data: conversations } = await supabaseClient
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
      
      const { data: allMembers } = await supabaseClient
        .from('conversation_members')
        .select('*')
        .in('conversation_id', conversationIds);
      
      const { data: messages } = await supabaseClient
        .from('conversation_messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: true });
      
      state.conversations = conversations || [];
      state.conversationMembers = allMembers || [];
      state.conversationMessages = messages || [];
      
      const supportConversation = state.conversations.find(c => c.is_support === true);
      state.supportConversationId = supportConversation?.id || null;
    } catch (err) {
      console.error('fetchMessengerData error:', err);
    }
  }

  async function startPollingMessages() {
  if (state.messagesPolling) return;
  
  console.log('🔄 Запуск polling (проверка каждые 3 секунды)');
  
  state.messagesPolling = setInterval(async () => {
    if (!state.currentSession?.user) return;
    if (!state.conversations.length) return;
    
    const lastMessageTime = state.conversationMessages.length > 0 
      ? state.conversationMessages[state.conversationMessages.length - 1]?.created_at 
      : new Date(0).toISOString();
    
    const { data: newMessages, error } = await supabaseClient
      .from('conversation_messages')
      .select('*')
      .gt('created_at', lastMessageTime)
      .in('conversation_id', state.conversations.map(c => c.id));
    
    if (error) {
      console.error('Polling error:', error);
      return;
    }
    
    if (newMessages && newMessages.length > 0) {
      console.log('📨 Найдено новых сообщений (polling):', newMessages.length);
      
      state.conversationMessages = [...state.conversationMessages, ...newMessages];
      
      await renderMessengerDialogs();
      
      if (state.currentConversationId) {
        await openConversation(state.currentConversationId, true);
      }
      
      newMessages.forEach(msg => {
        if (msg.user_id !== state.currentSession?.user?.id && Notification.permission === 'granted') {
          const sender = getProfileByUserId(msg.user_id);
          new Notification(`Новое сообщение от ${sender?.username || 'Пользователь'}`, {
            body: msg.text || msg.attachment_name || 'Новое сообщение'
          });
        }
      });
    }
  }, 3000);
}

      async function subscribeToMessages() {
  // Если уже подписаны - выходим
  if (state.isSubscribed) {
    console.log('✅ Уже подписаны, пропускаем');
    return;
  }
  
  if (!state.currentSession?.user) {
    console.log('❌ Нет пользователя, подписка не создаётся');
    return;
  }
  
  // Закрываем старый канал
  if (state.messagesChannel) {
    try {
      await supabaseClient.removeChannel(state.messagesChannel);
    } catch(e) {
      console.warn('removeChannel error:', e);
    }
  }
  
  console.log('🔄 Создаём новый канал...');
  
  state.messagesChannel = supabaseClient
    .channel('messages-channel')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'conversation_messages' },
      async (payload) => {
        const newMessage = payload.new;
        if (newMessage.user_id === state.currentSession?.user?.id) return;
        
        const isMember = state.conversationMembers.some(
          m => m.conversation_id === newMessage.conversation_id && m.user_id === state.currentSession.user.id
        );
        
        if (isMember) {
          await fetchMessengerData();
          await renderMessengerDialogs();
          if (state.currentConversationId === newMessage.conversation_id) {
            await openConversation(state.currentConversationId, true);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime подписка активна');
        state.isSubscribed = true;
      }
    });
}

    async function renderMessengerDialogs() {
    if (!messengerDialogs) return;
    
    if (!state.currentSession?.user) {
      messengerDialogs.innerHTML = '<div class="mkz-card"><p>Войди в аккаунт, чтобы пользоваться мессенджером.</p></div>';
      if (messengerMessages) messengerMessages.innerHTML = '';
      return;
    }
    
    await cacheProfiles();
    await fetchMessengerData();
    await findOrCreateSupportConversation();
    await fetchMessengerData();
    await updateConversationList();
    if (!state.isSubscribed) {
    await subscribeToMessages();
    if (!state.messagesPolling) {
    startPollingMessages();
  }
    
    const supportConv = state.conversations.find(c => String(c.id) === String(state.supportConversationId));
    if (pinnedOwnerChatBtn && supportConv) {
      applyAvatar(pinnedOwnerAvatar, SUPPORT_CHAT_IDENTITY.avatar_url, 'Mark1z Design');
      if (pinnedOwnerName) pinnedOwnerName.textContent = 'Mark1z Design';
      if (pinnedOwnerTime) pinnedOwnerTime.textContent = 'официальный чат';
      
      const lastMessage = state.conversationMessages
        .filter(m => m.conversation_id === supportConv.id)
        .pop();
      if (pinnedOwnerPreview) {
        pinnedOwnerPreview.textContent = lastMessage?.text || 'Напишите сообщение...';
      }
      
      pinnedOwnerChatBtn.classList.toggle('is-active', state.currentConversationId === supportConv.id);
      
      const unread = getUnreadCount(supportConv.id);
      if (pinnedOwnerUnread) {
        pinnedOwnerUnread.style.display = unread > 0 ? 'inline-flex' : 'none';
        pinnedOwnerUnread.textContent = unread;
      }
    }
    
    if (!state.currentConversationId && state.supportConversationId) {
      await openConversation(state.supportConversationId);
    }
  }

    async function updateConversationList() {
  if (!messengerDialogs) return;
  
  await fetchMessengerData();
  
  if (!state.currentSession?.user) return;
  
  // Собираем все чаты, где есть текущий пользователь
  const myConversations = state.conversationMembers
    .filter(m => m.user_id === state.currentSession.user.id)
    .map(m => m.conversation_id);
  
  const conversationsList = state.conversations.filter(c => myConversations.includes(c.id));
  
  if (!conversationsList.length) {
    messengerDialogs.innerHTML = '<div class="mkz-card"><p>Чатов пока нет.</p></div>';
    return;
  }
  
  // Сортируем по дате последнего сообщения
  conversationsList.sort((a, b) => {
    const aLastMsg = state.conversationMessages.filter(m => m.conversation_id === a.id).pop();
    const bLastMsg = state.conversationMessages.filter(m => m.conversation_id === b.id).pop();
    return new Date(bLastMsg?.created_at || 0) - new Date(aLastMsg?.created_at || 0);
  });
  
  messengerDialogs.innerHTML = conversationsList.map(conv => {
    const isSupport = conv.is_support;
    let title = isSupport ? 'Mark1z Design' : 'Личный чат';
    let avatarStyle = isSupport ? 'background: linear-gradient(135deg, #ff2fae, #7a3cff);' : '';
    
    // Для личных чатов пытаемся найти собеседника
    if (!isSupport) {
      const otherMember = state.conversationMembers.find(
        m => m.conversation_id === conv.id && m.user_id !== state.currentSession.user.id
      );
      if (otherMember) {
        const peerProfile = getProfileByUserId(otherMember.user_id);
        if (peerProfile) {
          title = peerProfile.username || 'Пользователь';
          if (peerProfile.avatar_url) {
            avatarStyle = `background-image: url('${peerProfile.avatar_url}'); background-size: cover;`;
          }
        }
      }
    }
    
    const lastMessage = state.conversationMessages.filter(m => m.conversation_id === conv.id).pop();
    const lastMessageText = lastMessage?.text || lastMessage?.attachment_name || 'Нет сообщений';
    const lastMessageTime = lastMessage?.created_at;
    const unreadCount = getUnreadCount(conv.id);
    
    return `
      <button class="mkz-chat-item ${state.currentConversationId === conv.id ? 'is-active' : ''}" 
              type="button" 
              data-open-conversation="${conv.id}">
        <div class="mkz-chat-item__avatar" style="${avatarStyle}">
          ${!avatarStyle.includes('background-image') ? (isSupport ? 'MD' : (title.charAt(0) || 'U')) : ''}
        </div>
        <div class="mkz-chat-item__body">
          <div class="mkz-chat-item__row">
            <div class="mkz-chat-item__name">${safeText(title, 'Чат')}</div>
            <div class="mkz-chat-item__time">${lastMessageTime ? formatDateTime(lastMessageTime) : ''}</div>
          </div>
          <div class="mkz-chat-item__preview">${safeText(lastMessageText, '')}</div>
        </div>
        ${unreadCount > 0 ? `<div class="mkz-chat-item__badge">${unreadCount}</div>` : ''}
      </button>
    `;
  }).join('');
  
  // Переназначаем обработчики
  $$('[data-open-conversation]', messengerDialogs).forEach(btn => {
    btn.addEventListener('click', async () => {
      await openConversation(btn.dataset.openConversation);
    });
  });
}

    function getConversationPeer(conversationId) {
    const members = state.conversationMembers.filter(m => m.conversation_id === conversationId);
    const peer = members.find(m => m.user_id !== state.currentSession?.user?.id);
    return peer ? getProfileByUserId(peer.user_id) : null;
  }

  async function openConversation(conversationId, silent = false) {
      // Принудительно обновляем сообщения при открытии чата
    await fetchMessengerData();
    state.currentConversationId = conversationId;
    await fetchMessengerData();
    
    const conversation = state.conversations.find(c => String(c.id) === String(conversationId));
    const peer = getConversationPeer(conversationId);
    const title = conversation?.is_support ? 'Mark1z Design' : (peer?.username || 'Чат');
    
    applyAvatar(messengerTopAvatar, conversation?.is_support ? SUPPORT_CHAT_IDENTITY.avatar_url : peer?.avatar_url, title);
    if (messengerTopName) messengerTopName.textContent = title;
    if (messengerTopSub) {
      messengerTopSub.textContent = conversation?.is_support
        ? 'Официальный чат бренда и бот-помощник'
        : getVisibleLastSeen(peer);
    }
    
    const messages = state.conversationMessages.filter(m => String(m.conversation_id) === String(conversationId));
    
    if (messengerMessages) {
      if (messages.length) {
        messengerMessages.innerHTML = messages.map(renderConversationMessage).join('');
        messengerMessages.scrollTop = messengerMessages.scrollHeight;
      } else {
        messengerMessages.innerHTML = `
          <div class="mkz-messenger-empty">
            <div class="mkz-messenger-empty__box">
              <div class="mkz-messenger-empty__icon">✉</div>
              <h3 class="mkz-messenger-empty__title">Диалог пуст</h3>
              <p class="mkz-messenger-empty__text">Напишите первое сообщение.</p>
            </div>
          </div>
        `;
      }
    }
    
    await markConversationAsRead(conversationId);
    await fetchMessengerData();
    
    if (!silent) {
      await renderMessengerDialogs();
    }
  }

 async function sendMessengerMessage() {
  if (!state.currentSession?.user) {
    openScreen('account');
    return;
  }
  
  if (!state.currentConversationId) {
    showNotification('Сначала выбери чат', 'warning');
    return;
  }
  
  const text = messengerInput?.value.trim() || '';
  const attachment = state.pendingMessengerAttachment;
  
  if (!text && !attachment) {
    showNotification('Напиши сообщение или прикрепи файл', 'warning');
    return;
  }
  
  setButtonState(messengerSendBtn, true, 'Отправка...', 'Отправить');
  
  try {
    let attachmentPayload = { attachment_url: '', attachment_name: '', attachment_type: '' };
    if (attachment?.file) {
      attachmentPayload = await uploadMessengerAttachment(attachment.file);
    }
    
    // ========== ОПРЕДЕЛЯЕМ РЕЖИМ ОТПРАВКИ ==========
    let senderMode = 'profile';
    let user_id = state.currentSession.user.id;
    
    if (isSupportConversation(state.currentConversationId)) {
      if (isOwner()) {
        // Админ в чате поддержки - используем выбранный режим
        if (state.supportSendMode === 'brand') {
          senderMode = 'support_brand'; // От Mark1z Design (видят все)
          user_id = OWNER_UID;
        } else {
          senderMode = 'admin_private'; // Личное сообщение админа (видят только админы)
        }
      } else {
        // Обычный пользователь пишет в поддержку
        senderMode = 'user_to_support';
      }
    }
    
    console.log('📤 Отправка сообщения:', { mode: senderMode, text: text || '[вложение]' });
    
    const { error } = await supabaseClient
      .from('conversation_messages')
      .insert({
        conversation_id: state.currentConversationId,
        user_id: user_id,
        sender_mode: senderMode,
        text: text || '',
        ...attachmentPayload
      });
    
    if (error) throw new Error(error.message || 'Не удалось отправить сообщение');
    
    // Обновляем время последнего сообщения в чате
    await supabaseClient
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', state.currentConversationId);
    
    // Очищаем поля ввода
    if (messengerInput) messengerInput.value = '';
    clearMessengerAttachment();
    
    // Обновляем список чатов и сообщения
    await updateConversationList();
    await openConversation(state.currentConversationId);
    
    showNotification('Сообщение отправлено', 'success');
    
    // ========== ВЫЗЫВАЕМ AI БОТА ==========
    // Если это чат поддержки, сообщение от обычного пользователя, и есть текст - отвечаем ботом
    if (isSupportConversation(state.currentConversationId) && !isOwner() && text) {
      await callAIBot(state.currentConversationId, text);
    }
    
  } catch (err) {
    console.error('sendMessengerMessage error:', err);
    showNotification(err.message, 'error');
  } finally {
    setButtonState(messengerSendBtn, false, 'Отправка...', 'Отправить');
  }
}

  

  function clearMessengerAttachment() {
    state.pendingMessengerAttachment = null;
    if (messengerImageInput) messengerImageInput.value = '';
    if (messengerFileInput) messengerFileInput.value = '';
    if (messengerAttachMeta) messengerAttachMeta.textContent = '';
  }

  function getConversationPeer(conversationId) {
    const members = state.conversationMembers.filter(m => String(m.conversation_id) === String(conversationId));
    const peer = members.find(m => String(m.user_id) !== String(state.currentSession?.user?.id));
    return peer ? getProfileByUserId(peer.user_id) : null;
  }

  async function markConversationAsRead(conversationId) {
    if (!state.currentSession?.user || !conversationId) return;
    try {
      await supabaseClient
        .from('conversation_members')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', state.currentSession.user.id);
    } catch {}
  }

  function getUnreadCount(conversationId) {
  if (!state.currentSession?.user) return 0;
  
  const member = state.conversationMembers.find(
    m => m.conversation_id === conversationId && m.user_id === state.currentSession.user.id
  );
  
  const lastReadAt = member?.last_read_at ? new Date(member.last_read_at).getTime() : 0;
  
  return state.conversationMessages.filter(msg => {
    // Свои сообщения не считаем за непрочитанные
    if (msg.user_id === state.currentSession.user.id) return false;
    // Проверяем, что сообщение из нужного чата и новее last_read_at
    return msg.conversation_id === conversationId && new Date(msg.created_at).getTime() > lastReadAt;
  }).length;
}

  async function findOrCreateSupportConversation() {
    if (!state.currentSession?.user) return null;
    
    await fetchMessengerData();
    if (state.supportConversationId) return state.supportConversationId;
    
    const { data: newConversation, error } = await supabaseClient
      .from('conversations')
      .insert({
        title: 'Mark1z Design',
        is_support: true,
        created_by: OWNER_UID,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .maybeSingle();
    
    if (error || !newConversation) return null;
    
    await supabaseClient
      .from('conversation_members')
      .insert([
        { conversation_id: newConversation.id, user_id: OWNER_UID, last_read_at: new Date().toISOString() },
        { conversation_id: newConversation.id, user_id: state.currentSession.user.id, last_read_at: null }
      ]);
    
    state.supportConversationId = newConversation.id;
    await fetchMessengerData();
    return newConversation.id;
  }

async function callAIBot(conversationId, userMessage) {
  if (!isSupportConversation(conversationId)) return;
  if (isOwner()) return;
  
  const lowerMessage = userMessage.toLowerCase();
  let botResponse = '';
  
  if (lowerMessage.includes('заказать') || lowerMessage.includes('хочу заказать')) {
    botResponse = '🎨 Отлично! Чтобы заказать дизайн, напишите в Telegram @Mark1zell или нажмите кнопку "Заказать" на главной. А пока расскажите, что именно нужно: логотип, баннер, сайт?';
  }
  else if (lowerMessage.includes('логотип')) {
    botResponse = '✨ Логотип — 600 ₽. Срок 1-3 дня. Сделаю уникальный, в вашем стиле! Напишите подробнее о проекте.';
  }
  else if (lowerMessage.includes('баннер') || lowerMessage.includes('постер')) {
    botResponse = '🖼️ Баннер/постер — 500 ₽. Отдам в форматах PNG, JPG, PDF. Могу сделать анимированный за доп. оплату.';
  }
  else if (lowerMessage.includes('сайт')) {
    botResponse = '💻 Дизайн сайта: макет — 3000 ₽, 5 страниц — 13 000 ₽, полноценный сайт — 25 000 ₽. Вёрстка + помощь с сервером — 15 000 ₽. Что вам нужно?';
  }
  else if (lowerMessage.includes('срок') || lowerMessage.includes('долго')) {
    botResponse = '⏰ Стандартные сроки: логотип — 1-3 дня, баннер — 1-2 дня, сайт — 5-10 дней. Индивидуально обсуждаем!';
  }
  else if (lowerMessage.includes('скидка') || lowerMessage.includes('акция')) {
    botResponse = '🎁 Следите за акциями в разделе "Лента"! Подпишитесь на Telegram: https://t.me/Mark1zdzn';
  }
  else if (lowerMessage.includes('пример') || lowerMessage.includes('портфолио')) {
    botResponse = '🎨 Портфолио в разделе "Портфолио". Там примеры моих работ: логотипы, баннеры, сайты.';
  }
  else if (lowerMessage.includes('спасибо')) {
    botResponse = '🙏 Пожалуйста! Обращайтесь, если нужен дизайн. Всегда на связи!';
  }
  else if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
    botResponse = '👋 Привет! Я AI-помощник Mark1z Design. Могу помочь с заказом дизайна, ответить на вопросы о ценах или портфолио. Что вас интересует?';
  }
  else if (lowerMessage.length > 10) {
    botResponse = '📝 Спасибо за сообщение! Администратор скоро ответит. А пока уточните, нужен ли вам дизайн-проект? У нас есть логотипы, баннеры, сайты.';
  }
  else {
    botResponse = '😊 Я AI-помощник Mark1z Design. Расскажите, что хотите заказать: логотип, баннер, дизайн сайта? Или задайте вопрос о ценах/сроках.';
  }
  
  setTimeout(async () => {
    await supabaseClient.from('conversation_messages').insert({
      conversation_id: conversationId,
      user_id: OWNER_UID,
      sender_mode: 'support_brand',
      text: botResponse
    });
    await fetchMessengerData();
    await renderMessengerDialogs();
    if (state.currentConversationId === conversationId) {
      await openConversation(conversationId, true);
    }
  }, 1500);
}

  async function findOrCreateDirectConversation(otherUserId) {
    if (!state.currentSession?.user) return null;
    
    await fetchMessengerData();
    
    const myId = String(state.currentSession.user.id);
    const targetId = String(otherUserId);
    
    const existing = state.conversations.find(conv => {
      if (conv.is_support) return false;
      const members = state.conversationMembers
        .filter(m => String(m.conversation_id) === String(conv.id))
        .map(m => String(m.user_id));
      return members.length === 2 && members.includes(myId) && members.includes(targetId);
    });
    
    if (existing) return existing.id;
    
    const { data: newConversation, error } = await supabaseClient
      .from('conversations')
      .insert({
        title: 'Личный чат',
        is_direct: true,
        is_support: false,
        created_by: state.currentSession.user.id,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error || !newConversation) {
      console.error('create conversation error:', error);
      return null;
    }
    
    const { error: membersError } = await supabaseClient
      .from('conversation_members')
      .insert([
        { conversation_id: newConversation.id, user_id: state.currentSession.user.id, last_read_at: new Date().toISOString() },
        { conversation_id: newConversation.id, user_id: otherUserId, last_read_at: null }
      ]);
    
    if (membersError) {
      console.error('create conversation members error:', membersError);
      return null;
    }
    
    await fetchMessengerData();
    return newConversation.id;
  }

    function getUnreadCount(conversationId) {
    const member = state.conversationMembers.find(
      m => String(m.conversation_id) === String(conversationId) && 
           String(m.user_id) === String(state.currentSession?.user?.id)
    );
    
    const lastReadAt = member?.last_read_at ? new Date(member.last_read_at).getTime() : 0;
    
    return state.conversationMessages.filter(message => {
      const isMineStandard = String(message.user_id) === String(state.currentSession?.user?.id) && 
                            message.sender_mode !== 'support_brand';
      return (
        String(message.conversation_id) === String(conversationId) &&
        !isMineStandard &&
        new Date(message.created_at).getTime() > lastReadAt
      );
    }).length;
  }

  function renderConversationMessage(message) {
    const isOutgoing = String(message.user_id) === String(state.currentSession?.user?.id) && 
                       message.sender_mode !== 'support_brand';
    const author = getMessageAuthorIdentity(message);
    const authorName = safeText(
      author?.username || (isOutgoing ? 'Вы' : 'Mark1z Design'),
      isOutgoing ? 'Вы' : 'Mark1z Design'
    );
    
    const attachmentUrl = safeUrl(message.attachment_url || '');
    const attachmentName = safeText(message.attachment_name || 'Файл', 'Файл');
    const attachmentType = String(message.attachment_type || '').toLowerCase();
    
    const isImage = attachmentUrl && attachmentType.startsWith('image/');
    const hasText = Boolean(message.text && String(message.text).trim());
    
    const rowClass = isOutgoing ? 'mkz-message-row mkz-message-row--me' : 'mkz-message-row mkz-message-row--them';
    const msgClass = isOutgoing ? 'mkz-message mkz-message--me' : 'mkz-message mkz-message--them';
    
    return `
      <div class="${rowClass}">
        <div class="${msgClass}">
          <span class="mkz-message__title">${authorName}</span>
          ${hasText ? `<div class="mkz-message__text">${nl2brSafe(message.text)}</div>` : ''}
          ${isImage ? `<div class="mkz-message__image"><img src="${attachmentUrl}" alt="${attachmentName}" data-zoom-image="${attachmentUrl}" data-zoom-title="${attachmentName}"></div>` : ''}
          ${attachmentUrl && !isImage ? `<div class="mkz-message__file"><a href="${attachmentUrl}" target="_blank" rel="noopener noreferrer">${attachmentName}</a></div>` : ''}
          <div class="mkz-message__footer">
            <span class="mkz-message__time">${formatDateTime(message.created_at)}</span>
          </div>
        </div>
      </div>
    `;
  }

  async function loadSupportDialogs() {
  const container = document.getElementById('mkzSupportDialogsList');
  if (!container) return;
  showLoading('Загрузка диалогов...');
  try {
    const supportConversations = state.conversations.filter(c => c.is_support === true);
    if (!supportConversations.length) {
      container.innerHTML = '<div class="mkz-card"><p>Нет сообщений в поддержку</p></div>';
      hideLoading();
      return;
    }
    const dialogs = await Promise.all(supportConversations.map(async (conv) => {
      const member = state.conversationMembers.find(m => m.conversation_id === conv.id && m.user_id !== OWNER_UID);
      let userProfile = null;
      if (member) userProfile = await readProfileByUserId(member.user_id);
      const messages = state.conversationMessages.filter(m => m.conversation_id === conv.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const lastMessage = messages[0];
      const unreadCount = messages.filter(m => {
        const isUserMessage = m.user_id !== OWNER_UID && m.sender_mode !== 'support_brand';
        const isUnread = isUserMessage && (!member?.last_read_at || new Date(m.created_at) > new Date(member.last_read_at));
        return isUnread;
      }).length;
      return {
        conversationId: conv.id,
        username: userProfile?.username || 'Пользователь',
        avatarUrl: userProfile?.avatar_url,
        lastMessageText: lastMessage?.text || lastMessage?.attachment_name || 'Вложение',
        lastMessageTime: lastMessage?.created_at,
        unreadCount
      };
    }));
    dialogs.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    container.innerHTML = dialogs.map(dialog => `
      <div class="mkz-support-dialog-card ${dialog.unreadCount > 0 ? 'unread' : ''}" data-conversation-id="${dialog.conversationId}">
        <div class="mkz-support-dialog-header">
          <div class="mkz-support-dialog-avatar" style="${dialog.avatarUrl ? `background-image: url('${dialog.avatarUrl}'); background-size: cover;` : ''}">${!dialog.avatarUrl ? getInitial(dialog.username, 'U') : ''}</div>
          <div class="mkz-support-dialog-info">
            <div class="mkz-support-dialog-name">${safeText(dialog.username, 'Пользователь')}${dialog.unreadCount > 0 ? `<span class="mkz-unread-badge">${dialog.unreadCount}</span>` : ''}</div>
            <div class="mkz-support-dialog-time">${dialog.lastMessageTime ? formatDateTime(dialog.lastMessageTime) : ''}</div>
          </div>
        </div>
        <div class="mkz-support-dialog-preview">${safeText(dialog.lastMessageText, '')}</div>
      </div>
    `).join('');
    $$('.mkz-support-dialog-card', container).forEach(card => {
      card.addEventListener('click', () => {
        openConversation(card.dataset.conversationId);
        openScreen('messenger');
      });
    });
  } catch (err) {
    console.error('loadSupportDialogs error:', err);
    container.innerHTML = '<div class="mkz-card"><p>Ошибка загрузки диалогов</p></div>';
  } finally { hideLoading(); }
}

  function initSupportDialogsButton() {
  const btn = document.getElementById('mkzOpenSupportChatsBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    await loadSupportDialogs();
    openScreen('support-dialogs');
  });
  async function updateUnreadCounter() {
    const supportConversations = state.conversations.filter(c => c.is_support === true);
    let totalUnread = 0;
    for (const conv of supportConversations) {
      const member = state.conversationMembers.find(m => m.conversation_id === conv.id && m.user_id !== OWNER_UID);
      if (member) {
        const messages = state.conversationMessages.filter(m => m.conversation_id === conv.id);
        const unread = messages.filter(m => {
          const isUserMessage = m.user_id !== OWNER_UID && m.sender_mode !== 'support_brand';
          return isUserMessage && (!member.last_read_at || new Date(m.created_at) > new Date(member.last_read_at));
        }).length;
        totalUnread += unread;
      }
    }
    const counterSpan = document.getElementById('mkzUnreadSupportCount');
    if (counterSpan) counterSpan.textContent = totalUnread;
  }
  updateUnreadCounter();
  setInterval(updateUnreadCounter, 10000);
}

  function initSupportDialogsBackButton() {
  const backBtn = document.getElementById('mkzBackToAdminBtn');
  if (backBtn) backBtn.addEventListener('click', () => openScreen('account'));
}

  async function markConversationAsRead(conversationId) {
    if (!state.currentSession?.user || !conversationId) return;
    try {
      await supabaseClient
        .from('conversation_members')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', state.currentSession.user.id);
    } catch (err) {
      console.error('markConversationAsRead error:', err);
    }
  }

    function clearMessengerAttachment() {
    state.pendingMessengerAttachment = null;
    if (messengerImageInput) messengerImageInput.value = '';
    if (messengerFileInput) messengerFileInput.value = '';
    if (messengerAttachMeta) messengerAttachMeta.textContent = '';
  }

    // ========== BIND STATIC EVENTS ==========
  function bindStaticEvents() {
    // Бургер-меню
    if (burger && nav) {
      burger.addEventListener('click', () => {
        nav.classList.toggle('is-open');
      });
    }

    // Навигационные кнопки
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        openScreen(btn.dataset.screenOpen);
      });
    });

    // Кнопка пользователя
    if (userPillButton) {
      userPillButton.addEventListener('click', () => openScreen('account'));
    }

    // Модальные окна
    if (openOrderModal) openOrderModal.addEventListener('click', showOrderModal);
    if (closeOrderModal) closeOrderModal.addEventListener('click', hideOrderModal);
    if (orderBackdrop) orderBackdrop.addEventListener('click', hideOrderModal);
    if (closeReviewPopup) closeReviewPopup.addEventListener('click', hideReviewPopup);
    if (reviewPopupBackdrop) reviewPopupBackdrop.addEventListener('click', hideReviewPopup);
    if (closeImageModal) closeImageModal.addEventListener('click', hideImageModal);
    if (imageModalBackdrop) imageModalBackdrop.addEventListener('click', hideImageModal);

    // Портфолио
    if (backToFolders) backToFolders.addEventListener('click', showFoldersList);
    if (quickAddFolderBtn) {
      quickAddFolderBtn.addEventListener('click', () => {
        folderTitle?.focus();
        ownerPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (quickAddWorkBtn) {
      quickAddWorkBtn.addEventListener('click', () => {
        if (state.currentOpenedFolderId && portfolioFolderSelect) {
          portfolioFolderSelect.value = state.currentOpenedFolderId;
        }
        portfolioTitle?.focus();
        ownerPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Новости (кнопки прикрепления)
    if (attachImageBtn && newsImage) attachImageBtn.addEventListener('click', () => newsImage.click());
    if (attachFileBtn && newsExtraFile) attachFileBtn.addEventListener('click', () => newsExtraFile.click());
    
    if (togglePollBtn && pollPanel) {
      togglePollBtn.addEventListener('click', () => {
        pollPanel.style.display = pollPanel.style.display === 'none' ? 'block' : 'none';
        togglePollBtn.classList.toggle('is-active', pollPanel.style.display !== 'none');
      });
    }
    if (toggleContestBtn && contestPanel) {
      toggleContestBtn.addEventListener('click', () => {
        contestPanel.style.display = contestPanel.style.display === 'none' ? 'block' : 'none';
        toggleContestBtn.classList.toggle('is-active', contestPanel.style.display !== 'none');
      });
    }
    if (toggleLinkBtn && linkPanel) {
      toggleLinkBtn.addEventListener('click', () => {
        linkPanel.style.display = linkPanel.style.display === 'none' ? 'block' : 'none';
        toggleLinkBtn.classList.toggle('is-active', linkPanel.style.display !== 'none');
      });
    }
    if (togglePinBtn) {
      togglePinBtn.addEventListener('click', () => {
        state.isPinnedDraft = !state.isPinnedDraft;
        togglePinBtn.classList.toggle('is-active', state.isPinnedDraft);
      });
    }

    function initSupportModeSelector() {
  const selector = document.getElementById('mkzSupportModeSelector');
  const brandBtn = document.getElementById('mkzModeBrandBtn');
  const adminBtn = document.getElementById('mkzModeAdminBtn');
  const hint = document.getElementById('mkzModeHint');

  if (!selector || !brandBtn || !adminBtn) return;

  if (!isOwner()) {
    selector.style.display = 'none';
    return;
  }

  const setActiveMode = (mode) => {
    state.supportSendMode = mode;
    if (mode === 'brand') {
      brandBtn.classList.add('is-active');
      adminBtn.classList.remove('is-active');
      if (hint) hint.innerHTML = '💡 Посетители видят только сообщения от Mark1z Design';
    } else {
      adminBtn.classList.add('is-active');
      brandBtn.classList.remove('is-active');
      if (hint) hint.innerHTML = '👤 Это ваше личное сообщение, посетители его НЕ увидят';
    }
  };

  brandBtn.addEventListener('click', () => {
    setActiveMode('brand');
    showNotification('🏢 Теперь вы отвечаете от имени Mark1z Design', 'success');
  });

  adminBtn.addEventListener('click', () => {
    setActiveMode('admin');
    showNotification('👤 Теперь вы пишете от своего имени (посетители не увидят)', 'info');
  });

  setActiveMode('brand');
}

    // FAQ и чат кнопки
    if (faqFab) faqFab.addEventListener('click', () => openScreen('faq'));
    if (chatFab) {
      chatFab.addEventListener('click', async () => {
        if (!state.currentSession) {
          openScreen('account');
          return;
        }
        openScreen('messenger');
        await renderMessengerDialogs();
        if (state.supportConversationId) {
          await openConversation(state.supportConversationId);
        }
      });
    }

    // Звёзды для оценки отзыва
    stars.forEach(star => {
      star.addEventListener('click', () => {
        state.currentRating = Number(star.dataset.rating);
        renderStars(state.currentRating);
      });
    });

    // Табы "Обо мне"
    aboutTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        aboutTabs.forEach(item => item.classList.remove('is-active'));
        aboutPanels.forEach(item => item.classList.remove('is-active'));
        tab.classList.add('is-active');
        document.querySelector(`[data-about-panel="${tab.dataset.aboutTab}"]`)?.classList.add('is-active');
      });
    });

    // Переключение форм входа/регистрации
    if (showLoginBtn && showRegisterBtn && loginForm && registerForm) {
      showLoginBtn.addEventListener('click', () => {
        showLoginBtn.classList.add('is-active');
        showRegisterBtn.classList.remove('is-active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
      });
      showRegisterBtn.addEventListener('click', () => {
        showRegisterBtn.classList.add('is-active');
        showLoginBtn.classList.remove('is-active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
      });
    }

    // Отправка форм
    loginForm?.addEventListener('submit', async e => { e.preventDefault(); await handleLogin(); });
    registerForm?.addEventListener('submit', async e => { e.preventDefault(); await handleRegister(); });
    reviewForm?.addEventListener('submit', async e => { e.preventDefault(); await handleReviewSend(); });
    faqAskForm?.addEventListener('submit', async e => { e.preventDefault(); await handleFaqAsk(); });
    folderAdminForm?.addEventListener('submit', async e => { e.preventDefault(); await handleAddFolder(); });
    folderEditForm?.addEventListener('submit', async e => { e.preventDefault(); await handleEditFolderCover(); });
    portfolioAdminForm?.addEventListener('submit', async e => { e.preventDefault(); await handleAddPortfolioItem(); });
    portfolioEditForm?.addEventListener('submit', async e => { e.preventDefault(); await handleEditWork(); });

    // Новости - публикация
    if (newsAddBtn) newsAddBtn.addEventListener('click', handleAddNewsPost);

    // Обновление профиля и выход
    if (updateProfileBtn) updateProfileBtn.addEventListener('click', handleUpdateProfile);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Поиск людей
    if (peopleSearchBtn) {
      peopleSearchBtn.addEventListener('click', async () => {
        await searchPeople(peopleSearchInput?.value || '');
      });
    }
    if (peopleSearchInput) {
      peopleSearchInput.addEventListener('input', debounce(async (e) => {
        await searchPeople(e.target.value);
      }, 300));
    }
    if (backToPeopleBtn) backToPeopleBtn.addEventListener('click', () => openScreen('people'));

    // Описание профиля
    if (updateBioBtn) updateBioBtn.addEventListener('click', saveUserBio);

    // Кнопка "Написать" в публичном профиле
    if (openProfileMessengerBtn) {
      // Убираем старые обработчики
      const newBtn = openProfileMessengerBtn.cloneNode(true);
      openProfileMessengerBtn.parentNode.replaceChild(newBtn, openProfileMessengerBtn);
      
      newBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔘 Кнопка НАПИСАТЬ нажата');
        console.log('🔘 data-user-id на кнопке:', this.getAttribute('data-user-id'));
        
        if (!state.currentSession) {
          showNotification('Сначала войди в аккаунт', 'warning');
          openScreen('account');
          return;
        }

        const targetUserId = this.getAttribute('data-user-id');
        console.log('📌 targetUserId:', targetUserId);
        
        if (!targetUserId) {
          showNotification('Профиль не найден', 'warning');
          return;
        }

        const myId = String(state.currentSession.user.id);
        console.log('👤 myId:', myId);
        
        if (targetUserId === myId) {
          showNotification('Вы не можете написать сами себе', 'info');
          return;
        }

        showLoading('Создание чата...');
        
        try {
          const conversationId = await findOrCreateDirectConversation(targetUserId);
          console.log('💬 conversationId:', conversationId);
          
          if (!conversationId) {
            showNotification('Не удалось открыть чат', 'error');
            return;
          }

          openScreen('messenger');
          await renderMessengerDialogs();
          await openConversation(conversationId);
        } catch (err) {
          console.error('❌ Ошибка:', err);
          showNotification('Ошибка при создании чата', 'error');
        } finally {
          hideLoading();
        }
      });
    }

    // Мессенджер: прикрепление файлов
    if (messengerAttachImageBtn && messengerImageInput) {
      messengerAttachImageBtn.addEventListener('click', () => messengerImageInput.click());
    }
    if (messengerAttachFileBtn && messengerFileInput) {
      messengerAttachFileBtn.addEventListener('click', () => messengerFileInput.click());
    }
    if (messengerImageInput) {
      messengerImageInput.addEventListener('change', () => {
        const file = messengerImageInput.files?.[0];
        if (!file) return;
        state.pendingMessengerAttachment = { file, kind: 'image' };
        if (messengerAttachMeta) messengerAttachMeta.textContent = `Фото: ${file.name}`;
      });
    }
    if (messengerFileInput) {
      messengerFileInput.addEventListener('change', () => {
        const file = messengerFileInput.files?.[0];
        if (!file) return;
        state.pendingMessengerAttachment = { file, kind: 'file' };
        if (messengerAttachMeta) messengerAttachMeta.textContent = `Файл: ${file.name}`;
      });
    }

    // Отправка сообщения
    if (messengerForm) {
      messengerForm.addEventListener('submit', async e => {
        e.preventDefault();
        await sendMessengerMessage();
      });
    }
    if (messengerInput) {
      messengerInput.addEventListener('keydown', async e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          await sendMessengerMessage();
        }
      });
    }

    // Обновление чата
    if (messengerRefreshBtn) {
      messengerRefreshBtn.addEventListener('click', async () => {
        await fetchMessengerData();
        await renderMessengerDialogs();
        if (state.currentConversationId) {
          await openConversation(state.currentConversationId, true);
        }
      });
    }

    // Открытие профиля из чата
    if (messengerOpenProfileBtn) {
      messengerOpenProfileBtn.addEventListener('click', async () => {
        const profileId = messengerOpenProfileBtn.dataset.profileId;
        if (!profileId) return;
        await openPublicProfile(profileId);
      });
    }
  initSupportDialogsButton();
  initSupportDialogsBackButton();
}

    // Закрепленный чат
if (pinnedOwnerChatBtn) {
    pinnedOwnerChatBtn.addEventListener('click', async () => {
        if (!state.currentSession) {
            openScreen('account');
            return;
        }
        // ДОБАВЬ ЭТИ СТРОКИ:
        await renderMessengerDialogs();
        if (state.supportConversationId) {
            await openConversation(state.supportConversationId);
        }
    });
}

// ========== INIT ==========
(async function init() {
  const style = document.createElement('style');
  style.textContent = `
    .mkz-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      display: none;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 10000;
    }
    .mkz-loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: mkz-spin 0.8s linear infinite;
    }
    @keyframes mkz-spin {
      to { transform: rotate(360deg); }
    }
    .mkz-loading-message {
      color: #fff;
      margin-top: 20px;
      font-size: 14px;
    }
    .mkz-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 380px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      transform: translateX(420px);
      transition: transform 0.3s ease;
      z-index: 10001;
      overflow: hidden;
    }
    .mkz-notification.show {
      transform: translateX(0);
    }
    .mkz-notification--success { border-left: 4px solid #4caf50; }
    .mkz-notification--error { border-left: 4px solid #f44336; }
    .mkz-notification--warning { border-left: 4px solid #ff9800; }
    .mkz-notification--info { border-left: 4px solid #2196f3; }
    .mkz-notification__content {
      padding: 14px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mkz-notification__message {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    .mkz-notification__close {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      padding: 0 8px;
      color: #999;
    }
    .mkz-notification__close:hover { color: #333; }
    .drag-over {
      border: 2px dashed #4caf50 !important;
      background: rgba(76,175,80,0.1) !important;
    }
    .mkz-profile-description {
      margin: 20px 0;
      padding: 16px;
      background: #1e293b;
      border-radius: 12px;
    }
    .mkz-profile-description textarea {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      font-family: inherit;
      resize: vertical;
      color: #e2e8f0;
    }
    .mkz-social-error {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }
    .mkz-social-inputs {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    @media (max-width: 640px) {
      .mkz-social-inputs {
        flex-direction: column;
      }
    }
  `;
  document.head.appendChild(style);
  
  await fetchSessionAndProfile();
  await Promise.all([
    cacheProfiles(),
    renderPortfolio(),
    renderReviews(),
    renderNews(),
    renderFaqQuestions(),
    renderContestEntriesAdmin(),
    searchPeople(),
    renderMessengerDialogs()
  ]);
  await loadUserBio();
  bindStaticEvents();
  
  supabaseClient.auth.onAuthStateChange(function (_event, session) {
    state.currentSession = session || null;
    if (state.currentSession) {
      startPresenceHeartbeat();
      requestNotificationsIfNeeded();
      updatePresence(true);
    } else {
      stopPresenceHeartbeat();
    }
    setTimeout(async () => {
      await fetchSessionAndProfile();
      await loadUserBio();
      await Promise.all([
        cacheProfiles(),
        renderPortfolio(),
        renderReviews(),
        renderNews(),
        renderFaqQuestions(),
        renderContestEntriesAdmin(),
        searchPeople(),
        renderMessengerDialogs()
      ]);
    }, 0);
  });

  document.addEventListener('visibilitychange', async () => {
    await updatePresence(!document.hidden);
  });

  window.addEventListener('beforeunload', () => {
    updatePresence(false);
  });
})();

})(); // Закрываем основную функцию

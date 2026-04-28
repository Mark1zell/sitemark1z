(function () {
  const OWNER_UID = '8365dfe0-74c7-4443-9e3d-22de6fd10050';
  const SUPABASE_URL = 'https://jtokctxkrojiggjckwfn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_jDgy-GUNpSSnPjsp2FQXAA_-m5NIehW';

    const SUPPORT_CHAT_IDENTITY = {
    id: '3bf0b657-7722-4189-bd0e-6b7b9271ccdc',
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

  function hideLoading() { if (loadingOverlay) loadingOverlay.style.display = 'none'; }

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
    return function (...args) {
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

  function clearCache(key) { if (key) queryCache.delete(key); else queryCache.clear(); }

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

  // ========== ИСПРАВЛЕННАЯ escapeHtml ==========
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
    const mod10 = n % 10, mod100 = n % 100;
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

  function isOwner() { return !!(state.currentSession?.user?.id === OWNER_UID); }

  function isSupportConversation(conversationId) { return String(conversationId) === String(state.supportConversationId); }

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
    if (existing && existing !== '#Mark1z') return existing.startsWith('#') ? existing : '#' + existing;
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
    if (!isProfileFieldVisible(profile, 'show_last_seen')) return 'Статус скрыт';
    if (profile.is_online) return 'В сети';
    if (profile.last_seen_at) {
      const lastSeen = new Date(profile.last_seen_at);
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 5) return 'Был(а) только что';
      if (diffMins < 60) return `Был(а) ${diffMins} ${pluralRu(diffMins, 'минуту', 'минуты', 'минут')} назад`;
      if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `Был(а) ${hours} ${pluralRu(hours, 'час', 'часа', 'часов')} назад`;
      } else {
        const days = Math.floor(diffMins / 1440);
        if (days < 7) return `Был(а) ${days} ${pluralRu(days, 'день', 'дня', 'дней')} назад`;
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
    pendingMessengerAttachment: null, supportSendMode: 'brand', messengerPollingTimer: null, messagesChannel: null, messagesPolling: null, isSubscribed: false, messagesSubscription: null, knownMessageIds: new Set(), notificationsReady: false, initialMessagesHydrated: false,
    mediaRecorder: null, mediaChunks: [], voiceStream: null
  };

  // ========== DEV-КОНСОЛЬ ДЛЯ ОТЛАДКИ ==========
  window.mkz = {
    state: state,
    chat: function() { return state.currentConversationId; },
    open: function(id) { return openConversation(id || state.currentConversationId); },
    support: function() { return openConversation(state.supportConversationId); },
    dialogs: function() { return renderMessengerDialogs(); },
    cache: function() { return cacheProfiles(); },
    messages: function() { return state.conversationMessages; },
    profile: function() { return state.currentProfile; },
    session: function() { return state.currentSession; },
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
        id: userId, username: baseData?.username ?? existing?.username ?? fallbackName,
        full_name: baseData?.username ?? existing?.full_name ?? fallbackName,
        phone: baseData?.phone ?? existing?.phone ?? '',
        avatar_url: baseData?.avatar_url ?? existing?.avatar_url ?? '',
        email: state.currentSession.user.email || existing?.email || '',
        telegram_username: baseData?.telegram_username ?? existing?.telegram_username ?? '',
        bio: existing?.bio || '', public_id: publicId, user_code: publicId,
        is_admin: userId === OWNER_UID, is_online: false, last_seen_at: existing?.last_seen_at || now,
        show_phone: existing?.show_phone ?? true, show_telegram: existing?.show_telegram ?? true, show_last_seen: existing?.show_last_seen ?? true
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
    if (state.messagesPolling) { clearInterval(state.messagesPolling); state.messagesPolling = null; }
    if (state.messagesChannel) { try { await supabaseClient.removeChannel(state.messagesChannel); } catch (e) { } state.messagesChannel = null; state.isSubscribed = false; }
    if (state.currentSession?.user) { await supabaseClient.from('profiles').update({ is_online: false, last_seen_at: new Date().toISOString() }).eq('id', state.currentSession.user.id); }
    await supabaseClient.auth.signOut();
    state.currentSession = null; state.currentProfile = null; state.userLikedPosts = new Set(); state.newsLikesMap = {}; state.newsCommentsMap = {};
    state.currentConversationId = null; state.supportConversationId = null; state.openedProfile = null; state.knownMessageIds = new Set(); state.initialMessagesHydrated = false;
    clearMessengerAttachment(); renderProfile();
    await Promise.all([cacheProfiles(), renderPortfolio(), renderReviews(), renderNews(), renderFaqQuestions(), renderContestEntriesAdmin(), searchPeople(), renderMessengerDialogs()]);
    openScreen('account'); showNotification('Вы вышли из аккаунта', 'info');
  }

  function startPresenceHeartbeat() {
    if (state.messengerPollingTimer) return;
    state.messengerPollingTimer = setInterval(async () => {
      if (!state.currentSession?.user) return;
      await touchCurrentProfileActivity();
    }, 30000);
  }

  function stopPresenceHeartbeat() { if (state.messengerPollingTimer) { clearInterval(state.messengerPollingTimer); state.messengerPollingTimer = null; } }

  async function requestNotificationsIfNeeded() {
    if (!('Notification' in window)) return;
    if (state.notificationsReady) return;
    if (Notification.permission === 'default') { try { await Notification.requestPermission(); } catch (e) { } }
    state.notificationsReady = true;
  }

  // ========== ФУНКЦИИ ПОРТФОЛИО ==========
  function renderPortfolioSelects() {
    if (portfolioFolderSelect) portfolioFolderSelect.innerHTML = state.folders.map(folder => `<option value="${folder.id}">${safeText(folder.title, 'Папка')}</option>`).join('');
    if (editFolderSelect) editFolderSelect.innerHTML = state.folders.map(folder => `<option value="${folder.id}">${safeText(folder.title, 'Папка')}</option>`).join('');
    if (editWorkSelect) editWorkSelect.innerHTML = state.items.map(item => `<option value="${item.id}">${safeText(item.title || 'Работа', 'Работа')}</option>`).join('');
  }

  function showFoldersList() { state.currentOpenedFolderId = null; if (folderBrowserList) folderBrowserList.style.display = 'block'; if (folderInside) folderInside.style.display = 'none'; updateAuthUI(); }

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
      const { data: posts, error } = await supabaseClient.from('news_posts').select('*').order('created_at', { ascending: false });
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

  async function handleAddNewsPost() { console.warn('handleAddNewsPost: не реализована'); }
  async function handleDeleteNewsPost(postId) { console.warn('handleDeleteNewsPost: не реализована'); }
  async function handleEditNewsPost(postId) { console.warn('handleEditNewsPost: не реализована'); }
  async function handleDeleteNewsComment(commentId) { console.warn('handleDeleteNewsComment: не реализована'); }

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

  async function openPublicProfile(userId) {
  try {
    console.log('🔍 openPublicProfile вызван с userId:', userId);
    
    let profile = await readProfileByUserId(userId);
    if (!profile) profile = getProfileByUserId(userId);
    if (!profile) {
      console.error('❌ Профиль не найден');
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
    
    // ========== ГЛАВНОЕ: СОХРАНЯЕМ ID В КНОПКУ ==========
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
          <div class="mkz-profile-stat"><strong>${userReviews.length}</strong><span>Отзывов</span></div>
          <div class="mkz-profile-stat"><strong>${userComments.length}</strong><span>Комментариев</span></div>
        </div>
      `;
    }
    
    openScreen('profile');
  } catch (err) {
    console.error('❌ openPublicProfile error:', err);
  }
}

    // ========== ПОИСК СУЩЕСТВУЮЩЕГО ЧАТА 1-на-1 ==========
async function findExistingConversation(userId) {
  if (!state.currentSession?.user) return null;
  const myUserId = state.currentSession.user.id;
  
  const { data: myChats } = await supabaseClient
    .from('chat_members')
    .select('chat_id')
    .eq('user_id', myUserId);
  
  if (!myChats?.length) return null;
  
  const myChatIds = myChats.map(m => m.chat_id);
  
  const { data: allMembers } = await supabaseClient
    .from('chat_members')
    .select('chat_id, user_id')
    .in('chat_id', myChatIds);
  
  const chatsMap = {};
  for (const m of allMembers || []) {
    if (!chatsMap[m.chat_id]) chatsMap[m.chat_id] = new Set();
    chatsMap[m.chat_id].add(m.user_id);
  }
  
  for (const [chatId, userIds] of Object.entries(chatsMap)) {
    if (userIds.size === 2 && userIds.has(myUserId) && userIds.has(userId)) {
      const { data: chat } = await supabaseClient
        .from('chats')
        .select('is_group')
        .eq('id', chatId)
        .single();
      if (chat && !chat.is_group) return chatId;
    }
  }
  
  return null;
}

    // ========== НАЧАТЬ ЧАТ С ПОЛЬЗОВАТЕЛЕМ ==========
  async function startConversationWithUser(userId) {
  if (!state.currentSession?.user) {
    showNotification('Сначала войдите в аккаунт', 'warning');
    return null;
  }

  const myId = state.currentSession.user.id;
  
  // 1. Проверяем существующий чат
  const existingId = await findExistingConversation(userId);
  if (existingId) {
    console.log('✅ Чат уже существует:', existingId);
    return existingId;
  }

  // 2. Создаём новый чат
  try {
    const { data: newChat, error: chatError } = await supabaseClient
      .from('chats')
      .insert({ is_group: false })
      .select('id')
      .single();

    if (chatError) {
      console.error('Ошибка создания чата:', chatError);
      throw new Error('Не удалось создать чат: ' + chatError.message);
    }
    
    if (!newChat?.id) {
      throw new Error('Не удалось создать чат: пустой ответ');
    }

    // 3. Добавляем участников
    const { error: membersError } = await supabaseClient
      .from('chat_members')
      .insert([
        { chat_id: newChat.id, user_id: myId },
        { chat_id: newChat.id, user_id: userId }
      ]);

    if (membersError) {
      console.error('Ошибка добавления участников:', membersError);
      // Удаляем пустой чат
      await supabaseClient.from('chats').delete().eq('id', newChat.id);
      throw new Error('Не удалось добавить участников: ' + membersError.message);
    }

    console.log('🆕 Чат создан:', newChat.id);
    return newChat.id;

  } catch (err) {
    console.error('startConversationWithUser error:', err);
    showNotification(err.message, 'error');
    return null;
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
      const { data: members } = await supabaseClient.from('conversation_members').select('*').eq('user_id', state.currentSession.user.id);
      const memberRows = members || [];
      const conversationIds = memberRows.map(item => item.conversation_id);
      if (!conversationIds.length) {
        state.conversations = [];
        state.conversationMembers = [];
        state.conversationMessages = [];
        return;
      }
      const { data: conversations } = await supabaseClient.from('conversations').select('*').in('id', conversationIds).order('updated_at', { ascending: false });
      const { data: allMembers } = await supabaseClient.from('conversation_members').select('*').in('conversation_id', conversationIds);
      const { data: messages } = await supabaseClient.from('conversation_messages').select('*').in('conversation_id', conversationIds).order('created_at', { ascending: true });
      state.conversations = conversations || [];
      state.conversationMembers = allMembers || [];
      state.conversationMessages = messages || [];
              // Загружаем профили отправителей
    var uniqueSenderIds = [];
    for (var i = 0; i < state.conversationMessages.length; i++) {
      var sId = state.conversationMessages[i].sender_id;
      if (uniqueSenderIds.indexOf(sId) === -1) {
        uniqueSenderIds.push(sId);
      }
    }
    var missingIds = [];
    for (var j = 0; j < uniqueSenderIds.length; j++) {
      var found = state.allProfilesCache.some(function(p) { return p.id === uniqueSenderIds[j]; });
      if (!found) missingIds.push(uniqueSenderIds[j]);
    }
        if (missingIds.length > 0) {
      var result = await supabaseClient.from('profiles').select('*').in('id', missingIds);
      if (result && result.data) {
        var newProfiles = result.data;
        for (var k = 0; k < newProfiles.length; k++) {
          var exists = state.allProfilesCache.some(function(p) { return p.id === newProfiles[k].id; });
          if (!exists) state.allProfilesCache.push(newProfiles[k]);
        }
      }
    }
      const supportConversation = state.conversations.find(c => c.is_support === true);
      state.supportConversationId = 'daba25cb-e4e2-44b3-be59-36f0f5e38ce5';
    } catch (err) { console.error('fetchMessengerData error:', err); }
  }

  // ========== РЕНДЕР СПИСКА ДИАЛОГОВ ==========
async function renderMessengerDialogs() {
  if (!messengerDialogs) return;
  if (!state.currentSession?.user) {
    messengerDialogs.innerHTML = '<div class="mkz-card"><p>Войдите в аккаунт, чтобы видеть диалоги.</p></div>';
    return;
  }

  try {
    showLoading('Загрузка диалогов...');
    
    // 1. Получаем все чаты, где участвует текущий пользователь
    const { data: myMemberships } = await supabaseClient
      .from('chat_members')
      .select('chat_id')
      .eq('user_id', state.currentSession.user.id);
    
    if (!myMemberships?.length) {
      messengerDialogs.innerHTML = '<div class="mkz-card"><p>У вас пока нет диалогов.</p><small>Найдите человека в разделе «Люди» и нажмите «Написать».</small></div>';
      hideLoading();
      return;
    }
    
    const chatIds = myMemberships.map(m => m.chat_id);
    
    // 2. Получаем сами чаты
    const { data: chats } = await supabaseClient
      .from('chats')
      .select('*')
      .in('id', chatIds)
      .order('created_at', { ascending: false });
    
    if (!chats?.length) {
      messengerDialogs.innerHTML = '<div class="mkz-card"><p>Нет активных диалогов.</p></div>';
      hideLoading();
      return;
    }
    
    // 3. Получаем ВСЕХ участников этих чатов
    const { data: allMembers } = await supabaseClient
      .from('chat_members')
      .select('chat_id, user_id')
      .in('chat_id', chatIds);
    
    // 4. Собираем ID всех собеседников (не себя)
    const myId = state.currentSession.user.id;
    const otherUserIds = new Set();
    for (const m of allMembers || []) {
      if (m.user_id !== myId) otherUserIds.add(m.user_id);
    }
    
    // 5. Загружаем профили всех собеседников ОДНИМ запросом
    let profilesMap = {};
    if (otherUserIds.size > 0) {
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id, username, avatar_url, is_online, last_seen_at, show_last_seen')
        .in('id', Array.from(otherUserIds));
      
      for (const p of profiles || []) {
        profilesMap[p.id] = p;
      }
      // Обновляем кеш
      for (const p of profiles || []) {
        const existing = state.allProfilesCache.findIndex(cached => cached.id === p.id);
        if (existing >= 0) {
          state.allProfilesCache[existing] = { ...state.allProfilesCache[existing], ...p };
        } else {
          state.allProfilesCache.push(p);
        }
      }
    }

            // Загружаем профиль бота из БД (без ошибок)
        try {
      var brandProfile = state.allProfilesCache.find(function(p) { return p.id === '3bf0b657-7722-4189-bd0e-6b7b9271ccdc'; });
      if (!brandProfile || !brandProfile.avatar_url) {
        var brandAvatar = localStorage.getItem('mkz_brand_avatar') || '';
        if (!brandAvatar) {
          try {
            var dbBrand = await supabaseClient.from('profiles').select('avatar_url').eq('id', '3bf0b657-7722-4189-bd0e-6b7b9271ccdc').single();
            if (dbBrand && dbBrand.data && dbBrand.data.avatar_url) {
              brandAvatar = dbBrand.data.avatar_url;
              localStorage.setItem('mkz_brand_avatar', brandAvatar);
            }
          } catch(e) {}
        }
        if (brandProfile) {
          brandProfile.avatar_url = brandAvatar;
        } else {
          state.allProfilesCache.push({
            id: '3bf0b657-7722-4189-bd0e-6b7b9271ccdc',
            username: 'Mark1z Design',
            avatar_url: brandAvatar,
            is_online: true
          });
        }
      }
    } catch(e) {
      console.log('Профиль бота не в БД, используем localStorage');
    }
    
    // 6. Для каждого чата получаем последнее сообщение
    const { data: lastMessages } = await supabaseClient
      .from('messages')
      .select('chat_id, content, sender_id, created_at')
      .in('chat_id', chatIds)
      .order('created_at', { ascending: false });
    
    // Группируем: для каждого чата — последнее сообщение
    const lastMsgMap = {};
    for (const msg of lastMessages || []) {
      if (!lastMsgMap[msg.chat_id]) {
        lastMsgMap[msg.chat_id] = msg;
      }
    }
    
    // 7. Рендерим
      messengerDialogs.innerHTML = chats.map(chat => {
      // Находим собеседника для этого чата
      const chatMembers = (allMembers || []).filter(m => m.chat_id === chat.id);
      const otherMemberId = chatMembers.find(m => m.user_id !== myId)?.user_id;
      
      let displayName = 'Пользователь';
      let avatarUrl = '';
      let statusText = '';
      
      if (chat.is_group) {
        displayName = chat.name || 'Группа';
        avatarUrl = chat.avatar_url || '';
        statusText = `${chatMembers.length} участников`;
      } else if (otherMemberId && profilesMap[otherMemberId]) {
        const profile = profilesMap[otherMemberId];
        displayName = profile.username || 'Пользователь';
        avatarUrl = profile.avatar_url || '';
        
        // Статус
        if (profile.is_online) {
          statusText = 'В сети';
        } else if (profile.last_seen_at) {
          const lastSeen = new Date(profile.last_seen_at);
          const now = new Date();
          const diffMs = now - lastSeen;
          const diffMins = Math.floor(diffMs / 60000);
          if (diffMins < 5) statusText = 'Был(а) только что';
          else if (diffMins < 60) statusText = `Был(а) ${diffMins} мин. назад`;
          else if (diffMins < 1440) statusText = `Был(а) ${Math.floor(diffMins / 60)} ч. назад`;
          else statusText = formatDateOnly(profile.last_seen_at);
        } else {
          statusText = 'Не в сети';
        }
      } else if (otherMemberId === '3bf0b657-7722-4189-bd0e-6b7b9271ccdc' || String(chat.id) === String(state.supportConversationId)) {
        displayName = 'Mark1z Design';
        var supportProfile = state.allProfilesCache.find(function(p) { return p.id === '3bf0b657-7722-4189-bd0e-6b7b9271ccdc'; });
        avatarUrl = supportProfile?.avatar_url || localStorage.getItem('mkz_brand_avatar') || '';
        statusText = 'Чат для заказов и техподдержка';
      }
      
      // Последнее сообщение
      const lastMsg = lastMsgMap[chat.id];
      let preview = 'Нет сообщений';
      let timeText = '';
      if (lastMsg) {
        preview = (lastMsg.content || '📎 Вложение').substring(0, 40);
        if ((lastMsg.content || '').length > 40) preview += '...';
        timeText = formatDateTime(lastMsg.created_at);
      }
      
      // Активный чат?
     var isActive = String(chat.id) === String(state.currentConversationId);
      if (isActive) console.log('Активный чат:', chat.id);
      
      return `
        <button class="mkz-dialog ${isActive ? 'mkz-dialog--active' : ''}" 
                type="button" 
                data-open-chat="${chat.id}">
          <div class="mkz-dialog__avatar" style="${avatarUrl ? `background-image:url('${escapeHtml(avatarUrl)}');background-size:cover;background-position:center;` : ''}">
            ${avatarUrl ? '' : getInitial(displayName, 'П')}
          </div>
          <div class="mkz-dialog__body">
            <div class="mkz-dialog__top">
              <span class="mkz-dialog__name">${escapeHtml(displayName)}</span>
              ${timeText ? `<span class="mkz-dialog__time">${timeText}</span>` : ''}
            </div>
            <div class="mkz-dialog__bottom">
              <span class="mkz-dialog__preview">${escapeHtml(preview)}</span>
            </div>
            <div class="mkz-dialog__status">${statusText}</div>
          </div>
        </button>`;
    }).join('');

        // Обработчик для чата поддержки
    var supportBtn = messengerDialogs.querySelector('[data-open-chat="' + state.supportConversationId + '"]');
    if (supportBtn) {
      supportBtn.addEventListener('click', async function() {
        state.supportConversationId = 'daba25cb-e4e2-44b3-be59-36f0f5e38ce5';
        await openConversation('daba25cb-e4e2-44b3-be59-36f0f5e38ce5');
      });
    }
    
    // Вешаем обработчики клика
    $$('[data-open-chat]', messengerDialogs).forEach(btn => {
      btn.addEventListener('click', async () => {
        const chatId = btn.dataset.openChat;
        await openConversation(chatId);
      });
    });

        // Обновляем счётчик непрочитанных
    var unreadCount = 0;
      for (var d = 0; d < chats.length; d++) {
      var lastMsg = lastMsgMap[chats[d].id];
      if (lastMsg && lastMsg.sender_id !== myId && String(chats[d].id) !== String(state.currentConversationId)) {
        unreadCount++;
      }
    }
    hideLoading();
    
  } catch (err) {
    console.error('renderMessengerDialogs error:', err);
    messengerDialogs.innerHTML = '<div class="mkz-card"><p>Ошибка загрузки диалогов</p></div>';
    hideLoading();
  }
}

    // ========== ОТКРЫТЬ ДИАЛОГ ==========
async function openConversation(conversationId, isPollingUpdate = false) {
  if (!conversationId) return;
  state.currentConversationId = conversationId;

  // Обновляем выделение в списке диалогов
  var allDialogs = document.querySelectorAll('.mkz-dialog');
  for (var d = 0; d < allDialogs.length; d++) {
    allDialogs[d].classList.remove('mkz-dialog--active');
  }
  var activeDialog = document.querySelector('[data-open-chat="' + conversationId + '"]');
  if (activeDialog) activeDialog.classList.add('mkz-dialog--active');

  // Сброс счётчика
  var badge = document.getElementById('mkzUnreadBadge');
  if (badge) {
    var currentCount = parseInt(badge.textContent) || 0;
    if (currentCount > 0) {
      currentCount = currentCount - 1;
      badge.textContent = currentCount > 0 ? currentCount : '';
      badge.style.display = currentCount > 0 ? 'inline-block' : 'none';
    }
  }

  // Пропускаем рендер если нет новых сообщений при polling
  if (isPollingUpdate && state._lastMessageCount === state.conversationMessages.length) return;

  // Загружаем данные собеседника
  var otherUserId = null;
  var otherProfile = null;
  
  try {
    var { data: members } = await supabaseClient.from('chat_members').select('user_id').eq('chat_id', conversationId);
    if (members) {
      otherUserId = members.find(function(m) { return m.user_id !== state.currentSession?.user?.id; })?.user_id;
    }
    if (otherUserId && otherUserId !== '3bf0b657-7722-4189-bd0e-6b7b9271ccdc') {
      var { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', otherUserId).single();
      otherProfile = profile;
    }
  } catch(e) {}

     // Обновляем хедер
    if (otherUserId === '3bf0b657-7722-4189-bd0e-6b7b9271ccdc' || String(conversationId) === String(state.supportConversationId)) {
      if (messengerTopName) messengerTopName.textContent = 'Mark1z Design';
      if (messengerTopSub) messengerTopSub.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:6px;"></span>Чат для заказов и техподдержка';
      if (messengerTopAvatar) {
        var brandAvatar = localStorage.getItem('mkz_brand_avatar') || '';
        if (!brandAvatar) {
          try {
            var db3 = await supabaseClient.from('profiles').select('avatar_url').eq('id', '3bf0b657-7722-4189-bd0e-6b7b9271ccdc').single();
            if (db3 && db3.data && db3.data.avatar_url) {
              brandAvatar = db3.data.avatar_url;
              localStorage.setItem('mkz_brand_avatar', brandAvatar);
            }
          } catch(e) {}
        }
        if (brandAvatar) {
          messengerTopAvatar.style.backgroundImage = "url('" + brandAvatar + "')";
          messengerTopAvatar.style.backgroundSize = 'cover';
          messengerTopAvatar.style.backgroundPosition = 'center';
          messengerTopAvatar.textContent = '';
        } else {
          messengerTopAvatar.style.background = 'linear-gradient(135deg, #ff2fae, #7a3cff)';
          messengerTopAvatar.textContent = 'M';
        }
      }

            // Двойной клик для загрузки аватарки
      if (messengerTopAvatar && isOwner() && String(conversationId) === String(state.supportConversationId)) {
        messengerTopAvatar.title = 'Двойной клик — сменить аватарку';
        messengerTopAvatar.style.cursor = 'pointer';
        messengerTopAvatar.ondblclick = async function() {
          var input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async function() {
            var file = input.files[0];
            if (!file) return;
            var upload = await uploadToBucket('avatars', file, 'brand_avatar');
            var brandId = '3bf0b657-7722-4189-bd0e-6b7b9271ccdc';
            await supabaseClient.from('profiles').upsert({
              id: brandId,
              username: 'Mark1z Design',
              avatar_url: upload.publicUrl,
              is_online: true
            }, { onConflict: 'id' });
            localStorage.setItem('mkz_brand_avatar', upload.publicUrl);
            messengerTopAvatar.style.backgroundImage = "url('" + upload.publicUrl + "')";
            messengerTopAvatar.style.backgroundSize = 'cover';
            messengerTopAvatar.style.backgroundPosition = 'center';
            messengerTopAvatar.textContent = '';
            showNotification('Аватарка обновлена!', 'success');
          };
          input.click();
        };
      }
      
    } else if (otherProfile) {
    if (messengerTopName) messengerTopName.textContent = otherProfile.username || 'Пользователь';
    if (messengerTopSub) {
      var statusText = getVisibleLastSeen(otherProfile);
      var dotColor = '#64748b';
      if (otherProfile.is_online) {
        dotColor = '#22c55e';
      } else if (statusText.indexOf('только что') >= 0 || statusText.indexOf('мин.') >= 0) {
        dotColor = '#f97316';
      }
      messengerTopSub.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + dotColor + ';margin-right:6px;"></span>' + statusText;
    }
    if (messengerTopAvatar) {
      if (otherProfile.avatar_url) {
        messengerTopAvatar.style.backgroundImage = "url('" + otherProfile.avatar_url + "')";
        messengerTopAvatar.style.backgroundSize = 'cover';
        messengerTopAvatar.style.backgroundPosition = 'center';
        messengerTopAvatar.textContent = '';
      } else {
        messengerTopAvatar.style.background = 'linear-gradient(135deg, #ff2fae, #7a3cff)';
        messengerTopAvatar.textContent = getInitial(otherProfile.username || 'П', 'П');
      }
    }
  }

  // Кнопки профиля и удаления чата
  setTimeout(function() {
    var headEl = document.querySelector('#messenger .mkz-messenger-head');
    if (!headEl) return;
    
    var oldProfile = document.getElementById('mkzMessengerProfileBtn');
    var oldDelete = document.getElementById('mkzDeleteChatBtn');
    if (oldProfile) oldProfile.remove();
    if (oldDelete) oldDelete.remove();
    
    var btnsContainer = document.createElement('div');
    btnsContainer.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:auto;';
    
    var deleteChatBtn = document.createElement('button');
    deleteChatBtn.id = 'mkzDeleteChatBtn';
    deleteChatBtn.innerHTML = '🗑️';
    deleteChatBtn.title = 'Удалить чат';
    deleteChatBtn.style.cssText = 'width:38px;height:38px;border:none;border-radius:10px;background:rgba(255,60,60,0.15);color:#ff4d4d;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;line-height:1;';
    
    var profileBtn = document.createElement('button');
    profileBtn.id = 'mkzMessengerProfileBtn';
    profileBtn.innerHTML = '👤';
    profileBtn.title = 'Профиль';
    profileBtn.style.cssText = 'width:38px;height:38px;border:none;border-radius:10px;background:rgba(255,255,255,0.08);color:#fff;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;line-height:1;';
    
    btnsContainer.appendChild(deleteChatBtn);
    btnsContainer.appendChild(profileBtn);
    headEl.appendChild(btnsContainer);
    
    if (otherUserId && otherUserId !== '3bf0b657-7722-4189-bd0e-6b7b9271ccdc') {
      profileBtn.onclick = function() { openPublicProfile(otherUserId); };
                  deleteChatBtn.onclick = async function() {
        if (!confirm('Удалить этот чат? Переписка исчезнет у обоих.')) return;
        var chatId = conversationId;
        // Удаляем сообщения
        await supabaseClient.from('messages').delete().eq('chat_id', chatId);
        // Удаляем всех участников
        await supabaseClient.from('chat_members').delete().eq('chat_id', chatId);
        // Удаляем сам чат
        await supabaseClient.from('chats').delete().eq('id', chatId);
        state.currentConversationId = null;
        if (messengerMessages) messengerMessages.innerHTML = '';
        showNotification('Чат удалён полностью', 'success');
          setTimeout(async function() {
          await fetchMessengerData();
          await renderMessengerDialogs();
        }, 500);
      };
    } else {
      profileBtn.style.display = 'none';
      deleteChatBtn.style.display = 'none';
    }
  }, 300);
  
  try {
    // Загружаем сообщения
    const { data: messages, error: msgError } = await supabaseClient
      .from('messages')
      .select('*')
      .eq('chat_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (msgError) { console.error('Ошибка загрузки сообщений:', msgError); return; }
    
    state.conversationMessages = messages || [];
    state._lastMessageCount = state.conversationMessages.length;
    
    // Рендер сообщений
    var msgContainer = document.getElementById('mkzMessengerMessages');
    if (msgContainer) {
      var renderMyId = state.currentSession ? state.currentSession.user.id : null;
      if (!state.conversationMessages || state.conversationMessages.length === 0) {
        msgContainer.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:40px;">💬 Сообщений пока нет</div>';
      } else {
        var html = '';
        for (var i = 0; i < state.conversationMessages.length; i++) {
          var msg = state.conversationMessages[i];
          var isMine = msg.sender_id === renderMyId;
          var content = msg.content || '';
          var time = new Date(msg.created_at).toLocaleString('ru-RU');
          html += '<div class="mkz-message-row ' + (isMine ? 'mkz-message-row--me' : 'mkz-message-row--them') + '">';
          html += '<div class="mkz-message ' + (isMine ? 'mkz-message--me' : 'mkz-message--them') + '">';
          html += '<div class="mkz-message__text">' + content + '</div>';
          html += '<div class="mkz-message__footer"><span class="mkz-message__time">' + time + '</span></div>';
          html += '</div></div>';
        }
        msgContainer.innerHTML = html;
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }
    }
  } catch (err) {
    console.error('openConversation error:', err);
  }
}
  function renderConversationMessage(message) {
    const isOutgoing = String(message.user_id) === String(state.currentSession?.user?.id) && message.sender_mode !== 'support_brand';
    const author = getMessageAuthorIdentity(message);
    const authorName = safeText(author?.username || (isOutgoing ? 'Вы' : 'Mark1z Design'), isOutgoing ? 'Вы' : 'Mark1z Design');
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

  async function startPollingMessages() {
    if (state.messagesPolling) return;
    console.log('🔄 Запуск polling (проверка каждые 3 секунды)');
    state.messagesPolling = setInterval(async () => {
      if (!state.currentSession?.user) return;
      if (!state.conversations.length) return;
      const lastMessageTime = state.conversationMessages.length > 0 ? state.conversationMessages[state.conversationMessages.length - 1]?.created_at : new Date(0).toISOString();
      const { data: newMessages, error } = await supabaseClient.from('conversation_messages').select('*').gt('created_at', lastMessageTime).in('conversation_id', state.conversations.map(c => c.id));
      if (error) { console.error('Polling error:', error); return; }
      if (newMessages && newMessages.length > 0) {
        console.log('📨 Найдено новых сообщений (polling):', newMessages.length);
        state.conversationMessages = [...state.conversationMessages, ...newMessages];
        await renderMessengerDialogs();
        if (state.currentConversationId) await openConversation(state.currentConversationId, true);
      }
    }, 3000);
  }

  // ========== ФУНКЦИИ ПОДДЕРЖКИ ==========
  async function loadSupportDialogs() {
    const container = document.getElementById('mkzSupportDialogsList');
    if (!container) return;
    showLoading('Загрузка диалогов...');
    try {
      const supportConversations = state.conversations.filter(c => c.is_support === true);
      if (!supportConversations.length) { container.innerHTML = '<div class="mkz-card"><p>Нет сообщений в поддержку</p></div>'; hideLoading(); return; }
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
        return { conversationId: conv.id, username: userProfile?.username || 'Пользователь', avatarUrl: userProfile?.avatar_url, lastMessageText: lastMessage?.text || lastMessage?.attachment_name || 'Вложение', lastMessageTime: lastMessage?.created_at, unreadCount };
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
      $$('.mkz-support-dialog-card', container).forEach(card => { card.addEventListener('click', () => { openConversation(card.dataset.conversationId); openScreen('messenger'); }); });
    } catch (err) { console.error('loadSupportDialogs error:', err); container.innerHTML = '<div class="mkz-card"><p>Ошибка загрузки диалогов</p></div>'; } finally { hideLoading(); }
  }

  function initSupportDialogsButton() { const btn = document.getElementById('mkzOpenSupportChatsBtn'); if (btn) btn.addEventListener('click', async () => { await loadSupportDialogs(); openScreen('support-dialogs'); }); }
  function initSupportDialogsBackButton() { const backBtn = document.getElementById('mkzBackToAdminBtn'); if (backBtn) backBtn.addEventListener('click', () => openScreen('account')); }

    // ========== БЫСТРЫЙ РЕНДЕР СООБЩЕНИЙ (без перезагрузки) ==========
  function clearMessengerAttachment() { 
  state.pendingMessengerAttachment = null; 
  if (messengerImageInput) messengerImageInput.value = ''; 
  if (messengerFileInput) messengerFileInput.value = ''; 
  if (messengerAttachMeta) messengerAttachMeta.textContent = ''; 
}
  
      function renderMessagesList() {
    if (!messengerMessages) return;
    var currentMyId = state.currentProfile?.id || state.currentSession?.user?.id;

    if (!state.conversationMessages.length) {
      messengerMessages.innerHTML = '<div class="mkz-messenger-empty"><p style="text-align:center;color:rgba(255,255,255,0.5);">💬 Сообщений пока нет</p></div>';
      return;
    }

    messengerMessages.innerHTML = state.conversationMessages.map(function(msg) {
      var isMine = msg.sender_id === currentMyId;
      var content = nl2brSafe(msg.content || '');
      var time = formatDateTime(msg.created_at);
      var edited = msg.is_edited ? ' (изм.)' : '';
      var pending = msg._pending ? ' (отправка...)' : '';
      
      var authorName = '';
      if (!isMine) {
        var author = getMessageAuthorIdentity(msg);
        authorName = '<div class="mkz-message__title">' + escapeHtml(author?.username || 'Пользователь') + '</div>';
      }

      var rowClass = isMine ? 'mkz-message-row--me' : 'mkz-message-row--them';
      var msgClass = isMine ? 'mkz-message--me' : 'mkz-message--them';

      var attachmentHtml = '';
      if (msg.file_url) {
        attachmentHtml = '<div class="mkz-message__image"><img src="' + safeUrl(msg.file_url) + '" alt="Изображение"></div>';
      }

      return '<div class="mkz-message-row ' + rowClass + '">' +
        '<div class="mkz-message ' + msgClass + '" data-message-id="' + msg.id + '">' +
          authorName +
          (content ? '<div class="mkz-message__text">' + content + '</div>' : '') +
          attachmentHtml +
          '<div class="mkz-message__footer">' +
            '<span class="mkz-message__time">' + time + edited + pending + '</span>' +
            (isMine && !msg._pending ? '<span class="mkz-message__actions"><button class="mkz-message__icon-btn" data-edit-message="' + msg.id + '" title="Редактировать"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button><button class="mkz-message__icon-btn" data-delete-message="' + msg.id + '" title="Удалить"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button></span>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    messengerMessages.scrollTop = messengerMessages.scrollHeight;
  }

  // ========== ОТПРАВКА СООБЩЕНИЯ В ЧАТ ==========
  async function sendMessengerMessage() {
    if (!state.currentSession || !state.currentSession.user) {
      showNotification('Войдите в аккаунт', 'warning');
      return;
    }
    if (!state.currentConversationId) {
      showNotification('Выберите диалог', 'warning');
      return;
    }

    var content = messengerInput ? messengerInput.value.trim() : '';
    var hasAttachment = !!(state.pendingMessengerAttachment && state.pendingMessengerAttachment.attachment_url);

    if (!content && !hasAttachment) {
      showNotification('Введите сообщение или прикрепите файл', 'warning');
      return;
    }

    setButtonState(messengerSendBtn, true, '...', 'Отправить');

    if (messengerInput) messengerInput.value = '';
    var tempAttachment = state.pendingMessengerAttachment;
    clearMessengerAttachment();

    var tempId = 'temp_' + Date.now();
    var tempMsg = {
      id: tempId,
      chat_id: state.currentConversationId,
      sender_id: state.currentSession.user.id,
      content: content || '',
      type: tempAttachment ? (tempAttachment.attachment_type && tempAttachment.attachment_type.startsWith('image/') ? 'image' : 'file') : 'text',
      file_url: tempAttachment ? tempAttachment.attachment_url || null : null,
      created_at: new Date().toISOString(),
      is_edited: false,
      _pending: true
    };

    state.conversationMessages.push(tempMsg);
    renderMessagesList();

        try {
      var payload = {
        chat_id: state.currentConversationId,
        sender_id: state.currentSession.user.id,
        content: content || '',
        type: 'text'
      };

      // Отправляем через fetch вместо supabaseClient
      var result = await fetch('https://jtokctxkrojiggjckwfn.supabase.co/rest/v1/messages', {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_jDgy-GUNpSSnPjsp2FQXAA_-m5NIehW',
          'Authorization': 'Bearer ' + state.currentSession.access_token,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
      
      if (!result.ok) {
        var errData = await result.json();
        throw new Error(errData.message || 'Ошибка отправки');
      }
      
      var resultData = await result.json();
      
      var idx = state.conversationMessages.findIndex(function(m) { return m.id === tempId; });
      if (idx >= 0 && resultData && resultData[0]) {
        state.conversationMessages[idx] = resultData[0];
      }
      renderMessagesList();
      await renderMessengerDialogs();

    } catch (err) {
      state.conversationMessages = state.conversationMessages.filter(function(m) { return m.id !== tempId; });
      renderMessagesList();
      showNotification('Ошибка при отправке: ' + err.message, 'error');
    } finally {
      setButtonState(messengerSendBtn, false, '...', 'Отправить');
    }
  }

  // ========== BIND STATIC EVENTS ==========
  function bindStaticEvents() {
    if (burger && nav) burger.addEventListener('click', () => { nav.classList.toggle('is-open'); });
    navButtons.forEach(btn => { btn.addEventListener('click', () => { openScreen(btn.dataset.screenOpen); }); });
    if (userPillButton) userPillButton.addEventListener('click', () => openScreen('account'));
    if (openOrderModal) openOrderModal.addEventListener('click', showOrderModal);
    if (closeOrderModal) closeOrderModal.addEventListener('click', hideOrderModal);
    if (orderBackdrop) orderBackdrop.addEventListener('click', hideOrderModal);
    if (closeReviewPopup) closeReviewPopup.addEventListener('click', hideReviewPopup);
    if (reviewPopupBackdrop) reviewPopupBackdrop.addEventListener('click', hideReviewPopup);
    if (closeImageModal) closeImageModal.addEventListener('click', hideImageModal);
    if (imageModalBackdrop) imageModalBackdrop.addEventListener('click', hideImageModal);
    if (backToFolders) backToFolders.addEventListener('click', showFoldersList);
    if (quickAddFolderBtn) quickAddFolderBtn.addEventListener('click', () => { folderTitle?.focus(); ownerPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if (quickAddWorkBtn) quickAddWorkBtn.addEventListener('click', () => { if (state.currentOpenedFolderId && portfolioFolderSelect) portfolioFolderSelect.value = state.currentOpenedFolderId; portfolioTitle?.focus(); ownerPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if (attachImageBtn && newsImage) attachImageBtn.addEventListener('click', () => newsImage.click());
    if (attachFileBtn && newsExtraFile) attachFileBtn.addEventListener('click', () => newsExtraFile.click());
    if (togglePollBtn && pollPanel) togglePollBtn.addEventListener('click', () => { pollPanel.style.display = pollPanel.style.display === 'none' ? 'block' : 'none'; togglePollBtn.classList.toggle('is-active', pollPanel.style.display !== 'none'); });
    if (toggleContestBtn && contestPanel) toggleContestBtn.addEventListener('click', () => { contestPanel.style.display = contestPanel.style.display === 'none' ? 'block' : 'none'; toggleContestBtn.classList.toggle('is-active', contestPanel.style.display !== 'none'); });
    if (toggleLinkBtn && linkPanel) toggleLinkBtn.addEventListener('click', () => { linkPanel.style.display = linkPanel.style.display === 'none' ? 'block' : 'none'; toggleLinkBtn.classList.toggle('is-active', linkPanel.style.display !== 'none'); });
    if (togglePinBtn) togglePinBtn.addEventListener('click', () => { state.isPinnedDraft = !state.isPinnedDraft; togglePinBtn.classList.toggle('is-active', state.isPinnedDraft); });
    if (faqFab) faqFab.addEventListener('click', () => openScreen('faq'));
        if (chatFab) chatFab.addEventListener('click', async () => { 
      if (!state.currentSession) { openScreen('account'); return; } 
      openScreen('messenger'); 
      await renderMessengerDialogs();
    });
    stars.forEach(star => { star.addEventListener('click', () => { state.currentRating = Number(star.dataset.rating); renderStars(state.currentRating); }); });
    aboutTabs.forEach(tab => { tab.addEventListener('click', () => { aboutTabs.forEach(item => item.classList.remove('is-active')); aboutPanels.forEach(item => item.classList.remove('is-active')); tab.classList.add('is-active'); document.querySelector(`[data-about-panel="${tab.dataset.aboutTab}"]`)?.classList.add('is-active'); }); });
    if (showLoginBtn && showRegisterBtn && loginForm && registerForm) {
      showLoginBtn.addEventListener('click', () => { showLoginBtn.classList.add('is-active'); showRegisterBtn.classList.remove('is-active'); loginForm.style.display = 'block'; registerForm.style.display = 'none'; });
      showRegisterBtn.addEventListener('click', () => { showRegisterBtn.classList.add('is-active'); showLoginBtn.classList.remove('is-active'); loginForm.style.display = 'none'; registerForm.style.display = 'block'; });
    }
    loginForm?.addEventListener('submit', async e => { e.preventDefault(); await handleLogin(); });
    registerForm?.addEventListener('submit', async e => { e.preventDefault(); await handleRegister(); });
    reviewForm?.addEventListener('submit', async e => { e.preventDefault(); await handleReviewSend(); });
    faqAskForm?.addEventListener('submit', async e => { e.preventDefault(); await handleFaqAsk(); });
    folderAdminForm?.addEventListener('submit', async e => { e.preventDefault(); await handleAddFolder(); });
    folderEditForm?.addEventListener('submit', async e => { e.preventDefault(); await handleEditFolderCover(); });
    portfolioAdminForm?.addEventListener('submit', async e => { e.preventDefault(); await handleAddPortfolioItem(); });
    portfolioEditForm?.addEventListener('submit', async e => { e.preventDefault(); await handleEditWork(); });
    if (newsAddBtn) newsAddBtn.addEventListener('click', handleAddNewsPost);
    if (updateProfileBtn) updateProfileBtn.addEventListener('click', handleUpdateProfile);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (peopleSearchBtn) peopleSearchBtn.addEventListener('click', async () => { await searchPeople(peopleSearchInput?.value || ''); });
    if (peopleSearchInput) peopleSearchInput.addEventListener('input', debounce(async (e) => { await searchPeople(e.target.value); }, 300));
    if (backToPeopleBtn) backToPeopleBtn.addEventListener('click', () => openScreen('people'));
    if (updateBioBtn) updateBioBtn.addEventListener('click', saveUserBio);

    // ========== КНОПКА «НАПИСАТЬ» ИЗ ПРОФИЛЯ (ФИКС 2 В 1: нет дублей + проверки) ==========
    if (openProfileMessengerBtn) {
      // Убираем старые обработчики
      const newBtn = openProfileMessengerBtn.cloneNode(true);
      openProfileMessengerBtn.parentNode.replaceChild(newBtn, openProfileMessengerBtn);
      
      newBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔘 Кнопка НАПИСАТЬ нажата');
        
        // Проверяем авторизацию
        if (!state.currentSession) {
          showNotification('Сначала войди в аккаунт', 'warning');
          openScreen('account');
          return;
        }

        const targetUserId = this.getAttribute('data-user-id');
        console.log('📌 targetUserId из кнопки:', targetUserId);
        
        if (!targetUserId) {
          showNotification('Профиль не найден. Пожалуйста, обновите страницу.', 'error');
          return;
        }

        const myId = String(state.currentSession.user.id);
        console.log('👤 myId:', myId);
        
        if (targetUserId === myId) {
          showNotification('Вы не можете написать сами себе', 'info');
          return;
        }

                showLoading('Открываем чат...');
        
        try {
          // 1. Сначала ищем существующий чат
          var existingId = await findExistingConversation(targetUserId);
          if (existingId) {
            var checkMember = await supabaseClient.from('chat_members').select('*').eq('chat_id', existingId).eq('user_id', myId);
            if (!checkMember.data || checkMember.data.length === 0) {
              existingId = null;
            }
          }
          
          if (existingId) {
            console.log('✅ Найден существующий чат:', existingId);
            openScreen('messenger');
            await renderMessengerDialogs();
            await openConversation(existingId);
            return;
          }
          
          // 2. Если не нашли — создаём новый
          console.log('🆕 Создаём новый чат');
          
          var newChatId = crypto.randomUUID();
          var createChatRes = await fetch('https://jtokctxkrojiggjckwfn.supabase.co/rest/v1/chats', {
            method: 'POST',
            headers: {
              'apikey': 'sb_publishable_jDgy-GUNpSSnPjsp2FQXAA_-m5NIehW',
              'Authorization': 'Bearer ' + state.currentSession.access_token,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ id: newChatId, is_group: false })
          });
          
          var chatResText = await createChatRes.text();
          console.log('Статус chats:', createChatRes.status, 'Ответ:', chatResText);
          
          if (!createChatRes.ok) {
            console.error('❌ Ошибка создания чата:', chatResText);
            throw new Error('Ошибка создания чата: ' + createChatRes.status);
          }
          
          console.log('💬 Чат создан:', newChatId);
          
          // 3. Добавляем участников
          var addMembersRes = await fetch('https://jtokctxkrojiggjckwfn.supabase.co/rest/v1/chat_members', {
            method: 'POST',
            headers: {
              'apikey': 'sb_publishable_jDgy-GUNpSSnPjsp2FQXAA_-m5NIehW',
              'Authorization': 'Bearer ' + state.currentSession.access_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify([
              { chat_id: newChatId, user_id: myId },
              { chat_id: newChatId, user_id: targetUserId }
            ])
          });
          
          if (!addMembersRes.ok) {
            var membErr = await addMembersRes.json();
            console.error('❌ Ошибка добавления участников:', membErr);
            await fetch('https://jtokctxkrojiggjckwfn.supabase.co/rest/v1/chats?id=eq.' + newChatId, {
              method: 'DELETE',
              headers: { 'apikey': 'sb_publishable_jDgy-GUNpSSnPjsp2FQXAA_-m5NIehW', 'Authorization': 'Bearer ' + state.currentSession.access_token }
            });
            throw new Error('Ошибка добавления участников');
          }
          
          openScreen('messenger');
          await renderMessengerDialogs();
          await openConversation(newChatId);
          
        } catch (err) {
          console.error('❌ Полная ошибка:', err);
          showNotification('Ошибка: ' + err.message, 'error');
        } finally {
          hideLoading();
        }
      });
    }

    if (messengerAttachImageBtn && messengerImageInput) messengerAttachImageBtn.addEventListener('click', () => messengerImageInput.click());
    if (messengerAttachFileBtn && messengerFileInput) messengerAttachFileBtn.addEventListener('click', () => messengerFileInput.click());
    if (messengerForm) messengerForm.addEventListener('submit', async e => { e.preventDefault(); await sendMessengerMessage(); });
    if (pinnedOwnerChatBtn) pinnedOwnerChatBtn.addEventListener('click', async function() { 
      if (!state.currentSession) { openScreen('account'); return; } 
      state.supportConversationId = 'daba25cb-e4e2-44b3-be59-36f0f5e38ce5';
      openScreen('messenger');
      await renderMessengerDialogs();
      await openConversation('daba25cb-e4e2-44b3-be59-36f0f5e38ce5');
    });
    if (messengerRefreshBtn) messengerRefreshBtn.addEventListener('click', async () => { await fetchMessengerData(); await renderMessengerDialogs(); if (state.currentConversationId) await openConversation(state.currentConversationId, true); });
    
                // ========== ОТПРАВКА ПО ENTER ==========
    if (messengerInput) {
      messengerInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          var form = document.getElementById('mkzMessengerForm');
          if (form) {
            form.dispatchEvent(new Event('submit'));
          }
        }
      });
    }

    // ========== РЕДАКТИРОВАНИЕ СООБЩЕНИЯ ==========
    document.addEventListener('click', async function(e) {
      var editBtn = e.target.closest('[data-edit-message]');
      if (!editBtn) { return; }
      e.stopPropagation();
      
      var messageId = editBtn.getAttribute('data-edit-message');
      var msg = null;
      for (var i = 0; i < state.conversationMessages.length; i++) {
        if (state.conversationMessages[i].id === messageId) {
          msg = state.conversationMessages[i];
          break;
        }
      }
      if (!msg) { return; }
      
      var newText = prompt('Редактировать сообщение:', msg.content || '');
      if (newText === null || newText.trim() === String(msg.content || '')) { return; }
      if (!newText.trim()) {
        showNotification('Сообщение не может быть пустым', 'warning');
        return;
      }
      
      var result = await supabaseClient
        .from('messages')
        .update({ content: newText.trim(), is_edited: true })
        .eq('id', messageId);
      
      if (result.error) {
        showNotification('Ошибка редактирования', 'error');
        return;
      }
      
      msg.content = newText.trim();
      msg.is_edited = true;
      await openConversation(state.currentConversationId, true);
      showNotification('Сообщение изменено', 'success');
    });

       // ========== УДАЛЕНИЕ СООБЩЕНИЯ ==========
    document.addEventListener('click', async function(e) {
      var deleteBtn = e.target.closest('[data-delete-message]');
      if (!deleteBtn) { return; }
      e.stopPropagation();
      
      var messageId = deleteBtn.getAttribute('data-delete-message');
      
      if (!confirm('Удалить это сообщение?')) { return; }
      
      var result = await supabaseClient
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (result.error) {
        showNotification('Ошибка удаления', 'error');
        return;
      }
      
      var newMessages = [];
      for (var i = 0; i < state.conversationMessages.length; i++) {
        if (state.conversationMessages[i].id !== messageId) {
          newMessages.push(state.conversationMessages[i]);
        }
      }
      state.conversationMessages = newMessages;
      await openConversation(state.currentConversationId, true);
      showNotification('Сообщение удалено', 'success');
    });
        initSupportDialogsButton();
    initSupportDialogsBackButton();
  }

  // ========== CSS STYLING ==========
  var style = document.createElement('style');
    style.textContent = '.mkz-support-mode-selector{background:linear-gradient(135deg,rgba(255,47,174,0.1),rgba(122,60,255,0.1));border-radius:20px;padding:14px;margin-bottom:16px;border:1px solid rgba(255,255,255,0.1)}.mkz-message{display:flex;margin-bottom:8px}.mkz-msg-mine{justify-content:flex-end}.mkz-msg-notmine{justify-content:flex-start}.mkz-msg-bubble{max-width:75%;padding:10px 14px;border-radius:18px;word-break:break-word}.mkz-msg-mine .mkz-msg-bubble{background:linear-gradient(135deg,#7a3cff,#ff2fae);color:#fff;border-bottom-right-radius:4px}.mkz-msg-notmine .mkz-msg-bubble{background:rgba(255,255,255,0.12);color:#fff;border-bottom-left-radius:4px}.mkz-msg-meta{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:4px}.mkz-msg-time{font-size:0.7em;opacity:0.6}.mkz-msg-actions{display:none;gap:4px;margin-left:8px}.mkz-msg-bubble:hover .mkz-msg-actions{display:inline-flex}.mkz-msg-btn{background:none;border:none;cursor:pointer;font-size:14px;padding:2px 4px;border-radius:6px;opacity:0.7}.mkz-msg-btn:hover{opacity:1;background:rgba(255,255,255,0.15)}.mkz-msg-btn-del:hover{color:#ff4d4d}.mkz-msg-btn-edit:hover{color:#ffb800}.mkz-msg-author{font-size:0.75em;font-weight:600;margin-bottom:2px;opacity:0.8;padding-left:4px}.mkz-loading-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);display:none;justify-content:center;align-items:center;flex-direction:column;z-index:10000}.mkz-loading-spinner{width:50px;height:50px;border:4px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:mkz-spin 0.8s linear infinite}@keyframes mkz-spin{to{transform:rotate(360deg)}}.mkz-loading-message{color:#fff;margin-top:20px;font-size:14px}';

  // ========== INIT ==========
  (async function init() {
    await fetchSessionAndProfile();
    await Promise.all([cacheProfiles(), renderPortfolio(), renderReviews(), renderNews(), renderFaqQuestions(), renderContestEntriesAdmin(), searchPeople(), renderMessengerDialogs()]);
    await loadUserBio();
    bindStaticEvents();   
    supabaseClient.auth.onAuthStateChange(function(_event, session) {
      state.currentSession = session || null;
      if (state.currentSession) {
        startPresenceHeartbeat();
        updatePresence(true);
      } else {
        stopPresenceHeartbeat();
      }
      setTimeout(async function() {
        await fetchSessionAndProfile();
        await loadUserBio();
        await Promise.all([cacheProfiles(), renderPortfolio(), renderReviews(), renderNews(), renderFaqQuestions(), renderContestEntriesAdmin(), searchPeople(), renderMessengerDialogs()]);
      }, 0);
    });
    document.addEventListener('visibilitychange', async function() {
      await updatePresence(!document.hidden);
    });
    window.addEventListener('beforeunload', function() {
      updatePresence(false);
    });
  })();

})();

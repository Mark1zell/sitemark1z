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

  // Не ломает сайт, если кнопок для голосовых пока нет в HTML
  const messengerVoiceBtn = $('#mkzMessengerVoiceBtn');
  const messengerVoiceStopBtn = $('#mkzMessengerVoiceStopBtn');

  const state = {
    currentSession: null,
    currentProfile: null,
    currentRating: 5,
    currentOpenedFolderId: null,

    folders: [],
    items: [],

    reviews: [],
    reviewLikes: [],
    reviewReplies: [],

    newsPosts: [],
    newsLikes: [],
    newsComments: [],
    newsPolls: [],
    newsPollOptions: [],
    newsPollVotes: [],
    contests: [],
    contestEntries: [],

    faqQuestions: [],
    peopleSearchResults: [],
    allProfilesCache: [],
    openedProfile: null,

    conversations: [],
    conversationMembers: [],
    conversationMessages: [],
    currentConversationId: null,
    supportConversationId: null,

    userLikedPosts: new Set(),
    newsLikesMap: {},
    newsCommentsMap: {},

    profileSyncInProgress: false,
    isPinnedDraft: false,

    pendingMessengerAttachment: null,
    messengerPollingTimer: null,
    knownMessageIds: new Set(),
    notificationsReady: false,
    initialMessagesHydrated: false,

    mediaRecorder: null,
    mediaChunks: [],
    voiceStream: null
  };

  function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeText(value, fallback = '') {
  const prepared = String(value ?? '').trim();
  return prepared ? escapeHtml(prepared) : fallback;
}

function safeUrl(value) {
  const prepared = String(value ?? '').trim();
  if (!prepared) return '';
  return prepared.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function nl2brSafe(value) {
  return safeText(value || '', '').replace(/\n/g, '<br>');
}

  function getInitial(name, fallback = 'Г') {
    return String(name || fallback).trim().charAt(0).toUpperCase() || fallback;
  }

  function formatDateTime(value) {
    if (!value) return 'Без даты';
    try {
      return new Date(value).toLocaleString('ru-RU');
    } catch {
      return String(value);
    }
  }

  function formatDateOnly(value) {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString('ru-RU');
    } catch {
      return String(value);
    }
  }

  function pluralRu(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
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
    return String(text || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function isOwner() {
    return !!(state.currentSession?.user?.id === OWNER_UID);
  }

  function isSupportConversation(conversationId) {
    return String(conversationId) === String(state.supportConversationId);
  }

  function getMessageAuthorIdentity(message) {
    if (message?.sender_mode === 'support_brand') {
      return SUPPORT_CHAT_IDENTITY;
    }
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
    if (existing) return existing.startsWith('#') ? existing : '#' + existing;
    const digits = String(userId || '').replace(/\D/g, '');
    return '#' + (digits.slice(-7).padStart(7, '0') || '0000001');
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
    if (profile.is_online) return 'В сети';
    if (!isProfileFieldVisible(profile, 'show_last_seen')) return 'Статус скрыт';
    return formatLastSeen(profile.last_seen_at);
  }

  async function uploadToBucket(bucket, file, prefix) {
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const path = `${prefix}_${Date.now()}.${ext}`;

    const { error } = await supabaseClient.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  }

  async function uploadMessengerAttachment(file) {
    const upload = await uploadToBucket('chat-files', file, `chat_${state.currentSession.user.id}`);
    return {
      attachment_url: upload.publicUrl,
      attachment_name: file.name || '',
      attachment_type: file.type || ''
    };
  }

  function openScreen(name) {
    screens.forEach(screen => {
      screen.classList.toggle('mkz-screen--active', screen.dataset.screen === name);
    });

    $$('.mkz-nav__link, .mkz-bottom-nav__item').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.screenOpen === name);
    });

    if (nav) nav.classList.remove('is-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showOrderModal() {
    if (!orderModal) return;
    orderModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function hideOrderModal() {
    if (!orderModal) return;
    orderModal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showReviewPopup(review) {
    if (!reviewPopup || !popupReviewContent) return;

    const username = safeText(review.profile?.username || 'Пользователь', 'Пользователь');
    const text = nl2brSafe(review.text || '');
    const avatarUrl = safeUrl(review.profile?.avatar_url || '');
    const imageUrl = safeUrl(review.image_url || '');

    popupReviewContent.innerHTML = `
      <div class="mkz-popup-review__top">
        <div class="mkz-review-author__avatar" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">
          ${avatarUrl ? '' : getInitial(review.profile?.username, 'Г')}
        </div>
        <div>
          <div class="mkz-popup-review__name">${username}</div>
          <div class="mkz-popup-review__stars">${'★'.repeat(Number(review.rating || 0))}${'☆'.repeat(5 - Number(review.rating || 0))}</div>
        </div>
      </div>
      <div class="mkz-popup-review__text">${text}</div>
      ${imageUrl ? `<div class="mkz-popup-review__image"><img src="${imageUrl}" alt="Отзыв"></div>` : ''}
    `;

    reviewPopup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function hideReviewPopup() {
    if (!reviewPopup) return;
    reviewPopup.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showImageModal(src, title = '') {
    if (!imageModal || !popupImageWrap) return;
    popupImageWrap.innerHTML = `<img src="${safeUrl(src)}" alt="${safeText(title || 'Изображение', 'Изображение')}">`;
    if (popupImageTitle) popupImageTitle.textContent = title || '';
    imageModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function hideImageModal() {
    if (!imageModal) return;
    imageModal.classList.remove('is-open');
    if (popupImageWrap) popupImageWrap.innerHTML = '';
    if (popupImageTitle) popupImageTitle.textContent = '';
    document.body.style.overflow = '';
  }

  function renderStars(active) {
    stars.forEach(star => {
      star.classList.toggle('is-active', Number(star.dataset.rating) <= active);
    });
  }

  function clearMessengerAttachment() {
    state.pendingMessengerAttachment = null;
    if (messengerImageInput) messengerImageInput.value = '';
    if (messengerFileInput) messengerFileInput.value = '';
    if (messengerAttachMeta) messengerAttachMeta.textContent = '';
  }

  function renderMessengerAttachmentMeta() {
    if (!messengerAttachMeta) return;
    if (!state.pendingMessengerAttachment) {
      messengerAttachMeta.textContent = '';
      return;
    }

    const file = state.pendingMessengerAttachment.file;
    const label = state.pendingMessengerAttachment.kind === 'image'
      ? 'Фото'
      : state.pendingMessengerAttachment.kind === 'voice'
      ? 'Голосовое'
      : 'Файл';

    messengerAttachMeta.textContent = `${label}: ${file.name}`;
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

    if (privacyShowPhone) privacyShowPhone.checked = profile?.show_phone !== false;
    if (privacyShowTelegram) privacyShowTelegram.checked = profile?.show_telegram !== false;
    if (privacyShowLastSeen) privacyShowLastSeen.checked = profile?.show_last_seen !== false;

    updateAuthUI();
  }

  async function readProfileByUserId(userId) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) return null;
      return data || null;
    } catch {
      return null;
    }
  }

  async function ensureProfileForCurrentUser(baseData) {
    if (!state.currentSession?.user) return null;
    if (state.profileSyncInProgress) return state.currentProfile || null;

    state.profileSyncInProgress = true;

    try {
      const userId = state.currentSession.user.id;
      const existing = await readProfileByUserId(userId);

      const fallbackName =
        baseData?.username ||
        state.currentSession.user.user_metadata?.username ||
        state.currentSession.user.email?.split('@')[0] ||
        'Пользователь';

      const publicId = String(userId) === String(OWNER_UID)
        ? '#Mark1z'
        : (existing?.public_id || existing?.user_code || buildPublicUserCode(null, userId));

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
        is_online: true,
        last_seen_at: new Date().toISOString(),
        show_phone: existing?.show_phone ?? true,
        show_telegram: existing?.show_telegram ?? true,
        show_last_seen: existing?.show_last_seen ?? true
      };

      const { error } = await supabaseClient.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.error('ensureProfileForCurrentUser upsert error', error);
      }

      const afterInsert = await readProfileByUserId(userId);
      state.currentProfile = afterInsert || payload;
      return state.currentProfile;
    } finally {
      state.profileSyncInProgress = false;
    }
  }

  async function updatePresence(isOnline) {
    if (!state.currentSession?.user) return;
    try {
      await supabaseClient
        .from('profiles')
        .update({
          is_online: !!isOnline,
          last_seen_at: new Date().toISOString()
        })
        .eq('id', state.currentSession.user.id);
    } catch {}
  }

  async function touchCurrentProfileActivity() {
    if (!state.currentSession?.user) return;
    try {
      await supabaseClient
        .from('profiles')
        .update({
          is_online: !document.hidden,
          last_seen_at: new Date().toISOString()
        })
        .eq('id', state.currentSession.user.id);
    } catch {}
  }

  async function fetchSessionAndProfile(baseData) {
    try {
      const { data: sessionData, error } = await supabaseClient.auth.getSession();

      if (error) {
        state.currentSession = null;
        state.currentProfile = null;
        renderProfile();
        return;
      }

      state.currentSession = sessionData?.session || null;

      if (!state.currentSession) {
        state.currentProfile = null;
        renderProfile();
        return;
      }

      state.currentProfile = await ensureProfileForCurrentUser(baseData);
      renderProfile();
      await touchCurrentProfileActivity();
    } catch (err) {
      console.error(err);
      renderProfile();
    }
  }

  async function cacheProfiles() {
    try {
      const { data } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      state.allProfilesCache = data || [];
    } catch {
      state.allProfilesCache = [];
    }
  }

  function renderPortfolioSelects() {
    if (portfolioFolderSelect) {
      portfolioFolderSelect.innerHTML = state.folders
        .map(folder => `<option value="${folder.id}">${safeText(folder.title, 'Папка')}</option>`)
        .join('');
    }

    if (editFolderSelect) {
      editFolderSelect.innerHTML = state.folders
        .map(folder => `<option value="${folder.id}">${safeText(folder.title, 'Папка')}</option>`)
        .join('');
    }

    if (editWorkSelect) {
      editWorkSelect.innerHTML = state.items
        .map(item => `<option value="${item.id}">${safeText(item.title || 'Работа', 'Работа')}</option>`)
        .join('');
    }
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
    alert('Работа подставлена в форму редактирования.');
  }

  function openFolder(folderId) {
    state.currentOpenedFolderId = folderId;
    const folder = state.folders.find(item => String(item.id) === String(folderId));
    if (!folder) return;

    const works = state.items.filter(item => String(item.folder_id) === String(folder.id));
    if (currentFolderTitle) currentFolderTitle.textContent = folder.title || 'Папка';

    if (currentFolderWorks) {
      currentFolderWorks.innerHTML = works.length ? `
        <div class="mkz-portfolio-grid">
          ${works.map(item => `
            <article class="mkz-work-card">
              <div class="mkz-work-card__image">
                <img src="${safeUrl(item.image_url || '')}" alt="${safeText(item.title || 'Работа', 'Работа')}">
                ${isOwner() ? `
                  <div class="mkz-work-card__admin-overlay">
                    <button class="mkz-admin-icon" type="button" data-edit-work-inline="${item.id}">✎</button>
                    <button class="mkz-admin-icon" type="button" data-delete-work="${item.id}">✕</button>
                  </div>
                ` : ''}
              </div>
              <div class="mkz-work-card__body">
                <h3>${safeText(item.title || 'Без названия', 'Без названия')}</h3>
                <p>${safeText(item.description || '', '')}</p>
              </div>
            </article>
          `).join('')}
        </div>
      ` : `<div class="mkz-card"><p>В этой папке пока нет работ.</p></div>`;
    }

    if (folderBrowserList) folderBrowserList.style.display = 'none';
    if (folderInside) folderInside.style.display = 'block';
    updateAuthUI();
  }

  async function renderPortfolio() {
    try {
      const { data: folders } = await supabaseClient
        .from('portfolio_folders')
        .select('*')
        .order('sort_order', { ascending: true });

      const { data: items } = await supabaseClient
        .from('portfolio_items')
        .select('*')
        .order('sort_order', { ascending: true });

      state.folders = folders || [];
      state.items = items || [];

      if (portfolioCount) portfolioCount.textContent = String(state.items.length);
      if (!folderGrid) return;

      if (!state.folders.length) {
        folderGrid.innerHTML = '<div class="mkz-card"><h3>Папок пока нет</h3><p>Портфолио скоро появится.</p></div>';
        renderPortfolioSelects();
        showFoldersList();
        return;
      }

      folderGrid.innerHTML = state.folders.map(folder => {
        const worksCount = state.items.filter(item => String(item.folder_id) === String(folder.id)).length;
        const cover = safeUrl(folder.cover_image_url || '');

        return `
          <button class="mkz-folder" type="button" data-folder-open="${folder.id}">
            ${cover ? `<span class="mkz-folder__bg" style="background-image:url('${cover}')"></span>` : ''}
            <span class="mkz-folder__overlay"></span>
            <span class="mkz-folder__content">
              <span class="mkz-folder__icon">📁</span>
              <span class="mkz-folder__title">${safeText(folder.title, 'Папка')}</span>
              <span class="mkz-folder__count">${worksCount} работ</span>
            </span>
          </button>
        `;
      }).join('');

      $$('[data-folder-open]', folderGrid).forEach(btn => {
        btn.addEventListener('click', () => openFolder(btn.dataset.folderOpen));
      });

      renderPortfolioSelects();

      if (state.currentOpenedFolderId) {
        openFolder(state.currentOpenedFolderId);
      } else {
        showFoldersList();
      }
    } catch (err) {
      console.error('renderPortfolio error', err);
    }
  }

  async function renderReviews() {
    try {
      const { data: reviews } = await supabaseClient
        .from('reviews')
        .select('*, profiles:user_id ( * )')
        .order('created_at', { ascending: false });

      const { data: likes } = await supabaseClient
        .from('review_likes')
        .select('*');

      const { data: replies } = await supabaseClient
        .from('review_replies')
        .select('*, profiles:user_id ( * )')
        .order('created_at', { ascending: true });

      state.reviews = (reviews || []).map(r => ({ ...r, profile: r.profiles }));
      state.reviewLikes = likes || [];
      state.reviewReplies = (replies || []).map(r => ({ ...r, profile: r.profiles }));

      if (!reviewsList) return;

      if (!state.reviews.length) {
        reviewsList.innerHTML = '<div class="mkz-card"><h3>Пока нет отзывов</h3><p>Стань первым, кто оставит отзыв.</p></div>';
        if (averageRating) averageRating.textContent = '5.0';
        if (averageRatingTop) averageRatingTop.textContent = '5.0';
        return;
      }

      const avg = (
        state.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / state.reviews.length
      ).toFixed(1);

      if (averageRating) averageRating.textContent = avg;
      if (averageRatingTop) averageRatingTop.textContent = avg;

      reviewsList.innerHTML = state.reviews.map(item => {
        const avatarUrl = safeUrl(item.profile?.avatar_url || '');
        const username = safeText(item.profile?.username || 'Пользователь', 'Пользователь');
        const text = nl2brSafe(item.text || '');
        const imageUrl = safeUrl(item.image_url || '');
        const likesCount = state.reviewLikes.filter(l => String(l.review_id) === String(item.id)).length;

        const likedByUser = !!(
          state.currentSession &&
          state.reviewLikes.some(
            l =>
              String(l.review_id) === String(item.id) &&
              String(l.user_id) === String(state.currentSession.user.id)
          )
        );

        const replies = state.reviewReplies.filter(r => String(r.review_id) === String(item.id));

        return `
          <article class="mkz-review-card" data-review-id="${item.id}">
            <div class="mkz-review-author">
              <button class="mkz-review-author__avatar" type="button" data-open-profile="${item.user_id}" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">
                ${avatarUrl ? '' : getInitial(item.profile?.username, 'П')}
              </button>
              <div>
                <div class="mkz-review-card__name">${username}</div>
                <div class="mkz-review-card__stars">${'★'.repeat(Number(item.rating || 0))}${'☆'.repeat(5 - Number(item.rating || 0))}</div>
              </div>
            </div>

            <div class="mkz-review-card__text">${text}</div>
            ${imageUrl ? `<div class="mkz-review-card__image"><img src="${imageUrl}" alt="Отзыв" data-zoom-image="${imageUrl}" data-zoom-title="${username}"></div>` : ''}

            <div class="mkz-review-actions">
              <button class="mkz-like ${likedByUser ? 'is-active is-liked' : ''}" type="button" data-like-id="${item.id}">
                ❤️ ${likesCount}
              </button>
              <div class="mkz-review-card__date">${formatDateTime(item.created_at)}</div>
            </div>

            ${isOwner() ? `
              <div class="mkz-review-admin">
                <button class="mkz-btn mkz-btn--ghost" type="button" data-edit-review="${item.id}">Редактировать</button>
                <button class="mkz-btn mkz-btn--danger" type="button" data-delete-review="${item.id}">Удалить</button>
              </div>
            ` : ''}

            <div class="mkz-review-replies">
              ${replies.map(reply => `
                <div class="mkz-review-reply">
                  <div class="mkz-review-reply__meta">
                    <button class="mkz-user-inline" type="button" data-open-profile="${reply.user_id}">
                      ${safeText(reply.profile?.username || 'Пользователь', 'Пользователь')}
                    </button>
                    <div class="mkz-review-reply__date">${formatDateTime(reply.created_at)}</div>
                  </div>
                  <div class="mkz-review-reply__text">${nl2brSafe(reply.text || '')}</div>
                  ${isOwner() ? `
                    <div class="mkz-review-admin" style="margin-top:10px;">
                      <button class="mkz-btn mkz-btn--danger" type="button" data-delete-review-reply="${reply.id}">Удалить ответ</button>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>

            <form class="mkz-review-reply-form" data-review-reply-form="${item.id}">
              <label class="mkz-field">
                <span>Ответить на отзыв</span>
                <textarea class="mkz-textarea" data-review-reply-input="${item.id}" placeholder="Напиши ответ"></textarea>
              </label>
              <button class="mkz-btn mkz-btn--ghost" type="submit">Ответить</button>
            </form>
          </article>
        `;
      }).join('');

      $$('[data-review-reply-form]', reviewsList).forEach(form => {
        form.addEventListener('submit', async function (e) {
          e.preventDefault();

          if (!state.currentSession) {
            alert('Сначала войди в аккаунт');
            openScreen('account');
            return;
          }

          const reviewId = form.dataset.reviewReplyForm;
          const input = $(`[data-review-reply-input="${reviewId}"]`);
          const text = input?.value.trim() || '';

          if (!text) {
            alert('Напиши ответ');
            return;
          }

          const { error } = await supabaseClient.from('review_replies').insert({
            review_id: reviewId,
            user_id: state.currentSession.user.id,
            text
          });

          if (error) {
            alert(error.message);
            return;
          }

          input.value = '';
          await renderReviews();
        });
      });

      $$('[data-open-profile]', reviewsList).forEach(btn => {
        btn.addEventListener('click', async e => {
          e.stopPropagation();
          await openPublicProfile(btn.dataset.openProfile);
        });
      });

      $$('[data-zoom-image]', reviewsList).forEach(img => {
        img.addEventListener('click', e => {
          e.stopPropagation();
          showImageModal(img.dataset.zoomImage, img.dataset.zoomTitle || '');
        });
      });
    } catch (err) {
      console.error('renderReviews error', err);
    }
  }

  async function renderFaqQuestions() {
    if (!isOwner()) {
      if (faqQuestionsAdminList) faqQuestionsAdminList.innerHTML = '';
      return;
    }

    try {
      const { data } = await supabaseClient
        .from('faq_questions')
        .select('*')
        .order('created_at', { ascending: false });

      state.faqQuestions = data || [];

      if (!faqQuestionsAdminList) return;

      if (!state.faqQuestions.length) {
        faqQuestionsAdminList.innerHTML = '<div class="mkz-card"><p>Пока нет вопросов.</p></div>';
        return;
      }

      faqQuestionsAdminList.innerHTML = state.faqQuestions.map(item => `
        <div class="mkz-admin-message">
          <div class="mkz-admin-message__head">
            <div>
              <div class="mkz-admin-message__name">${safeText(item.name || 'Гость', 'Гость')}</div>
              <div class="mkz-admin-message__contact">${safeText(item.contact || 'Контакт не указан', 'Контакт не указан')}</div>
            </div>
            <div class="mkz-admin-message__date">${formatDateTime(item.created_at)}</div>
          </div>
          <div class="mkz-admin-message__text" style="margin-bottom:12px;">${safeText(item.question || '', '')}</div>
          <label class="mkz-field">
            <span>Ответ</span>
            <textarea class="mkz-textarea" data-faq-answer-input="${item.id}">${escapeHtml(item.answer || '')}</textarea>
          </label>
          <button class="mkz-btn mkz-btn--primary" type="button" data-save-faq-answer="${item.id}">Сохранить ответ</button>
        </div>
      `).join('');

      $$('[data-save-faq-answer]', faqQuestionsAdminList).forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.saveFaqAnswer;
          const input = $(`[data-faq-answer-input="${id}"]`);
          const answer = input?.value.trim() || '';

          const { error } = await supabaseClient
            .from('faq_questions')
            .update({
              answer,
              answered_by: state.currentSession.user.id,
              answered_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) {
            alert(error.message);
            return;
          }

          alert('Ответ сохранён');
          await renderFaqQuestions();
        });
      });
    } catch (err) {
      console.error('renderFaqQuestions error', err);
    }
  }

  async function searchPeople(query = '') {
    try {
      if (!peopleSearchResults) return;

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
        const lastSeen = getVisibleLastSeen(profile);

        return `
          <button class="mkz-card mkz-card--hover mkz-person-card" type="button" data-open-profile="${profile.id}">
            <div class="mkz-person-card__top">
              <div class="mkz-person-card__avatar" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">
                ${avatarUrl ? '' : getInitial(profile.username, 'U')}
              </div>
              <div class="mkz-person-card__meta">
                <div class="mkz-person-card__name">${name}</div>
                <div class="mkz-person-card__id">${publicId}</div>
                <div class="mkz-person-card__status">${lastSeen}</div>
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
      console.error('searchPeople error', err);
    }
  }

  async function openPublicProfile(userId) {
    try {
      let profile = await readProfileByUserId(userId);
      if (!profile) profile = getProfileByUserId(userId);
      if (!profile) return;

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
      console.error('openPublicProfile error', err);
    }
  }

  async function renderContestEntriesAdmin() {
    if (!isOwner()) {
      if (contestEntriesAdminList) contestEntriesAdminList.innerHTML = '';
      return;
    }

    try {
      const { data: entries } = await supabaseClient
        .from('contest_entries')
        .select('*')
        .order('id', { ascending: false });

      state.contestEntries = entries || [];

      if (!contestEntriesAdminList) return;

      if (!state.contestEntries.length) {
        contestEntriesAdminList.innerHTML = '<div class="mkz-card"><p>Пока нет участников.</p></div>';
        return;
      }

      await cacheProfiles();

      contestEntriesAdminList.innerHTML = state.contestEntries.map(entry => {
        const profile = getProfileByUserId(entry.user_id);
        const contest = state.contests.find(c => String(c.id) === String(entry.contest_id));
        return `
          <div class="mkz-admin-message">
            <div class="mkz-admin-message__head">
              <div>
                <div class="mkz-admin-message__name">${safeText(profile?.username || 'Пользователь', 'Пользователь')}</div>
                <div class="mkz-admin-message__contact">${safeText(profile?.email || 'Email не указан', 'Email не указан')}</div>
                <div class="mkz-admin-message__contact">${safeText(profile?.telegram_username || 'Telegram не указан', 'Telegram не указан')}</div>
              </div>
              <div class="mkz-admin-message__date">${formatDateTime(entry.created_at)}</div>
            </div>
            <div class="mkz-admin-message__text">
              Конкурс: ${safeText(contest?.title || 'Без названия', 'Без названия')}
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error('renderContestEntriesAdmin error', err);
    }
  }

  function processIncomingMessageNotifications(messages) {
    if (!state.currentSession?.user) return;

    if (!state.initialMessagesHydrated) {
      messages.forEach(m => state.knownMessageIds.add(String(m.id)));
      state.initialMessagesHydrated = true;
      return;
    }

    messages.forEach(message => {
      const key = String(message.id);
      if (state.knownMessageIds.has(key)) return;

      state.knownMessageIds.add(key);

      if (String(message.user_id) === String(state.currentSession.user.id) && message.sender_mode !== 'support_brand') return;

      if ('Notification' in window && Notification.permission === 'granted') {
        const conversation = state.conversations.find(c => String(c.id) === String(message.conversation_id));
        const author = getMessageAuthorIdentity(message);
        const title = conversation?.is_support
          ? 'Новое сообщение от Mark1z Design'
          : `Новое сообщение от ${author?.username || 'Пользователя'}`;

        if (document.hidden || String(state.currentConversationId) !== String(message.conversation_id)) {
          new Notification(title, {
            body: message.text || message.attachment_name || 'Новое вложение'
          });
        }
      }
    });
  }

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

      processIncomingMessageNotifications(state.conversationMessages);
    } catch (err) {
      console.error('fetchMessengerData error', err);
    }
  }

  async function ensureSupportSeedMessages(conversationId) {
    const existing = state.conversationMessages.filter(
      message => String(message.conversation_id) === String(conversationId)
    );

    if (existing.length) return;

    await supabaseClient.from('conversation_messages').insert([
      {
        conversation_id: conversationId,
        user_id: OWNER_UID,
        sender_mode: 'support_brand',
        text: 'Привет! Это официальный чат Mark1z Design.'
      },
      {
        conversation_id: conversationId,
        user_id: OWNER_UID,
        sender_mode: 'support_brand',
        text: 'Напишите сообщение, прикрепите фото, файл или голосовое — и вам ответят.'
      }
    ]);

    await supabaseClient
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  }

  async function findOrCreateSupportConversation() {
  if (!state.currentSession?.user) return null;

  await fetchMessengerData();

  if (state.supportConversationId) {
    const alreadyMember = state.conversationMembers.some(
  m =>
    String(m.conversation_id) === String(state.supportConversationId) &&
    String(m.user_id) === String(state.currentSession.user.id)
);

if (!alreadyMember) {
  const { error: joinError } = await supabaseClient
    .from('conversation_members')
    .insert({
      conversation_id: state.supportConversationId,
      user_id: state.currentSession.user.id,
      last_read_at: null
    });

  if (joinError) {
    console.error('support join membership error', joinError);
  }

  await fetchMessengerData();
}
    await ensureSupportSeedMessages(state.supportConversationId);
    return state.supportConversationId;
  }

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

  if (error || !newConversation) {
    console.error('findOrCreateSupportConversation insert conversation error', error);
    return null;
  }

  const membersToInsert = [
  {
    conversation_id: newConversation.id,
    user_id: OWNER_UID,
    last_read_at: new Date().toISOString()
  }
];

if (String(state.currentSession.user.id) !== String(OWNER_UID)) {
  membersToInsert.push({
    conversation_id: newConversation.id,
    user_id: state.currentSession.user.id,
    last_read_at: null
  });
}

const { error: membersError } = await supabaseClient
  .from('conversation_members')
  .insert(membersToInsert);

  if (membersError) {
    console.error('findOrCreateSupportConversation insert members error', membersError);
    return null;
  }

  state.supportConversationId = newConversation.id;

  await fetchMessengerData();
  await ensureSupportSeedMessages(newConversation.id);
  return newConversation.id;
}
  async function findOrCreateDirectConversation(otherUserId) {
    if (!state.currentSession?.user) return null;

    await fetchMessengerData();

    const myId = String(state.currentSession.user.id);
    const targetId = String(otherUserId);

    const possible = state.conversations.find(conv => {
      const members = state.conversationMembers
        .filter(m => String(m.conversation_id) === String(conv.id))
        .map(m => String(m.user_id));
      return !conv.is_support && members.length === 2 && members.includes(myId) && members.includes(targetId);
    });

    if (possible) return possible.id;

    const { data: newConversation, error } = await supabaseClient
      .from('conversations')
      .insert({
        title: 'Личный чат',
        is_support: false,
        created_by: state.currentSession.user.id,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .maybeSingle();

    if (error || !newConversation) return null;

    await supabaseClient.from('conversation_members').insert([
      { conversation_id: newConversation.id, user_id: state.currentSession.user.id, last_read_at: new Date().toISOString() },
      { conversation_id: newConversation.id, user_id: otherUserId, last_read_at: null }
    ]);

    return newConversation.id;
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
    const member = state.conversationMembers.find(
      m =>
        String(m.conversation_id) === String(conversationId) &&
        String(m.user_id) === String(state.currentSession?.user?.id)
    );

    const lastReadAt = member?.last_read_at ? new Date(member.last_read_at).getTime() : 0;

    return state.conversationMessages.filter(message => {
      const isMineStandard = String(message.user_id) === String(state.currentSession?.user?.id) && message.sender_mode !== 'support_brand';
      return (
        String(message.conversation_id) === String(conversationId) &&
        !isMineStandard &&
        new Date(message.created_at).getTime() > lastReadAt
      );
    }).length;
  }

  function renderConversationMessage(message) {
    const isMine =
      (String(message.user_id) === String(state.currentSession?.user?.id) && message.sender_mode !== 'support_brand') ||
      (isOwner() && isSupportConversation(message.conversation_id) && message.sender_mode === 'support_brand');

    const author = getMessageAuthorIdentity(message);
    const authorName = safeText(author?.username || (isMine ? 'Вы' : 'Пользователь'), 'Пользователь');

    const attachmentUrl = safeUrl(message.attachment_url || '');
    const attachmentName = safeText(message.attachment_name || 'Файл', 'Файл');
    const attachmentType = String(message.attachment_type || '').toLowerCase();
    const isImage = attachmentUrl && attachmentType.startsWith('image/');
    const isAudio = attachmentUrl && attachmentType.startsWith('audio/');

    const canModerate =
      (String(message.user_id) === String(state.currentSession?.user?.id) && message.sender_mode !== 'support_brand') ||
      (isOwner() && isSupportConversation(message.conversation_id));

    return `
      <div class="mkz-message-row ${isMine ? 'mkz-message-row--me' : 'mkz-message-row--them'}">
        <div class="mkz-message-bubble ${isMine ? 'mkz-message-bubble--me' : 'mkz-message-bubble--them'}">
          <div class="mkz-message__meta">${authorName}</div>

          ${message.text ? `<div>${nl2brSafe(message.text)}</div>` : ''}

          ${isImage ? `
            <div class="mkz-message__image">
              <img
                src="${attachmentUrl}"
                alt="${attachmentName}"
                data-zoom-image="${attachmentUrl}"
                data-zoom-title="${attachmentName}"
              >
            </div>
          ` : ''}

          ${isAudio ? `
            <div class="mkz-message-bubble__audio">
              <audio controls src="${attachmentUrl}"></audio>
              <div style="margin-top:8px;">
                <a href="${attachmentUrl}" target="_blank" rel="noopener noreferrer" download="${attachmentName}">Скачать аудио</a>
              </div>
            </div>
          ` : ''}

          ${attachmentUrl && !isImage && !isAudio ? `
            <div class="mkz-message-bubble__file">
              <span>${attachmentName}</span>
              <a href="${attachmentUrl}" target="_blank" rel="noopener noreferrer" download="${attachmentName}">
                Скачать
              </a>
            </div>
          ` : ''}

          <div class="mkz-message-time">${formatDateTime(message.created_at)}</div>

          ${canModerate ? `
            <div class="mkz-review-admin" style="margin-top:10px;">
              <button class="mkz-btn mkz-btn--danger" type="button" data-delete-message="${message.id}">Удалить</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
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

    const supportConv = state.conversations.find(c => String(c.id) === String(state.supportConversationId));

    if (pinnedOwnerChatBtn && supportConv) {
      const supportMessages = state.conversationMessages.filter(
        m => String(m.conversation_id) === String(supportConv.id)
      );
      const lastSupportMessage = supportMessages[supportMessages.length - 1];
      const unreadSupport = getUnreadCount(supportConv.id);

      applyAvatar(pinnedOwnerAvatar, SUPPORT_CHAT_IDENTITY.avatar_url, 'Mark1z Design');
      if (pinnedOwnerName) pinnedOwnerName.textContent = 'Mark1z Design';
      if (pinnedOwnerTime) pinnedOwnerTime.textContent = 'официальный чат';
      if (pinnedOwnerPreview) {
        pinnedOwnerPreview.textContent =
          lastSupportMessage?.text ||
          lastSupportMessage?.attachment_name ||
          'Привет! Напишите сообщение и оставьте контакты для связи.';
      }

      pinnedOwnerChatBtn.classList.toggle('is-active', String(state.currentConversationId) === String(supportConv.id));

      if (pinnedOwnerUnread) {
        pinnedOwnerUnread.style.display = unreadSupport > 0 ? 'inline-flex' : 'none';
        pinnedOwnerUnread.textContent = String(unreadSupport);
      }
    }

    let list = state.conversations.filter(c => !c.is_support);
    const query = String(messengerSearch?.value || '').trim().toLowerCase();

    if (query) {
      list = list.filter(conv => {
        const peer = getConversationPeer(conv.id);
        const title = String(conv.title || '').toLowerCase();
        const peerName = String(peer?.username || '').toLowerCase();
        const convMessages = state.conversationMessages
          .filter(m => String(m.conversation_id) === String(conv.id))
          .some(m => String(m.text || '').toLowerCase().includes(query));
        return title.includes(query) || peerName.includes(query) || convMessages;
      });
    }

    if (!list.length) {
      messengerDialogs.innerHTML = '<div class="mkz-card"><p>Чатов пока нет.</p></div>';
    } else {
      messengerDialogs.innerHTML = list.map(conv => {
        const peer = getConversationPeer(conv.id);
        const lastMessage = [...state.conversationMessages]
          .filter(m => String(m.conversation_id) === String(conv.id))
          .pop();

        const title = peer?.username || 'Личный чат';
        const avatarUrl = safeUrl(peer?.avatar_url || '');
        const lastText = lastMessage?.text || lastMessage?.attachment_name || 'Сообщений пока нет';
        const unread = getUnreadCount(conv.id);

        return `
          <button class="mkz-chat-item ${String(state.currentConversationId) === String(conv.id) ? 'is-active' : ''}" type="button" data-open-conversation="${conv.id}">
            <div class="mkz-chat-item__avatar" style="${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center;` : ''}">
              ${avatarUrl ? '' : getInitial(title, 'M')}
            </div>

            <div class="mkz-chat-item__body">
              <div class="mkz-chat-item__row">
                <div class="mkz-chat-item__name">${safeText(title, 'Чат')}</div>
                <div class="mkz-chat-item__time">${lastMessage ? formatDateTime(lastMessage.created_at) : ''}</div>
              </div>
              <div class="mkz-chat-item__preview">${safeText(lastText, '')}</div>
            </div>

            ${unread > 0 ? `<div class="mkz-chat-item__badge">${unread}</div>` : ''}
          </button>
        `;
      }).join('');
    }

    $$('[data-open-conversation]', messengerDialogs).forEach(btn => {
      btn.addEventListener('click', async () => {
        await openConversation(btn.dataset.openConversation);
      });
    });

    if (!state.currentConversationId && state.supportConversationId) {
      await openConversation(state.supportConversationId);
    }
  }

  async function openConversation(conversationId, silent = false) {
    state.currentConversationId = conversationId;
    await fetchMessengerData();

    const conversation = state.conversations.find(c => String(c.id) === String(conversationId));
    const peer = getConversationPeer(conversationId);
    const title = conversation?.is_support ? 'Mark1z Design' : (peer?.username || 'Чат');

    applyAvatar(
      messengerTopAvatar,
      conversation?.is_support ? SUPPORT_CHAT_IDENTITY.avatar_url : peer?.avatar_url,
      title
    );

    if (messengerTopName) messengerTopName.textContent = title;
    if (messengerTopSub) {
      messengerTopSub.textContent = conversation?.is_support
        ? 'Официальный чат бренда и бот-помощник'
        : getVisibleLastSeen(peer);
    }

    if (messengerOpenProfileBtn) {
      if (conversation?.is_support) {
        delete messengerOpenProfileBtn.dataset.profileId;
      } else if (peer?.id) {
        messengerOpenProfileBtn.dataset.profileId = peer.id;
      } else {
        delete messengerOpenProfileBtn.dataset.profileId;
      }
    }

    const messages = state.conversationMessages.filter(m => String(m.conversation_id) === String(conversationId));

    if (messengerMessages) {
      messengerMessages.innerHTML = messages.length
        ? messages.map(renderConversationMessage).join('')
        : `
          <div class="mkz-messenger-empty">
            <div class="mkz-messenger-empty__box">
              <div class="mkz-messenger-empty__icon">✉</div>
              <h3 class="mkz-messenger-empty__title">Диалог пуст</h3>
              <p class="mkz-messenger-empty__text">Напишите первое сообщение.</p>
            </div>
          </div>
        `;

      messengerMessages.scrollTop = messengerMessages.scrollHeight;
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
      alert('Сначала выбери чат');
      return;
    }

    const text = messengerInput?.value.trim() || '';
    const attachment = state.pendingMessengerAttachment;

    if (!text && !attachment) {
      alert('Напиши сообщение или прикрепи файл');
      return;
    }

    setButtonState(messengerSendBtn, true, 'Отправка...', 'Отправить');

    try {
      let attachmentPayload = {
        attachment_url: '',
        attachment_name: '',
        attachment_type: ''
      };

      if (attachment?.file) {
        attachmentPayload = await uploadMessengerAttachment(attachment.file);
      }

      const isSupportChat = isSupportConversation(state.currentConversationId);
      const senderMode = isSupportChat && isOwner() ? 'support_brand' : 'profile';

      const insertPayload = {
        conversation_id: state.currentConversationId,
        user_id: state.currentSession.user.id,
        sender_mode: senderMode,
        text,
        ...attachmentPayload
      };

      const { error } = await supabaseClient.from('conversation_messages').insert(insertPayload);

      if (error) {
        alert(error.message || 'Не удалось отправить сообщение');
        return;
      }

      await supabaseClient
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', state.currentConversationId);

      if (messengerInput) messengerInput.value = '';
      clearMessengerAttachment();

      if (isSupportChat && !isOwner()) {
        const supportMessages = state.conversationMessages.filter(
          m => String(m.conversation_id) === String(state.currentConversationId)
        );

        const alreadyAutoAnswered = supportMessages.some(
          m =>
            m.sender_mode === 'support_brand' &&
            String(m.text || '').includes('В ближайшее время вам ответят')
        );

        if (!alreadyAutoAnswered) {
          try {
            await supabaseClient.from('conversation_messages').insert({
              conversation_id: state.currentConversationId,
              user_id: OWNER_UID,
              sender_mode: 'support_brand',
              text: 'Спасибо за сообщение. В ближайшее время вам ответят.'
            });

            await supabaseClient
              .from('conversations')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', state.currentConversationId);
          } catch {}
        }
      }

      await openConversation(state.currentConversationId);
    } finally {
      setButtonState(messengerSendBtn, false, 'Отправка...', 'Отправить');
    }
  }

  async function handleDeleteConversationMessage(messageId) {
    if (!state.currentSession) return;

    const message = state.conversationMessages.find(m => String(m.id) === String(messageId));
    if (!message) return;

    const canDelete =
      (String(message.user_id) === String(state.currentSession.user.id) && message.sender_mode !== 'support_brand') ||
      (isOwner() && isSupportConversation(message.conversation_id));

    if (!canDelete) {
      alert('Ты не можешь удалить это сообщение');
      return;
    }

    if (!confirm('Удалить сообщение?')) return;

    const { error } = await supabaseClient
      .from('conversation_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      alert(error.message || 'Не удалось удалить сообщение');
      return;
    }

    await openConversation(state.currentConversationId);
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

  async function startVoiceRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Запись голосовых не поддерживается в этом браузере');
      return;
    }

    try {
      state.voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaChunks = [];
      state.mediaRecorder = new MediaRecorder(state.voiceStream);

      state.mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          state.mediaChunks.push(e.data);
        }
      };

      state.mediaRecorder.onstop = async () => {
        const blob = new Blob(state.mediaChunks, { type: 'audio/webm' });
        const file = new File([blob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
        state.pendingMessengerAttachment = { file, kind: 'voice' };
        renderMessengerAttachmentMeta();

        if (state.voiceStream) {
          state.voiceStream.getTracks().forEach(track => track.stop());
          state.voiceStream = null;
        }
      };

      state.mediaRecorder.start();
      if (messengerAttachMeta) messengerAttachMeta.textContent = 'Идёт запись голосового...';
    } catch (err) {
      console.error(err);
      alert('Не удалось начать запись голосового');
    }
  }

  function stopVoiceRecording() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
    }
  }

  async function renderNews() {
  try {
    const [
      { data: posts },
      { data: likes },
      { data: comments },
      { data: polls },
      { data: pollOptions },
      { data: pollVotes },
      { data: contests },
      { data: contestEntries }
    ] = await Promise.all([
      supabaseClient.from('news_posts').select('*').order('id', { ascending: false }),
      supabaseClient.from('news_post_likes').select('*'),
      supabaseClient.from('news_comments').select('*').order('id', { ascending: true }),
      supabaseClient.from('news_polls').select('*'),
      supabaseClient.from('news_poll_options').select('*'),
      supabaseClient.from('news_poll_votes').select('*'),
      supabaseClient.from('contests').select('*'),
      supabaseClient.from('contest_entries').select('*')
    ]);

      state.newsPosts = (posts || []).sort((a, b) => {
        const pinDiff = Number(!!b.is_pinned) - Number(!!a.is_pinned);
        if (pinDiff !== 0) return pinDiff;
        return Number(b.id || 0) - Number(a.id || 0);
      });

      state.newsLikes = likes || [];
      state.newsComments = comments || [];
      state.newsPolls = polls || [];
      state.newsPollOptions = pollOptions || [];
      state.newsPollVotes = pollVotes || [];
      state.contests = contests || [];
      state.contestEntries = contestEntries || [];

      state.newsLikesMap = {};
      state.newsCommentsMap = {};
      state.userLikedPosts = new Set();

      state.newsLikes.forEach(like => {
        const postId = String(like.post_id);
        state.newsLikesMap[postId] = (state.newsLikesMap[postId] || 0) + 1;

        if (String(like.user_id) === String(state.currentSession?.user?.id)) {
          state.userLikedPosts.add(postId);
        }
      });

      state.newsComments.forEach(comment => {
        const postId = String(comment.post_id);
        state.newsCommentsMap[postId] = (state.newsCommentsMap[postId] || 0) + 1;
      });

      if (!newsList) return;

      const commentsMap = {};
      state.newsComments.forEach(comment => {
        const key = String(comment.post_id);
        if (!commentsMap[key]) commentsMap[key] = [];
        commentsMap[key].push(comment);
      });

      const pollsMap = {};
      state.newsPolls.forEach(poll => {
        pollsMap[String(poll.post_id)] = poll;
      });

      const pollOptionsMap = {};
      state.newsPollOptions.forEach(option => {
        const key = String(option.poll_id);
        if (!pollOptionsMap[key]) pollOptionsMap[key] = [];
        pollOptionsMap[key].push(option);
      });

      const pollVotesMap = {};
      state.newsPollVotes.forEach(vote => {
        const optionId = String(vote.option_id);
        pollVotesMap[optionId] = (pollVotesMap[optionId] || 0) + 1;
      });

      const contestsMap = {};
      state.contests.forEach(contest => {
        contestsMap[String(contest.post_id)] = contest;
      });

      const contestEntriesMap = {};
      state.contestEntries.forEach(entry => {
        const contestId = String(entry.contest_id);
        contestEntriesMap[contestId] = (contestEntriesMap[contestId] || 0) + 1;
      });

      function renderCommentThread(comment, allComments, level = 0) {
        const children = allComments.filter(c => String(c.parent_comment_id) === String(comment.id));
        const isOwn = String(comment.user_id) === String(state.currentSession?.user?.id);
        const canDelete = isOwn || isOwner();
        const commentProfile = getProfileByUserId(comment.user_id);

        return `
          <div class="mkz-news-comment" style="margin-left:${level * 18}px;">
            <div class="mkz-news-comment__meta">
              <button class="mkz-user-inline mkz-user-inline--comment" type="button" data-open-profile="${comment.user_id}">
                ${safeText(commentProfile?.username || 'Пользователь', 'Пользователь')}
              </button>
              <div class="mkz-news-comment__date">${formatDateTime(comment.created_at || comment.id)}</div>
            </div>

            <div class="mkz-news-comment__text">${nl2brSafe(comment.text || '')}</div>

            <div class="mkz-review-admin" style="margin-top:10px;">
              <button class="mkz-btn mkz-btn--ghost" type="button" data-reply-news-comment="${comment.id}">
                Ответить
              </button>

              ${isOwn ? `
                <button class="mkz-btn mkz-btn--ghost" type="button" data-edit-news-comment="${comment.id}">
                  Редактировать
                </button>
              ` : ''}

              ${canDelete ? `
                <button class="mkz-btn mkz-btn--danger" type="button" data-delete-news-comment="${comment.id}">
                  Удалить
                </button>
              ` : ''}
            </div>

            <form class="mkz-news-comment-form" data-reply-form="${comment.id}" style="display:none; margin-top:12px;">
              <label class="mkz-field">
                <span>Ответ</span>
                <textarea class="mkz-textarea" data-reply-input="${comment.id}" placeholder="Напиши ответ"></textarea>
              </label>
              <button class="mkz-btn mkz-btn--primary" type="submit">Отправить ответ</button>
            </form>

            ${children.length ? `
              <div class="mkz-news-comment-children">
                ${children.map(child => renderCommentThread(child, allComments, level + 1)).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      if (!state.newsPosts.length) {
        newsList.innerHTML = '<div class="mkz-card"><h3>Пока нет постов</h3></div>';
        return;
      }

      newsList.innerHTML = state.newsPosts.map(post => {
        const postId = String(post.id);
        const postLikes = state.newsLikesMap[postId] || 0;
        const postComments = commentsMap[postId] || [];
        const rootComments = postComments.filter(c => !c.parent_comment_id);
        const lastComment = rootComments.at(-1);

        const poll = pollsMap[postId];
        const options = poll ? (pollOptionsMap[String(poll.id)] || []) : [];

        const contest = contestsMap[postId];
        const entriesCount = contest ? (contestEntriesMap[String(contest.id)] || 0) : 0;

        const imageUrl = safeUrl(post.image_url || '');
        const linkUrl = safeUrl(post.figma_url || '');
        const linkButtonText = safeText(post.link_button_text || 'Открыть ссылку', 'Открыть ссылку');
        const extraFileUrl = safeUrl(post.extra_file_url || '');
        const extraFileName = safeText(post.extra_file_name || 'Вложение', 'Вложение');

        const hasDownloadableFile =
          extraFileUrl && !/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(post.extra_file_name || '');

        return `
          <article class="mkz-news-card" data-news-post="${post.id}">
            <div class="mkz-news-card__head">
              <div>
                <h3 class="mkz-news-card__title">
                  ${post.is_pinned ? '📌 ' : ''}${safeText(post.title || 'Без названия', 'Без названия')}
                </h3>
                <div class="mkz-news-card__date">${formatDateTime(post.created_at || post.id)}</div>
              </div>

              ${isOwner() ? `
                <div class="mkz-review-admin">
                  <button class="mkz-btn mkz-btn--ghost" type="button" data-edit-news-post="${post.id}">
                    Редактировать
                  </button>
                  <button class="mkz-btn mkz-btn--danger" type="button" data-delete-news-post="${post.id}">
                    Удалить
                  </button>
                </div>
              ` : ''}
            </div>

            ${post.text ? `<div class="mkz-news-card__body">${nl2brSafe(post.text || '')}</div>` : ''}

            ${imageUrl ? `
              <div class="mkz-news-card__image">
                <img
                  src="${imageUrl}"
                  alt="${safeText(post.title || 'Пост', 'Пост')}"
                  data-zoom-image="${imageUrl}"
                  data-zoom-title="${safeText(post.title || 'Пост', 'Пост')}"
                >
              </div>
            ` : ''}

            ${(linkUrl || hasDownloadableFile) ? `
              <div class="mkz-news-card__actions">
                ${linkUrl ? `
                  <a class="mkz-btn mkz-btn--ghost" href="${linkUrl}" target="_blank" rel="noopener noreferrer">
                    ${linkButtonText}
                  </a>
                ` : ''}

                ${hasDownloadableFile ? `
                  <a class="mkz-btn mkz-btn--ghost" href="${extraFileUrl}" target="_blank" rel="noopener noreferrer">
                    Скачать: ${extraFileName}
                  </a>
                ` : ''}
              </div>
            ` : ''}

            ${poll ? `
              <div class="mkz-poll">
                <div class="mkz-poll__question">${safeText(poll.question || '', '')}</div>
                ${options.map(option => `
                  <button class="mkz-poll-option" type="button" data-poll-option="${option.id}">
                    <span>${safeText(option.option_text || '', '')}</span>
                    <span>${pollVotesMap[String(option.id)] || 0}</span>
                  </button>
                `).join('')}
              </div>
            ` : ''}

            ${contest ? `
              <div class="mkz-contest">
                <div class="mkz-contest__title">🏆 ${safeText(contest.title || 'Конкурс', 'Конкурс')}</div>
                <div class="mkz-contest__meta">
                  <div>${nl2brSafe(contest.description || '')}</div>

                  <div class="mkz-contest__badges">
                    <div class="mkz-contest-badge">
                      <span class="mkz-contest-badge__label">Приз</span>
                      <span class="mkz-contest-badge__value">${safeText(contest.prize || 'Не указан', 'Не указан')}</span>
                    </div>

                    <div class="mkz-contest-badge mkz-contest-badge--deadline">
                      <span class="mkz-contest-badge__label">Дедлайн</span>
                      <span class="mkz-contest-badge__value">${formatDateTime(contest.deadline)}</span>
                    </div>

                    <div class="mkz-contest-badge mkz-contest-badge--users">
                      <span class="mkz-contest-badge__label">Участников</span>
                      <span class="mkz-contest-badge__value">${entriesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="mkz-news-card__actions">
              <button
                class="mkz-like ${state.userLikedPosts.has(postId) ? 'is-active is-liked' : ''}"
                type="button"
                data-like-post="${post.id}">
                ❤️ ${postLikes}
              </button>

              <button class="mkz-btn mkz-btn--ghost" type="button" data-toggle-comments="${post.id}">
                Комментарии (${rootComments.length})
              </button>
            </div>

            ${lastComment ? `
              <div class="mkz-news-last-comment">
                <div class="mkz-news-last-comment__name">Последний комментарий</div>
                <div>${nl2brSafe(lastComment.text || '')}</div>
              </div>
            ` : ''}

            <div class="mkz-news-comments-list" id="mkzCommentsList-${post.id}">
              ${rootComments.map(comment => renderCommentThread(comment, postComments, 0)).join('')}
            </div>

            <form class="mkz-news-comment-form" data-comment-form="${post.id}">
              <label class="mkz-field">
                <span>Комментарий</span>
                <textarea class="mkz-textarea" data-comment-input="${post.id}" placeholder="Напиши комментарий"></textarea>
              </label>
              <button class="mkz-btn mkz-btn--primary" type="submit">Отправить</button>
            </form>
          </article>
        `;
      }).join('');

      $$('[data-open-profile]', newsList).forEach(btn => {
        btn.addEventListener('click', async e => {
          e.stopPropagation();
          await openPublicProfile(btn.dataset.openProfile);
        });
      });

      $$('[data-toggle-comments]', newsList).forEach(btn => {
        btn.addEventListener('click', () => {
          const postId = btn.dataset.toggleComments;
          const list = document.getElementById(`mkzCommentsList-${postId}`);
          if (list) list.classList.toggle('is-open');
        });
      });

      $$('[data-comment-form]', newsList).forEach(form => {
        form.addEventListener('submit', async e => {
          e.preventDefault();

          if (!state.currentSession) {
            alert('Сначала войди в аккаунт');
            openScreen('account');
            return;
          }

          const postId = String(form.dataset.commentForm || '');
          const input = $(`[data-comment-input="${postId}"]`, form);
          const text = input?.value.trim() || '';

          if (!text) {
            alert('Напиши комментарий');
            return;
          }

          const { error } = await supabaseClient.from('news_comments').insert({
            post_id: postId,
            user_id: state.currentSession.user.id,
            text,
            parent_comment_id: null
          });

          if (error) {
            alert('Ошибка комментария: ' + error.message);
            return;
          }

          const contestForPost = state.contests.find(
            contest => String(contest.post_id) === String(postId)
          );

          if (contestForPost) {
            const alreadyJoined = state.contestEntries.some(
              entry =>
                String(entry.contest_id) === String(contestForPost.id) &&
                String(entry.user_id) === String(state.currentSession.user.id)
            );

            if (!alreadyJoined) {
              await supabaseClient.from('contest_entries').insert({
                contest_id: contestForPost.id,
                user_id: state.currentSession.user.id
              });
            }
          }

          input.value = '';
          await renderNews();
          await renderContestEntriesAdmin();
        });
      });

      $$('[data-reply-news-comment]', newsList).forEach(btn => {
        btn.addEventListener('click', () => {
          const commentId = btn.dataset.replyNewsComment;
          const form = document.querySelector(`[data-reply-form="${commentId}"]`);
          if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
          }
        });
      });

      $$('[data-reply-form]', newsList).forEach(form => {
        form.addEventListener('submit', async e => {
          e.preventDefault();

          if (!state.currentSession) {
            alert('Сначала войди в аккаунт');
            openScreen('account');
            return;
          }

          const parentCommentId = String(form.dataset.replyForm || '');
          const input = $(`[data-reply-input="${parentCommentId}"]`, form);
          const text = input?.value.trim() || '';

          const parentComment = state.newsComments.find(c => String(c.id) === parentCommentId);
          if (!parentComment) return;

          if (!text) {
            alert('Напиши ответ');
            return;
          }

          const { error } = await supabaseClient.from('news_comments').insert({
            post_id: parentComment.post_id,
            user_id: state.currentSession.user.id,
            text,
            parent_comment_id: parentComment.id
          });

          if (error) {
            alert(error.message || 'Не удалось отправить ответ');
            return;
          }

          input.value = '';
          form.style.display = 'none';
          await renderNews();
        });
      });

      $$('[data-edit-news-comment]', newsList).forEach(btn => {
        btn.addEventListener('click', async () => {
          const commentId = btn.dataset.editNewsComment;
          const comment = state.newsComments.find(c => String(c.id) === String(commentId));
          if (!comment) return;

          const newText = prompt('Новый текст комментария:', comment.text || '');
          if (newText === null) return;

          const { error } = await supabaseClient
            .from('news_comments')
            .update({ text: newText.trim() })
            .eq('id', commentId);

          if (error) {
            alert(error.message || 'Не удалось обновить комментарий');
            return;
          }

          await renderNews();
        });
      });

      $$('[data-delete-news-comment]', newsList).forEach(btn => {
        btn.addEventListener('click', async () => {
          await handleDeleteNewsComment(btn.dataset.deleteNewsComment);
        });
      });

      $$('[data-edit-news-post]', newsList).forEach(btn => {
        btn.addEventListener('click', async () => {
          await handleEditNewsPost(btn.dataset.editNewsPost);
        });
      });

      $$('[data-delete-news-post]', newsList).forEach(btn => {
        btn.addEventListener('click', async () => {
          await handleDeleteNewsPost(btn.dataset.deleteNewsPost);
        });
      });

      $$('[data-poll-option]', newsList).forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!state.currentSession) {
            alert('Сначала войди в аккаунт');
            openScreen('account');
            return;
          }

          const optionId = btn.dataset.pollOption;
          const option = state.newsPollOptions.find(o => String(o.id) === String(optionId));
          if (!option) return;

          const samePollVotes = state.newsPollVotes.filter(vote => {
            if (String(vote.user_id) !== String(state.currentSession.user.id)) return false;
            const votedOption = state.newsPollOptions.find(o => String(o.id) === String(vote.option_id));
            return votedOption && String(votedOption.poll_id) === String(option.poll_id);
          });

          if (samePollVotes.length) {
            alert('Ты уже голосовал в этом опросе');
            return;
          }

          const { error } = await supabaseClient.from('news_poll_votes').insert({
            option_id: optionId,
            user_id: state.currentSession.user.id
          });

          if (error) {
            alert(error.message || 'Не удалось проголосовать');
            return;
          }

          await renderNews();
        });
      });

      $$('[data-zoom-image]', newsList).forEach(img => {
        img.addEventListener('click', () => {
          showImageModal(img.dataset.zoomImage, img.dataset.zoomTitle || '');
        });
      });
    } catch (err) {
      console.error('renderNews error', err);
    }
  }

  async function likeReview(reviewId) {
    if (!state.currentSession) {
      alert('Сначала войди в аккаунт');
      openScreen('account');
      return;
    }

    const existing = state.reviewLikes.find(
      l =>
        String(l.review_id) === String(reviewId) &&
        String(l.user_id) === String(state.currentSession.user.id)
    );

    if (existing) {
      const { error } = await supabaseClient
        .from('review_likes')
        .delete()
        .eq('id', existing.id);

      if (error) {
        alert(error.message || 'Не удалось убрать лайк');
        return;
      }
    } else {
      const { error } = await supabaseClient
        .from('review_likes')
        .insert({
          review_id: reviewId,
          user_id: state.currentSession.user.id
        });

      if (error) {
        alert(error.message || 'Не удалось поставить лайк');
        return;
      }
    }

    await renderReviews();
  }

  async function handleLogin() {
    if (!loginForm?.reportValidity()) return;
    setButtonState(loginBtn, true, 'Вход...', 'Войти');

    try {
      const email = loginEmail?.value.trim() || '';
      const password = loginPassword?.value || '';

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert('Ошибка входа: ' + error.message);
        return;
      }

      state.currentSession = data?.session || null;

      if (!state.currentSession) {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        state.currentSession = sessionData?.session || null;
      }

      if (!state.currentSession) {
        alert('Сессия не создалась после входа');
        return;
      }

      state.currentProfile = await ensureProfileForCurrentUser();
      renderProfile();

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

      openScreen('account');
      alert('Вход выполнен');
    } catch (err) {
      console.error(err);
      alert('Ошибка входа');
    } finally {
      setButtonState(loginBtn, false, 'Вход...', 'Войти');
    }
  }

  async function handleRegister() {
    if (!registerForm?.reportValidity()) return;
    setButtonState(registerBtn, true, 'Регистрация...', 'Зарегистрироваться');

    try {
      const username = nameInput?.value.trim() || '';
      const phone = phoneInput?.value.trim() || '';
      let telegramUsername = telegramInput?.value.trim() || '';
      const avatarFile = avatarInput?.files?.[0];

      if (!telegramUsername) {
        alert('Укажи Telegram username');
        return;
      }

      if (!telegramUsername.startsWith('@')) {
        telegramUsername = '@' + telegramUsername.replace(/^@+/, '');
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email: registerEmail.value.trim(),
        password: registerPassword.value.trim(),
        options: {
          data: {
            username,
            telegram_username: telegramUsername
          }
        }
      });

      if (error) {
        alert('Ошибка регистрации: ' + error.message);
        return;
      }

      let avatarUrl = '';

      if (data?.user && avatarFile) {
        try {
          const upload = await uploadToBucket('avatars', avatarFile, data.user.id);
          avatarUrl = upload.publicUrl;
        } catch (err) {
          console.error(err);
        }
      }

      if (data?.session) {
        state.currentSession = data.session;
      } else {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        state.currentSession = sessionData?.session || null;
      }

      if (state.currentSession) {
        await ensureProfileForCurrentUser({
          username,
          phone,
          avatar_url: avatarUrl,
          telegram_username: telegramUsername
        });

        state.currentProfile =
          (await readProfileByUserId(state.currentSession.user.id)) ||
          state.currentProfile;

        renderProfile();
        await cacheProfiles();
        await searchPeople();
        openScreen('account');
        alert('Регистрация завершена');
      } else {
        alert('Аккаунт создан. Теперь войди в него.');
        registerForm.reset();
        showLoginBtn?.click();
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка регистрации');
    } finally {
      setButtonState(registerBtn, false, 'Регистрация...', 'Зарегистрироваться');
    }
  }

  async function handleReviewSend() {
    if (!state.currentSession) {
      alert('Чтобы оставить отзыв, сначала войди в аккаунт');
      openScreen('account');
      return;
    }

    if (!reviewForm?.reportValidity()) return;
    setButtonState(reviewSendBtn, true, 'Отправка...', 'Оставить отзыв');

    try {
      let imageUrl = '';
      const file = reviewImage?.files?.[0];

      if (file) {
        try {
          const upload = await uploadToBucket('reviews', file, state.currentSession.user.id);
          imageUrl = upload.publicUrl;
        } catch {
          alert('Не удалось загрузить картинку к отзыву');
          return;
        }
      }

      const { error } = await supabaseClient.from('reviews').insert({
        user_id: state.currentSession.user.id,
        rating: state.currentRating,
        text: reviewText.value.trim(),
        image_url: imageUrl
      });

      if (error) {
        alert('Не удалось оставить отзыв: ' + error.message);
        return;
      }

      reviewForm.reset();
      state.currentRating = 5;
      renderStars(state.currentRating);
      await renderReviews();
      alert('Отзыв опубликован');
    } finally {
      setButtonState(reviewSendBtn, false, 'Отправка...', 'Оставить отзыв');
    }
  }

  async function handleFaqAsk() {
    if (!faqAskForm?.reportValidity()) return;
    setButtonState(faqAskBtn, true, 'Отправка...', 'Отправить вопрос');

    try {
      const { error } = await supabaseClient.from('faq_questions').insert({
        user_id: state.currentSession?.user?.id || null,
        name: faqAskName?.value.trim() || '',
        contact: faqAskContact?.value.trim() || '',
        question: faqAskQuestion?.value.trim() || ''
      });

      if (error) {
        alert(error.message);
        return;
      }

      faqAskForm.reset();
      await renderFaqQuestions();
      alert('Вопрос отправлен');
    } finally {
      setButtonState(faqAskBtn, false, 'Отправка...', 'Отправить вопрос');
    }
  }

  async function handleAddFolder() {
    if (!folderAdminForm?.reportValidity()) return;
    if (!isOwner()) return;
    setButtonState(folderAddBtn, true, 'Добавление...', 'Добавить папку');

    try {
      let coverImageUrl = '';
      const coverFile = folderCover?.files?.[0];

      if (coverFile) {
        const upload = await uploadToBucket(
          'portfolio',
          coverFile,
          `folder_cover_${state.currentSession.user.id}`
        );
        coverImageUrl = upload.publicUrl;
      }

      const { error } = await supabaseClient.from('portfolio_folders').insert({
        title: folderTitle?.value.trim() || '',
        slug: slugify(folderSlug?.value.trim() || folderTitle?.value.trim() || ''),
        sort_order: Number(folderSortOrder?.value || 0),
        cover_image_url: coverImageUrl
      });

      if (error) {
        alert(error.message || 'Не удалось создать папку');
        return;
      }

      folderAdminForm.reset();
      await renderPortfolio();
      alert('Папка добавлена');
    } finally {
      setButtonState(folderAddBtn, false, 'Добавление...', 'Добавить папку');
    }
  }

  async function handleEditFolderCover() {
    if (!isOwner()) return;
    if (!folderEditForm?.reportValidity()) return;

    const file = editFolderCover?.files?.[0];
    if (!file) {
      alert('Выбери новую обложку');
      return;
    }

    setButtonState(folderEditBtn, true, 'Сохраняю...', 'Обновить обложку');

    try {
      const upload = await uploadToBucket(
        'portfolio',
        file,
        `folder_cover_edit_${state.currentSession.user.id}`
      );

      const { error } = await supabaseClient
        .from('portfolio_folders')
        .update({
          cover_image_url: upload.publicUrl
        })
        .eq('id', editFolderSelect.value);

      if (error) {
        alert(error.message);
        return;
      }

      folderEditForm.reset();
      await renderPortfolio();
      alert('Обложка обновлена');
    } finally {
      setButtonState(folderEditBtn, false, 'Сохраняю...', 'Обновить обложку');
    }
  }

  async function handleAddPortfolioItem() {
    if (!portfolioAdminForm?.reportValidity()) return;
    if (!isOwner()) return;
    setButtonState(portfolioAddBtn, true, 'Загрузка...', 'Добавить в портфолио');

    try {
      const file = portfolioImage?.files?.[0];
      if (!file) {
        alert('Выбери картинку');
        return;
      }

      const upload = await uploadToBucket(
        'portfolio',
        file,
        `portfolio_${state.currentSession.user.id}`
      );

      const { error } = await supabaseClient.from('portfolio_items').insert({
        folder_id: portfolioFolderSelect.value,
        title: portfolioTitle.value.trim(),
        description: portfolioDescription.value.trim(),
        image_url: upload.publicUrl,
        sort_order: Number(portfolioSortOrder.value || 0)
      });

      if (error) {
        alert(error.message || 'Не удалось добавить работу');
        return;
      }

      portfolioAdminForm.reset();
      await renderPortfolio();

      if (state.currentOpenedFolderId) {
        openFolder(state.currentOpenedFolderId);
      }

      alert('Работа добавлена');
    } finally {
      setButtonState(portfolioAddBtn, false, 'Загрузка...', 'Добавить в портфолио');
    }
  }

  async function handleEditWork() {
    if (!isOwner()) return;
    if (!portfolioEditForm?.reportValidity()) return;
    setButtonState(editWorkBtn, true, 'Сохраняю...', 'Сохранить изменения');

    try {
      const payload = {
        updated_at: new Date().toISOString(),
        title: editWorkTitle?.value.trim() || '',
        description: editWorkDescription?.value.trim() || ''
      };

      const file = editWorkImage?.files?.[0];
      if (file) {
        const upload = await uploadToBucket(
          'portfolio',
          file,
          `portfolio_edit_${state.currentSession.user.id}`
        );
        payload.image_url = upload.publicUrl;
      }

      const { error } = await supabaseClient
        .from('portfolio_items')
        .update(payload)
        .eq('id', editWorkSelect.value);

      if (error) {
        alert(error.message);
        return;
      }

      portfolioEditForm.reset();
      await renderPortfolio();

      if (state.currentOpenedFolderId) {
        openFolder(state.currentOpenedFolderId);
      }

      alert('Работа обновлена');
    } finally {
      setButtonState(editWorkBtn, false, 'Сохраняю...', 'Сохранить изменения');
    }
  }

  async function handleDeleteWork(workId) {
    if (!isOwner()) return;
    if (!confirm('Удалить эту работу?')) return;

    const { error } = await supabaseClient
      .from('portfolio_items')
      .delete()
      .eq('id', workId);

    if (error) {
      alert(error.message || 'Не удалось удалить работу');
      return;
    }

    await renderPortfolio();

    if (state.currentOpenedFolderId) {
      openFolder(state.currentOpenedFolderId);
    }
  }

  async function handleUpdateProfile() {
    if (!state.currentSession) return;
    setButtonState(updateProfileBtn, true, 'Сохранение...', 'Обновить профиль');

    try {
      let avatarUrl = state.currentProfile?.avatar_url || '';
      const file = updateAvatar?.files?.[0];

      if (file) {
        const upload = await uploadToBucket('avatars', file, state.currentSession.user.id);
        avatarUrl = upload.publicUrl;
      }

      let telegramUsername =
        updateTelegram?.value.trim() ||
        state.currentProfile?.telegram_username ||
        '';

      if (telegramUsername && !telegramUsername.startsWith('@')) {
        telegramUsername = '@' + telegramUsername.replace(/^@+/, '');
      }

      const payload = {
        username:
          updateName?.value.trim() ||
          state.currentProfile?.username ||
          state.currentSession.user.email?.split('@')[0] ||
          'Пользователь',
        full_name:
          updateName?.value.trim() ||
          state.currentProfile?.full_name ||
          state.currentProfile?.username ||
          'Пользователь',
        phone: updatePhone?.value.trim() || state.currentProfile?.phone || '',
        telegram_username: telegramUsername,
        email: state.currentSession.user.email || state.currentProfile?.email || '',
        avatar_url: avatarUrl,
        last_seen_at: new Date().toISOString(),
        show_phone: !!privacyShowPhone?.checked,
        show_telegram: !!privacyShowTelegram?.checked,
        show_last_seen: !!privacyShowLastSeen?.checked,
        is_online: !document.hidden
      };

      const { error } = await supabaseClient
        .from('profiles')
        .update(payload)
        .eq('id', state.currentSession.user.id);

      if (error) {
        alert(error.message);
        return;
      }

      state.currentProfile =
        (await readProfileByUserId(state.currentSession.user.id)) || {
          ...state.currentProfile,
          ...payload
        };

      renderProfile();
      await cacheProfiles();
      await searchPeople();
      alert('Профиль обновлён');
    } finally {
      setButtonState(updateProfileBtn, false, 'Сохранение...', 'Обновить профиль');
    }
  }

  async function handleLogout() {
    stopPresenceHeartbeat();

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

    openScreen('account');
    alert('Вы вышли из аккаунта');
  }

  async function handleAddNewsPost() {
    if (!isOwner()) return;

    const text = newsText?.value || '';
    const normalizedText = text.trim();

    const hasContest =
      contestPanel &&
      contestPanel.style.display !== 'none' &&
      !!contestTitle?.value.trim();

    const hasPoll =
      pollPanel &&
      pollPanel.style.display !== 'none' &&
      !!pollQuestion?.value.trim();

    const hasLink =
      !!(newsLinkUrl?.value.trim() || newsLinkText?.value.trim());

    const imageFile = newsImage?.files?.[0];
    const extraFile = newsExtraFile?.files?.[0];

    if (!normalizedText && !hasContest && !hasPoll && !hasLink && !imageFile && !extraFile) {
      alert('Заполни хотя бы один блок: текст, конкурс, опрос, ссылку, фото или файл');
      return;
    }

    setButtonState(newsAddBtn, true, 'Публикую...', 'Опубликовать');

    try {
      let imageUrl = '';
      let extraFileUrl = '';
      let extraFileName = '';

      let linkUrlRaw = newsLinkUrl?.value.trim() || '';
      const linkButtonTextRaw = newsLinkText?.value.trim() || '';

      if (linkUrlRaw && !/^https?:\/\//i.test(linkUrlRaw)) {
        linkUrlRaw = 'https://' + linkUrlRaw;
      }

      if (imageFile) {
        const upload = await uploadToBucket(
          'portfolio',
          imageFile,
          `news_image_${state.currentSession.user.id}`
        );
        imageUrl = upload.publicUrl || '';
      }

      if (extraFile) {
        const upload = await uploadToBucket(
          'portfolio',
          extraFile,
          `news_file_${state.currentSession.user.id}`
        );
        extraFileUrl = upload.publicUrl || '';
        extraFileName = extraFile.name || '';
      }

      const { data: insertedPost, error: postError } = await supabaseClient
        .from('news_posts')
        .insert({
          user_id: state.currentSession.user.id,
          title: newsTitle?.value.trim() || '',
          text,
          image_url: imageUrl,
          figma_url: linkUrlRaw,
          link_button_text: linkButtonTextRaw,
          extra_file_url: extraFileUrl,
          extra_file_name: extraFileName,
          is_pinned: !!state.isPinnedDraft
        })
        .select('*')
        .maybeSingle();

      if (postError || !insertedPost) {
        alert(postError?.message || 'Не удалось создать пост');
        return;
      }

      if (hasPoll) {
        const { data: pollData, error: pollError } = await supabaseClient
          .from('news_polls')
          .insert({
            post_id: insertedPost.id,
            question: pollQuestion.value.trim()
          })
          .select('*')
          .maybeSingle();

        if (!pollError && pollData) {
          const options = [
            pollOption1?.value.trim(),
            pollOption2?.value.trim(),
            pollOption3?.value.trim()
          ].filter(Boolean);

          if (options.length >= 2) {
            await supabaseClient
              .from('news_poll_options')
              .insert(
                options.map(optionText => ({
                  poll_id: pollData.id,
                  option_text: optionText
                }))
              );
          }
        }
      }

      if (hasContest) {
        await supabaseClient
          .from('contests')
          .insert({
            post_id: insertedPost.id,
            title: contestTitle.value.trim(),
            description: contestDescription?.value.trim() || '',
            prize: contestPrize?.value.trim() || '',
            deadline: contestDeadline?.value
              ? new Date(contestDeadline.value).toISOString()
              : null
          });
      }

      if (newsTitle) newsTitle.value = '';
      if (newsText) newsText.value = '';
      if (newsImage) newsImage.value = '';
      if (newsExtraFile) newsExtraFile.value = '';
      if (newsLinkText) newsLinkText.value = '';
      if (newsLinkUrl) newsLinkUrl.value = '';
      if (pollQuestion) pollQuestion.value = '';
      if (pollOption1) pollOption1.value = '';
      if (pollOption2) pollOption2.value = '';
      if (pollOption3) pollOption3.value = '';
      if (contestTitle) contestTitle.value = '';
      if (contestDescription) contestDescription.value = '';
      if (contestPrize) contestPrize.value = '';
      if (contestDeadline) contestDeadline.value = '';
      if (newsMetaPreview) newsMetaPreview.textContent = '';

      if (pollPanel) pollPanel.style.display = 'none';
      if (contestPanel) contestPanel.style.display = 'none';
      if (linkPanel) linkPanel.style.display = 'none';

      state.isPinnedDraft = false;
      if (togglePinBtn) togglePinBtn.classList.remove('is-active');

      await renderNews();
      await renderContestEntriesAdmin();

      alert('Пост опубликован');
    } catch (err) {
      console.error(err);
      alert('Ошибка публикации поста');
    } finally {
      setButtonState(newsAddBtn, false, 'Публикую...', 'Опубликовать');
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!isOwner()) return;
    if (!confirm('Удалить отзыв?')) return;

    const { error } = await supabaseClient
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      alert(error.message || 'Не удалось удалить отзыв');
      return;
    }

    await renderReviews();
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

    const { error } = await supabaseClient
      .from('reviews')
      .update({
        text: newText.trim(),
        rating: newRating,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId);

    if (error) {
      alert(error.message);
      return;
    }

    await renderReviews();
    alert('Отзыв обновлён');
  }

  async function handleDeleteReviewReply(replyId) {
    if (!isOwner()) return;

    const { error } = await supabaseClient
      .from('review_replies')
      .delete()
      .eq('id', replyId);

    if (error) {
      alert(error.message || 'Не удалось удалить ответ');
      return;
    }

    await renderReviews();
  }

  async function handleDeleteNewsComment(commentId) {
    if (!state.currentSession) return;

    const comment = state.newsComments.find(c => String(c.id) === String(commentId));
    if (!comment) return;

    const canDelete =
      String(comment.user_id) === String(state.currentSession.user.id) || isOwner();

    if (!canDelete) {
      alert('Ты не можешь удалить этот комментарий');
      return;
    }

    if (!confirm('Удалить этот комментарий?')) return;

    const { error } = await supabaseClient
      .from('news_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      alert(error.message || 'Не удалось удалить комментарий');
      return;
    }

    await renderNews();
  }

  async function handleDeleteNewsPost(postId) {
    if (!isOwner()) return;
    if (!confirm('Удалить этот пост?')) return;

    try {
      const poll = state.newsPolls.find(p => String(p.post_id) === String(postId));
      const contest = state.contests.find(c => String(c.post_id) === String(postId));

      if (poll) {
        const pollOptionIds = state.newsPollOptions
          .filter(o => String(o.poll_id) === String(poll.id))
          .map(o => o.id);

        if (pollOptionIds.length) {
          await supabaseClient
            .from('news_poll_votes')
            .delete()
            .in('option_id', pollOptionIds);

          await supabaseClient
            .from('news_poll_options')
            .delete()
            .eq('poll_id', poll.id);
        }

        await supabaseClient
          .from('news_polls')
          .delete()
          .eq('id', poll.id);
      }

      if (contest) {
        await supabaseClient
          .from('contest_entries')
          .delete()
          .eq('contest_id', contest.id);

        await supabaseClient
          .from('contests')
          .delete()
          .eq('id', contest.id);
      }

      await supabaseClient
        .from('news_comments')
        .delete()
        .eq('post_id', postId);

      await supabaseClient
        .from('news_post_likes')
        .delete()
        .eq('post_id', postId);

      const { error } = await supabaseClient
        .from('news_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        alert(error.message || 'Не удалось удалить пост');
        return;
      }

      await renderNews();
      await renderContestEntriesAdmin();
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления поста');
    }
  }

  async function handleEditNewsPost(postId) {
    if (!isOwner()) return;

    const post = state.newsPosts.find(p => String(p.id) === String(postId));
    if (!post) return;

    const newTitle = prompt('Новый заголовок поста:', post.title || '');
    if (newTitle === null) return;

    const newText = prompt('Новый текст поста:', post.text || '');
    if (newText === null) return;

    let newLinkText = prompt('Новый текст кнопки ссылки:', post.link_button_text || '');
    if (newLinkText === null) return;

    let newLinkUrl = prompt('Новая ссылка кнопки:', post.figma_url || '');
    if (newLinkUrl === null) return;

    if (newLinkUrl && !/^https?:\/\//i.test(newLinkUrl)) {
      newLinkUrl = 'https://' + newLinkUrl;
    }

    const newPinned = confirm('Сделать пост закреплённым? Нажми ОК = да, Отмена = нет');

    const { error } = await supabaseClient
      .from('news_posts')
      .update({
        title: newTitle.trim(),
        text: newText,
        figma_url: newLinkUrl.trim(),
        link_button_text: newLinkText.trim(),
        is_pinned: newPinned
      })
      .eq('id', postId);

    if (error) {
      alert(error.message || 'Не удалось обновить пост');
      return;
    }

    await renderNews();
    alert('Пост обновлён');
  }

  function bindStaticEvents() {
    if (burger && nav) {
      burger.addEventListener('click', () => {
        nav.classList.toggle('is-open');
      });
    }

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        openScreen(btn.dataset.screenOpen);
      });
    });

    if (userPillButton) {
      userPillButton.addEventListener('click', () => openScreen('account'));
    }

    if (openOrderModal) {
      openOrderModal.addEventListener('click', showOrderModal);
    }

    if (closeOrderModal) {
      closeOrderModal.addEventListener('click', hideOrderModal);
    }

    if (orderBackdrop) {
      orderBackdrop.addEventListener('click', hideOrderModal);
    }

    if (closeReviewPopup) {
      closeReviewPopup.addEventListener('click', hideReviewPopup);
    }

    if (reviewPopupBackdrop) {
      reviewPopupBackdrop.addEventListener('click', hideReviewPopup);
    }

    if (closeImageModal) {
      closeImageModal.addEventListener('click', hideImageModal);
    }

    if (imageModalBackdrop) {
      imageModalBackdrop.addEventListener('click', hideImageModal);
    }

    if (backToFolders) {
      backToFolders.addEventListener('click', showFoldersList);
    }

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

    if (attachImageBtn && newsImage) {
      attachImageBtn.addEventListener('click', () => newsImage.click());
    }

    if (attachFileBtn && newsExtraFile) {
      attachFileBtn.addEventListener('click', () => newsExtraFile.click());
    }

    if (togglePollBtn && pollPanel) {
      togglePollBtn.addEventListener('click', () => {
        pollPanel.style.display =
          pollPanel.style.display === 'none' ? 'block' : 'none';
        togglePollBtn.classList.toggle('is-active', pollPanel.style.display !== 'none');
      });
    }

    if (toggleContestBtn && contestPanel) {
      toggleContestBtn.addEventListener('click', () => {
        contestPanel.style.display =
          contestPanel.style.display === 'none' ? 'block' : 'none';
        toggleContestBtn.classList.toggle('is-active', contestPanel.style.display !== 'none');
      });
    }

    if (toggleLinkBtn && linkPanel) {
      toggleLinkBtn.addEventListener('click', () => {
        linkPanel.style.display =
          linkPanel.style.display === 'none' ? 'block' : 'none';
        toggleLinkBtn.classList.toggle('is-active', linkPanel.style.display !== 'none');
      });
    }

    if (togglePinBtn) {
      togglePinBtn.addEventListener('click', () => {
        state.isPinnedDraft = !state.isPinnedDraft;
        togglePinBtn.classList.toggle('is-active', state.isPinnedDraft);
      });
    }

    if (newsImage) {
      newsImage.addEventListener('change', () => {
        const file = newsImage.files?.[0];
        if (file && newsMetaPreview) {
          newsMetaPreview.textContent = `Прикреплено фото: ${file.name}`;
        }
      });
    }

    if (newsExtraFile) {
      newsExtraFile.addEventListener('change', () => {
        const file = newsExtraFile.files?.[0];
        if (file && newsMetaPreview) {
          newsMetaPreview.textContent = `Прикреплён файл: ${file.name}`;
        }
      });
    }

    if (faqFab) {
      faqFab.addEventListener('click', () => openScreen('faq'));
    }

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

    stars.forEach(star => {
      star.addEventListener('click', () => {
        state.currentRating = Number(star.dataset.rating);
        renderStars(state.currentRating);
      });
    });

    aboutTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        aboutTabs.forEach(item => item.classList.remove('is-active'));
        aboutPanels.forEach(item => item.classList.remove('is-active'));

        tab.classList.add('is-active');
        document
          .querySelector(`[data-about-panel="${tab.dataset.aboutTab}"]`)
          ?.classList.add('is-active');
      });
    });

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

    loginForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleLogin();
    });

    registerForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleRegister();
    });

    reviewForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleReviewSend();
    });

    faqAskForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleFaqAsk();
    });

    folderAdminForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleAddFolder();
    });

    folderEditForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleEditFolderCover();
    });

    portfolioAdminForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleAddPortfolioItem();
    });

    portfolioEditForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await handleEditWork();
    });

    if (newsAddBtn) {
      newsAddBtn.addEventListener('click', handleAddNewsPost);
    }

    if (updateProfileBtn) {
      updateProfileBtn.addEventListener('click', handleUpdateProfile);
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    if (peopleSearchBtn) {
      peopleSearchBtn.addEventListener('click', async () => {
        await searchPeople(peopleSearchInput?.value || '');
      });
    }

    if (peopleSearchInput) {
      peopleSearchInput.addEventListener('keydown', async e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          await searchPeople(peopleSearchInput.value || '');
        }
      });
    }

    if (backToPeopleBtn) {
      backToPeopleBtn.addEventListener('click', () => openScreen('people'));
    }

    if (openProfileMessengerBtn) {
      openProfileMessengerBtn.addEventListener('click', async () => {
        if (!state.currentSession) {
          alert('Сначала войди в аккаунт');
          openScreen('account');
          return;
        }

        if (!state.openedProfile?.id) return;

        const targetId = String(state.openedProfile.id);
        const myId = String(state.currentSession.user.id);

        if (targetId === myId) {
          openScreen('messenger');
          await renderMessengerDialogs();
          return;
        }

        const conversationId = await findOrCreateDirectConversation(targetId);

        if (!conversationId) {
          alert('Не удалось открыть чат');
          return;
        }

        openScreen('messenger');
        await renderMessengerDialogs();
        await openConversation(conversationId);
      });
    }

    if (messengerSearch) {
      messengerSearch.addEventListener('input', async () => {
        await renderMessengerDialogs();
      });
    }

    messengerForm?.addEventListener('submit', async e => {
      e.preventDefault();
      await sendMessengerMessage();
    });

    if (pinnedOwnerChatBtn) {
      pinnedOwnerChatBtn.addEventListener('click', async () => {
        if (!state.currentSession) {
          openScreen('account');
          return;
        }

        await renderMessengerDialogs();

        if (state.supportConversationId) {
          await openConversation(state.supportConversationId);
        }
      });
    }

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
        renderMessengerAttachmentMeta();
      });
    }

    if (messengerFileInput) {
      messengerFileInput.addEventListener('change', () => {
        const file = messengerFileInput.files?.[0];
        if (!file) return;
        state.pendingMessengerAttachment = { file, kind: 'file' };
        renderMessengerAttachmentMeta();
      });
    }

    if (messengerVoiceBtn) {
      messengerVoiceBtn.addEventListener('click', async () => {
        await startVoiceRecording();
      });
    }

    if (messengerVoiceStopBtn) {
      messengerVoiceStopBtn.addEventListener('click', () => {
        stopVoiceRecording();
      });
    }

    if (messengerRefreshBtn) {
      messengerRefreshBtn.addEventListener('click', async () => {
        await fetchMessengerData();
        await renderMessengerDialogs();

        if (state.currentConversationId) {
          await openConversation(state.currentConversationId, true);
        }
      });
    }

    if (messengerOpenProfileBtn) {
      messengerOpenProfileBtn.addEventListener('click', async () => {
        const profileId = messengerOpenProfileBtn.dataset.profileId;
        if (!profileId) return;
        await openPublicProfile(profileId);
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

    if (messengerMessages) {
      messengerMessages.addEventListener('click', async e => {
        const zoomImg = e.target.closest('[data-zoom-image]');
        if (zoomImg) {
          showImageModal(zoomImg.dataset.zoomImage, zoomImg.dataset.zoomTitle || '');
          return;
        }

        const deleteBtn = e.target.closest('[data-delete-message]');
        if (deleteBtn) {
          await handleDeleteConversationMessage(deleteBtn.dataset.deleteMessage);
          return;
        }
      });
    }

    reviewsList?.addEventListener('click', async function (e) {
      const likeBtn = e.target.closest('[data-like-id]');
      if (likeBtn) {
        e.stopPropagation();
        await likeReview(likeBtn.dataset.likeId);
        return;
      }

      const editBtn = e.target.closest('[data-edit-review]');
      if (editBtn) {
        e.stopPropagation();
        await handleEditReview(editBtn.dataset.editReview);
        return;
      }

      const deleteBtn = e.target.closest('[data-delete-review]');
      if (deleteBtn) {
        e.stopPropagation();
        await handleDeleteReview(deleteBtn.dataset.deleteReview);
        return;
      }

      const deleteReplyBtn = e.target.closest('[data-delete-review-reply]');
      if (deleteReplyBtn) {
        e.stopPropagation();
        await handleDeleteReviewReply(deleteBtn?.dataset.deleteReviewReply || deleteReplyBtn.dataset.deleteReviewReply);
        return;
      }

      const replyForm = e.target.closest('[data-review-reply-form]');
      if (replyForm) return;

      const profileBtn = e.target.closest('[data-open-profile]');
      if (profileBtn) {
        e.stopPropagation();
        return;
      }

      const card = e.target.closest('[data-review-id]');
      if (card) {
        const review = state.reviews.find(
          r => String(r.id) === String(card.dataset.reviewId)
        );
        if (review) showReviewPopup(review);
      }
    });

    currentFolderWorks?.addEventListener('click', async function (e) {
      const editBtn = e.target.closest('[data-edit-work-inline]');
      if (editBtn) {
        fillEditWorkForm(editBtn.dataset.editWorkInline);
        return;
      }

      const deleteBtn = e.target.closest('[data-delete-work]');
      if (deleteBtn) {
        await handleDeleteWork(deleteBtn.dataset.deleteWork);
        return;
      }

      const image = e.target.closest('.mkz-work-card__image img');
      if (image) {
        showImageModal(image.getAttribute('src') || '', image.getAttribute('alt') || '');
      }
    });

    document.addEventListener('click', async e => {
      const likePostBtn = e.target.closest('[data-like-post]');
      if (likePostBtn) {
        if (!state.currentSession) {
          openScreen('account');
          return;
        }

        const postId = String(likePostBtn.dataset.likePost);
        const userId = String(state.currentSession.user.id);
        const liked = state.userLikedPosts.has(postId);

        if (liked) {
          const existing = state.newsLikes.find(
            l => String(l.post_id) === postId && String(l.user_id) === userId
          );

          if (existing) {
            const { error } = await supabaseClient
              .from('news_post_likes')
              .delete()
              .eq('id', existing.id);

            if (error) {
              alert(error.message || 'Не удалось убрать лайк');
              return;
            }
          }
        } else {
          const { error } = await supabaseClient
            .from('news_post_likes')
            .insert({
              post_id: postId,
              user_id: state.currentSession.user.id
            });

            if (error) {
              alert(error.message || 'Не удалось поставить лайк');
              return;
            }
        }

        await renderNews();
      }
    });

    document.addEventListener('visibilitychange', async () => {
      await updatePresence(!document.hidden);
    });

    window.addEventListener('beforeunload', () => {
      updatePresence(false);
    });
  }

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

  bindStaticEvents();

  (async function init() {
    renderStars(state.currentRating);
    await fetchSessionAndProfile();

    if (state.currentSession) {
      startPresenceHeartbeat();
      await requestNotificationsIfNeeded();
      await updatePresence(true);
    }

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
  }
})();

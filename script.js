/**
 * AHMEDKO — Complete Frontend Controller (Matched 100% to index.html, style.css & ai.js)
 * Compact Tabs & Shortcuts Edition
 * File: script.js
 */

(function () {
  'use strict';

  // Configure PDF.js Worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // =========================================================================
  // 1. COMPACT BILINGUAL DICTIONARY (SHORT LABELS & TABS ONLY)
  // =========================================================================
  const I18N = {
    en: {
      tagline: 'Smart AI Workspace',
      uploadBtn: 'Open',
      readerView: 'Workspace',
      dashboardBtnLabel: 'Dashboard',
      projectorBtn: 'Present',
      welcomeTitle: '⚡ Quick Launch',
      uploadFilesCta: 'Open File',
      loadSampleBtn: 'Sample Guide',
      qaAiTitle: 'AI Chat',
      qaAiDesc: 'Ask & Analyze',
      qaTransTitle: 'Translator',
      qaTransDesc: 'Instant Dict',
      qaNotesTitle: 'Notes',
      qaNotesDesc: 'Page-Linked',
      qaProjTitle: 'Projector',
      qaProjDesc: 'Laser & Timer',
      allFilesTab: '📂 Recent',
      favoritesTab: '★ Saved',
      clearHistoryBtn: '🗑️ Clear',
      thumbsTab: '📄 Pages',
      outlineTab: '📑 Index',
      bookmarksTab: '🔖 Marks',
      bookmarkPageBtn: '+ Bookmark',
      tabAiChat: '🤖 Chat',
      tabStudyTools: '🎓 Tools (20)',
      tabTranslator: '🌐 Translate',
      tabNotes: '📝 Notes',
      configureKeysBtn: '🔑 API Keys',
      contextLabel: 'Scope:',
      ctxCurrentPage: 'Page',
      ctxSelectedText: 'Selection',
      ctxPageRange: 'Range',
      ctxFullDoc: 'Full Doc',
      ctxGeneral: 'General',
      sendBtn: 'Send',
      difficultyLabel: 'Level:',
      outputLangLabel: 'Lang:',
      transSelBtn: 'Selection',
      transPageBtn: 'Page',
      transDocBtn: 'Doc',
      translateNowBtn: '⚡ Translate',
      translationResult: 'Result',
      transHistoryTitle: 'History',
      noDocOpenTitle: 'No File Open',
      toolSelect: '',
      toolHighlight: '',
      toolUnderline: '',
      toolStrike: '',
      toolPen: '',
      toolPencil: '',
      toolFreehand: '',
      toolEraser: '',
      toolText: '',
      toolSticky: '',
      toolRect: '',
      toolCircle: '',
      toolArrow: '',
      toolLine: '',
      searchFilesPlaceholder: 'Filter files...',
      findInDoc: 'Find...',
      chatPlaceholder: 'Ask AI...'
    },
    ar: {
      tagline: 'مساحة العمل الذكية',
      uploadBtn: 'فتح',
      readerView: 'مساحة العمل',
      dashboardBtnLabel: 'الرئيسية',
      projectorBtn: 'عرض',
      welcomeTitle: '⚡ وصول سريع',
      uploadFilesCta: 'رفع ملف',
      loadSampleBtn: 'ملف تجريبي',
      qaAiTitle: 'المساعد الذكي',
      qaAiDesc: 'اسأل وحلل',
      qaTransTitle: 'المترجم',
      qaTransDesc: 'قاموس فوري',
      qaNotesTitle: 'الملاحظات',
      qaNotesDesc: 'مرتبطة بالصفحات',
      qaProjTitle: 'وضع العرض',
      qaProjDesc: 'ليزر ومؤقت',
      allFilesTab: '📂 الأخيرة',
      favoritesTab: '★ المفضلة',
      clearHistoryBtn: '🗑️ مسح',
      thumbsTab: '📄 الصفحات',
      outlineTab: '📑 الفهرس',
      bookmarksTab: '🔖 الإشارات',
      bookmarkPageBtn: '+ حفظ إشارة',
      tabAiChat: '🤖 محادثة',
      tabStudyTools: '🎓 أدوات (20)',
      tabTranslator: '🌐 ترجمة',
      tabNotes: '📝 ملاحظات',
      configureKeysBtn: '🔑 المفاتيح',
      contextLabel: 'النطاق:',
      ctxCurrentPage: 'الصفحة',
      ctxSelectedText: 'المحدد',
      ctxPageRange: 'نطاق',
      ctxFullDoc: 'المستند',
      ctxGeneral: 'عام',
      sendBtn: 'إرسال',
      difficultyLabel: 'المستوى:',
      outputLangLabel: 'اللغة:',
      transSelBtn: 'المحدد',
      transPageBtn: 'الصفحة',
      transDocBtn: 'المستند',
      translateNowBtn: '⚡ ترجم',
      translationResult: 'النتيجة',
      transHistoryTitle: 'السجل',
      noDocOpenTitle: 'لا يوجد ملف مفتوح',
      toolSelect: '',
      toolHighlight: '',
      toolUnderline: '',
      toolStrike: '',
      toolPen: '',
      toolPencil: '',
      toolFreehand: '',
      toolEraser: '',
      toolText: '',
      toolSticky: '',
      toolRect: '',
      toolCircle: '',
      toolArrow: '',
      toolLine: '',
      searchFilesPlaceholder: 'بحث في الملفات...',
      findInDoc: 'بحث...',
      chatPlaceholder: 'اسأل الذكاء الاصطناعي...'
    }
  };

  // Short labels for the 20 study tools
  const COMPACT_STUDY_LABELS = {
    en: {
      explain_page: '📖 Explain Page',
      explain_beginner: '🌱 Simple Explain',
      summarize_doc: '📚 Doc Summary',
      summarize_page: '📄 Page Summary',
      key_points: '🎯 Key Points',
      mcq: '✅ MCQ Quiz',
      true_false: '⚖️ True / False',
      essay: '✍️ Essay Qs',
      flashcards: '🗂️ Flashcards',
      glossary: '📘 Glossary',
      terminology: '🔬 Terms',
      study_guide: '🧭 Study Guide',
      quiz: '🏆 Full Quiz',
      compare_concepts: '🔄 Compare',
      revision_notes: '📝 Revision',
      extract_formulas: '∑ Formulas',
      explain_diagrams: '🖼️ Diagrams',
      qa_with_answers: '💡 Q & A',
      qa_without_answers: '❓ Self-Test',
      lecture_outline: '🎓 Lecture Plan'
    },
    ar: {
      explain_page: '📖 شرح الصفحة',
      explain_beginner: '🌱 شرح مبسط',
      summarize_doc: '📚 ملخص كامل',
      summarize_page: '📄 ملخص الصفحة',
      key_points: '🎯 أهم النقاط',
      mcq: '✅ اختياري MCQ',
      true_false: '⚖️ صح وخطأ',
      essay: '✍️ أسئلة مقالية',
      flashcards: '🗂️ بطاقات استذكار',
      glossary: '📘 قاموس مصطلحات',
      terminology: '🔬 شرح المصطلحات',
      study_guide: '🧭 دليل مذاكرة',
      quiz: '🏆 اختبار شامل',
      compare_concepts: '🔄 مقارنة مفاهيم',
      revision_notes: '📝 برشامة مراجعة',
      extract_formulas: '∑ القوانين والمعادلات',
      explain_diagrams: '🖼️ شرح الرسوم',
      qa_with_answers: '💡 س وج محلول',
      qa_without_answers: '❓ اختبر نفسك',
      lecture_outline: '🎓 خطة محاضرة'
    }
  };

  // =========================================================================
  // 2. APPLICATION STATE
  // =========================================================================
  const state = {
    lang: localStorage.getItem('ahmedko_lang') || 'ar',
    theme: localStorage.getItem('ahmedko_theme') || 'dark',
    paperTint: localStorage.getItem('ahmedko_tint') || 'default',
    defaultZoom: localStorage.getItem('ahmedko_zoom') || '1',
    currentView: 'dashboard', // 'dashboard' | 'workspace'
    fileFilter: 'all',
    fileSearch: '',
    fileSort: 'date-desc',

    openDocs: [], // Array of { id, name, type, size }
    currentDocId: null,
    currentDocMeta: null,
    docType: null, // 'pdf' | 'docx' | 'pptx' | 'txt' | 'image'
    pdfDoc: null,
    virtualPages: [],
    pageTexts: [], // 0-indexed array of strings per page
    currentPage: 1,
    totalPages: 1,
    scale: 1.0,
    rotation: 0,
    layoutMode: 'single', // 'single' | 'continuous' | 'two-page'

    // 14-Tool Annotation Engine
    activeTool: 'select',
    strokeColor: '#6366f1',
    hlColor: '#FFEB3B',
    strokeSize: 3,
    strokeOpacity: 1.0,
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentPath: [],
    annotationsByPage: {},
    undoStackByPage: {},
    redoStackByPage: {},

    // Bookmarks, Notes, Translations, Chat Sessions
    bookmarks: [],
    notes: JSON.parse(localStorage.getItem('ahmedko_notes') || '[]'),
    transHistory: JSON.parse(localStorage.getItem('ahmedko_trans_hist') || '[]'),
    chatSessions: JSON.parse(
      localStorage.getItem('ahmedko_chats') ||
        '[{"id":"default","title":"Main Chat","messages":[]}]'
    ),
    activeChatId: 'default',
    selectedTextContext: '',

    // In-Doc Search
    searchMatches: [],
    searchIdx: -1,

    // Projector
    projectorActive: false,
    laserActive: false,
    curtainMode: null, // null | 'black' | 'white'
    timerSeconds: 0,
    timerInterval: null
  };

  const $ = (id) => document.getElementById(id);

  // =========================================================================
  // 3. COMPACT UI STYLING (NO CLUTTER, TABS & SHORTCUTS)
  // =========================================================================
  function injectCompactUIStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide verbose paragraphs & clutter */
      .hero-content p, .hero-badge, .storage-notice, .study-hint, .settings-note {
        display: none !important;
      }
      .hero-card {
        padding: 14px 18px !important;
        margin-bottom: 16px !important;
        grid-template-columns: auto 1fr !important;
        gap: 16px !important;
      }
      .hero-content h1 {
        font-size: 1.05rem !important;
        margin-bottom: 8px !important;
      }
      .quick-actions-grid {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 8px !important;
      }
      .quick-card {
        padding: 8px 10px !important;
      }
      .quick-card p {
        display: none !important;
      }
      /* 2-Column Compact Grid for 20 Study Tools */
      .study-tools-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 6px !important;
      }
      .study-tool-btn {
        padding: 8px 10px !important;
        font-size: 0.76rem !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Icon-only compact Annotation Toolbar */
      .anno-btn span {
        display: none !important;
      }
      .anno-btn {
        padding: 5px 9px !important;
        font-size: 0.88rem !important;
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(msg, isError = false) {
    const container = $('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    if (isError) t.style.borderLeftColor = '#ef4444';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // =========================================================================
  // 4. INDEXEDDB STORAGE ENGINE
  // =========================================================================
  const DB_NAME = 'AhmedkoWorkspaceDB';
  const STORE_NAME = 'files';

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveDocToDB(record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getDocFromDB(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllDocsFromDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteDocFromDB(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearAllDocsFromDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function syncDocMetadataToDB() {
    if (!state.currentDocId) return;
    const rec = await getDocFromDB(state.currentDocId);
    if (!rec) return;
    rec.currentPage = state.currentPage;
    rec.totalPages = state.totalPages;
    rec.annotationsByPage = state.annotationsByPage;
    rec.bookmarks = state.bookmarks;
    rec.lastOpened = Date.now();
    await saveDocToDB(rec);
  }

  // =========================================================================
  // 5. LOCALIZATION & THEME (SAFE ATTRIBUTE-ONLY UPDATES)
  // =========================================================================
  function applyLanguage(lang) {
    state.lang = lang === 'ar' ? 'ar' : 'en';
    localStorage.setItem('ahmedko_lang', state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

    const dict = I18N[state.lang];
    // ONLY update elements with explicit [data-i18n] or [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // Update compact 20 study tools labels
    const studyLabels = COMPACT_STUDY_LABELS[state.lang];
    document.querySelectorAll('.study-tool-btn[data-study]').forEach((btn) => {
      const key = btn.getAttribute('data-study');
      if (studyLabels[key]) btn.textContent = studyLabels[key];
    });

    const badge = $('langBadge');
    if (badge) badge.textContent = state.lang === 'ar' ? 'EN' : 'عربي';

    const settingLang = $('settingLangSelect');
    if (settingLang) settingLang.value = state.lang;

    updateViewSwitchLabel();
    renderRecentFilesGrid();
  }

  function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem('ahmedko_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    const settingTheme = $('settingThemeSelect');
    if (settingTheme) settingTheme.value = state.theme;
  }

  function applyPaperTint(tint) {
    state.paperTint = tint || 'default';
    localStorage.setItem('ahmedko_tint', state.paperTint);
    const stage = $('documentStage');
    if (stage) {
      stage.classList.remove('paper-sepia', 'paper-night');
      if (state.paperTint === 'sepia') stage.classList.add('paper-sepia');
      if (state.paperTint === 'night') stage.classList.add('paper-night');
    }
  }

  // =========================================================================
  // 6. VIEW & TAB NAVIGATION
  // =========================================================================
  function switchView(targetView) {
    state.currentView = targetView === 'workspace' ? 'workspace' : 'dashboard';
    const dash = $('dashboardView');
    const work = $('workspaceView');
    if (dash && work) {
      dash.classList.toggle('hidden', state.currentView !== 'dashboard');
      work.classList.toggle('hidden', state.currentView !== 'workspace');
    }
    updateViewSwitchLabel();
    if (state.currentView === 'dashboard') {
      renderRecentFilesGrid();
    }
  }

  function updateViewSwitchLabel() {
    const lbl = $('viewSwitchLabel');
    if (!lbl) return;
    const dict = I18N[state.lang];
    lbl.textContent =
      state.currentView === 'dashboard' ? dict.readerView : dict.dashboardBtnLabel;
  }

  function activateRightTab(tabName) {
    document.querySelectorAll('.rp-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.rpTab === tabName);
    });
    const map = {
      aiChat: 'rpTabAiChat',
      studyTools: 'rpTabStudyTools',
      translator: 'rpTabTranslator',
      notes: 'rpTabNotes'
    };
    Object.entries(map).forEach(([k, id]) => {
      const el = $(id);
      if (el) {
        el.classList.toggle('hidden', k !== tabName);
        el.classList.toggle('active', k === tabName);
      }
    });
  }

  function activateLeftTab(tabName) {
    document.querySelectorAll('.sidebar-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.leftTab === tabName);
    });
    const map = {
      thumbnails: 'leftTabThumbnails',
      outline: 'leftTabOutline',
      bookmarks: 'leftTabBookmarks'
    };
    Object.entries(map).forEach(([k, id]) => {
      const el = $(id);
      if (el) {
        el.classList.toggle('hidden', k !== tabName);
        el.classList.toggle('active', k === tabName);
      }
    });
  }

  // =========================================================================
  // 7. DASHBOARD FILE MANAGER & MULTI-DOC TABS BAR
  // =========================================================================
  function formatSize(bytes) {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB';
  }

  async function renderRecentFilesGrid() {
    const grid = $('recentFilesGrid');
    if (!grid) return;

    let docs = await getAllDocsFromDB();
    if (state.fileFilter === 'favorites') {
      docs = docs.filter((d) => d.favorite);
    }
    if (state.fileSearch) {
      const q = state.fileSearch.toLowerCase();
      docs = docs.filter((d) => d.name.toLowerCase().includes(q));
    }

    docs.sort((a, b) => {
      if (state.fileSort === 'name-asc') return a.name.localeCompare(b.name);
      if (state.fileSort === 'size-desc') return (b.size || 0) - (a.size || 0);
      if (state.fileSort === 'type-asc') return (a.type || '').localeCompare(b.type || '');
      return (b.lastOpened || 0) - (a.lastOpened || 0);
    });

    if (docs.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-muted);">
        ${state.lang === 'ar' ? 'لا توجد ملفات بعد — اضغط "رفع ملف" أو "ملف تجريبي"' : 'No files yet — click Open File or Sample Guide'}
      </div>`;
      return;
    }

    grid.innerHTML = '';
    docs.forEach((doc) => {
      const ext = (doc.name.split('.').pop() || 'FILE').toUpperCase();
      const card = document.createElement('div');
      card.className = 'file-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div>
          <div class="file-card-top">
            <span class="file-type-badge">${ext}</span>
            <div style="display:flex;gap:6px;">
              <button class="icon-btn btn-xs fav-toggle" title="Favorite">${doc.favorite ? '★' : '☆'}</button>
              <button class="icon-btn btn-xs del-doc" title="Delete">✕</button>
            </div>
          </div>
          <div class="file-title">${doc.name}</div>
        </div>
        <div class="file-card-actions">
          <span class="file-meta">${formatSize(doc.size)} • ${doc.totalPages || 1}p</span>
          <span class="file-meta">${doc.currentPage || 1}/${doc.totalPages || 1}</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.fav-toggle') || e.target.closest('.del-doc')) return;
        openDocumentById(doc.id);
      });

      card.querySelector('.fav-toggle').addEventListener('click', async (e) => {
        e.stopPropagation();
        doc.favorite = !doc.favorite;
        await saveDocToDB(doc);
        renderRecentFilesGrid();
      });

      card.querySelector('.del-doc').addEventListener('click', async (e) => {
        e.stopPropagation();
        await deleteDocFromDB(doc.id);
        state.openDocs = state.openDocs.filter((d) => d.id !== doc.id);
        renderDocTabsBar();
        renderRecentFilesGrid();
      });

      grid.appendChild(card);
    });
  }

  function renderDocTabsBar() {
    const bar = $('docTabsBar');
    if (!bar) return;
    bar.innerHTML = '';
    state.openDocs.forEach((doc) => {
      const tab = document.createElement('div');
      tab.className = 'doc-tab' + (doc.id === state.currentDocId ? ' active' : '');
      tab.innerHTML = `
        <span class="doc-tab-title">${doc.name}</span>
        <span class="doc-tab-close" title="Close">✕</span>
      `;
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('doc-tab-close')) {
          e.stopPropagation();
          closeDocTab(doc.id);
          return;
        }
        openDocumentById(doc.id);
      });
      bar.appendChild(tab);
    });
  }

  function closeDocTab(id) {
    state.openDocs = state.openDocs.filter((d) => d.id !== id);
    if (state.currentDocId === id) {
      if (state.openDocs.length > 0) {
        openDocumentById(state.openDocs[state.openDocs.length - 1].id);
      } else {
        state.currentDocId = null;
        $('documentStage')?.classList.add('hidden');
        $('emptyReaderState')?.classList.remove('hidden');
      }
    }
    renderDocTabsBar();
  }

  // =========================================================================
  // 8. MULTI-FORMAT DOCUMENT LOADER (PDF, DOCX, PPTX, TXT, IMAGES)
  // =========================================================================
  async function handleFilesSelected(fileList) {
    if (!fileList || fileList.length === 0) return;
    let lastId = null;
    for (const file of Array.from(fileList)) {
      const buffer = await file.arrayBuffer();
      const id = 'doc_' + file.name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + file.size;
      const existing = await getDocFromDB(id);
      const record = {
        id,
        name: file.name,
        type: file.type || '',
        size: file.size,
        data: buffer,
        lastOpened: Date.now(),
        currentPage: existing?.currentPage || 1,
        totalPages: existing?.totalPages || 1,
        favorite: existing?.favorite || false,
        annotationsByPage: existing?.annotationsByPage || {},
        bookmarks: existing?.bookmarks || []
      };
      await saveDocToDB(record);
      lastId = id;
    }
    if (lastId) await openDocumentById(lastId);
  }

  async function loadSampleGuide() {
    const pages = [
      `# ⚡ Ahmedko Smart Workspace\n\nWelcome to your streamlined workspace. Everything is organized into quick tabs and icon shortcuts:\n\n* **Top Bar**: Switch tabs, toggle Projector Mode, or change Theme/Language.\n* **14 Drawing Tools**: Highlight, Pen, Shapes, Sticky Notes, Text, and PDF Export.\n* **Right Panel Tabs**: 🤖 AI Chat, 🎓 20 Study Tools, 🌐 Instant Translator, and 📝 Rich Notes.`,
      `# 🎓 Active Recall & AI Study Suite\n\nClick any of the **20 Study Tools** in the right sidebar to automatically generate:\n\n* Multiple Choice Questions (MCQs) & True/False quizzes.\n* Flashcards, Glossaries, and Last-Minute Revision Sheets.\n* Formula extractions and beginner-friendly explanations.`,
      `# 📽️ Classroom Projector Mode\n\nClick **Present** in the top bar for fullscreen presentation:\n\n* Press **L** to activate the Red Laser Pointer.\n* Press **B** or **W** for Black/White screen focus curtains.\n* Built-in timer for tracking lecture time.`
    ];
    const encoded = new TextEncoder().encode(pages.join('\n\n---PAGE---\n\n')).buffer;
    const rec = {
      id: 'sample_guide_doc',
      name: 'Ahmedko_Quick_Guide.txt',
      type: 'text/plain',
      size: encoded.byteLength,
      data: encoded,
      lastOpened: Date.now(),
      currentPage: 1,
      totalPages: pages.length,
      favorite: true,
      annotationsByPage: {},
      bookmarks: [{ page: 1, label: 'Quick Overview' }]
    };
    await saveDocToDB(rec);
    await openDocumentById(rec.id);
  }

  async function openDocumentById(id) {
    const doc = await getDocFromDB(id);
    if (!doc) return showToast('File not found', true);

    state.currentDocId = doc.id;
    state.currentDocMeta = doc;
    state.currentPage = doc.currentPage || 1;
    state.annotationsByPage = doc.annotationsByPage || {};
    state.bookmarks = doc.bookmarks || [];
    state.undoStackByPage = {};
    state.redoStackByPage = {};
    state.pageTexts = [];
    state.pdfDoc = null;
    state.virtualPages = [];

    if (!state.openDocs.some((d) => d.id === doc.id)) {
      state.openDocs.push({ id: doc.id, name: doc.name });
    }
    renderDocTabsBar();
    switchView('workspace');

    $('emptyReaderState')?.classList.add('hidden');
    const stage = $('documentStage');
    if (stage) stage.classList.remove('hidden');

    const ext = (doc.name.split('.').pop() || '').toLowerCase();
    try {
      if (ext === 'pdf' || doc.type === 'application/pdf') {
        state.docType = 'pdf';
        await parsePdf(doc.data);
      } else if (ext === 'docx') {
        state.docType = 'docx';
        await parseDocx(doc.data);
      } else if (ext === 'pptx') {
        state.docType = 'pptx';
        await parsePptx(doc.data);
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || doc.type.startsWith('image/')) {
        state.docType = 'image';
        await parseImage(doc.data, doc.type || 'image/png');
      } else {
        state.docType = 'txt';
        await parseText(doc.data);
      }

      if (state.currentPage > state.totalPages) state.currentPage = 1;
      await syncDocMetadataToDB();
      renderBookmarks();
      await renderActivePages();
    } catch (err) {
      console.error(err);
      showToast('Error opening file: ' + err.message, true);
    }
  }

  async function parsePdf(buffer) {
    const uint8 = new Uint8Array(buffer.slice(0));
    state.pdfDoc = await window.pdfjsLib.getDocument({ data: uint8 }).promise;
    state.totalPages = state.pdfDoc.numPages;
    state.pageTexts = new Array(state.totalPages).fill('');

    // Extract text asynchronously
    (async () => {
      for (let i = 1; i <= state.totalPages; i++) {
        try {
          const p = await state.pdfDoc.getPage(i);
          const tc = await p.getTextContent();
          state.pageTexts[i - 1] = tc.items.map((it) => it.str).join(' ');
        } catch (_) {}
      }
    })();

    renderPdfThumbnails();
    renderPdfOutline();
  }

  async function parseDocx(buffer) {
    const res = await window.mammoth.convertToHtml({ arrayBuffer: buffer.slice(0) });
    const temp = document.createElement('div');
    temp.innerHTML = res.value || '<p>Empty DOCX</p>';
    const blocks = Array.from(temp.children);
    const pages = [];
    let chunk = '';
    blocks.forEach((b) => {
      chunk += b.outerHTML;
      if (chunk.length > 2600) {
        pages.push(`<div class="doc-html-sheet">${chunk}</div>`);
        chunk = '';
      }
    });
    if (chunk || pages.length === 0) pages.push(`<div class="doc-html-sheet">${chunk}</div>`);
    state.virtualPages = pages;
    state.totalPages = pages.length;
    state.pageTexts = pages.map((html) => {
      const d = document.createElement('div');
      d.innerHTML = html;
      return d.textContent || '';
    });
    renderSimpleThumbnails();
  }

  async function parsePptx(buffer) {
    const zip = await window.JSZip.loadAsync(buffer.slice(0));
    const files = Object.keys(zip.files)
      .filter((k) => /^ppt\/slides\/slide\d+\.xml$/i.test(k))
      .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));

    const pages = [];
    state.pageTexts = [];
    for (let i = 0; i < files.length; i++) {
      const xml = await zip.files[files[i]].async('string');
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const texts = Array.from(doc.getElementsByTagName('a:t'))
        .map((n) => n.textContent.trim())
        .filter(Boolean);
      state.pageTexts.push(texts.join(' '));
      const title = texts[0] || `Slide ${i + 1}`;
      const body = texts
        .slice(1)
        .map((t) => `<li style="margin-bottom:8px;">${t}</li>`)
        .join('');
      pages.push(`
        <div class="pptx-slide-card">
          <div style="font-size:12px;color:#6366f1;font-weight:700;margin-bottom:8px;">SLIDE ${i + 1}</div>
          <h2 style="margin-bottom:16px;">${title}</h2>
          <ul style="padding-left:20px;line-height:1.6;">${body}</ul>
        </div>
      `);
    }
    if (pages.length === 0) pages.push('<div class="pptx-slide-card">Empty presentation</div>');
    state.virtualPages = pages;
    state.totalPages = pages.length;
    renderSimpleThumbnails();
  }

  async function parseText(buffer) {
    const raw = new TextDecoder('utf-8').decode(buffer);
    const parts = raw.includes('---PAGE---')
      ? raw.split('---PAGE---')
      : raw.match(/[\s\S]{1,2500}/g) || [raw];
    state.pageTexts = parts.map((p) => p.trim());
    state.virtualPages = parts.map((p) => {
      const html = window.AhmedkoAI ? window.AhmedkoAI.renderMarkdown(p.trim()) : p;
      return `<div class="doc-html-sheet">${html}</div>`;
    });
    state.totalPages = state.virtualPages.length;
    renderSimpleThumbnails();
  }

  async function parseImage(buffer, mime) {
    const url = URL.createObjectURL(new Blob([buffer], { type: mime }));
    state.virtualPages = [
      `<div style="padding:16px;background:#fff;"><img id="activeImageElem" src="${url}" style="max-width:780px;display:block;" /></div>`
    ];
    state.totalPages = 1;
    state.pageTexts = [''];
    renderSimpleThumbnails();
  }

  // =========================================================================
  // 9. THUMBNAILS, OUTLINE & BOOKMARKS
  // =========================================================================
  function renderPdfThumbnails() {
    const box = $('thumbnailsContainer');
    if (!box || !state.pdfDoc) return;
    box.innerHTML = '';
    const limit = Math.min(state.totalPages, 40);
    for (let p = 1; p <= limit; p++) {
      const item = document.createElement('div');
      item.className = 'thumb-item' + (p === state.currentPage ? ' active' : '');
      item.dataset.page = p;
      const c = document.createElement('canvas');
      const lbl = document.createElement('div');
      lbl.className = 'thumb-label';
      lbl.textContent = p;
      item.appendChild(c);
      item.appendChild(lbl);
      item.onclick = () => goToPage(p);
      box.appendChild(item);

      state.pdfDoc.getPage(p).then((page) => {
        const vp = page.getViewport({ scale: 0.22 });
        c.width = vp.width;
        c.height = vp.height;
        page.render({ canvasContext: c.getContext('2d'), viewport: vp });
      });
    }
  }

  function renderSimpleThumbnails() {
    const box = $('thumbnailsContainer');
    if (!box) return;
    box.innerHTML = '';
    for (let p = 1; p <= state.totalPages; p++) {
      const item = document.createElement('div');
      item.className = 'thumb-item' + (p === state.currentPage ? ' active' : '');
      item.dataset.page = p;
      item.innerHTML = `<div class="thumb-label" style="padding:10px 0;font-weight:600;">📄 ${p}</div>`;
      item.onclick = () => goToPage(p);
      box.appendChild(item);
    }
    const outline = $('outlineContainer');
    if (outline) outline.innerHTML = '<div style="padding:10px;color:var(--text-muted);font-size:12px;">—</div>';
  }

  async function renderPdfOutline() {
    const box = $('outlineContainer');
    if (!box || !state.pdfDoc) return;
    const outline = await state.pdfDoc.getOutline();
    if (!outline || outline.length === 0) {
      box.innerHTML = '<div style="padding:10px;color:var(--text-muted);font-size:12px;">No outline</div>';
      return;
    }
    box.innerHTML = '';
    outline.forEach((it) => {
      const d = document.createElement('div');
      d.style.cssText = 'padding:6px 8px;font-size:12px;cursor:pointer;border-bottom:1px solid var(--border-color);';
      d.textContent = it.title;
      d.onclick = async () => {
        try {
          const dest = typeof it.dest === 'string' ? await state.pdfDoc.getDestination(it.dest) : it.dest;
          const idx = await state.pdfDoc.getPageIndex(dest[0]);
          goToPage(idx + 1);
        } catch (_) {}
      };
      box.appendChild(d);
    });
  }

  function renderBookmarks() {
    const box = $('bookmarksContainer');
    if (!box) return;
    box.innerHTML = '';
    state.bookmarks.forEach((bm, idx) => {
      const d = document.createElement('div');
      d.style.cssText =
        'display:flex;justify-content:space-between;padding:6px 8px;font-size:12px;border-bottom:1px solid var(--border-color);cursor:pointer;';
      d.innerHTML = `<span>🔖 P.${bm.page}</span><span style="color:#ef4444;">✕</span>`;
      d.onclick = (e) => {
        if (e.target.textContent === '✕') {
          state.bookmarks.splice(idx, 1);
          syncDocMetadataToDB();
          renderBookmarks();
          return;
        }
        goToPage(bm.page);
      };
      box.appendChild(d);
    });
  }

  // =========================================================================
  // 10. VIEWPORT RENDERER & 14-TOOL ANNOTATION CANVAS
  // =========================================================================
  async function renderActivePages() {
    const stage = $('documentStage');
    if (!stage || !state.currentDocId) return;
    stage.innerHTML = '';
    stage.classList.toggle('two-page-grid', state.layoutMode === 'two-page');
    applyPaperTint(state.paperTint);

    let pagesToRender = [state.currentPage];
    if (state.layoutMode === 'two-page') {
      if (state.currentPage + 1 <= state.totalPages) {
        pagesToRender = [state.currentPage, state.currentPage + 1];
      }
    } else if (state.layoutMode === 'continuous') {
      const maxContinuous = Math.min(state.totalPages, 15);
      pagesToRender = Array.from({ length: maxContinuous }, (_, i) => i + 1);
    }

    for (const pNum of pagesToRender) {
      const wrapper = await createPageElement(pNum);
      stage.appendChild(wrapper);
    }

    updateToolbarCounters();
    syncProjectorStage();
  }

  async function createPageElement(pageNum) {
    const wrapper = document.createElement('div');
    wrapper.className = 'page-wrapper';
    wrapper.dataset.page = pageNum;
    wrapper.style.transform = `rotate(${state.rotation}deg)`;

    const annoCanvas = document.createElement('canvas');
    annoCanvas.className =
      'annotation-canvas' + (state.activeTool !== 'select' ? ' drawing-active' : '');
    annoCanvas.dataset.page = pageNum;

    if (state.docType === 'pdf' && state.pdfDoc) {
      const page = await state.pdfDoc.getPage(pageNum);
      const vp = page.getViewport({ scale: state.scale });
      const pdfCanvas = document.createElement('canvas');
      pdfCanvas.className = 'pdf-canvas';
      pdfCanvas.width = vp.width;
      pdfCanvas.height = vp.height;
      wrapper.style.width = vp.width + 'px';
      wrapper.style.height = vp.height + 'px';
      annoCanvas.width = vp.width;
      annoCanvas.height = vp.height;

      wrapper.appendChild(pdfCanvas);
      wrapper.appendChild(annoCanvas);
      await page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport: vp }).promise;
    } else {
      const content = document.createElement('div');
      content.innerHTML = state.virtualPages[pageNum - 1] || '';
      content.style.transform = `scale(${state.scale})`;
      content.style.transformOrigin = 'top left';
      wrapper.appendChild(content);
      wrapper.appendChild(annoCanvas);

      setTimeout(() => {
        annoCanvas.width = wrapper.clientWidth || 794;
        annoCanvas.height = wrapper.clientHeight || 1050;
        redrawPageAnnotations(annoCanvas, pageNum);
      }, 40);
    }

    setupAnnotationEvents(annoCanvas, pageNum);
    redrawPageAnnotations(annoCanvas, pageNum);
    return wrapper;
  }

  function updateToolbarCounters() {
    const pIn = $('pageNumberInput');
    if (pIn) pIn.value = state.currentPage;
    const tot = $('totalPagesLabel');
    if (tot) tot.textContent = state.totalPages;
    const zLbl = $('zoomPercentLabel');
    if (zLbl) zLbl.textContent = Math.round(state.scale * 100) + '%';
    const prog = $('readingProgressBar');
    if (prog) prog.style.width = Math.round((state.currentPage / state.totalPages) * 100) + '%';
    const linkBadge = $('linkPageBadge');
    if (linkBadge) linkBadge.textContent = `P.${state.currentPage}`;

    document.querySelectorAll('.thumb-item').forEach((el) => {
      el.classList.toggle('active', parseInt(el.dataset.page, 10) === state.currentPage);
    });
  }

  function goToPage(p) {
    state.currentPage = Math.max(1, Math.min(state.totalPages, parseInt(p, 10) || 1));
    syncDocMetadataToDB();
    renderActivePages();
  }

  // ---- 14-Tool Annotation Drawing ----
  function getAnnots(p) {
    if (!state.annotationsByPage[p]) state.annotationsByPage[p] = [];
    return state.annotationsByPage[p];
  }

  function saveUndoState(p) {
    if (!state.undoStackByPage[p]) state.undoStackByPage[p] = [];
    state.undoStackByPage[p].push(JSON.parse(JSON.stringify(getAnnots(p))));
    state.redoStackByPage[p] = [];
  }

  function setupAnnotationEvents(canvas, pageNum) {
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    canvas.onmousedown = (e) => {
      if (state.activeTool === 'select') return;
      const { x, y } = pos(e);

      if (state.activeTool === 'textbox' || state.activeTool === 'sticky') {
        const txt = prompt(state.activeTool === 'sticky' ? '📌 Note:' : '🔤 Text:');
        if (!txt) return;
        saveUndoState(pageNum);
        getAnnots(pageNum).push({
          tool: state.activeTool,
          x,
          y,
          text: txt,
          color: state.activeTool === 'sticky' ? '#eab308' : state.strokeColor,
          size: state.strokeSize
        });
        redrawPageAnnotations(canvas, pageNum);
        syncDocMetadataToDB();
        return;
      }

      state.isDrawing = true;
      state.startX = x;
      state.startY = y;
      state.currentPath = [{ x, y }];
    };

    canvas.onmousemove = (e) => {
      if (!state.isDrawing) return;
      const { x, y } = pos(e);
      if (['pen', 'pencil', 'freehand', 'highlighter', 'eraser'].includes(state.activeTool)) {
        state.currentPath.push({ x, y });
      }
      redrawPageAnnotations(canvas, pageNum);
      drawShape(canvas.getContext('2d'), buildTempAnnotation(x, y));
    };

    canvas.onmouseup = (e) => {
      if (!state.isDrawing) return;
      state.isDrawing = false;
      const { x, y } = pos(e);
      saveUndoState(pageNum);

      if (state.activeTool === 'eraser') {
        state.annotationsByPage[pageNum] = getAnnots(pageNum).filter((a) => {
          if (a.points) return !a.points.some((pt) => Math.hypot(pt.x - x, pt.y - y) < 22);
          return Math.hypot((a.x || 0) - x, (a.y || 0) - y) >= 25;
        });
      } else {
        getAnnots(pageNum).push(buildTempAnnotation(x, y));
      }
      redrawPageAnnotations(canvas, pageNum);
      syncDocMetadataToDB();
    };
  }

  function buildTempAnnotation(endX, endY) {
    const isHl = state.activeTool === 'highlighter';
    return {
      tool: state.activeTool,
      points: state.currentPath.slice(),
      x: state.startX,
      y: state.startY,
      endX,
      endY,
      color: isHl ? state.hlColor : state.strokeColor,
      size: isHl ? state.strokeSize * 5 : state.activeTool === 'pencil' ? 1.5 : state.strokeSize,
      opacity: isHl ? 0.35 : state.strokeOpacity
    };
  }

  function redrawPageAnnotations(canvas, pageNum) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    getAnnots(pageNum).forEach((a) => drawShape(ctx, a));
  }

  function drawShape(ctx, a) {
    if (!a || a.tool === 'eraser') return;
    ctx.save();
    ctx.strokeStyle = a.color || '#6366f1';
    ctx.fillStyle = a.color || '#6366f1';
    ctx.lineWidth = a.size || 3;
    ctx.globalAlpha = a.opacity || 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (['pen', 'pencil', 'freehand', 'highlighter'].includes(a.tool) && a.points?.length > 1) {
      ctx.beginPath();
      ctx.moveTo(a.points[0].x, a.points[0].y);
      a.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (['line', 'underline', 'strikethrough'].includes(a.tool)) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.endX, a.tool === 'line' ? a.endY : a.y);
      ctx.stroke();
    } else if (a.tool === 'rect') {
      ctx.strokeRect(a.x, a.y, a.endX - a.x, a.endY - a.y);
    } else if (a.tool === 'circle') {
      const rx = Math.abs(a.endX - a.x) / 2;
      const ry = Math.abs(a.endY - a.y) / 2;
      ctx.beginPath();
      ctx.ellipse(Math.min(a.x, a.endX) + rx, Math.min(a.y, a.endY) + ry, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (a.tool === 'arrow') {
      const ang = Math.atan2(a.endY - a.y, a.endX - a.x);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.endX, a.endY);
      ctx.lineTo(a.endX - 12 * Math.cos(ang - 0.5), a.endY - 12 * Math.sin(ang - 0.5));
      ctx.moveTo(a.endX, a.endY);
      ctx.lineTo(a.endX - 12 * Math.cos(ang + 0.5), a.endY - 12 * Math.sin(ang + 0.5));
      ctx.stroke();
    } else if (a.tool === 'textbox') {
      ctx.font = `600 ${Math.max(14, (a.size || 3) * 5)}px Inter, Cairo, sans-serif`;
      ctx.fillText(a.text || '', a.x, a.y);
    } else if (a.tool === 'sticky') {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(a.x, a.y, 140, 65);
      ctx.strokeStyle = '#eab308';
      ctx.strokeRect(a.x, a.y, 140, 65);
      ctx.fillStyle = '#0f172a';
      ctx.font = '12px Inter, Cairo, sans-serif';
      ctx.fillText('📌 ' + (a.text || '').slice(0, 18), a.x + 6, a.y + 24);
    }
    ctx.restore();
  }

  // =========================================================================
  // 11. AI CHAT & 20 STUDY TOOLS ENGINE (CONNECTED TO window.AhmedkoAI)
  // =========================================================================
  function populateAiModels() {
    const provSel = $('aiProviderSelect');
    const modSel = $('aiModelSelect');
    if (!provSel || !modSel || !window.AhmedkoAI) return;
    const prov = provSel.value;
    const models = window.AhmedkoAI.PROVIDERS[prov]?.models || [];
    modSel.innerHTML = models
      .map((m) => `<option value="${m.id}">${m.label}</option>`)
      .join('');
  }

  function getActiveChatSession() {
    let s = state.chatSessions.find((c) => c.id === state.activeChatId);
    if (!s) {
      s = { id: 'default', title: 'Main Chat', messages: [] };
      state.chatSessions.push(s);
    }
    return s;
  }

  function saveChats() {
    localStorage.setItem('ahmedko_chats', JSON.stringify(state.chatSessions));
  }

  function renderChatSessionsDropdown() {
    const sel = $('chatSessionSelect');
    if (!sel) return;
    sel.innerHTML = state.chatSessions
      .map((c) => `<option value="${c.id}" ${c.id === state.activeChatId ? 'selected' : ''}>${c.title}</option>`)
      .join('');
    renderChatMessages();
  }

  function renderChatMessages() {
    const box = $('chatMessagesList');
    if (!box) return;
    const session = getActiveChatSession();
    box.innerHTML = '';
    session.messages.forEach((m) => {
      const b = document.createElement('div');
      b.className = `chat-bubble ${m.role}`;
      b.innerHTML = window.AhmedkoAI ? window.AhmedkoAI.renderMarkdown(m.content) : m.content;
      box.appendChild(b);
    });
    box.scrollTop = box.scrollHeight;
  }

  async function sendAiPrompt(customPrompt, forceContextScope) {
    if (!window.AhmedkoAI) return;
    const input = $('chatPromptInput');
    const promptText = (customPrompt || input?.value || '').trim();
    if (!promptText) return;
    if (!customPrompt && input) input.value = '';

    activateRightTab('aiChat');
    const session = getActiveChatSession();
    session.messages.push({ role: 'user', content: promptText });
    renderChatMessages();

    const scope = forceContextScope || $('aiContextScope')?.value || 'page';
    let contextBlock = '';
    if (scope === 'selection' && state.selectedTextContext) {
      contextBlock = `Selected Text:\n${state.selectedTextContext}`;
    } else if (scope === 'document') {
      const rag = window.AhmedkoAI.buildRelevantDocumentContext(state.pageTexts, promptText);
      contextBlock = rag.text;
    } else if (scope === 'page') {
      contextBlock = `[Page ${state.currentPage}]\n${state.pageTexts[state.currentPage - 1] || ''}`;
    }

    const sysPrompt = `You are Ahmedko AI Study Assistant. Be concise, structured, and helpful.${
      contextBlock ? `\n\nDocument Context:\n${contextBlock}` : ''
    }`;

    const stopBtn = $('stopAiGenBtn');
    stopBtn?.classList.remove('hidden');

    try {
      const res = await window.AhmedkoAI.sendChatRequest({
        provider: $('aiProviderSelect')?.value || 'gemini',
        model: $('aiModelSelect')?.value,
        messages: session.messages.slice(-8),
        systemPrompt: sysPrompt
      });
      session.messages.push({ role: 'assistant', content: res.text });
      saveChats();
      renderChatMessages();
    } catch (err) {
      session.messages.push({
        role: 'assistant',
        content: `⚠️ **AI Notice:** ${err.message}\n\n*(Click **🔑 API Keys** above to add your Gemini, OpenAI, or Claude API key).*`
      });
      renderChatMessages();
    } finally {
      stopBtn?.classList.add('hidden');
    }
  }

  // =========================================================================
  // 12. SMART TRANSLATOR & NOTES
  // =========================================================================
  async function runTranslator() {
    const srcEl = $('transSourceInput');
    const outEl = $('transResultBox');
    const text = (srcEl?.value || '').trim();
    if (!text) return showToast('Enter text to translate', true);

    const sl = $('transSourceLang')?.value || 'auto';
    const tl = $('transTargetLang')?.value || 'ar';
    if (outEl) outEl.textContent = '...';

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      const translated = (data[0] || []).map((s) => s[0]).join('');
      if (outEl) outEl.textContent = translated;

      state.transHistory.unshift({ src: text.slice(0, 60), out: translated.slice(0, 80) });
      state.transHistory = state.transHistory.slice(0, 15);
      localStorage.setItem('ahmedko_trans_hist', JSON.stringify(state.transHistory));
      renderTransHistory();
    } catch (e) {
      if (outEl) outEl.textContent = 'Translation error.';
    }
  }

  function renderTransHistory() {
    const box = $('transHistoryList');
    if (!box) return;
    box.innerHTML = state.transHistory
      .map(
        (h) => `<div class="trans-hist-item"><strong>${h.src}</strong><br/><span>${h.out}</span></div>`
      )
      .join('');
  }

  function renderSavedNotes() {
    const box = $('savedNotesList');
    if (!box) return;
    const folder = $('notesFolderSelect')?.value || 'all';
    const list =
      folder === 'all' ? state.notes : state.notes.filter((n) => n.folder === folder);

    box.innerHTML = list
      .map(
        (n, i) => `
      <div class="saved-note-item">
        <div style="display:flex;justify-content:space-between;font-weight:600;margin-bottom:4px;">
          <span>${n.title || 'Note'} ${n.page ? `(P.${n.page})` : ''}</span>
          <span data-del-note="${i}" style="color:#ef4444;cursor:pointer;">✕</span>
        </div>
        <div style="font-size:12px;opacity:0.85;">${n.html}</div>
      </div>
    `
      )
      .join('');

    box.querySelectorAll('[data-del-note]').forEach((btn) => {
      btn.onclick = () => {
        state.notes.splice(parseInt(btn.dataset.delNote, 10), 1);
        localStorage.setItem('ahmedko_notes', JSON.stringify(state.notes));
        renderSavedNotes();
      };
    });
  }

  // =========================================================================
  // 13. PROJECTOR MODE
  // =========================================================================
  function toggleProjector(show) {
    state.projectorActive = show !== undefined ? show : !state.projectorActive;
    const ov = $('projectorOverlay');
    if (!ov) return;
    ov.classList.toggle('hidden', !state.projectorActive);
    if (state.projectorActive) {
      syncProjectorStage();
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }

  function syncProjectorStage() {
    if (!state.projectorActive) return;
    const pStage = $('projectorStage');
    const dStage = $('documentStage');
    if (pStage && dStage) {
      pStage.innerHTML = '';
      const firstPage = dStage.querySelector('.page-wrapper');
      if (firstPage) {
        const clone = firstPage.cloneNode(true);
        const srcC = firstPage.querySelectorAll('canvas');
        const dstC = clone.querySelectorAll('canvas');
        srcC.forEach((c, i) => dstC[i]?.getContext('2d').drawImage(c, 0, 0));
        pStage.appendChild(clone);
      }
    }
    const ind = $('projPageIndicator');
    if (ind) ind.textContent = `${state.currentPage} / ${state.totalPages}`;
  }

  // =========================================================================
  // 14. EVENT BINDINGS
  // =========================================================================
  function bindAllEvents() {
    const fileInput = $('globalFileInput');
    ['headerUploadBtn', 'heroUploadBtn', 'emptyUploadBtn'].forEach((id) => {
      $(id)?.addEventListener('click', () => fileInput?.click());
    });
    fileInput?.addEventListener('change', (e) => handleFilesSelected(e.target.files));

    ['heroSampleBtn', 'emptySampleBtn'].forEach((id) => {
      $(id)?.addEventListener('click', loadSampleGuide);
    });

    // Drag & Drop
    const dropOverlay = $('dropZoneOverlay');
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropOverlay?.classList.remove('hidden');
    });
    window.addEventListener('dragleave', (e) => {
      if (e.target === dropOverlay) dropOverlay?.classList.add('hidden');
    });
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      dropOverlay?.classList.add('hidden');
      if (e.dataTransfer?.files?.length) handleFilesSelected(e.dataTransfer.files);
    });

    // Header Actions
    $('brandHomeBtn')?.addEventListener('click', () => switchView('dashboard'));
    $('viewSwitchBtn')?.addEventListener('click', () =>
      switchView(state.currentView === 'dashboard' ? 'workspace' : 'dashboard')
    );
    $('projectorModeBtn')?.addEventListener('click', () => toggleProjector(true));
    $('langToggleBtn')?.addEventListener('click', () =>
      applyLanguage(state.lang === 'en' ? 'ar' : 'en')
    );
    $('themeToggleBtn')?.addEventListener('click', () =>
      applyTheme(state.theme === 'dark' ? 'light' : 'dark')
    );
    $('shortcutsHelpBtn')?.addEventListener('click', () =>
      $('shortcutsModal')?.classList.remove('hidden')
    );
    $('settingsOpenBtn')?.addEventListener('click', () =>
      $('settingsModal')?.classList.remove('hidden')
    );
    $('openApiKeyModalBtn')?.addEventListener('click', () =>
      $('settingsModal')?.classList.remove('hidden')
    );

    document.querySelectorAll('.close-modal-btn').forEach((btn) => {
      btn.addEventListener('click', () => $(btn.dataset.close)?.classList.add('hidden'));
    });

    // Quick Cards on Dashboard
    $('qaAiAssistant')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('aiChat');
    });
    $('qaTranslate')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('translator');
    });
    $('qaNotes')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('notes');
    });
    $('qaProjector')?.addEventListener('click', () => toggleProjector(true));

    // Dashboard Filter & Search
    document.querySelectorAll('.fm-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.fm-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.fileFilter = tab.dataset.filter;
        renderRecentFilesGrid();
      });
    });
    $('dashboardSearchInput')?.addEventListener('input', (e) => {
      state.fileSearch = e.target.value;
      renderRecentFilesGrid();
    });
    $('fileSortSelect')?.addEventListener('change', (e) => {
      state.fileSort = e.target.value;
      renderRecentFilesGrid();
    });
    $('clearHistoryBtn')?.addEventListener('click', async () => {
      await clearAllDocsFromDB();
      state.openDocs = [];
      renderDocTabsBar();
      renderRecentFilesGrid();
      showToast('History cleared');
    });

    // Sidebars & Tabs
    document.querySelectorAll('.sidebar-tab').forEach((b) => {
      b.addEventListener('click', () => activateLeftTab(b.dataset.leftTab));
    });
    document.querySelectorAll('.rp-tab').forEach((b) => {
      b.addEventListener('click', () => activateRightTab(b.dataset.rpTab));
    });
    $('toggleLeftSidebarBtn')?.addEventListener('click', () =>
      $('leftSidebar')?.classList.toggle('hidden')
    );
    $('toggleRightPanelBtn')?.addEventListener('click', () =>
      $('rightSidebar')?.classList.toggle('hidden')
    );

    // Reader Navigation & Zoom
    $('prevPageBtn')?.addEventListener('click', () => goToPage(state.currentPage - 1));
    $('nextPageBtn')?.addEventListener('click', () => goToPage(state.currentPage + 1));
    $('pageNumberInput')?.addEventListener('change', (e) => goToPage(e.target.value));
    $('zoomInBtn')?.addEventListener('click', () => {
      state.scale = Math.min(3, state.scale + 0.2);
      renderActivePages();
    });
    $('zoomOutBtn')?.addEventListener('click', () => {
      state.scale = Math.max(0.4, state.scale - 0.2);
      renderActivePages();
    });
    $('zoomPresetSelect')?.addEventListener('change', (e) => {
      const v = e.target.value;
      state.scale = v === 'fit-width' ? 1.15 : v === 'fit-page' ? 0.9 : parseFloat(v) || 1;
      renderActivePages();
    });
    $('viewLayoutSelect')?.addEventListener('change', (e) => {
      state.layoutMode = e.target.value;
      renderActivePages();
    });
    $('rotateCwBtn')?.addEventListener('click', () => {
      state.rotation = (state.rotation + 90) % 360;
      renderActivePages();
    });
    $('rotateCcwBtn')?.addEventListener('click', () => {
      state.rotation = (state.rotation + 270) % 360;
      renderActivePages();
    });

    // Extra Utilities
    $('addBookmarkBtn')?.addEventListener('click', () => {
      if (!state.bookmarks.some((b) => b.page === state.currentPage)) {
        state.bookmarks.push({ page: state.currentPage });
        syncDocMetadataToDB();
        renderBookmarks();
        showToast('Bookmarked P.' + state.currentPage);
      }
    });

    $('ttsToggleBtn')?.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) return;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
      }
      const txt =
        window.getSelection().toString().trim() ||
        state.pageTexts[state.currentPage - 1] ||
        '';
      if (!txt) return showToast('No text on this page', true);
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = /[\u0600-\u06FF]/.test(txt) ? 'ar-SA' : 'en-US';
      window.speechSynthesis.speak(u);
    });

    $('ocrPageBtn')?.addEventListener('click', async () => {
      const c = document.querySelector('.pdf-canvas') || $('activeImageElem');
      if (!c || !window.Tesseract) return showToast('No image/page for OCR', true);
      showToast('Running OCR...');
      const res = await window.Tesseract.recognize(c, 'eng+ara');
      state.pageTexts[state.currentPage - 1] = res.data.text || '';
      if ($('transSourceInput')) $('transSourceInput').value = state.pageTexts[state.currentPage - 1];
      activateRightTab('translator');
      showToast('OCR Extracted!');
    });

    $('wordCountBtn')?.addEventListener('click', () => {
      const allTxt = state.pageTexts.join('\n\n');
      const words = allTxt.trim() ? allTxt.trim().split(/\s+/).length : 0;
      if ($('docStatsMetrics')) {
        $('docStatsMetrics').innerHTML = `
          <div class="stat-box"><strong>${state.totalPages}</strong><span>Pages</span></div>
          <div class="stat-box"><strong>${words}</strong><span>Words</span></div>
          <div class="stat-box"><strong>${allTxt.length}</strong><span>Chars</span></div>
          <div class="stat-box"><strong>${Math.ceil(words / 200)}m</strong><span>Read Time</span></div>
        `;
      }
      if ($('extractedTextOutput')) $('extractedTextOutput').value = allTxt;
      $('docStatsModal')?.classList.remove('hidden');
    });

    $('copyExtractedTextBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText($('extractedTextOutput')?.value || '');
      showToast('Copied!');
    });

    $('screenshotPageBtn')?.addEventListener('click', exportPagePng);
    $('exportAnnotatedPdfBtn')?.addEventListener('click', exportPagePng);
    $('downloadDocBtn')?.addEventListener('click', exportPagePng);
    $('printDocBtn')?.addEventListener('click', () => window.print());

    // 14 Annotation Tools
    document.querySelectorAll('.anno-btn[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.anno-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTool = btn.dataset.tool;
        document.querySelectorAll('.annotation-canvas').forEach((c) => {
          c.classList.toggle('drawing-active', state.activeTool !== 'select');
        });
      });
    });

    document.querySelectorAll('.swatch[data-hl]').forEach((sw) => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
        sw.classList.add('active');
        state.hlColor = sw.dataset.hl;
      });
    });

    $('annoColorPicker')?.addEventListener('input', (e) => (state.strokeColor = e.target.value));
    $('annoSizeInput')?.addEventListener('input', (e) => (state.strokeSize = +e.target.value));
    $('annoOpacityInput')?.addEventListener(
      'input',
      (e) => (state.strokeOpacity = +e.target.value / 100)
    );

    $('annoUndoBtn')?.addEventListener('click', () => {
      const p = state.currentPage;
      if (!state.undoStackByPage[p]?.length) return;
      state.redoStackByPage[p] = state.redoStackByPage[p] || [];
      state.redoStackByPage[p].push(JSON.parse(JSON.stringify(getAnnots(p))));
      state.annotationsByPage[p] = state.undoStackByPage[p].pop();
      renderActivePages();
    });

    $('annoRedoBtn')?.addEventListener('click', () => {
      const p = state.currentPage;
      if (!state.redoStackByPage[p]?.length) return;
      state.undoStackByPage[p].push(JSON.parse(JSON.stringify(getAnnots(p))));
      state.annotationsByPage[p] = state.redoStackByPage[p].pop();
      renderActivePages();
    });

    $('annoClearPageBtn')?.addEventListener('click', () => {
      saveUndoState(state.currentPage);
      state.annotationsByPage[state.currentPage] = [];
      renderActivePages();
    });

    // AI Chat & 20 Study Tools
    $('aiProviderSelect')?.addEventListener('change', populateAiModels);
    $('testAiConnBtn')?.addEventListener('click', async () => {
      const badge = $('aiConnectionBadge');
      try {
        await window.AhmedkoAI.testConnection(
          $('aiProviderSelect').value,
          $('aiModelSelect').value
        );
        if (badge) {
          badge.textContent = '● Connected';
          badge.className = 'conn-badge connected';
        }
        showToast('AI Connected!');
      } catch (e) {
        showToast(e.message, true);
      }
    });

    $('sendChatBtn')?.addEventListener('click', () => sendAiPrompt());
    $('chatPromptInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiPrompt();
      }
    });
    $('stopAiGenBtn')?.addEventListener('click', () => window.AhmedkoAI?.stopGeneration());

    $('newChatSessionBtn')?.addEventListener('click', () => {
      const id = 'chat_' + Date.now();
      state.chatSessions.push({ id, title: `Chat ${state.chatSessions.length + 1}`, messages: [] });
      state.activeChatId = id;
      saveChats();
      renderChatSessionsDropdown();
    });
    $('clearChatSessionBtn')?.addEventListener('click', () => {
      getActiveChatSession().messages = [];
      saveChats();
      renderChatMessages();
    });

    document.querySelectorAll('.study-tool-btn[data-study]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.study;
        const basePrompt = window.AhmedkoAI?.STUDY_PROMPTS[key] || key;
        const diff = $('studyDifficultySelect')?.value || 'Medium';
        const lang = $('studyLangSelect')?.value || 'Arabic';
        const fullPrompt = `${basePrompt}\n(Difficulty Level: ${diff} | Output Language: ${lang})`;
        sendAiPrompt(
          fullPrompt,
          key === 'summarize_doc' ? 'document' : 'page'
        );
      });
    });

    // Translator
    $('runTranslateBtn')?.addEventListener('click', runTranslator);
    $('transSelectionBtn')?.addEventListener('click', () => {
      if ($('transSourceInput')) $('transSourceInput').value = window.getSelection().toString();
      runTranslator();
    });
    $('transPageBtn')?.addEventListener('click', () => {
      if ($('transSourceInput'))
        $('transSourceInput').value = (state.pageTexts[state.currentPage - 1] || '').slice(0, 1500);
      runTranslator();
    });
    $('copyTransBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText($('transResultBox')?.textContent || '');
      showToast('Copied!');
    });

    // Notes
    document.querySelectorAll('.rich-btn[data-cmd]').forEach((b) => {
      b.addEventListener('click', () =>
        document.execCommand(b.dataset.cmd, false, b.dataset.val || null)
      );
    });
    $('saveNoteBtn')?.addEventListener('click', () => {
      const editor = $('noteRichEditor');
      if (!editor || !editor.innerHTML.trim()) return;
      state.notes.unshift({
        title: $('noteTitleInput')?.value || `Page ${state.currentPage} Note`,
        folder: $('noteFolderAssign')?.value || 'General',
        page: $('linkNoteToPageChk')?.checked ? state.currentPage : null,
        html: editor.innerHTML
      });
      editor.innerHTML = '';
      if ($('noteTitleInput')) $('noteTitleInput').value = '';
      localStorage.setItem('ahmedko_notes', JSON.stringify(state.notes));
      renderSavedNotes();
      showToast('Note saved!');
    });
    $('notesFolderSelect')?.addEventListener('change', renderSavedNotes);

    // Settings Modal Save
    $('saveSettingsBtn')?.addEventListener('click', () => {
      const keys = {
        openai: $('settingOpenaiKey')?.value.trim() || '',
        gemini: $('settingGeminiKey')?.value.trim() || '',
        anthropic: $('settingAnthropicKey')?.value.trim() || ''
      };
      localStorage.setItem('ahmedko_api_keys', JSON.stringify(keys));
      applyTheme($('settingThemeSelect')?.value || state.theme);
      applyLanguage($('settingLangSelect')?.value || state.lang);
      applyPaperTint($('settingPaperTint')?.value || 'default');
      $('settingsModal')?.classList.add('hidden');
      showToast('Settings saved!');
    });

    $('resetAllDataBtn')?.addEventListener('click', async () => {
      localStorage.clear();
      await clearAllDocsFromDB();
      location.reload();
    });

    // Projector HUD Controls
    $('projPrevBtn')?.addEventListener('click', () => goToPage(state.currentPage - 1));
    $('projNextBtn')?.addEventListener('click', () => goToPage(state.currentPage + 1));
    $('projExitBtn')?.addEventListener('click', () => toggleProjector(false));
    $('projLaserBtn')?.addEventListener('click', () => {
      state.laserActive = !state.laserActive;
      $('laserPointerDot')?.classList.toggle('hidden', !state.laserActive);
    });
    $('projectorOverlay')?.addEventListener('mousemove', (e) => {
      if (!state.laserActive) return;
      const dot = $('laserPointerDot');
      if (dot) {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      }
    });
  }

  function exportPagePng() {
    const wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) return;
    const canvases = wrapper.querySelectorAll('canvas');
    if (!canvases.length) return;
    const out = document.createElement('canvas');
    out.width = canvases[0].width;
    out.height = canvases[0].height;
    const ctx = out.getContext('2d');
    canvases.forEach((c) => ctx.drawImage(c, 0, 0));
    const a = document.createElement('a');
    a.download = `ahmedko_page_${state.currentPage}.png`;
    a.href = out.toDataURL('image/png');
    a.click();
  }

  // =========================================================================
  // 15. INITIALIZE ON LOAD
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    injectCompactUIStyles();
    populateAiModels();
    applyTheme(state.theme);
    applyLanguage(state.lang);
    bindAllEvents();
    renderChatSessionsDropdown();
    renderTransHistory();
    renderSavedNotes();
    renderRecentFilesGrid();
  });
})();

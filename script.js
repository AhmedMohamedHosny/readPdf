/**
 * AHMEDKO — Complete High-DPI Controller, All-Pages Lazy Renderer, Snap Vision & Projector
 * File: script.js
 */

(function () {
  'use strict';

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const I18N = {
    ar: {
      uploadBtn: 'فتح ملف',
      readerView: 'مساحة العمل',
      dashboardBtnLabel: 'الرئيسية',
      projectorBtn: 'عرض',
      welcomeTitle: '⚡ بوابة الملفات السريعة',
      uploadFilesCta: 'رفع مستند جديد',
      loadSampleBtn: 'ملف تجريبي',
      qaAiTitle: 'المساعد الذكي',
      qaStudyTitle: 'أدوات الدراسة',
      qaTransTitle: 'المترجم الفوري',
      qaNotesTitle: 'الملاحظات',
      allFilesTab: '📂 الملفات الأخيرة',
      favoritesTab: '★ المفضلة',
      clearHistoryBtn: '🗑️ مسح الكل',
      thumbsTab: '📄 الصفحات',
      outlineTab: '📑 الفهرس',
      bookmarksTab: '🔖 الإشارات',
      bookmarkPageBtn: '+ حفظ الصفحة الحالية',
      tabAiChat: '🤖 محادثة',
      tabStudyTools: '🎓 مذاكرة',
      tabTranslator: '🌐 ترجمة',
      tabNotes: '📝 ملاحظات',
      contextLabel: 'النطاق:',
      ctxCurrentPage: 'الصفحة الحالية',
      ctxFullDoc: 'كامل المستند',
      ctxSelectedText: 'النص المحدد',
      sendBtn: 'إرسال',
      transPageBtn: 'ترجمة الصفحة',
      translateNowBtn: '⚡ ترجم الآن',
      translationResult: 'الترجمة',
      noDocOpenTitle: 'لا يوجد مستند مفتوح',
      tSelect: 'تحديد',
      tHighlight: 'تظليل',
      tPen: 'قلم',
      tArrow: 'سهم',
      tRect: 'مربع',
      tNote: 'ملصق',
      tEraser: 'مسح',
      tSnap: 'قص وشرح AI',
      searchFilesPlaceholder: 'بحث في الملفات...',
      findInDoc: 'بحث...',
      chatPlaceholder: 'اسأل عن الصفحة أو الرسمة...'
    },
    en: {
      uploadBtn: 'Open',
      readerView: 'Workspace',
      dashboardBtnLabel: 'Dashboard',
      projectorBtn: 'Present',
      welcomeTitle: '⚡ Quick Document Launch',
      uploadFilesCta: 'Upload Document',
      loadSampleBtn: 'Sample Guide',
      qaAiTitle: 'AI Chat',
      qaStudyTitle: 'Study Tools',
      qaTransTitle: 'Translator',
      qaNotesTitle: 'Notes',
      allFilesTab: '📂 Recent Files',
      favoritesTab: '★ Saved',
      clearHistoryBtn: '🗑️ Clear All',
      thumbsTab: '📄 Pages',
      outlineTab: '📑 Index',
      bookmarksTab: '🔖 Marks',
      bookmarkPageBtn: '+ Bookmark Page',
      tabAiChat: '🤖 Chat',
      tabStudyTools: '🎓 Study',
      tabTranslator: '🌐 Translate',
      tabNotes: '📝 Notes',
      contextLabel: 'Scope:',
      ctxCurrentPage: 'Current Page',
      ctxFullDoc: 'Full Doc',
      ctxSelectedText: 'Selection',
      sendBtn: 'Send',
      transPageBtn: 'Translate Page',
      translateNowBtn: '⚡ Translate Now',
      translationResult: 'Translation',
      noDocOpenTitle: 'No Document Open',
      tSelect: 'Select',
      tHighlight: 'Highlight',
      tPen: 'Pen',
      tArrow: 'Arrow',
      tRect: 'Box',
      tNote: 'Note',
      tEraser: 'Erase',
      tSnap: 'Snap & Ask AI',
      searchFilesPlaceholder: 'Filter files...',
      findInDoc: 'Find...',
      chatPlaceholder: 'Ask about this page or diagram...'
    }
  };

  const state = {
    lang: localStorage.getItem('ahmedko_lang') || 'ar',
    theme: localStorage.getItem('ahmedko_theme') || 'dark',
    paperTint: localStorage.getItem('ahmedko_tint') || 'default',
    currentView: 'dashboard',
    fileFilter: 'all',
    fileSearch: '',
    fileSort: 'date-desc',

    openDocs: [],
    currentDocId: null,
    currentDocMeta: null,
    docType: null,
    pdfDoc: null,
    virtualPages: [],
    pageTexts: [],
    currentPage: 1,
    totalPages: 1,
    scale: 1.15,
    rotation: 0,
    layoutMode: 'continuous', // Default to continuous with full-page lazy rendering

    // 8 Streamlined Tools: select, highlighter, pen, arrow, rect, sticky, eraser, snap
    activeTool: 'select',
    strokeColor: '#ef4444',
    hlColor: '#FFEB3B',
    strokeSize: 3,
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentPath: [],
    annotationsByPage: {},
    undoStackByPage: {},
    redoStackByPage: {},

    bookmarks: [],
    notes: JSON.parse(localStorage.getItem('ahmedko_notes') || '[]'),
    transHistory: JSON.parse(localStorage.getItem('ahmedko_trans_hist') || '[]'),
    chatMessages: JSON.parse(localStorage.getItem('ahmedko_chat_msgs') || '[]'),
    selectedTextContext: '',

    // In-Doc Search
    searchMatches: [], // Array of page numbers
    searchIdx: -1,

    // Pomodoro 25/5 Timer
    pomoSeconds: 25 * 60,
    pomoRunning: false,
    pomoIsBreak: false,
    pomoInterval: null,

    // Projector
    projectorActive: false,
    projScale: 1.25,
    projTool: 'laser', // 'laser' | 'pen'
    projCurtain: null,
    projTimerSeconds: 0,
    projTimerRunning: false,
    projTimerInterval: null
  };

  const $ = (id) => document.getElementById(id);
  let pageObserver = null;

  function showToast(msg, isError = false) {
    const container = $('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    if (isError) t.style.borderInlineStartColor = '#ef4444';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // =========================================================================
  // 1. POMODORO 25/5 FOCUS TIMER WITH AUDIO CHIME
  // =========================================================================
  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  }

  function updatePomoUI() {
    const m = String(Math.floor(state.pomoSeconds / 60)).padStart(2, '0');
    const s = String(state.pomoSeconds % 60).padStart(2, '0');
    if ($('pomoTimeDisplay')) $('pomoTimeDisplay').textContent = `${m}:${s}`;
    if ($('pomoModeIcon')) $('pomoModeIcon').textContent = state.pomoIsBreak ? '☕' : '🍅';
    if ($('pomoToggleBtn')) $('pomoToggleBtn').textContent = state.pomoRunning ? '⏸' : '▶';
  }

  function togglePomodoro() {
    state.pomoRunning = !state.pomoRunning;
    if (state.pomoRunning) {
      state.pomoInterval = setInterval(() => {
        state.pomoSeconds--;
        if (state.pomoSeconds <= 0) {
          playBeep();
          state.pomoIsBreak = !state.pomoIsBreak;
          state.pomoSeconds = (state.pomoIsBreak ? 5 : 25) * 60;
          showToast(state.pomoIsBreak ? '☕ وقت راحة 5 دقائق!' : '🍅 ابدأ جلسة تركيز 25 دقيقة!');
        }
        updatePomoUI();
      }, 1000);
    } else {
      clearInterval(state.pomoInterval);
    }
    updatePomoUI();
  }

  function resetPomodoro() {
    clearInterval(state.pomoInterval);
    state.pomoRunning = false;
    state.pomoIsBreak = false;
    state.pomoSeconds = 25 * 60;
    updatePomoUI();
  }

  // =========================================================================
  // 2. INDEXEDDB STORAGE
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
  // 3. LANGUAGE, THEME & VIEW NAVIGATION
  // =========================================================================
  function applyLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'ar';
    localStorage.setItem('ahmedko_lang', state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

    const dict = I18N[state.lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (dict[k] !== undefined) el.placeholder = dict[k];
    });

    if ($('langBadge')) $('langBadge').textContent = state.lang === 'ar' ? 'EN' : 'عربي';
    if ($('settingLangSelect')) $('settingLangSelect').value = state.lang;
    updateViewSwitchLabel();
    renderRecentFilesGrid();
  }

  function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem('ahmedko_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    if ($('settingThemeSelect')) $('settingThemeSelect').value = state.theme;
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

  function switchView(targetView) {
    state.currentView = targetView === 'workspace' ? 'workspace' : 'dashboard';
    $('dashboardView')?.classList.toggle('hidden', state.currentView !== 'dashboard');
    $('workspaceView')?.classList.toggle('hidden', state.currentView !== 'workspace');
    updateViewSwitchLabel();
    if (state.currentView === 'dashboard') renderRecentFilesGrid();
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
      $(id)?.classList.toggle('hidden', k !== tabName);
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
      $(id)?.classList.toggle('hidden', k !== tabName);
    });
  }

  // =========================================================================
  // 4. DASHBOARD & DOCUMENT LOADER
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
    if (state.fileFilter === 'favorites') docs = docs.filter((d) => d.favorite);
    if (state.fileSearch) {
      const q = state.fileSearch.toLowerCase();
      docs = docs.filter((d) => d.name.toLowerCase().includes(q));
    }
    docs.sort((a, b) => {
      if (state.fileSort === 'name-asc') return a.name.localeCompare(b.name);
      if (state.fileSort === 'size-desc') return (b.size || 0) - (a.size || 0);
      return (b.lastOpened || 0) - (a.lastOpened || 0);
    });

    if (docs.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:28px;color:var(--text-muted);">
        ${state.lang === 'ar' ? 'لا توجد ملفات محفوظة حالياً — اضغط "رفع مستند جديد"' : 'No saved files yet — click Upload Document'}
      </div>`;
      return;
    }

    grid.innerHTML = '';
    docs.forEach((doc) => {
      const ext = (doc.name.split('.').pop() || 'DOC').toUpperCase();
      const card = document.createElement('div');
      card.className = 'file-card';
      card.innerHTML = `
        <div>
          <div class="file-card-top">
            <span class="file-type-badge">${ext}</span>
            <div style="display:flex;gap:4px;">
              <button class="icon-btn btn-xs fav-toggle">${doc.favorite ? '★' : '☆'}</button>
              <button class="icon-btn btn-xs del-doc">✕</button>
            </div>
          </div>
          <div class="file-title" style="margin-top:8px;">${doc.name}</div>
        </div>
        <div class="file-card-actions">
          <span class="file-meta">${formatSize(doc.size)}</span>
          <span class="file-meta">P.${doc.currentPage || 1} / ${doc.totalPages || 1}</span>
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
        <span class="doc-tab-close">✕</span>
      `;
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('doc-tab-close')) {
          e.stopPropagation();
          state.openDocs = state.openDocs.filter((d) => d.id !== doc.id);
          if (state.currentDocId === doc.id) {
            if (state.openDocs.length) openDocumentById(state.openDocs[0].id);
            else {
              state.currentDocId = null;
              $('documentStage')?.classList.add('hidden');
              $('emptyReaderState')?.classList.remove('hidden');
            }
          }
          renderDocTabsBar();
          return;
        }
        openDocumentById(doc.id);
      });
      bar.appendChild(tab);
    });
  }

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
      `# ⚡ دليل مساحة عمل AHMEDKO المحدثة\n\nتم تصميم الواجهة لتعمل بأعلى دقة (HiDPI Retina) بدون أي تشوه للنصوص أو الرسومات الهندسية:\n\n* **تظليل ذكي شفاف (Multiply Blend)**: ظلل فوق أي كلام أو مخطط هندسي دون أن يختفي النص الأسود تحته.\n* **أداة قص وشرح الرسومات (✂️ قص وشرح AI)**: اختر الأداة من شريط الرسم، واسحب مربعاً حول أي رسمة هندسية ليشرحها الذكاء الاصطناعي فوراً.\n* **تحديد النصوص الذكي**: ظلل أي كلمة بالماوس لتظهر لك كبسولة الترجمة والشرح والنطق الفوري.`,
      `# 🎓 كبسولات المذاكرة والتركيز\n\n* **مؤقت بومودورو (🍅 25:00)**: موجود في البار العلوي لتنظيم جلسات المذاكرة (25 دقيقة تركيز / 5 دقائق راحة).\n* **8 أدوات دراسة مركزة**: اضغط على تبويب **🎓 مذاكرة** لتوليد أسئلة MCQ أو صح وخطأ أو شرح الرسومات الهندسية بضغطة واحدة.`
    ];
    const encoded = new TextEncoder().encode(pages.join('\n\n---PAGE---\n\n')).buffer;
    const rec = {
      id: 'sample_guide_v2',
      name: 'Ahmedko_Guide.txt',
      type: 'text/plain',
      size: encoded.byteLength,
      data: encoded,
      lastOpened: Date.now(),
      currentPage: 1,
      totalPages: pages.length,
      favorite: true,
      annotationsByPage: {},
      bookmarks: [{ page: 1 }]
    };
    await saveDocToDB(rec);
    await openDocumentById(rec.id);
  }

  // =========================================================================
  // 5. HIGH-DPI PDF & MULTI-FORMAT PARSER (ALL PAGES SUPPORTED)
  // =========================================================================
  async function openDocumentById(id) {
    const doc = await getDocFromDB(id);
    if (!doc) return showToast('الملف غير موجود', true);

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
    $('documentStage')?.classList.remove('hidden');

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
      await renderDocumentViewport(true);
    } catch (err) {
      console.error(err);
      showToast('خطأ في فتح الملف: ' + err.message, true);
    }
  }

  async function parsePdf(buffer) {
    const uint8 = new Uint8Array(buffer.slice(0));
    state.pdfDoc = await window.pdfjsLib.getDocument({ data: uint8 }).promise;
    state.totalPages = state.pdfDoc.numPages;
    state.pageTexts = new Array(state.totalPages).fill('');

    // Extract text for all pages in background for search & AI
    (async () => {
      for (let i = 1; i <= state.totalPages; i++) {
        try {
          const p = await state.pdfDoc.getPage(i);
          const tc = await p.getTextContent();
          state.pageTexts[i - 1] = tc.items.map((it) => it.str).join(' ');
        } catch (_) {}
      }
    })();

    renderAllThumbnails();
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
      if (chunk.length > 2800) {
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
    renderAllThumbnails();
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
          <div style="font-size:12px;color:#6366f1;font-weight:700;margin-bottom:8px;">SLIDE ${i + 1} / ${files.length}</div>
          <h2 style="margin-bottom:14px;">${title}</h2>
          <ul style="padding-inline-start:20px;line-height:1.6;">${body}</ul>
        </div>
      `);
    }
    state.virtualPages = pages;
    state.totalPages = pages.length || 1;
    renderAllThumbnails();
  }

  async function parseText(buffer) {
    const raw = new TextDecoder('utf-8').decode(buffer);
    const parts = raw.includes('---PAGE---')
      ? raw.split('---PAGE---')
      : raw.match(/[\s\S]{1,2600}/g) || [raw];
    state.pageTexts = parts.map((p) => p.trim());
    state.virtualPages = parts.map((p) => {
      const html = window.AhmedkoAI ? window.AhmedkoAI.renderMarkdown(p.trim()) : p;
      return `<div class="doc-html-sheet">${html}</div>`;
    });
    state.totalPages = state.virtualPages.length;
    renderAllThumbnails();
  }

  async function parseImage(buffer, mime) {
    const url = URL.createObjectURL(new Blob([buffer], { type: mime }));
    state.virtualPages = [
      `<div style="padding:16px;background:#fff;"><img id="activeImageElem" src="${url}" style="max-width:800px;display:block;" /></div>`
    ];
    state.totalPages = 1;
    state.pageTexts = [''];
    renderAllThumbnails();
  }

  // Render ALL page thumbnails (no 40-page cutoff) using IntersectionObserver
  function renderAllThumbnails() {
    const box = $('thumbnailsContainer');
    if (!box) return;
    box.innerHTML = '';

    const thumbObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          obs.unobserve(item);
          const p = parseInt(item.dataset.page, 10);
          if (state.docType === 'pdf' && state.pdfDoc) {
            const c = item.querySelector('canvas');
            state.pdfDoc.getPage(p).then((page) => {
              const vp = page.getViewport({ scale: 0.25 });
              c.width = vp.width;
              c.height = vp.height;
              page.render({ canvasContext: c.getContext('2d'), viewport: vp });
            });
          }
        });
      },
      { root: $('leftTabThumbnails'), rootMargin: '120px' }
    );

    for (let p = 1; p <= state.totalPages; p++) {
      const item = document.createElement('div');
      item.className = 'thumb-item' + (p === state.currentPage ? ' active' : '');
      item.dataset.page = p;
      if (state.docType === 'pdf') {
        const c = document.createElement('canvas');
        const lbl = document.createElement('div');
        lbl.className = 'thumb-label';
        lbl.textContent = `صفحة ${p}`;
        item.appendChild(c);
        item.appendChild(lbl);
        thumbObserver.observe(item);
      } else {
        item.innerHTML = `<div class="thumb-label" style="padding:6px 0;">📄 صفحة ${p}</div>`;
      }
      item.onclick = () => goToPage(p);
      box.appendChild(item);
    }
  }

  async function renderPdfOutline() {
    const box = $('outlineContainer');
    if (!box || !state.pdfDoc) return;
    const outline = await state.pdfDoc.getOutline();
    if (!outline || outline.length === 0) {
      box.innerHTML = '<div style="padding:10px;color:var(--text-muted);font-size:12px;">لا يوجد فهرس</div>';
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
      d.innerHTML = `<span>🔖 صفحة ${bm.page}</span><span style="color:#ef4444;">✕</span>`;
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
  // 6. HIGH-DPI VIEWPORT RENDERING & ALL-PAGES CONTINUOUS LAZY LOADER
  // =========================================================================
  async function renderDocumentViewport(scrollToCurrent = false) {
    const stage = $('documentStage');
    if (!stage || !state.currentDocId) return;

    if (pageObserver) pageObserver.disconnect();
    stage.innerHTML = '';
    stage.classList.toggle('two-page-grid', state.layoutMode === 'two-page');
    applyPaperTint(state.paperTint);

    let pagesList = [];
    if (state.layoutMode === 'single') {
      pagesList = [state.currentPage];
    } else if (state.layoutMode === 'two-page') {
      pagesList =
        state.currentPage + 1 <= state.totalPages
          ? [state.currentPage, state.currentPage + 1]
          : [state.currentPage];
    } else {
      // Continuous mode: create lightweight placeholders for ALL pages (1..totalPages)
      pagesList = Array.from({ length: state.totalPages }, (_, i) => i + 1);
    }

    // Obtain default page dimensions from page 1 for placeholders
    let defaultW = Math.round(612 * state.scale);
    let defaultH = Math.round(792 * state.scale);
    if (state.docType === 'pdf' && state.pdfDoc) {
      try {
        const p1 = await state.pdfDoc.getPage(1);
        const vp1 = p1.getViewport({ scale: state.scale, rotation: state.rotation });
        defaultW = Math.round(vp1.width);
        defaultH = Math.round(vp1.height);
      } catch (_) {}
    }

    pageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wrapper = entry.target;
          const pNum = parseInt(wrapper.dataset.page, 10);
          if (entry.isIntersecting) {
            if (!wrapper.dataset.rendered) {
              wrapper.dataset.rendered = 'true';
              populatePageContent(wrapper, pNum);
            }
            // Update active page counter when scrolling in continuous mode
            if (state.layoutMode === 'continuous' && entry.intersectionRatio > 0.35) {
              state.currentPage = pNum;
              updateToolbarCounters();
            }
          }
        });
      },
      { root: $('readerViewport'), rootMargin: '350px 0px', threshold: [0.05, 0.4] }
    );

    for (const pNum of pagesList) {
      const wrapper = document.createElement('div');
      wrapper.className = 'page-wrapper';
      wrapper.id = `page-wrap-${pNum}`;
      wrapper.dataset.page = pNum;
      wrapper.style.width = defaultW + 'px';
      wrapper.style.height = defaultH + 'px';
      stage.appendChild(wrapper);
      pageObserver.observe(wrapper);
    }

    updateToolbarCounters();

    if (scrollToCurrent && state.layoutMode === 'continuous') {
      setTimeout(() => {
        const targetEl = $(`page-wrap-${state.currentPage}`);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 60);
    }

    if (state.projectorActive) renderProjectorPage();
  }

  async function populatePageContent(wrapper, pageNum) {
    wrapper.innerHTML = '';
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // High-DPI sharpness

    const annoCanvas = document.createElement('canvas');
    annoCanvas.className =
      'annotation-canvas' + (state.activeTool !== 'select' ? ' drawing-active' : '');
    annoCanvas.dataset.page = pageNum;

    if (state.docType === 'pdf' && state.pdfDoc) {
      const page = await state.pdfDoc.getPage(pageNum);
      const cssViewport = page.getViewport({ scale: state.scale, rotation: state.rotation });
      const hiDpiViewport = page.getViewport({
        scale: state.scale * dpr,
        rotation: state.rotation
      });

      const cssW = Math.round(cssViewport.width);
      const cssH = Math.round(cssViewport.height);
      wrapper.style.width = cssW + 'px';
      wrapper.style.height = cssH + 'px';

      const pdfCanvas = document.createElement('canvas');
      pdfCanvas.className = 'pdf-canvas';
      pdfCanvas.width = Math.round(hiDpiViewport.width);
      pdfCanvas.height = Math.round(hiDpiViewport.height);
      pdfCanvas.style.width = cssW + 'px';
      pdfCanvas.style.height = cssH + 'px';

      // Interactive Text Layer for mouse text selection
      const textLayerDiv = document.createElement('div');
      textLayerDiv.className = 'textLayer';
      textLayerDiv.style.width = cssW + 'px';
      textLayerDiv.style.height = cssH + 'px';

      annoCanvas.width = cssW;
      annoCanvas.height = cssH;
      annoCanvas.style.width = cssW + 'px';
      annoCanvas.style.height = cssH + 'px';

      wrapper.appendChild(pdfCanvas);
      wrapper.appendChild(textLayerDiv);
      wrapper.appendChild(annoCanvas);

      await page.render({
        canvasContext: pdfCanvas.getContext('2d'),
        viewport: hiDpiViewport
      }).promise;

      try {
        const textContent = await page.getTextContent();
        window.pdfjsLib.renderTextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport: cssViewport,
          textDivs: []
        });
      } catch (_) {}
    } else {
      const content = document.createElement('div');
      content.innerHTML = state.virtualPages[pageNum - 1] || '';
      wrapper.style.width = 'auto';
      wrapper.style.height = 'auto';
      wrapper.appendChild(content);
      wrapper.appendChild(annoCanvas);

      setTimeout(() => {
        annoCanvas.width = wrapper.clientWidth || 780;
        annoCanvas.height = wrapper.clientHeight || 1020;
        redrawPageAnnotations(annoCanvas, pageNum);
      }, 50);
    }

    setupAnnotationEvents(annoCanvas, pageNum, wrapper);
    redrawPageAnnotations(annoCanvas, pageNum);
  }

  function updateToolbarCounters() {
    if ($('pageNumberInput')) $('pageNumberInput').value = state.currentPage;
    if ($('totalPagesLabel')) $('totalPagesLabel').textContent = state.totalPages;
    if ($('zoomPercentLabel')) $('zoomPercentLabel').textContent = Math.round(state.scale * 100) + '%';
    if ($('readingProgressBar')) {
      $('readingProgressBar').style.width =
        Math.round((state.currentPage / state.totalPages) * 100) + '%';
    }
    if ($('linkPageBadge')) $('linkPageBadge').textContent = `P.${state.currentPage}`;

    document.querySelectorAll('.thumb-item').forEach((el) => {
      const isAct = parseInt(el.dataset.page, 10) === state.currentPage;
      el.classList.toggle('active', isAct);
    });
  }

  function goToPage(p) {
    const target = Math.max(1, Math.min(state.totalPages, parseInt(p, 10) || 1));
    state.currentPage = target;
    syncDocMetadataToDB();
    updateToolbarCounters();

    if (state.layoutMode === 'continuous') {
      const wrap = $(`page-wrap-${target}`);
      if (wrap) {
        if (!wrap.dataset.rendered) {
          wrap.dataset.rendered = 'true';
          populatePageContent(wrap, target);
        }
        wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      renderDocumentViewport(false);
    }

    if (state.projectorActive) renderProjectorPage();
  }

  // =========================================================================
  // 7. NON-DESTRUCTIVE ANNOTATION ENGINE & SNAP-TO-AI VISION TOOL
  // =========================================================================
  function getAnnots(p) {
    if (!state.annotationsByPage[p]) state.annotationsByPage[p] = [];
    return state.annotationsByPage[p];
  }

  function saveUndoState(p) {
    if (!state.undoStackByPage[p]) state.undoStackByPage[p] = [];
    state.undoStackByPage[p].push(JSON.parse(JSON.stringify(getAnnots(p))));
    state.redoStackByPage[p] = [];
  }

  function setupAnnotationEvents(canvas, pageNum, wrapper) {
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    canvas.onmousedown = (e) => {
      if (state.activeTool === 'select') return;
      const { x, y } = pos(e);

      if (state.activeTool === 'sticky') {
        const txt = prompt('📌 اكتب نص الملصق أو الملاحظة على الصفحة:');
        if (!txt) return;
        saveUndoState(pageNum);
        getAnnots(pageNum).push({
          tool: 'sticky',
          x,
          y,
          text: txt,
          color: state.strokeColor
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
      if (['pen', 'highlighter', 'eraser'].includes(state.activeTool)) {
        state.currentPath.push({ x, y });
      }
      redrawPageAnnotations(canvas, pageNum);

      if (state.activeTool === 'snap') {
        // Draw dashed selection box for Snap & Ask AI
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(state.startX, state.startY, x - state.startX, y - state.startY);
        ctx.strokeRect(state.startX, state.startY, x - state.startX, y - state.startY);
        ctx.restore();
      } else {
        drawShape(canvas.getContext('2d'), buildTempAnnotation(x, y));
      }
    };

    canvas.onmouseup = (e) => {
      if (!state.isDrawing) return;
      state.isDrawing = false;
      const { x, y } = pos(e);

      if (state.activeTool === 'snap') {
        redrawPageAnnotations(canvas, pageNum);
        captureRegionAndAskAI(wrapper, state.startX, state.startY, x, y);
        return;
      }

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
      size: isHl ? state.strokeSize * 6 : state.strokeSize,
      opacity: isHl ? 0.45 : 1.0
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
    ctx.strokeStyle = a.color || '#ef4444';
    ctx.fillStyle = a.color || '#ef4444';
    ctx.lineWidth = a.size || 3;
    ctx.globalAlpha = a.opacity || 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (['pen', 'highlighter'].includes(a.tool) && a.points?.length > 1) {
      ctx.beginPath();
      ctx.moveTo(a.points[0].x, a.points[0].y);
      a.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (a.tool === 'rect') {
      ctx.strokeRect(a.x, a.y, a.endX - a.x, a.endY - a.y);
    } else if (a.tool === 'arrow') {
      const ang = Math.atan2(a.endY - a.y, a.endX - a.x);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.endX, a.endY);
      ctx.lineTo(a.endX - 13 * Math.cos(ang - 0.5), a.endY - 13 * Math.sin(ang - 0.5));
      ctx.moveTo(a.endX, a.endY);
      ctx.lineTo(a.endX - 13 * Math.cos(ang + 0.5), a.endY - 13 * Math.sin(ang + 0.5));
      ctx.stroke();
    } else if (a.tool === 'sticky') {
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(a.x, a.y, 155, 65);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(a.x, a.y, 155, 65);
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 12px Cairo, Inter, sans-serif';
      ctx.fillText('📌 ' + (a.text || '').slice(0, 22), a.x + 8, a.y + 24);
      if ((a.text || '').length > 22) {
        ctx.fillText((a.text || '').slice(22, 45), a.x + 8, a.y + 44);
      }
    }
    ctx.restore();
  }

  // Crop selected region from PDF canvas and send to Vision AI
  function captureRegionAndAskAI(wrapper, x1, y1, x2, y2) {
    const pdfCanvas = wrapper.querySelector('.pdf-canvas');
    if (!pdfCanvas) return showToast('متاح لصفحات PDF', true);

    const rx = Math.min(x1, x2);
    const ry = Math.min(y1, y2);
    const rw = Math.abs(x2 - x1);
    const rh = Math.abs(y2 - y1);
    if (rw < 20 || rh < 20) return;

    const scaleRatio = pdfCanvas.width / pdfCanvas.clientWidth;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = rw * scaleRatio;
    cropCanvas.height = rh * scaleRatio;
    cropCanvas
      .getContext('2d')
      .drawImage(
        pdfCanvas,
        rx * scaleRatio,
        ry * scaleRatio,
        rw * scaleRatio,
        rh * scaleRatio,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height
      );

    const dataUrl = cropCanvas.toDataURL('image/png');
    showToast('✂️ جاري تحليل الجزء المحدد بالذكاء البصري...');
    sendAiPrompt(
      'اشرح هذه الرسمة أو الجزء المقتطع بالتفصيل ووضح كافة البيانات والمصطلحات الموجودة فيه.',
      'page',
      dataUrl
    );
  }

  // =========================================================================
  // 8. FLOATING SELECTION POPUP (TRANSLATE, EXPLAIN, NOTE, SPEAK, COPY)
  // =========================================================================
  function bindSelectionPopup() {
    const popup = $('selectionPopup');
    if (!popup) return;

    document.addEventListener('mouseup', (e) => {
      if (popup.contains(e.target)) return;
      setTimeout(() => {
        const sel = window.getSelection();
        const text = (sel?.toString() || '').trim();
        if (!text || text.length < 2 || !$('readerViewport')?.contains(sel.anchorNode)) {
          popup.classList.add('hidden');
          return;
        }
        state.selectedTextContext = text;
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        popup.style.top = Math.max(10, rect.top - 42) + 'px';
        popup.style.left = Math.max(10, rect.left) + 'px';
        popup.classList.remove('hidden');
      }, 20);
    });

    $('selPopupTranslate')?.addEventListener('click', () => {
      popup.classList.add('hidden');
      activateRightTab('translator');
      if ($('transSourceInput')) $('transSourceInput').value = state.selectedTextContext;
      runTranslator();
    });

    $('selPopupExplain')?.addEventListener('click', () => {
      popup.classList.add('hidden');
      sendAiPrompt(`اشرح هذه العبارة بالتفصيل:\n"${state.selectedTextContext}"`, 'selection');
    });

    $('selPopupNote')?.addEventListener('click', () => {
      popup.classList.add('hidden');
      activateRightTab('notes');
      const ed = $('noteRichEditor');
      if (ed) ed.innerHTML += `<p>• ${state.selectedTextContext}</p>`;
    });

    $('selPopupSpeak')?.addEventListener('click', () => {
      popup.classList.add('hidden');
      speakText(state.selectedTextContext);
    });

    $('selPopupCopy')?.addEventListener('click', () => {
      popup.classList.add('hidden');
      navigator.clipboard.writeText(state.selectedTextContext);
      showToast('تم النسخ!');
    });
  }

  function speakText(txt) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = /[\u0600-\u06FF]/.test(txt) ? 'ar-SA' : 'en-US';
    window.speechSynthesis.speak(u);
  }

  // =========================================================================
  // 9. IN-DOCUMENT SEARCH (Ctrl + F)
  // =========================================================================
  function runDocSearch(query) {
    const q = (query || '').trim().toLowerCase();
    state.searchMatches = [];
    state.searchIdx = -1;
    if (!q) {
      if ($('docSearchCount')) $('docSearchCount').textContent = '0/0';
      return;
    }
    state.pageTexts.forEach((txt, idx) => {
      if ((txt || '').toLowerCase().includes(q)) {
        state.searchMatches.push(idx + 1);
      }
    });
    if (state.searchMatches.length > 0) {
      state.searchIdx = 0;
      jumpToSearchMatch();
    } else {
      if ($('docSearchCount')) $('docSearchCount').textContent = '0/0';
      showToast('لا توجد نتائج مطابقة', true);
    }
  }

  function jumpToSearchMatch() {
    if (!state.searchMatches.length) return;
    const pageNum = state.searchMatches[state.searchIdx];
    if ($('docSearchCount')) {
      $('docSearchCount').textContent = `${state.searchIdx + 1}/${state.searchMatches.length}`;
    }
    goToPage(pageNum);
  }

  // =========================================================================
  // 10. AI CHAT & 8 STUDY CAPSULES (WITH VISION SUPPORT)
  // =========================================================================
  function populateAiModels() {
    const provSel = $('aiProviderSelect');
    const modSel = $('aiModelSelect');
    if (!provSel || !modSel || !window.AhmedkoAI) return;
    const models = window.AhmedkoAI.PROVIDERS[provSel.value]?.models || [];
    modSel.innerHTML = models
      .map((m) => `<option value="${m.id}">${m.label}</option>`)
      .join('');
  }

  function renderChatMessages() {
    const box = $('chatMessagesList');
    if (!box) return;
    box.innerHTML = '';
    state.chatMessages.forEach((m) => {
      const b = document.createElement('div');
      b.className = `chat-bubble ${m.role}`;
      b.innerHTML = window.AhmedkoAI ? window.AhmedkoAI.renderMarkdown(m.content) : m.content;
      box.appendChild(b);
    });
    box.scrollTop = box.scrollHeight;
  }

  function getActivePageImageBase64() {
    const wrap =
      $(`page-wrap-${state.currentPage}`) || document.querySelector('.page-wrapper');
    const canvas = wrap?.querySelector('.pdf-canvas');
    if (!canvas) return null;
    return canvas.toDataURL('image/jpeg', 0.82);
  }

  async function sendAiPrompt(customPrompt, forceScope, customImageBase64 = null) {
    if (!window.AhmedkoAI) return;
    const input = $('chatPromptInput');
    const promptText = (customPrompt || input?.value || '').trim();
    if (!promptText) return;
    if (!customPrompt && input) input.value = '';

    activateRightTab('aiChat');
    state.chatMessages.push({ role: 'user', content: promptText });
    renderChatMessages();

    const scope = forceScope || $('aiContextScope')?.value || 'page';
    let contextBlock = '';
    if (scope === 'selection' && state.selectedTextContext) {
      contextBlock = `Selected Text:\n${state.selectedTextContext}`;
    } else if (scope === 'document') {
      contextBlock = window.AhmedkoAI.buildRelevantDocumentContext(
        state.pageTexts,
        promptText
      ).text;
    } else {
      contextBlock = `[Page ${state.currentPage}]\n${
        state.pageTexts[state.currentPage - 1] || ''
      }`;
    }

    const sysPrompt = `You are Ahmedko AI Academic & Engineering Assistant. Answer clearly and accurately.${
      contextBlock ? `\n\nDocument Context:\n${contextBlock}` : ''
    }`;

    $('stopAiGenBtn')?.classList.remove('hidden');

    try {
      const res = await window.AhmedkoAI.sendChatRequest({
        provider: $('aiProviderSelect')?.value || 'gemini',
        model: $('aiModelSelect')?.value,
        messages: state.chatMessages.slice(-8),
        systemPrompt: sysPrompt,
        imageBase64: customImageBase64
      });
      state.chatMessages.push({ role: 'assistant', content: res.text });
      localStorage.setItem('ahmedko_chat_msgs', JSON.stringify(state.chatMessages.slice(-30)));
      renderChatMessages();
    } catch (err) {
      state.chatMessages.push({
        role: 'assistant',
        content: `⚠️ **تنبيه:** ${err.message}`
      });
      renderChatMessages();
    } finally {
      $('stopAiGenBtn')?.classList.add('hidden');
    }
  }

  // =========================================================================
  // 11. TRANSLATOR, NOTES & PDF EXPORT
  // =========================================================================
  async function runTranslator() {
    const srcEl = $('transSourceInput');
    const outEl = $('transResultBox');
    const text = (srcEl?.value || '').trim();
    if (!text) return showToast('أدخل نصاً للترجمة', true);

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
      state.transHistory = state.transHistory.slice(0, 12);
      localStorage.setItem('ahmedko_trans_hist', JSON.stringify(state.transHistory));
      renderTransHistory();
    } catch (_) {
      if (outEl) outEl.textContent = 'تعذر الاتصال بخدمة الترجمة.';
    }
  }

  function renderTransHistory() {
    const box = $('transHistoryList');
    if (!box) return;
    box.innerHTML = state.transHistory
      .map(
        (h) =>
          `<div class="trans-hist-item"><strong>${h.src}</strong><br/><span>${h.out}</span></div>`
      )
      .join('');
  }

  function renderSavedNotes() {
    const box = $('savedNotesList');
    if (!box) return;
    box.innerHTML = state.notes
      .map(
        (n, i) => `
      <div class="saved-note-item">
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
          <span style="cursor:pointer;color:var(--accent);" data-goto="${n.page || 1}">${
          n.title || 'ملاحظة'
        } (P.${n.page || 1})</span>
          <span data-del-note="${i}" style="color:#ef4444;cursor:pointer;">✕</span>
        </div>
        <div>${n.html}</div>
      </div>
    `
      )
      .join('');

    box.querySelectorAll('[data-goto]').forEach((el) => {
      el.onclick = () => goToPage(parseInt(el.dataset.goto, 10));
    });
    box.querySelectorAll('[data-del-note]').forEach((btn) => {
      btn.onclick = () => {
        state.notes.splice(parseInt(btn.dataset.delNote, 10), 1);
        localStorage.setItem('ahmedko_notes', JSON.stringify(state.notes));
        renderSavedNotes();
      };
    });
  }

  async function exportAnnotatedPdf() {
    const wrap =
      $(`page-wrap-${state.currentPage}`) || document.querySelector('.page-wrapper');
    if (!wrap) return;
    const pdfC = wrap.querySelector('.pdf-canvas');
    const annoC = wrap.querySelector('.annotation-canvas');
    if (!pdfC && !annoC) return;

    const merged = document.createElement('canvas');
    merged.width = pdfC ? pdfC.width : annoC.width;
    merged.height = pdfC ? pdfC.height : annoC.height;
    const ctx = merged.getContext('2d');

    if (pdfC) ctx.drawImage(pdfC, 0, 0);
    if (annoC) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(annoC, 0, 0, merged.width, merged.height);
      ctx.restore();
    }

    if (window.jspdf?.jsPDF) {
      const orientation = merged.width > merged.height ? 'l' : 'p';
      const pdf = new window.jspdf.jsPDF(orientation, 'pt', [merged.width, merged.height]);
      pdf.addImage(
        merged.toDataURL('image/jpeg', 0.92),
        'JPEG',
        0,
        0,
        merged.width,
        merged.height
      );
      pdf.save(`${(state.currentDocMeta?.name || 'page').replace(/\.pdf$/i, '')}_P${state.currentPage}.pdf`);
      showToast('💾 تم حفظ الصفحة كملف PDF بالتعديلات!');
    } else {
      const a = document.createElement('a');
      a.download = `page_${state.currentPage}.png`;
      a.href = merged.toDataURL('image/png');
      a.click();
    }
  }

  // =========================================================================
  // 12. INTERACTIVE PROJECTOR MODE (LIVE PEN, LASER, TIMER & CURTAINS)
  // =========================================================================
  function toggleProjector(show) {
    state.projectorActive = show !== undefined ? show : !state.projectorActive;
    const ov = $('projectorOverlay');
    if (!ov) return;
    ov.classList.toggle('hidden', !state.projectorActive);

    if (state.projectorActive) {
      renderProjectorPage();
      $('laserPointerDot')?.classList.toggle('hidden', state.projTool !== 'laser');
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      $('laserPointerDot')?.classList.add('hidden');
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }

  async function renderProjectorPage() {
    if (!state.projectorActive) return;
    const pStage = $('projectorStage');
    if (!pStage) return;
    pStage.innerHTML = '';

    const prevScale = state.scale;
    state.scale = state.projScale;
    const wrap = document.createElement('div');
    wrap.className = 'page-wrapper';
    wrap.dataset.page = state.currentPage;
    pStage.appendChild(wrap);
    await populatePageContent(wrap, state.currentPage);
    state.scale = prevScale;

    // If Pen is active inside Projector, enable drawing directly on projector canvas
    const projAnno = wrap.querySelector('.annotation-canvas');
    if (projAnno) {
      projAnno.classList.toggle('drawing-active', state.projTool === 'pen');
    }

    if ($('projPageIndicator')) {
      $('projPageIndicator').textContent = `${state.currentPage} / ${state.totalPages}`;
    }
  }

  function toggleProjTimer() {
    state.projTimerRunning = !state.projTimerRunning;
    if ($('projTimerToggleBtn')) {
      $('projTimerToggleBtn').textContent = state.projTimerRunning ? '⏸' : '▶';
    }
    if (state.projTimerRunning) {
      state.projTimerInterval = setInterval(() => {
        state.projTimerSeconds++;
        const m = String(Math.floor(state.projTimerSeconds / 60)).padStart(2, '0');
        const s = String(state.projTimerSeconds % 60).padStart(2, '0');
        if ($('projTimerDisplay')) $('projTimerDisplay').textContent = `${m}:${s}`;
      }, 1000);
    } else {
      clearInterval(state.projTimerInterval);
    }
  }

  function toggleCurtain(mode) {
    const c = $('projectorCurtain');
    if (!c) return;
    if (state.projCurtain === mode) {
      state.projCurtain = null;
      c.className = 'projector-curtain hidden';
    } else {
      state.projCurtain = mode;
      c.className = `projector-curtain ${mode}`;
    }
  }

  // =========================================================================
  // 13. SIDEBAR RESIZER & EVENT BINDINGS
  // =========================================================================
  function initRightSidebarResizer() {
    const resizer = $('rightPanelResizer');
    const sidebar = $('rightSidebar');
    if (!resizer || !sidebar) return;
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      resizer.classList.add('resizing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const isRtl = document.documentElement.dir === 'rtl';
      const newWidth = isRtl ? e.clientX : window.innerWidth - e.clientX;
      if (newWidth >= 270 && newWidth <= 580) {
        sidebar.style.width = newWidth + 'px';
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
      }
    });
  }

  function bindAllEvents() {
    const fileInput = $('globalFileInput');
    ['headerUploadBtn', 'heroUploadBtn', 'emptyUploadBtn'].forEach((id) => {
      $(id)?.addEventListener('click', () => fileInput?.click());
    });
    fileInput?.addEventListener('change', (e) => handleFilesSelected(e.target.files));

    ['heroSampleBtn', 'emptySampleBtn'].forEach((id) => {
      $(id)?.addEventListener('click', loadSampleGuide);
    });

    // Pomodoro
    $('pomoToggleBtn')?.addEventListener('click', togglePomodoro);
    $('pomoResetBtn')?.addEventListener('click', resetPomodoro);

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

    // Header Controls
    $('brandHomeBtn')?.addEventListener('click', () => switchView('dashboard'));
    $('viewSwitchBtn')?.addEventListener('click', () =>
      switchView(state.currentView === 'dashboard' ? 'workspace' : 'dashboard')
    );
    $('projectorModeBtn')?.addEventListener('click', () => toggleProjector(true));
    $('langToggleBtn')?.addEventListener('click', () =>
      applyLanguage(state.lang === 'ar' ? 'en' : 'ar')
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

    // Dashboard Quick Cards
    $('qaAiAssistant')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('aiChat');
    });
    $('qaStudy')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('studyTools');
    });
    $('qaTranslate')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('translator');
    });
    $('qaNotes')?.addEventListener('click', () => {
      switchView('workspace');
      activateRightTab('notes');
    });

    // Dashboard Filters
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
      showToast('تم مسح السجل');
    });

    // Sidebar Tabs
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
      renderDocumentViewport(true);
    });
    $('zoomOutBtn')?.addEventListener('click', () => {
      state.scale = Math.max(0.5, state.scale - 0.2);
      renderDocumentViewport(true);
    });
    $('zoomPresetSelect')?.addEventListener('change', (e) => {
      const v = e.target.value;
      state.scale = v === 'fit-width' ? 1.2 : parseFloat(v) || 1;
      renderDocumentViewport(true);
    });
    $('viewLayoutSelect')?.addEventListener('change', (e) => {
      state.layoutMode = e.target.value;
      renderDocumentViewport(true);
    });
    $('rotateCwBtn')?.addEventListener('click', () => {
      state.rotation = (state.rotation + 90) % 360;
      renderDocumentViewport(false);
    });

    // In-Doc Search
    $('docSearchInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runDocSearch(e.target.value);
    });
    $('docSearchNextBtn')?.addEventListener('click', () => {
      if (!state.searchMatches.length) return runDocSearch($('docSearchInput')?.value);
      state.searchIdx = (state.searchIdx + 1) % state.searchMatches.length;
      jumpToSearchMatch();
    });
    $('docSearchPrevBtn')?.addEventListener('click', () => {
      if (!state.searchMatches.length) return;
      state.searchIdx =
        (state.searchIdx - 1 + state.searchMatches.length) % state.searchMatches.length;
      jumpToSearchMatch();
    });

    // Bookmarks, TTS, OCR, Export
    $('addBookmarkBtn')?.addEventListener('click', () => {
      if (!state.bookmarks.some((b) => b.page === state.currentPage)) {
        state.bookmarks.push({ page: state.currentPage });
        syncDocMetadataToDB();
        renderBookmarks();
        showToast('تم حفظ الإشارة لصفحة ' + state.currentPage);
      }
    });

    $('ttsToggleBtn')?.addEventListener('click', () => {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
        return;
      }
      const txt =
        window.getSelection().toString().trim() ||
        state.pageTexts[state.currentPage - 1] ||
        '';
      if (!txt) return showToast('لا يوجد نص للقراءة في هذه الصفحة', true);
      speakText(txt);
    });

    $('ocrPageBtn')?.addEventListener('click', async () => {
      const wrap =
        $(`page-wrap-${state.currentPage}`) || document.querySelector('.page-wrapper');
      const c = wrap?.querySelector('.pdf-canvas') || $('activeImageElem');
      if (!c || !window.Tesseract) return showToast('لا توجد صفحة لاستخراج النص', true);
      showToast('🔍 جاري استخراج النص عبر OCR...');
      const res = await window.Tesseract.recognize(c, 'eng+ara');
      state.pageTexts[state.currentPage - 1] = res.data.text || '';
      if ($('transSourceInput')) $('transSourceInput').value = state.pageTexts[state.currentPage - 1];
      activateRightTab('translator');
      showToast('تم استخراج النص بنجاح!');
    });

    $('exportAnnotatedPdfBtn')?.addEventListener('click', exportAnnotatedPdf);

    // Annotation Tools
    document.querySelectorAll('.anno-btn[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.anno-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTool = btn.dataset.tool;
        document.querySelectorAll('.annotation-canvas').forEach((c) => {
          c.classList.toggle('drawing-active', state.activeTool !== 'select');
        });
        if (state.activeTool === 'snap') {
          showToast('✂️ اسحب بالماوس حول أي رسمة في الصفحة لشرحها بالذكاء الاصطناعي');
        }
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

    $('annoUndoBtn')?.addEventListener('click', () => {
      const p = state.currentPage;
      if (!state.undoStackByPage[p]?.length) return;
      state.redoStackByPage[p] = state.redoStackByPage[p] || [];
      state.redoStackByPage[p].push(JSON.parse(JSON.stringify(getAnnots(p))));
      state.annotationsByPage[p] = state.undoStackByPage[p].pop();
      const wrap = $(`page-wrap-${p}`);
      redrawPageAnnotations(wrap?.querySelector('.annotation-canvas'), p);
      syncDocMetadataToDB();
    });

    $('annoRedoBtn')?.addEventListener('click', () => {
      const p = state.currentPage;
      if (!state.redoStackByPage[p]?.length) return;
      state.undoStackByPage[p].push(JSON.parse(JSON.stringify(getAnnots(p))));
      state.annotationsByPage[p] = state.redoStackByPage[p].pop();
      const wrap = $(`page-wrap-${p}`);
      redrawPageAnnotations(wrap?.querySelector('.annotation-canvas'), p);
      syncDocMetadataToDB();
    });

    $('annoClearPageBtn')?.addEventListener('click', () => {
      const p = state.currentPage;
      saveUndoState(p);
      state.annotationsByPage[p] = [];
      const wrap = $(`page-wrap-${p}`);
      redrawPageAnnotations(wrap?.querySelector('.annotation-canvas'), p);
      syncDocMetadataToDB();
    });

    // AI Chat & 8 Study Capsules
    $('aiProviderSelect')?.addEventListener('change', populateAiModels);
    $('sendChatBtn')?.addEventListener('click', () => sendAiPrompt());
    $('chatPromptInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiPrompt();
      }
    });
    $('stopAiGenBtn')?.addEventListener('click', () => window.AhmedkoAI?.stopGeneration());
    $('clearChatSessionBtn')?.addEventListener('click', () => {
      state.chatMessages = [];
      localStorage.removeItem('ahmedko_chat_msgs');
      renderChatMessages();
    });

    $('explainVisualPageBtn')?.addEventListener('click', () => {
      const img = getActivePageImageBase64();
      sendAiPrompt(
        window.AhmedkoAI.STUDY_PROMPTS.explain_diagrams,
        'page',
        img
      );
    });

    document.querySelectorAll('.study-tool-btn[data-study]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.study;
        const basePrompt = window.AhmedkoAI?.STUDY_PROMPTS[key] || key;
        const diff = $('studyDifficultySelect')?.value || 'Medium';
        const lang = $('studyLangSelect')?.value || 'Arabic';
        const img = key === 'explain_diagrams' ? getActivePageImageBase64() : null;
        sendAiPrompt(`${basePrompt}\n(المستوى: ${diff} | اللغة: ${lang})`, 'page', img);
      });
    });

    // Translator & Notes
    $('runTranslateBtn')?.addEventListener('click', runTranslator);
    $('transPageBtn')?.addEventListener('click', () => {
      if ($('transSourceInput')) {
        $('transSourceInput').value = (state.pageTexts[state.currentPage - 1] || '').slice(
          0,
          1600
        );
      }
      runTranslator();
    });
    $('copyTransBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText($('transResultBox')?.textContent || '');
      showToast('تم نسخ الترجمة!');
    });
    $('insertTransToNoteBtn')?.addEventListener('click', () => {
      const txt = $('transResultBox')?.textContent || '';
      if (!txt) return;
      activateRightTab('notes');
      if ($('noteRichEditor')) $('noteRichEditor').innerHTML += `<p>${txt}</p>`;
    });

    $('saveNoteBtn')?.addEventListener('click', () => {
      const ed = $('noteRichEditor');
      if (!ed || !ed.innerHTML.trim()) return;
      state.notes.unshift({
        title: $('noteTitleInput')?.value || `ملاحظة صفحة ${state.currentPage}`,
        page: $('linkNoteToPageChk')?.checked ? state.currentPage : 1,
        html: ed.innerHTML
      });
      ed.innerHTML = '';
      if ($('noteTitleInput')) $('noteTitleInput').value = '';
      localStorage.setItem('ahmedko_notes', JSON.stringify(state.notes));
      renderSavedNotes();
      showToast('تم حفظ الملاحظة!');
    });

    $('exportNoteTxtBtn')?.addEventListener('click', () => {
      const txt = state.notes
        .map((n) => `[${n.title} - P.${n.page}]\n${n.html.replace(/<[^>]+>/g, '')}`)
        .join('\n\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
      a.download = 'Ahmedko_Notes.txt';
      a.click();
    });

    // Settings Save
    $('saveSettingsBtn')?.addEventListener('click', () => {
      const existing = JSON.parse(localStorage.getItem('ahmedko_api_keys') || '{}');
      const keys = {
        gemini: $('settingGeminiKey')?.value.trim() || existing.gemini || '',
        openai: $('settingOpenaiKey')?.value.trim() || existing.openai || '',
        anthropic: $('settingAnthropicKey')?.value.trim() || existing.anthropic || ''
      };
      localStorage.setItem('ahmedko_api_keys', JSON.stringify(keys));
      applyTheme($('settingThemeSelect')?.value || state.theme);
      applyLanguage($('settingLangSelect')?.value || state.lang);
      applyPaperTint($('settingPaperTint')?.value || 'default');
      $('settingsModal')?.classList.add('hidden');
      showToast('تم حفظ الإعدادات بنجاح!');
    });

    $('resetAllDataBtn')?.addEventListener('click', async () => {
      localStorage.clear();
      await clearAllDocsFromDB();
      location.reload();
    });

    // Projector HUD Controls
    $('projPrevBtn')?.addEventListener('click', () => goToPage(state.currentPage - 1));
    $('projNextBtn')?.addEventListener('click', () => goToPage(state.currentPage + 1));
    $('projZoomInBtn')?.addEventListener('click', () => {
      state.projScale = Math.min(3, state.projScale + 0.25);
      renderProjectorPage();
    });
    $('projZoomOutBtn')?.addEventListener('click', () => {
      state.projScale = Math.max(0.6, state.projScale - 0.25);
      renderProjectorPage();
    });
    $('projFitBtn')?.addEventListener('click', () => {
      state.projScale = 1.25;
      renderProjectorPage();
    });
    $('projLaserBtn')?.addEventListener('click', () => {
      state.projTool = 'laser';
      $('projLaserBtn')?.classList.add('active');
      $('projPenBtn')?.classList.remove('active');
      $('laserPointerDot')?.classList.remove('hidden');
      renderProjectorPage();
    });
    $('projPenBtn')?.addEventListener('click', () => {
      state.projTool = 'pen';
      state.activeTool = 'pen';
      $('projPenBtn')?.classList.add('active');
      $('projLaserBtn')?.classList.remove('active');
      $('laserPointerDot')?.classList.add('hidden');
      renderProjectorPage();
    });
    $('projBlackScreenBtn')?.addEventListener('click', () => toggleCurtain('black'));
    $('projWhiteScreenBtn')?.addEventListener('click', () => toggleCurtain('white'));
    $('projTimerToggleBtn')?.addEventListener('click', toggleProjTimer);
    $('projTimerResetBtn')?.addEventListener('click', () => {
      clearInterval(state.projTimerInterval);
      state.projTimerRunning = false;
      state.projTimerSeconds = 0;
      if ($('projTimerDisplay')) $('projTimerDisplay').textContent = '00:00';
      if ($('projTimerToggleBtn')) $('projTimerToggleBtn').textContent = '▶';
    });
    $('projExitBtn')?.addEventListener('click', () => toggleProjector(false));

    $('projectorOverlay')?.addEventListener('mousemove', (e) => {
      if (!state.projectorActive || state.projTool !== 'laser') return;
      const dot = $('laserPointerDot');
      if (dot) {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      }
    });

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') {
        goToPage(state.lang === 'ar' ? state.currentPage - 1 : state.currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        goToPage(state.lang === 'ar' ? state.currentPage + 1 : state.currentPage - 1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        $('annoUndoBtn')?.click();
      } else if (state.projectorActive) {
        if (e.key.toLowerCase() === 'b') toggleCurtain('black');
        if (e.key.toLowerCase() === 'w') toggleCurtain('white');
        if (e.key.toLowerCase() === 'l') $('projLaserBtn')?.click();
        if (e.key === 'Escape') toggleProjector(false);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    populateAiModels();
    applyTheme(state.theme);
    applyLanguage(state.lang);
    bindAllEvents();
    bindSelectionPopup();
    initRightSidebarResizer();
    renderChatMessages();
    renderTransHistory();
    renderSavedNotes();
    renderRecentFilesGrid();
  });
})();
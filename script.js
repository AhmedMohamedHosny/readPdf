/**
 * AHMEDKO - Core Application Controller, Document Reader, Annotations, Translator & AI Suite
 * File: script.js
 */

(function () {
  'use strict';

  // Configure PDF.js worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // Bilingual I18N Dictionary (English LTR & Arabic RTL)
  const I18N = {
    en: {
      tagline: 'Your Knowledge. Your Workspace. Your AI.',
      uploadBtn: 'Open File',
      readerView: 'Workspace',
      dashboardView: 'Dashboard',
      projectorBtn: 'Projector',
      welcomeTitle: 'Welcome to Ahmedko – Your Smart Workspace.',
      welcomeSub:
        'Open, annotate, translate, study, and present PDF, DOCX, PPTX, TXT & Images with 20 integrated AI study tools.',
      uploadFilesCta: 'Upload Documents',
      loadSampleBtn: 'Load Interactive Sample Guide',
      allFilesTab: 'Recent Documents',
      favoritesTab: '★ Favorites',
      clearHistoryBtn: 'Clear History',
      storageNotice:
        'ℹ️ Files are cached locally in your browser IndexedDB for instant reopening.',
      thumbsTab: 'Pages',
      outlineTab: 'Outline',
      bookmarksTab: 'Bookmarks',
      bookmarkPageBtn: '+ Bookmark Current Page',
      tabAiChat: '🤖 AI Chat',
      tabStudyTools: '🎓 Study (20)',
      tabTranslator: '🌐 Translate',
      tabNotes: '📝 Notes',
      sendBtn: 'Send',
      translateNowBtn: 'Translate Now',
      translatePageBtn: 'Translate Current Page',
      addNoteBtn: 'Save Note',
      exportNotesBtn: 'Export Notes',
      exportPdfBtn: 'Export Annotated PDF',
      ocrBtn: 'Run OCR on Page',
      ttsPlayBtn: 'Read Aloud',
      ttsStopBtn: 'Stop Reading',
      noFilesMsg: 'No documents in history yet. Upload a file or load the sample guide to begin.',
      noBookmarksMsg: 'No bookmarks saved for this document.',
      noOutlineMsg: 'No table of contents available for this file.',
      pageLabel: 'Page',
      ofLabel: 'of',
      translatingMsg: 'Translating text...',
      ocrRunningMsg: 'Running Tesseract OCR on current page...',
      savedNoteMsg: 'Note saved successfully!',
      bookmarkAddedMsg: 'Page bookmarked!',
      historyClearedMsg: 'Document history cleared.'
    },
    ar: {
      tagline: 'معرفتك. مساحتك الخاصة. ذكاؤك الاصطناعي.',
      uploadBtn: 'فتح ملف',
      readerView: 'مساحة العمل',
      dashboardView: 'الرئيسية',
      projectorBtn: 'وضع العرض',
      welcomeTitle: 'مرحباً بك في أحمدكو – مساحة عملك الذكية.',
      welcomeSub:
        'افتح، علّق، ترجم، ادرس، واعرض ملفات PDF وDOCX وPPTX والنصوص مع 20 أداة ذكاء اصطناعي للدراسة.',
      uploadFilesCta: 'رفع المستندات',
      loadSampleBtn: 'تحميل الدليل التفاعلي التجريبي',
      allFilesTab: 'المستندات الأخيرة',
      favoritesTab: '★ المفضلة',
      clearHistoryBtn: 'مسح السجل',
      storageNotice:
        'ℹ️ يتم حفظ الملفات محلياً في متصفحك عبر IndexedDB لفتحها فوراً في أي وقت.',
      thumbsTab: 'الصفحات',
      outlineTab: 'الفهرس',
      bookmarksTab: 'الإشارات',
      bookmarkPageBtn: '+ حفظ إشارة للصفحة الحالية',
      tabAiChat: '🤖 المساعد الذكي',
      tabStudyTools: '🎓 أدوات الدراسة (20)',
      tabTranslator: '🌐 المترجم',
      tabNotes: '📝 الملاحظات',
      sendBtn: 'إرسال',
      translateNowBtn: 'ترجم الآن',
      translatePageBtn: 'ترجمة الصفحة الحالية',
      addNoteBtn: 'حفظ الملاحظة',
      exportNotesBtn: 'تصدير الملاحظات',
      exportPdfBtn: 'تصدير PDF مع التعليقات',
      ocrBtn: 'استخراج النص (OCR)',
      ttsPlayBtn: 'قراءة صوتية',
      ttsStopBtn: 'إيقاف القراءة',
      noFilesMsg: 'لا توجد مستندات محفوظة بعد. ارفع ملفاً أو افتح الدليل التجريبي للبدء.',
      noBookmarksMsg: 'لا توجد إشارات مرجعية محفوظة لهذا المستند.',
      noOutlineMsg: 'لا يتوفر فهرس محتويات لهذا الملف.',
      pageLabel: 'صفحة',
      ofLabel: 'من',
      translatingMsg: 'جاري الترجمة...',
      ocrRunningMsg: 'جاري استخراج النص عبر Tesseract OCR...',
      savedNoteMsg: 'تم حفظ الملاحظة بنجاح!',
      bookmarkAddedMsg: 'تمت إضافة الصفحة إلى الإشارات المرجعية!',
      historyClearedMsg: 'تم مسح سجل المستندات.'
    }
  };

  // =========================================================================
  // 1. APPLICATION STATE
  // =========================================================================
  const state = {
    lang: localStorage.getItem('ahmedko_lang') || 'en',
    theme: localStorage.getItem('ahmedko_theme') || 'dark',
    currentView: 'dashboard', // 'dashboard' | 'reader'
    activeFilter: 'all', // 'all' | 'favorites'
    currentDocId: null,
    currentDocMeta: null,
    docType: null, // 'pdf' | 'docx' | 'pptx' | 'txt' | 'image'
    pdfDoc: null,
    virtualPages: [], // HTML content array for non-PDF documents
    pageTexts: {}, // { pageNum: "extracted string" }
    currentPage: 1,
    totalPages: 1,
    scale: 1.25,
    rotation: 0,
    viewMode: 'single', // 'single' | 'scroll' | 'spread'
    pageFilter: 'normal', // 'normal' | 'sepia' | 'night' | 'grayscale'

    // 14-Tool Annotation Engine State
    activeTool: 'select', // select, pen, highlighter, marker, eraser, line, arrow, rect, circle, text, sticky, stamp, redact, laser
    strokeColor: '#ff3b30',
    strokeWidth: 3,
    strokeOpacity: 1.0,
    activeStamp: '✓ APPROVED',
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentPath: [],
    annotationsByPage: {}, // { [pageNum]: Array<AnnotationObject> }
    undoStackByPage: {}, // { [pageNum]: Array<Array<AnnotationObject>> }
    redoStackByPage: {}, // { [pageNum]: Array<Array<AnnotationObject>> }
    laserTrail: [],

    // Bookmarks & Notes
    bookmarks: [], // Array<{ page, label, timestamp }>
    notes: [], // Array<{ id, page, text, timestamp }>

    // Projector Mode & Timer
    projectorActive: false,
    projectorBlackout: false,
    projectorLaser: true,
    timerSeconds: 0,
    timerRunning: false,
    timerInterval: null,

    // TTS State
    ttsActive: false,
    ttsUtterance: null,

    // Search State
    searchQuery: '',
    searchMatches: [],
    searchMatchIdx: -1
  };

  // Expose state globally for external AI modules
  window.AhmedkoState = state;

  // =========================================================================
  // 2. INDEXEDDB BINARY FILE & METADATA CACHE
  // =========================================================================
  const DB_NAME = 'AhmedkoWorkspaceDB';
  const DB_VERSION = 1;
  const STORE_FILES = 'files';

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_FILES)) {
          const store = db.createObjectStore(STORE_FILES, { keyPath: 'id' });
          store.createIndex('lastOpened', 'lastOpened', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveDocumentToDB(docRecord) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readwrite');
      tx.objectStore(STORE_FILES).put(docRecord);
      tx.oncomplete = () => resolve(docRecord);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getDocumentFromDB(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readonly');
      const req = tx.objectStore(STORE_FILES).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllDocumentsFromDB() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readonly');
      const req = tx.objectStore(STORE_FILES).getAll();
      req.onsuccess = () => {
        const list = (req.result || []).sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteDocumentFromDB(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readwrite');
      tx.objectStore(STORE_FILES).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearAllDocumentsFromDB() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_FILES, 'readwrite');
      tx.objectStore(STORE_FILES).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function persistCurrentDocState() {
    if (!state.currentDocId) return;
    try {
      const rec = await getDocumentFromDB(state.currentDocId);
      if (!rec) return;
      rec.currentPage = state.currentPage;
      rec.totalPages = state.totalPages;
      rec.annotationsByPage = state.annotationsByPage;
      rec.bookmarks = state.bookmarks;
      rec.notes = state.notes;
      rec.lastOpened = Date.now();
      await saveDocumentToDB(rec);
    } catch (err) {
      console.warn('Could not persist state to IndexedDB:', err);
    }
  }

  // =========================================================================
  // 3. DOM HELPERS & TOAST NOTIFICATIONS
  // =========================================================================
  function $(id) {
    return document.getElementById(id);
  }

  function showToast(message, type = 'info') {
    let container = $('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      Object.assign(container.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: '99999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      });
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    Object.assign(toast.style, {
      background: type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2563eb',
      color: '#ffffff',
      padding: '12px 18px',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    });
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // =========================================================================
  // 4. LOCALIZATION (AR / EN) & THEME MANAGEMENT
  // =========================================================================
  function t(key) {
    const dict = I18N[state.lang] || I18N.en;
    return dict[key] || I18N.en[key] || key;
  }

  function applyLanguage(lang) {
    state.lang = lang === 'ar' ? 'ar' : 'en';
    localStorage.setItem('ahmedko_lang', state.lang);

    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', state.lang === 'ar');

    const dict = I18N[state.lang];
    Object.keys(dict).forEach((key) => {
      // Update by ID if matching element exists
      const elById = document.getElementById(key);
      if (elById && elById.tagName !== 'INPUT' && elById.tagName !== 'TEXTAREA') {
        elById.textContent = dict[key];
      }
      // Update by data-i18n attribute
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach((el) => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      });
    });

    const langBtn = $('langToggle') || $('langBtn');
    if (langBtn) {
      langBtn.textContent = state.lang === 'ar' ? 'EN' : 'عربي';
    }

    renderDashboardFiles();
    updatePageCounterUI();
  }

  function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem('ahmedko_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    document.body.classList.toggle('light-theme', state.theme === 'light');
    document.body.classList.toggle('dark-theme', state.theme === 'dark');

    const themeBtn = $('themeToggle') || $('themeBtn');
    if (themeBtn) {
      themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // =========================================================================
  // 5. VIEW SWITCHING (DASHBOARD <-> WORKSPACE READER)
  // =========================================================================
  function switchView(viewName) {
    state.currentView = viewName;
    const dashEl = $('dashboardSection') || $('dashboardViewPanel') || document.querySelector('.dashboard-section');
    const readerEl = $('readerSection') || $('readerViewPanel') || document.querySelector('.reader-section');

    if (dashEl && readerEl) {
      if (viewName === 'dashboard') {
        dashEl.style.display = '';
        dashEl.classList.remove('hidden');
        readerEl.style.display = 'none';
        readerEl.classList.add('hidden');
        renderDashboardFiles();
      } else {
        dashEl.style.display = 'none';
        dashEl.classList.add('hidden');
        readerEl.style.display = '';
        readerEl.classList.remove('hidden');
      }
    }

    const dashBtn = $('dashboardView') || $('dashboardBtn');
    const readerBtn = $('readerView') || $('readerBtn');
    if (dashBtn) dashBtn.classList.toggle('active', viewName === 'dashboard');
    if (readerBtn) readerBtn.classList.toggle('active', viewName === 'reader');
  }

  // =========================================================================
  // 6. DASHBOARD FILE CARDS & INTERACTIVE SAMPLE GUIDE
  // =========================================================================
  async function renderDashboardFiles() {
    const grid =
      $('filesGrid') ||
      $('recentFilesGrid') ||
      $('documentsGrid') ||
      $('fileList') ||
      document.querySelector('.files-grid');
    if (!grid) return;

    const allDocs = await getAllDocumentsFromDB();
    const filtered =
      state.activeFilter === 'favorites' ? allDocs.filter((d) => d.favorite) : allDocs;

    // Update dashboard stats if elements exist
    const totalFilesStat = $('statTotalFiles') || $('totalFilesCount');
    if (totalFilesStat) totalFilesStat.textContent = allDocs.length;

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="padding:32px;text-align:center;opacity:0.75;">${t('noFilesMsg')}</div>`;
      return;
    }

    grid.innerHTML = '';
    filtered.forEach((doc) => {
      const card = document.createElement('div');
      card.className = 'file-card doc-card';
      card.style.cssText =
        'position:relative;padding:18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);cursor:pointer;display:flex;flex-direction:column;gap:8px;transition:transform 0.2s;';

      const ext = (doc.name.split('.').pop() || 'doc').toUpperCase();
      const dateStr = new Date(doc.lastOpened || Date.now()).toLocaleDateString(
        state.lang === 'ar' ? 'ar-EG' : 'en-US'
      );
      const progressPct =
        doc.totalPages > 0 ? Math.min(100, Math.round(((doc.currentPage || 1) / doc.totalPages) * 100)) : 100;

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11px;font-weight:700;padding:4px 8px;border-radius:6px;background:#2563eb;color:#fff;">${ext}</span>
          <div style="display:flex;gap:8px;">
            <button class="fav-btn" title="Favorite" style="background:none;border:none;cursor:pointer;font-size:16px;color:${doc.favorite ? '#facc15' : '#9ca3af'};">★</button>
            <button class="del-btn" title="Delete" style="background:none;border:none;cursor:pointer;font-size:14px;color:#ef4444;">✕</button>
          </div>
        </div>
        <h4 style="margin:4px 0;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${doc.name}</h4>
        <div style="font-size:12px;opacity:0.7;display:flex;justify-content:space-between;">
          <span>${formatBytes(doc.size)} • ${doc.totalPages || 1} ${t('thumbsTab')}</span>
          <span>${dateStr}</span>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;margin-top:4px;">
          <div style="height:100%;width:${progressPct}%;background:#3b82f6;"></div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.fav-btn') || e.target.closest('.del-btn')) return;
        openCachedDocument(doc.id);
      });

      card.querySelector('.fav-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        doc.favorite = !doc.favorite;
        await saveDocumentToDB(doc);
        renderDashboardFiles();
      });

      card.querySelector('.del-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await deleteDocumentFromDB(doc.id);
        renderDashboardFiles();
      });

      grid.appendChild(card);
    });
  }

  async function loadInteractiveSampleGuide() {
    const samplePages = [
      `# Ahmedko Smart Workspace – Interactive Guide (Page 1)\n\nWelcome to **Ahmedko**, your all-in-one document reader, 14-tool canvas annotation studio, bilingual translator, and 20-tool AI study companion.\n\n### Key Capabilities:\n1. **Multi-Format Engine**: Open PDF, Word (DOCX), PowerPoint (PPTX), Markdown, TXT, and Images.\n2. **14-Tool Annotation Canvas**: Draw with Pen, Highlighter, Marker, Shapes, Arrows, Sticky Notes, Stamps, Redaction, and Laser Pointer.\n3. **Smart AI Study Suite**: Generate summaries, flashcards, quizzes, mind maps, Cornell notes, and exam predictions directly from your document.`,
      `# Artificial Intelligence & Cognitive Learning (Page 2)\n\nSpaced repetition and active recall are two of the most effective evidence-based learning techniques in cognitive psychology.\n\n* **Active Recall**: Testing yourself on key concepts strengthens neural pathways far more effectively than passive re-reading.\n* **Feynman Technique**: Explaining a complex topic in simple terms reveals gaps in your understanding.\n* **Cornell Note-Taking**: Dividing notes into Cues, Notes, and Summary accelerates exam revision.`,
      `# Presentation & Projector Mode (Page 3)\n\nUse **Projector Mode** at the top bar to present your slides or PDF pages in fullscreen.\n\n* Press **L** or move your mouse to use the live **Laser Pointer**.\n* Use the built-in **Presentation Timer** to track your talk duration.\n* Select any sentence on the page to trigger instant **Bilingual Translation** or **Text-to-Speech (TTS)**.`
    ];

    const content = samplePages.join('\n\n---PAGE---\n\n');
    const encoder = new TextEncoder();
    const buffer = encoder.encode(content).buffer;

    const sampleRecord = {
      id: 'sample-ahmedko-guide',
      name: 'Ahmedko_Interactive_Guide.md',
      type: 'text/markdown',
      size: buffer.byteLength,
      data: buffer,
      lastOpened: Date.now(),
      currentPage: 1,
      totalPages: samplePages.length,
      favorite: true,
      annotationsByPage: {},
      bookmarks: [{ page: 1, label: 'Welcome Overview', timestamp: Date.now() }],
      notes: [
        {
          id: 'n1',
          page: 1,
          text: 'Try the 14 annotation tools in the top toolbar and the 20 AI study tools on the right panel!',
          timestamp: Date.now()
        }
      ]
    };

    await saveDocumentToDB(sampleRecord);
    await openCachedDocument(sampleRecord.id);
  }

  // =========================================================================
  // 7. FILE UPLOAD & MULTI-FORMAT DOCUMENT LOADER (PDF, DOCX, PPTX, TXT, IMG)
  // =========================================================================
  async function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const buffer = await file.arrayBuffer();
    const id = 'doc_' + file.name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + file.size;

    const existing = await getDocumentFromDB(id);
    const record = {
      id,
      name: file.name,
      type: file.type || '',
      size: file.size,
      data: buffer,
      lastOpened: Date.now(),
      currentPage: existing ? existing.currentPage || 1 : 1,
      totalPages: existing ? existing.totalPages || 1 : 1,
      favorite: existing ? !!existing.favorite : false,
      annotationsByPage: existing ? existing.annotationsByPage || {} : {},
      bookmarks: existing ? existing.bookmarks || [] : [],
      notes: existing ? existing.notes || [] : []
    };

    await saveDocumentToDB(record);
    await openCachedDocument(id);
  }

  async function openCachedDocument(id) {
    const doc = await getDocumentFromDB(id);
    if (!doc) {
      showToast('Document not found in cache.', 'error');
      return;
    }

    state.currentDocId = doc.id;
    state.currentDocMeta = doc;
    state.currentPage = doc.currentPage || 1;
    state.annotationsByPage = doc.annotationsByPage || {};
    state.undoStackByPage = {};
    state.redoStackByPage = {};
    state.bookmarks = doc.bookmarks || [];
    state.notes = doc.notes || [];
    state.pageTexts = {};
    state.pdfDoc = null;
    state.virtualPages = [];

    const titleEl = $('currentDocTitle') || $('docTitle') || $('fileNameDisplay');
    if (titleEl) titleEl.textContent = doc.name;

    switchView('reader');

    const ext = (doc.name.split('.').pop() || '').toLowerCase();
    try {
      if (ext === 'pdf' || doc.type === 'application/pdf') {
        state.docType = 'pdf';
        await loadPdfDocument(doc.data);
      } else if (ext === 'docx') {
        state.docType = 'docx';
        await loadDocxDocument(doc.data);
      } else if (ext === 'pptx') {
        state.docType = 'pptx';
        await loadPptxDocument(doc.data);
      } else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || doc.type.startsWith('image/')) {
        state.docType = 'image';
        await loadImageDocument(doc.data, doc.type || 'image/png');
      } else {
        state.docType = 'txt';
        await loadTextDocument(doc.data);
      }

      await persistCurrentDocState();
      renderBookmarksList();
      renderNotesList();
      renderCurrentPage();
    } catch (err) {
      console.error('Error loading document:', err);
      showToast('Failed to render file: ' + err.message, 'error');
    }
  }

  // ---- 7A. PDF.js Multi-Mode Loader ----
  async function loadPdfDocument(arrayBuffer) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library is not loaded.');
    }
    const uint8 = new Uint8Array(arrayBuffer.slice(0));
    const loadingTask = window.pdfjsLib.getDocument({ data: uint8 });
    state.pdfDoc = await loadingTask.promise;
    state.totalPages = state.pdfDoc.numPages;
    if (state.currentPage > state.totalPages) state.currentPage = 1;

    // Extract text in background for AI & Search
    extractAllPdfText();
    renderPdfThumbnails();
    renderPdfOutline();
  }

  async function extractAllPdfText() {
    if (!state.pdfDoc) return;
    for (let p = 1; p <= state.pdfDoc.numPages; p++) {
      try {
        const page = await state.pdfDoc.getPage(p);
        const textContent = await page.getTextContent();
        state.pageTexts[p] = textContent.items.map((item) => item.str).join(' ');
      } catch (e) {
        state.pageTexts[p] = '';
      }
    }
  }

  async function renderPdfThumbnails() {
    const container = $('thumbsContainer') || $('thumbsList') || $('thumbnailsPanel');
    if (!container || !state.pdfDoc) return;
    container.innerHTML = '';

    const maxThumbs = Math.min(state.pdfDoc.numPages, 50);
    for (let p = 1; p <= maxThumbs; p++) {
      const item = document.createElement('div');
      item.className = 'thumb-item';
      item.dataset.page = p;
      item.style.cssText =
        'padding:8px;margin-bottom:8px;border-radius:8px;cursor:pointer;text-align:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);';

      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto 6px;';
      const label = document.createElement('span');
      label.style.fontSize = '12px';
      label.textContent = `${t('pageLabel')} ${p}`;

      item.appendChild(canvas);
      item.appendChild(label);
      item.addEventListener('click', () => goToPage(p));
      container.appendChild(item);

      state.pdfDoc.getPage(p).then((page) => {
        const vp = page.getViewport({ scale: 0.25 });
        canvas.width = vp.width;
        canvas.height = vp.height;
        page.render({ canvasContext: canvas.getContext('2d'), viewport: vp });
      });
    }
  }

  async function renderPdfOutline() {
    const container = $('outlineContainer') || $('outlineList') || $('outlinePanel');
    if (!container) return;
    if (!state.pdfDoc) {
      container.innerHTML = `<div style="padding:12px;opacity:0.7;">${t('noOutlineMsg')}</div>`;
      return;
    }
    const outline = await state.pdfDoc.getOutline();
    if (!outline || outline.length === 0) {
      container.innerHTML = `<div style="padding:12px;opacity:0.7;">${t('noOutlineMsg')}</div>`;
      return;
    }
    container.innerHTML = '';
    outline.forEach((item) => {
      const row = document.createElement('div');
      row.style.cssText =
        'padding:8px 10px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;';
      row.textContent = item.title;
      row.addEventListener('click', async () => {
        try {
          if (item.dest) {
            const dest = typeof item.dest === 'string' ? await state.pdfDoc.getDestination(item.dest) : item.dest;
            const pageIndex = await state.pdfDoc.getPageIndex(dest[0]);
            goToPage(pageIndex + 1);
          }
        } catch (e) {
          console.warn('Outline navigation error:', e);
        }
      });
      container.appendChild(row);
    });
  }

  // ---- 7B. DOCX (Mammoth.js) Loader ----
  async function loadDocxDocument(arrayBuffer) {
    if (!window.mammoth) {
      throw new Error('Mammoth.js is required to render DOCX files.');
    }
    const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer.slice(0) });
    const rawHtml = result.value || '<p>Empty document.</p>';

    // Paginate HTML into virtual pages (~2500 chars per page)
    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;
    const blocks = Array.from(temp.children);
    const pages = [];
    let currentChunk = '';

    blocks.forEach((el) => {
      currentChunk += el.outerHTML;
      if (currentChunk.length > 2600) {
        pages.push(currentChunk);
        currentChunk = '';
      }
    });
    if (currentChunk || pages.length === 0) pages.push(currentChunk);

    state.virtualPages = pages;
    state.totalPages = pages.length;
    pages.forEach((html, idx) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      state.pageTexts[idx + 1] = div.textContent || '';
    });
    renderVirtualThumbnails();
  }

  // ---- 7C. PPTX (JSZip) Slide Loader ----
  async function loadPptxDocument(arrayBuffer) {
    if (!window.JSZip) {
      throw new Error('JSZip is required to render PPTX files.');
    }
    const zip = await window.JSZip.loadAsync(arrayBuffer.slice(0));
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const na = parseInt(a.match(/slide(\d+)\.xml/i)[1], 10);
        const nb = parseInt(b.match(/slide(\d+)\.xml/i)[1], 10);
        return na - nb;
      });

    const pages = [];
    for (let i = 0; i < slideFiles.length; i++) {
      const xmlStr = await zip.files[slideFiles[i]].async('string');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
      const textNodes = Array.from(xmlDoc.getElementsByTagName('a:t'));
      const lines = textNodes.map((n) => n.textContent.trim()).filter(Boolean);
      state.pageTexts[i + 1] = lines.join(' ');

      const title = lines[0] || `Slide ${i + 1}`;
      const bullets = lines.slice(1).map((line) => `<li style="margin-bottom:10px;">${line}</li>`).join('');
      pages.push(`
        <div class="pptx-slide" style="padding:40px;min-height:480px;display:flex;flex-direction:column;justify-content:center;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:0.6;margin-bottom:8px;">Slide ${i + 1} of ${slideFiles.length}</div>
          <h2 style="font-size:28px;margin-bottom:24px;color:#2563eb;border-bottom:2px solid rgba(37,99,235,0.2);padding-bottom:12px;">${title}</h2>
          <ul style="font-size:18px;line-height:1.7;padding-left:24px;">${bullets}</ul>
        </div>
      `);
    }

    if (pages.length === 0) {
      pages.push('<div style="padding:40px;">No readable slides found in PPTX.</div>');
    }
    state.virtualPages = pages;
    state.totalPages = pages.length;
    renderVirtualThumbnails();
  }

  // ---- 7D. Text / Markdown & Image Loaders ----
  async function loadTextDocument(arrayBuffer) {
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer);
    const rawChunks = text.includes('---PAGE---')
      ? text.split('---PAGE---')
      : text.match(/[\s\S]{1,2500}/g) || [text];

    state.virtualPages = rawChunks.map((chunk, idx) => {
      state.pageTexts[idx + 1] = chunk.trim();
      const formatted = chunk
        .trim()
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/\n/g, '<br>');
      return `<div class="markdown-page" style="padding:36px;line-height:1.8;font-size:16px;">${formatted}</div>`;
    });
    state.totalPages = state.virtualPages.length;
    renderVirtualThumbnails();
  }

  async function loadImageDocument(arrayBuffer, mimeType) {
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    state.virtualPages = [
      `<div style="text-align:center;padding:20px;"><img id="docImagePage" src="${url}" style="max-width:100%;height:auto;border-radius:8px;" /></div>`
    ];
    state.totalPages = 1;
    state.pageTexts[1] = '[Image Document - Use OCR button to extract text]';
    renderVirtualThumbnails();
  }

  function renderVirtualThumbnails() {
    const container = $('thumbsContainer') || $('thumbsList') || $('thumbnailsPanel');
    if (!container) return;
    container.innerHTML = '';
    for (let p = 1; p <= state.totalPages; p++) {
      const div = document.createElement('div');
      div.style.cssText =
        'padding:10px;margin-bottom:6px;border-radius:8px;cursor:pointer;background:rgba(255,255,255,0.04);font-size:13px;';
      div.textContent = `${t('pageLabel')} ${p}`;
      div.addEventListener('click', () => goToPage(p));
      container.appendChild(div);
    }
  }

  // =========================================================================
  // 8. PAGE RENDERING & 14-TOOL ANNOTATION OVERLAY ENGINE
  // =========================================================================
  function getViewerStage() {
    return (
      $('viewerStage') ||
      $('documentViewport') ||
      $('pdfViewer') ||
      $('readerCanvasContainer') ||
      $('pageContainer') ||
      document.querySelector('.viewer-stage, .canvas-container, .reader-viewport')
    );
  }

  async function renderCurrentPage() {
    updatePageCounterUI();
    const stage = getViewerStage();
    if (!stage) return;

    // Apply visual filters (normal, sepia, night, grayscale)
    const filterMap = {
      normal: 'none',
      sepia: 'sepia(0.85) contrast(0.95)',
      night: 'invert(0.92) hue-rotate(180deg)',
      grayscale: 'grayscale(1)'
    };

    stage.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.id = 'activePageWrapper';
    wrapper.style.cssText = `position:relative;margin:20px auto;background:#ffffff;color:#111827;box-shadow:0 12px 36px rgba(0,0,0,0.45);border-radius:6px;overflow:hidden;filter:${filterMap[state.pageFilter] || 'none'};transform:rotate(${state.rotation}deg);transition:transform 0.2s ease;`;

    const baseCanvas = document.createElement('canvas');
    baseCanvas.id = 'pdfRenderCanvas';
    baseCanvas.style.display = 'block';

    const contentDiv = document.createElement('div');
    contentDiv.id = 'virtualPageContent';
    contentDiv.style.display = 'none';

    const annotCanvas = document.createElement('canvas');
    annotCanvas.id = 'annotationCanvas';
    annotCanvas.style.cssText = 'position:absolute;top:0;left:0;z-index:10;cursor:crosshair;';

    wrapper.appendChild(baseCanvas);
    wrapper.appendChild(contentDiv);
    wrapper.appendChild(annotCanvas);
    stage.appendChild(wrapper);

    if (state.docType === 'pdf' && state.pdfDoc) {
      const page = await state.pdfDoc.getPage(state.currentPage);
      const viewport = page.getViewport({ scale: state.scale });
      baseCanvas.width = viewport.width;
      baseCanvas.height = viewport.height;
      wrapper.style.width = viewport.width + 'px';
      wrapper.style.height = viewport.height + 'px';
      annotCanvas.width = viewport.width;
      annotCanvas.height = viewport.height;

      await page.render({
        canvasContext: baseCanvas.getContext('2d'),
        viewport
      }).promise;
    } else {
      baseCanvas.style.display = 'none';
      contentDiv.style.display = 'block';
      const width = Math.round(720 * state.scale);
      wrapper.style.width = width + 'px';
      wrapper.style.minHeight = Math.round(920 * state.scale) + 'px';
      contentDiv.innerHTML = state.virtualPages[state.currentPage - 1] || '';

      setTimeout(() => {
        annotCanvas.width = wrapper.clientWidth || width;
        annotCanvas.height = wrapper.clientHeight || 920;
        redrawAnnotations(annotCanvas);
      }, 50);
    }

    bindAnnotationCanvasEvents(annotCanvas);
    redrawAnnotations(annotCanvas);
    syncProjectorView();
  }

  function updatePageCounterUI() {
    const pageInput = $('pageInput') || $('currentPageInput');
    if (pageInput) pageInput.value = state.currentPage;

    const totalEl = $('totalPages') || $('pageCount') || $('totalPagesSpan');
    if (totalEl) totalEl.textContent = state.totalPages;

    const indicator = $('pageIndicator');
    if (indicator) {
      indicator.textContent = `${t('pageLabel')} ${state.currentPage} ${t('ofLabel')} ${state.totalPages}`;
    }

    const zoomLabel = $('zoomLevel') || $('zoomValue');
    if (zoomLabel) zoomLabel.textContent = Math.round(state.scale * 100) + '%';
  }

  function goToPage(pageNum) {
    const target = Math.max(1, Math.min(state.totalPages, parseInt(pageNum, 10) || 1));
    state.currentPage = target;
    persistCurrentDocState();
    renderCurrentPage();
  }

  // =========================================================================
  // 9. 14-TOOL CANVAS ANNOTATION ENGINE (WITH UNDO, REDO & PDF EXPORT)
  // =========================================================================
  function getPageAnnotations(page = state.currentPage) {
    if (!state.annotationsByPage[page]) {
      state.annotationsByPage[page] = [];
    }
    return state.annotationsByPage[page];
  }

  function pushUndoSnapshot(page = state.currentPage) {
    if (!state.undoStackByPage[page]) state.undoStackByPage[page] = [];
    state.undoStackByPage[page].push(JSON.parse(JSON.stringify(getPageAnnotations(page))));
    if (state.undoStackByPage[page].length > 40) state.undoStackByPage[page].shift();
    state.redoStackByPage[page] = [];
  }

  function undoAnnotation() {
    const page = state.currentPage;
    const stack = state.undoStackByPage[page] || [];
    if (stack.length === 0) return;
    if (!state.redoStackByPage[page]) state.redoStackByPage[page] = [];
    state.redoStackByPage[page].push(JSON.parse(JSON.stringify(getPageAnnotations(page))));
    state.annotationsByPage[page] = stack.pop();
    redrawAnnotations($('annotationCanvas'));
    persistCurrentDocState();
  }

  function redoAnnotation() {
    const page = state.currentPage;
    const stack = state.redoStackByPage[page] || [];
    if (stack.length === 0) return;
    if (!state.undoStackByPage[page]) state.undoStackByPage[page] = [];
    state.undoStackByPage[page].push(JSON.parse(JSON.stringify(getPageAnnotations(page))));
    state.annotationsByPage[page] = stack.pop();
    redrawAnnotations($('annotationCanvas'));
    persistCurrentDocState();
  }

  function clearPageAnnotations() {
    pushUndoSnapshot();
    state.annotationsByPage[state.currentPage] = [];
    redrawAnnotations($('annotationCanvas'));
    persistCurrentDocState();
  }

  function bindAnnotationCanvasEvents(canvas) {
    if (!canvas) return;
    canvas.style.pointerEvents = state.activeTool === 'select' ? 'none' : 'auto';

    const getCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    canvas.onmousedown = (e) => {
      if (state.activeTool === 'select') return;
      const { x, y } = getCoords(e);
      state.isDrawing = true;
      state.startX = x;
      state.startY = y;
      state.currentPath = [{ x, y }];

      if (['text', 'sticky', 'stamp'].includes(state.activeTool)) {
        state.isDrawing = false;
        handlePointAnnotationTool(x, y, canvas);
      }
    };

    canvas.onmousemove = (e) => {
      const { x, y } = getCoords(e);
      if (state.activeTool === 'laser') {
        state.laserTrail.push({ x, y, time: Date.now() });
        redrawAnnotations(canvas);
        return;
      }
      if (!state.isDrawing) return;

      if (['pen', 'highlighter', 'marker', 'eraser'].includes(state.activeTool)) {
        state.currentPath.push({ x, y });
        redrawAnnotations(canvas);
        drawPreviewStroke(canvas.getContext('2d'));
      } else {
        redrawAnnotations(canvas);
        drawPreviewShape(canvas.getContext('2d'), x, y);
      }
    };

    window.addEventListener('mouseup', (e) => {
      if (!state.isDrawing) return;
      state.isDrawing = false;
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      commitAnnotation(endX, endY, canvas);
    });
  }

  function handlePointAnnotationTool(x, y, canvas) {
    const annots = getPageAnnotations();
    if (state.activeTool === 'text') {
      const text = prompt(state.lang === 'ar' ? 'أدخل النص:' : 'Enter annotation text:');
      if (!text) return;
      pushUndoSnapshot();
      annots.push({
        tool: 'text',
        x,
        y,
        text,
        color: state.strokeColor,
        size: Math.max(14, state.strokeWidth * 5)
      });
    } else if (state.activeTool === 'sticky') {
      const noteText = prompt(state.lang === 'ar' ? 'أدخل ملاحظة الملصق:' : 'Enter sticky note:');
      if (!noteText) return;
      pushUndoSnapshot();
      annots.push({
        tool: 'sticky',
        x,
        y,
        text: noteText,
        color: '#facc15'
      });
      // Also add to Document Notes list
      state.notes.push({
        id: 'note_' + Date.now(),
        page: state.currentPage,
        text: `📌 ${noteText}`,
        timestamp: Date.now()
      });
      renderNotesList();
    } else if (state.activeTool === 'stamp') {
      pushUndoSnapshot();
      annots.push({
        tool: 'stamp',
        x,
        y,
        text: state.activeStamp || '★ IMPORTANT',
        color: state.strokeColor
      });
    }
    redrawAnnotations(canvas);
    persistCurrentDocState();
  }

  function commitAnnotation(endX, endY, canvas) {
    const annots = getPageAnnotations();
    pushUndoSnapshot();

    if (state.activeTool === 'eraser') {
      // Erase nearby objects within 25px radius
      const radius = 25;
      state.annotationsByPage[state.currentPage] = annots.filter((a) => {
        if (a.points && a.points.length > 0) {
          return !a.points.some((pt) => Math.hypot(pt.x - endX, pt.y - endY) < radius);
        }
        return Math.hypot((a.x || 0) - endX, (a.y || 0) - endY) >= radius;
      });
    } else if (['pen', 'highlighter', 'marker'].includes(state.activeTool)) {
      annots.push({
        tool: state.activeTool,
        points: state.currentPath.slice(),
        color: state.strokeColor,
        width:
          state.activeTool === 'highlighter'
            ? state.strokeWidth * 6
            : state.activeTool === 'marker'
            ? state.strokeWidth * 3
            : state.strokeWidth,
        opacity: state.activeTool === 'highlighter' ? 0.35 : state.activeTool === 'marker' ? 0.75 : 1.0
      });
    } else if (['line', 'arrow', 'rect', 'circle', 'redact'].includes(state.activeTool)) {
      annots.push({
        tool: state.activeTool,
        x: state.startX,
        y: state.startY,
        endX,
        endY,
        color: state.activeTool === 'redact' ? '#000000' : state.strokeColor,
        width: state.strokeWidth
      });
    }

    redrawAnnotations(canvas);
    persistCurrentDocState();
  }

  function drawPreviewStroke(ctx) {
    if (state.currentPath.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = state.strokeColor;
    ctx.lineWidth =
      state.activeTool === 'highlighter'
        ? state.strokeWidth * 6
        : state.activeTool === 'marker'
        ? state.strokeWidth * 3
        : state.strokeWidth;
    ctx.globalAlpha = state.activeTool === 'highlighter' ? 0.35 : 0.9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(state.currentPath[0].x, state.currentPath[0].y);
    state.currentPath.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.stroke();
    ctx.restore();
  }

  function drawPreviewShape(ctx, curX, curY) {
    drawSingleAnnotation(ctx, {
      tool: state.activeTool,
      x: state.startX,
      y: state.startY,
      endX: curX,
      endY: curY,
      color: state.activeTool === 'redact' ? '#000000' : state.strokeColor,
      width: state.strokeWidth
    });
  }

  function redrawAnnotations(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const annots = getPageAnnotations();
    annots.forEach((item) => drawSingleAnnotation(ctx, item));

    // Draw temporary laser trail if active
    const now = Date.now();
    state.laserTrail = state.laserTrail.filter((pt) => now - pt.time < 600);
    if (state.laserTrail.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = '#ff0044';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff0044';
      ctx.shadowBlur = 12;
      ctx.moveTo(state.laserTrail[0].x, state.laserTrail[0].y);
      state.laserTrail.forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
      ctx.restore();
      requestAnimationFrame(() => redrawAnnotations(canvas));
    }
  }

  function drawSingleAnnotation(ctx, item) {
    ctx.save();
    ctx.strokeStyle = item.color || '#ff3b30';
    ctx.fillStyle = item.color || '#ff3b30';
    ctx.lineWidth = item.width || 3;
    ctx.globalAlpha = item.opacity !== undefined ? item.opacity : 1.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (item.points && item.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(item.points[0].x, item.points[0].y);
      item.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (item.tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(item.x, item.y);
      ctx.lineTo(item.endX, item.endY);
      ctx.stroke();
    } else if (item.tool === 'arrow') {
      const headLen = 14;
      const angle = Math.atan2(item.endY - item.y, item.endX - item.x);
      ctx.beginPath();
      ctx.moveTo(item.x, item.y);
      ctx.lineTo(item.endX, item.endY);
      ctx.lineTo(
        item.endX - headLen * Math.cos(angle - Math.PI / 6),
        item.endY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(item.endX, item.endY);
      ctx.lineTo(
        item.endX - headLen * Math.cos(angle + Math.PI / 6),
        item.endY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    } else if (item.tool === 'rect') {
      ctx.strokeRect(item.x, item.y, item.endX - item.x, item.endY - item.y);
    } else if (item.tool === 'redact') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(item.x, item.y, item.endX - item.x, item.endY - item.y);
    } else if (item.tool === 'circle') {
      const rx = Math.abs(item.endX - item.x) / 2;
      const ry = Math.abs(item.endY - item.y) / 2;
      const cx = Math.min(item.x, item.endX) + rx;
      const cy = Math.min(item.y, item.endY) + ry;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (item.tool === 'text') {
      ctx.font = `600 ${item.size || 16}px sans-serif`;
      ctx.fillText(item.text, item.x, item.y);
    } else if (item.tool === 'sticky') {
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.fillRect(item.x, item.y, 160, 90);
      ctx.strokeRect(item.x, item.y, 160, 90);
      ctx.fillStyle = '#1f2937';
      ctx.font = '13px sans-serif';
      ctx.fillText('📌 ' + item.text.slice(0, 22), item.x + 8, item.y + 26);
      if (item.text.length > 22) {
        ctx.fillText(item.text.slice(22, 46), item.x + 8, item.y + 46);
      }
    } else if (item.tool === 'stamp') {
      ctx.font = 'bold 15px sans-serif';
      const w = ctx.measureText(item.text).width + 20;
      ctx.strokeRect(item.x, item.y - 22, w, 30);
      ctx.fillText(item.text, item.x + 10, item.y - 2);
    }
    ctx.restore();
  }

  function exportAnnotatedPage() {
    const baseCanvas = $('pdfRenderCanvas');
    const annotCanvas = $('annotationCanvas');
    if (!annotCanvas) return;

    const merged = document.createElement('canvas');
    merged.width = annotCanvas.width;
    merged.height = annotCanvas.height;
    const ctx = merged.getContext('2d');

    if (baseCanvas && baseCanvas.style.display !== 'none') {
      ctx.drawImage(baseCanvas, 0, 0);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, merged.width, merged.height);
    }
    ctx.drawImage(annotCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = `${(state.currentDocMeta?.name || 'document').replace(/\.[^.]+$/, '')}_page_${state.currentPage}_annotated.png`;
    link.href = merged.toDataURL('image/png');
    link.click();
    showToast('Annotated page exported!', 'success');
  }

  // =========================================================================
  // 10. BOOKMARKS & PAGE-LINKED NOTES MANAGER
  // =========================================================================
  function addBookmarkCurrentPage() {
    if (state.bookmarks.some((b) => b.page === state.currentPage)) {
      showToast('Page is already bookmarked.');
      return;
    }
    state.bookmarks.push({
      page: state.currentPage,
      label: `${t('pageLabel')} ${state.currentPage}`,
      timestamp: Date.now()
    });
    persistCurrentDocState();
    renderBookmarksList();
    showToast(t('bookmarkAddedMsg'), 'success');
  }

  function renderBookmarksList() {
    const container = $('bookmarksContainer') || $('bookmarksList');
    if (!container) return;
    if (!state.bookmarks || state.bookmarks.length === 0) {
      container.innerHTML = `<div style="padding:12px;opacity:0.7;font-size:13px;">${t('noBookmarksMsg')}</div>`;
      return;
    }
    container.innerHTML = '';
    state.bookmarks.forEach((bm, idx) => {
      const item = document.createElement('div');
      item.style.cssText =
        'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.08);cursor:pointer;font-size:13px;';
      item.innerHTML = `
        <span>🔖 ${bm.label}</span>
        <button data-idx="${idx}" style="background:none;border:none;color:#ef4444;cursor:pointer;">✕</button>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          state.bookmarks.splice(idx, 1);
          persistCurrentDocState();
          renderBookmarksList();
          return;
        }
        goToPage(bm.page);
      });
      container.appendChild(item);
    });
  }

  function addNoteFromInput() {
    const input = $('noteInput') || $('notesTextarea') || $('newNoteText');
    if (!input || !input.value.trim()) return;
    state.notes.unshift({
      id: 'note_' + Date.now(),
      page: state.currentPage,
      text: input.value.trim(),
      timestamp: Date.now()
    });
    input.value = '';
    persistCurrentDocState();
    renderNotesList();
    showToast(t('savedNoteMsg'), 'success');
  }

  function renderNotesList() {
    const list = $('notesList') || $('savedNotesContainer');
    if (!list) return;
    list.innerHTML = '';
    state.notes.forEach((n, idx) => {
      const card = document.createElement('div');
      card.style.cssText =
        'padding:10px 12px;margin-bottom:8px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);font-size:13px;';
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;opacity:0.75;font-size:11px;margin-bottom:4px;">
          <span class="note-page-link" style="cursor:pointer;color:#60a5fa;">${t('pageLabel')} ${n.page}</span>
          <button style="background:none;border:none;color:#ef4444;cursor:pointer;">✕</button>
        </div>
        <div style="line-height:1.5;">${n.text}</div>
      `;
      card.querySelector('.note-page-link').addEventListener('click', () => goToPage(n.page));
      card.querySelector('button').addEventListener('click', () => {
        state.notes.splice(idx, 1);
        persistCurrentDocState();
        renderNotesList();
      });
      list.appendChild(card);
    });
  }

  function exportNotesAsMarkdown() {
    if (state.notes.length === 0) {
      showToast('No notes to export.');
      return;
    }
    const content =
      `# Notes for ${state.currentDocMeta?.name || 'Document'}\n\n` +
      state.notes.map((n) => `### Page ${n.page}\n${n.text}\n`).join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${(state.currentDocMeta?.name || 'notes').replace(/\.[^.]+$/, '')}_notes.md`;
    link.click();
  }

  // =========================================================================
  // 11. SMART BILINGUAL TRANSLATOR
  // =========================================================================
  async function translateText(sourceText, targetLang = 'ar') {
    const outputEl = $('translateOutput') || $('translationResult') || $('translatedText');
    if (outputEl) outputEl.textContent = t('translatingMsg');

    const text = (
      sourceText ||
      ($('translateInput') || $('sourceText'))?.value ||
      window.getSelection().toString() ||
      state.pageTexts[state.currentPage] ||
      ''
    )
      .trim()
      .slice(0, 1800);

    if (!text) {
      if (outputEl) outputEl.textContent = 'Select or enter text to translate.';
      return;
    }

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
        targetLang
      )}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      const translated = data[0].map((seg) => seg[0]).join('');
      if (outputEl) outputEl.textContent = translated;
      return translated;
    } catch (err) {
      const fallbackMsg = `[Offline Translation Fallback (${targetLang.toUpperCase()})]:\n${text}`;
      if (outputEl) outputEl.textContent = fallbackMsg;
      return fallbackMsg;
    }
  }

  // =========================================================================
  // 12. TEXT-TO-SPEECH (TTS) & TESSERACT OCR
  // =========================================================================
  function toggleTextToSpeech() {
    if (!('speechSynthesis' in window)) {
      showToast('Speech Synthesis is not supported in this browser.', 'error');
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      state.ttsActive = false;
      return;
    }
    const selected = window.getSelection().toString().trim();
    const textToRead =
      selected || state.pageTexts[state.currentPage] || 'No readable text on this page.';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = /[\u0600-\u06FF]/.test(textToRead) ? 'ar-SA' : 'en-US';
    utterance.rate = parseFloat(($('ttsSpeed') || {})?.value || '1.0');
    utterance.onend = () => {
      state.ttsActive = false;
    };
    state.ttsActive = true;
    window.speechSynthesis.speak(utterance);
  }

  async function runOcrOnCurrentPage() {
    if (!window.Tesseract) {
      showToast('Tesseract OCR library not loaded.', 'error');
      return;
    }
    const targetCanvas = $('pdfRenderCanvas') || $('docImagePage');
    if (!targetCanvas) {
      showToast('No visual canvas available for OCR on this page.', 'error');
      return;
    }
    showToast(t('ocrRunningMsg'));
    try {
      const result = await window.Tesseract.recognize(targetCanvas, 'eng+ara');
      const extracted = (result?.data?.text || '').trim();
      state.pageTexts[state.currentPage] = extracted;
      const translateInput = $('translateInput') || $('sourceText');
      if (translateInput) translateInput.value = extracted;
      showToast('OCR completed! Text extracted to page index & translator.', 'success');
    } catch (err) {
      showToast('OCR failed: ' + err.message, 'error');
    }
  }

  // =========================================================================
  // 13. PROJECTOR MODE WITH LASER POINTER & PRESENTATION TIMER
  // =========================================================================
  function toggleProjectorMode() {
    state.projectorActive = !state.projectorActive;
    let overlay = $('projectorOverlay');

    if (state.projectorActive) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'projectorOverlay';
        overlay.style.cssText =
          'position:fixed;inset:0;background:#090d16;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
        overlay.innerHTML = `
          <div style="position:fixed;top:16px;right:24px;display:flex;gap:12px;align-items:center;background:rgba(15,23,42,0.85);padding:8px 16px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);z-index:10001;color:#fff;">
            <span id="projectorTimerDisplay" style="font-family:monospace;font-size:15px;">00:00</span>
            <button id="projPrevBtn" style="background:none;border:none;color:#fff;cursor:pointer;font-size:16px;">◀</button>
            <span id="projPageBadge" style="font-size:13px;">1 / 1</span>
            <button id="projNextBtn" style="background:none;border:none;color:#fff;cursor:pointer;font-size:16px;">▶</button>
            <button id="projBlackoutBtn" style="background:none;border:none;color:#fff;cursor:pointer;font-size:13px;">Blackout (B)</button>
            <button id="exitProjectorBtn" style="background:#ef4444;border:none;color:#fff;padding:4px 12px;border-radius:999px;cursor:pointer;font-size:13px;">Exit</button>
          </div>
          <div id="projectorStage" style="max-width:92vw;max-height:88vh;overflow:auto;display:flex;justify-content:center;align-items:center;"></div>
          <div id="projectorLaserDot" style="position:fixed;width:14px;height:14px;border-radius:50%;background:#ff0044;box-shadow:0 0 16px 6px #ff0044;pointer-events:none;z-index:10002;display:none;"></div>
        `;
        document.body.appendChild(overlay);

        $('projPrevBtn').onclick = () => goToPage(state.currentPage - 1);
        $('projNextBtn').onclick = () => goToPage(state.currentPage + 1);
        $('projBlackoutBtn').onclick = () => {
          state.projectorBlackout = !state.projectorBlackout;
          $('projectorStage').style.opacity = state.projectorBlackout ? '0' : '1';
        };
        $('exitProjectorBtn').onclick = () => toggleProjectorMode();

        overlay.addEventListener('mousemove', (e) => {
          const dot = $('projectorLaserDot');
          if (dot) {
            dot.style.display = 'block';
            dot.style.left = e.clientX - 7 + 'px';
            dot.style.top = e.clientY - 7 + 'px';
          }
        });
      }
      overlay.style.display = 'flex';
      startProjectorTimer();
      syncProjectorView();
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (overlay) overlay.style.display = 'none';
      stopProjectorTimer();
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  function syncProjectorView() {
    if (!state.projectorActive) return;
    const projStage = $('projectorStage');
    const activeWrapper = $('activePageWrapper');
    if (projStage && activeWrapper) {
      projStage.innerHTML = '';
      const clone = activeWrapper.cloneNode(true);
      // Copy canvas bitmaps
      const srcCanvases = activeWrapper.querySelectorAll('canvas');
      const dstCanvases = clone.querySelectorAll('canvas');
      srcCanvases.forEach((src, i) => {
        if (dstCanvases[i]) {
          dstCanvases[i].getContext('2d').drawImage(src, 0, 0);
        }
      });
      projStage.appendChild(clone);
    }
    const badge = $('projPageBadge');
    if (badge) badge.textContent = `${state.currentPage} / ${state.totalPages}`;
  }

  function startProjectorTimer() {
    stopProjectorTimer();
    state.timerSeconds = 0;
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      const mins = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
      const secs = String(state.timerSeconds % 60).padStart(2, '0');
      const el = $('projectorTimerDisplay') || $('projectorTimer');
      if (el) el.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopProjectorTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  // =========================================================================
  // 14. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function bindEvents() {
    // Language & Theme
    const langBtn = $('langToggle') || $('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () =>
        applyLanguage(state.lang === 'en' ? 'ar' : 'en')
      );
    }

    const themeBtn = $('themeToggle') || $('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () =>
        applyTheme(state.theme === 'dark' ? 'light' : 'dark')
      );
    }

    // Navigation Views
    [$('dashboardView'), $('dashboardBtn')].forEach((btn) => {
      if (btn) btn.addEventListener('click', () => switchView('dashboard'));
    });
    [$('readerView'), $('readerBtn')].forEach((btn) => {
      if (btn) btn.addEventListener('click', () => switchView('reader'));
    });
    const projBtn = $('projectorBtn');
    if (projBtn) projBtn.addEventListener('click', toggleProjectorMode);

    // File Upload Buttons & Drag-and-Drop
    const fileInput = $('fileInput') || document.querySelector('input[type="file"]');
    [$('uploadBtn'), $('uploadFilesCta')].forEach((btn) => {
      if (btn && fileInput) btn.addEventListener('click', () => fileInput.click());
    });
    if (fileInput) {
      fileInput.addEventListener('change', (e) => handleFileUpload(e.target.files));
    }

    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) {
        handleFileUpload(e.dataTransfer.files);
      }
    });

    // Sample Guide & History Controls
    const sampleBtn = $('loadSampleBtn');
    if (sampleBtn) sampleBtn.addEventListener('click', loadInteractiveSampleGuide);

    const allTab = $('allFilesTab');
    const favTab = $('favoritesTab');
    if (allTab) {
      allTab.addEventListener('click', () => {
        state.activeFilter = 'all';
        renderDashboardFiles();
      });
    }
    if (favTab) {
      favTab.addEventListener('click', () => {
        state.activeFilter = 'favorites';
        renderDashboardFiles();
      });
    }

    const clearBtn = $('clearHistoryBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        await clearAllDocumentsFromDB();
        renderDashboardFiles();
        showToast(t('historyClearedMsg'));
      });
    }

    // Reader Page & Zoom Controls
    const prevBtn = $('prevPageBtn') || $('prevPage');
    const nextBtn = $('nextPageBtn') || $('nextPage');
    if (prevBtn) prevBtn.addEventListener('click', () => goToPage(state.currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToPage(state.currentPage + 1));

    const pageInput = $('pageInput') || $('currentPageInput');
    if (pageInput) {
      pageInput.addEventListener('change', (e) => goToPage(e.target.value));
    }

    const zoomIn = $('zoomInBtn') || $('zoomIn');
    const zoomOut = $('zoomOutBtn') || $('zoomOut');
    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        state.scale = Math.min(3.0, state.scale + 0.2);
        renderCurrentPage();
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        state.scale = Math.max(0.5, state.scale - 0.2);
        renderCurrentPage();
      });
    }

    const rotateBtn = $('rotateBtn') || $('rotatePageBtn');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        state.rotation = (state.rotation + 90) % 360;
        renderCurrentPage();
      });
    }

    // 14 Annotation Tools Selection
    document.querySelectorAll('[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-tool]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTool = btn.dataset.tool;
        const annotCanvas = $('annotationCanvas');
        if (annotCanvas) {
          annotCanvas.style.pointerEvents = state.activeTool === 'select' ? 'none' : 'auto';
        }
      });
    });

    const colorInput = $('annotColor') || $('strokeColor');
    if (colorInput) {
      colorInput.addEventListener('input', (e) => {
        state.strokeColor = e.target.value;
      });
    }

    const sizeInput = $('annotSize') || $('strokeWidth');
    if (sizeInput) {
      sizeInput.addEventListener('input', (e) => {
        state.strokeWidth = parseInt(e.target.value, 10) || 3;
      });
    }

    const undoBtn = $('undoBtn');
    const redoBtn = $('redoBtn');
    const clearAnnotBtn = $('clearAnnotBtn') || $('clearCanvasBtn');
    const exportBtn = $('exportPdfBtn') || $('exportAnnotatedBtn');
    if (undoBtn) undoBtn.addEventListener('click', undoAnnotation);
    if (redoBtn) redoBtn.addEventListener('click', redoAnnotation);
    if (clearAnnotBtn) clearAnnotBtn.addEventListener('click', clearPageAnnotations);
    if (exportBtn) exportBtn.addEventListener('click', exportAnnotatedPage);

    // Bookmarks, Notes, Translator, TTS, OCR
    const bmBtn = $('bookmarkPageBtn');
    if (bmBtn) bmBtn.addEventListener('click', addBookmarkCurrentPage);

    const addNoteBtn = $('addNoteBtn') || $('saveNoteBtn');
    if (addNoteBtn) addNoteBtn.addEventListener('click', addNoteFromInput);

    const exportNotesBtn = $('exportNotesBtn');
    if (exportNotesBtn) exportNotesBtn.addEventListener('click', exportNotesAsMarkdown);

    const transBtn = $('translateNowBtn');
    if (transBtn) {
      transBtn.addEventListener('click', () => {
        const targetLang = ($('targetLang') || $('translateLangSelect'))?.value || 'ar';
        translateText(null, targetLang);
      });
    }

    const ttsBtn = $('ttsBtn') || $('ttsPlayBtn');
    if (ttsBtn) ttsBtn.addEventListener('click', toggleTextToSpeech);

    const ocrBtn = $('ocrBtn') || $('runOcrBtn');
    if (ocrBtn) ocrBtn.addEventListener('click', runOcrOnCurrentPage);

    // Sidebar Tabs (Left & Right)
    document.querySelectorAll('[data-tab], .tab-btn, .sidebar-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const targetId = tabBtn.dataset.tab || tabBtn.dataset.target;
        if (!targetId) return;
        const parent = tabBtn.parentElement;
        if (parent) {
          parent.querySelectorAll('[data-tab], .tab-btn, .sidebar-tab').forEach((b) =>
            b.classList.remove('active')
          );
        }
        tabBtn.classList.add('active');

        const panel = $(targetId);
        if (panel && panel.parentElement) {
          Array.from(panel.parentElement.children).forEach((sib) => {
            if (sib.classList.contains('tab-panel') || sib.classList.contains('panel')) {
              sib.style.display = sib.id === targetId ? 'block' : 'none';
              sib.classList.toggle('active', sib.id === targetId);
            }
          });
        }
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') {
        goToPage(state.lang === 'ar' ? state.currentPage - 1 : state.currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        goToPage(state.lang === 'ar' ? state.currentPage + 1 : state.currentPage - 1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoAnnotation();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoAnnotation();
      } else if (e.key === 'Escape' && state.projectorActive) {
        toggleProjectorMode();
      }
    });
  }

  // Expose helper API for external AI module (ai.js / study-tools.js)
  window.AhmedkoApp = {
    getState: () => state,
    getCurrentPageText: () => state.pageTexts[state.currentPage] || '',
    getAllDocumentText: () =>
      Object.keys(state.pageTexts)
        .map((p) => `[Page ${p}]\n${state.pageTexts[p]}`)
        .join('\n\n'),
    goToPage,
    translateText,
    runOcrOnCurrentPage,
    toggleTextToSpeech,
    loadInteractiveSampleGuide
  };

  // Boot Application on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    applyLanguage(state.lang);
    bindEvents();
    renderDashboardFiles();
  });
})();

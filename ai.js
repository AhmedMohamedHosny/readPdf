/**
 * AHMEDKO — Multi-AI Integration, Document Context (RAG) & 20 Study Tools Engine
 * File: ai.js
 */

window.AhmedkoAI = (function () {
  const PROVIDERS = {
    openai: {
      name: 'OpenAI (ChatGPT)',
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
        { id: 'gpt-4o', label: 'GPT-4o (Flagship Multimodal)' },
        { id: 'o3-mini', label: 'o3-mini (Reasoning)' }
      ]
    },
    gemini: {
      name: 'Google Gemini',
      models: [
        { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
        { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
        { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' }
      ]
    },
    anthropic: {
      name: 'Anthropic Claude',
      models: [
        { id: 'claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet' },
        { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku' }
      ]
    }
  };

  const STUDY_PROMPTS = {
    explain_page: 'Explain the contents of this page clearly and thoroughly, breaking down its core ideas step by step.',
    explain_beginner: "Explain the concepts in this material as if I am an absolute beginner, using relatable everyday analogies and simple language.",
    summarize_doc: 'Provide a comprehensive executive summary of the entire document, organized by main sections and key takeaways.',
    summarize_page: 'Provide a concise, high-impact summary of this current page.',
    key_points: 'Extract the most important bullet points, key facts, and critical takeaways from this material.',
    mcq: 'Generate 6 high-quality Multiple Choice Questions (MCQs) with 4 options (A, B, C, D) each based on this content. Include the correct answer and a brief explanation at the end.',
    true_false: 'Generate 8 True/False statements testing comprehension of this material, followed by an answer key explaining why each is True or False.',
    essay: 'Generate 3 thought-provoking analytical essay questions based on this material, along with key rubric points that a strong answer should cover.',
    flashcards: 'Create 8 study flashcards from this material formatted clearly as **Front (Question/Term)** and **Back (Answer/Definition)**.',
    glossary: 'Create an alphabetical glossary of key terms, acronyms, and concepts appearing in this text with clear definitions.',
    terminology: 'Identify all complex, technical, or domain-specific terminology in this material and explain each term in plain language.',
    study_guide: 'Create a complete structured exam study guide covering learning objectives, core concepts, common pitfalls, and review checkpoints.',
    quiz: 'Create a mixed diagnostic quiz (3 MCQs, 3 Short Answer, 2 True/False) with a scoring rubric and answer key at the bottom.',
    compare_concepts: 'Identify the two most central or contrasting concepts in this text and compare them across key dimensions (Definition, Mechanism, Pros/Cons, Use Cases).',
    revision_notes: 'Create compact, high-yield last-minute revision notes using clear headings, bullet points, and bold keywords.',
    extract_formulas: 'Extract all mathematical formulas, equations, laws, quantitative relationships, or formal rules mentioned, and explain what each variable represents.',
    explain_diagrams: 'Examine the visual layout, diagrams, charts, or figures on this page and explain their structure, labels, and meaning in detail.',
    qa_with_answers: 'Generate 8 comprehensive study questions WITH detailed model answers based strictly on the provided text.',
    qa_without_answers: 'Generate 10 challenging self-test study questions WITHOUT answers so the student can practice active recall.',
    lecture_outline: 'Create a structured university lecture outline (including learning outcomes, timed segments, talking points, and discussion prompts) based on this material.'
  };

  let activeAbortController = null;
  let serverPreconfiguredKeys = { openai: false, gemini: false, anthropic: false };

  /**
   * Retrieve stored user keys from localStorage (sent to local backend proxy)
   */
  function getStoredApiKey(provider) {
    try {
      const keys = JSON.parse(localStorage.getItem('ahmedko_api_keys') || '{}');
      return keys[provider] || '';
    } catch (_) {
      return '';
    }
  }

  /**
   * Smart RAG Chunking: Splits full document pages and retrieves top relevant pages
   */
  function buildRelevantDocumentContext(pagesTextArray, queryText, maxChars = 14000) {
    if (!Array.isArray(pagesTextArray) || pagesTextArray.length === 0) {
      return { text: '', warning: 'No extractable text was found in this document. Try running OCR on scanned pages.' };
    }

    const queryWords = (queryText || '')
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);

    const scoredPages = pagesTextArray.map((pageText, idx) => {
      const lower = (pageText || '').toLowerCase();
      let score = 0;
      queryWords.forEach((qw) => {
        if (lower.includes(qw)) score += 3;
      });
      // Boost early overview pages slightly
      if (idx === 0) score += 1;
      return { pageNum: idx + 1, text: pageText || '', score };
    });

    // Sort by relevance score if query has keywords, then restore page order
    const sorted = queryWords.length > 0
      ? [...scoredPages].sort((a, b) => b.score - a.score)
      : scoredPages;

    const selected = [];
    let currentLen = 0;
    for (const item of sorted) {
      if (!item.text.trim()) continue;
      const chunk = `[Page ${item.pageNum}]\n${item.text.trim()}\n`;
      if (currentLen + chunk.length > maxChars && selected.length > 0) break;
      selected.push(item);
      currentLen += chunk.length;
    }

    selected.sort((a, b) => a.pageNum - b.pageNum);
    const combined = selected.map((s) => `[Page ${s.pageNum}]\n${s.text.trim()}`).join('\n\n');

    return {
      text: combined,
      includedPages: selected.map((s) => s.pageNum),
      totalPages: pagesTextArray.length
    };
  }

  /**
   * Check backend health & preconfigured .env keys
   */
  async function checkServerHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      const data = await res.json();
      if (data.serverKeys) {
        serverPreconfiguredKeys = data.serverKeys;
      }
      return data;
    } catch (_) {
      return null;
    }
  }

  /**
   * Test real connection to selected AI provider
   */
  async function testConnection(provider, model) {
    const apiKey = getStoredApiKey(provider);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, apiKey })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Connection test failed (${res.status})`);
      }
      return { ok: true, model: data.model, reply: data.reply };
    } catch (err) {
      // Fallback direct browser test for Gemini or OpenAI if running without Node server
      if (err.message.includes('Failed to fetch') && apiKey) {
        return await directBrowserFallbackTest(provider, model, apiKey);
      }
      throw err;
    }
  }

  /**
   * Fallback direct API call if user opened index.html without starting server.js
   */
  async function directBrowserFallbackChat({ provider, model, apiKey, messages, systemPrompt }) {
    if (!apiKey) {
      throw new Error(`Please start server.js (node server.js) or configure your ${provider} API key in Settings.`);
    }
    if (provider === 'gemini') {
      const targetModel = model || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const body = { contents };
      if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: activeAbortController?.signal
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || 'Gemini request failed');
      const text = (d.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('\n');
      return { ok: true, provider, model: targetModel, text };
    }
    if (provider === 'openai') {
      const targetModel = model || 'gpt-4o-mini';
      const formatted = systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages;
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: targetModel, messages: formatted }),
        signal: activeAbortController?.signal
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || 'OpenAI request failed');
      return { ok: true, provider, model: targetModel, text: d.choices?.[0]?.message?.content || '' };
    }
    throw new Error('Please run `node server.js` to proxy requests for this provider.');
  }

  async function directBrowserFallbackTest(provider, model, apiKey) {
    const res = await directBrowserFallbackChat({
      provider,
      model,
      apiKey,
      messages: [{ role: 'user', content: 'Say CONNECTED' }],
      systemPrompt: 'Reply with CONNECTED'
    });
    return { ok: true, model: res.model, reply: res.text };
  }

  /**
   * Send chat or study tool prompt with document context
   */
  async function sendChatRequest({ provider, model, messages, systemPrompt, imageBase64 }) {
    const apiKey = getStoredApiKey(provider);
    activeAbortController = new AbortController();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          messages,
          systemPrompt,
          imageBase64
        }),
        signal: activeAbortController.signal
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `AI Error (${res.status})`);
      }
      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Generation stopped by user.');
      }
      if (err.message.includes('Failed to fetch') && apiKey) {
        return await directBrowserFallbackChat({ provider, model, apiKey, messages, systemPrompt });
      }
      throw err;
    } finally {
      activeAbortController = null;
    }
  }

  function stopGeneration() {
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
  }

  /**
   * Safe Markdown to HTML Renderer (escapes raw HTML first)
   */
  function renderMarkdown(mdText) {
    if (!mdText) return '';
    let safe = mdText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```lang ... ```
    safe = safe.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    safe = safe.replace(/^### (.*)$/gm, '<h4>$1</h4>');
    safe = safe.replace(/^## (.*)$/gm, '<h3>$1</h3>');
    safe = safe.replace(/^# (.*)$/gm, '<h2>$1</h2>');

    // Bold & Italic
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Line breaks
    safe = safe.replace(/\n/g, '<br/>');
    return safe;
  }

  return {
    PROVIDERS,
    STUDY_PROMPTS,
    checkServerHealth,
    testConnection,
    sendChatRequest,
    stopGeneration,
    buildRelevantDocumentContext,
    renderMarkdown,
    hasServerKey: (p) => Boolean(serverPreconfiguredKeys[p])
  };
})();

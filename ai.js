/**
 * AHMEDKO — Multi-AI Direct & Proxy Engine + Vision Diagram Analyzer
 * File: ai.js
 */

window.AhmedkoAI = (function () {
  const PROVIDERS = {
    gemini: {
      name: 'Google Gemini',
      models: [
        { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (موصى به)' },
        { id: 'gemini-3.8-pro', label: 'Gemini 3.8 Pro' },
        { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' }
      ]
    },
    openai: {
      name: 'OpenAI GPT',
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { id: 'gpt-4o', label: 'GPT-4o Vision' }
      ]
    },
    anthropic: {
      name: 'Anthropic Claude',
      models: [
        { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku' }
      ]
    }
  };

  const STUDY_PROMPTS = {
    explain_page:
      'اشرح محتوى هذه الصفحة بشكل واضح ومنظم خطوة بخطوة، مع تبسيط المفاهيم الهندسية أو العلمية الواردة فيها.',
    explain_diagrams:
      'افحص الرسومات التوضيحية أو المخططات الهندسية أو الجداول الموجودة في هذه الصورة، واشرح كل جزء ووظيفته والعلاقة بين المكونات بالتفصيل.',
    summarize_page:
      'قدم ملخصاً مركزاً وشاملاً لأهم الأفكار الواردة في هذه الصفحة.',
    key_points:
      'استخرج أهم النقاط الجوهرية والمعلومات الأساسية للامتحان في نقاط مرتبة.',
    mcq:
      'أنشئ 5 أسئلة اختيار من متعدد (MCQ) عالية الجودة من هذا المحتوى مع 4 اختيارات لكل سؤال، واكتب الإجابات الصحيحة مع التفسير في النهاية.',
    true_false:
      'أنشئ 6 أسئلة (صح أم خطأ) تختبر الفهم الدقيق لهذا المحتوى، مع تصحيح العبارات الخاطئة في نهاية الإجابة.',
    flashcards:
      'أنشئ 6 بطاقات استذكار (Flashcards) بصيغة: **المصطلح/السؤال** ⬅️ **التعريف/الإجابة**.',
    extract_formulas:
      'استخرج جميع القوانين، المعادلات، التصنيفات، والتعريفات الهامة المذكورة في هذا الجزء واشرح دلالة كل منها.'
  };

  let activeAbortController = null;

  function getStoredApiKey(provider) {
    try {
      const keys = JSON.parse(localStorage.getItem('ahmedko_api_keys') || '{}');
      return (keys[provider] || '').trim();
    } catch (_) {
      return '';
    }
  }

  function buildRelevantDocumentContext(pagesTextArray, queryText, maxChars = 14000) {
    if (!Array.isArray(pagesTextArray) || pagesTextArray.length === 0) {
      return { text: '' };
    }
    const queryWords = (queryText || '')
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);

    const scored = pagesTextArray.map((txt, idx) => {
      const lower = (txt || '').toLowerCase();
      let score = idx === 0 ? 1 : 0;
      queryWords.forEach((w) => {
        if (lower.includes(w)) score += 3;
      });
      return { pageNum: idx + 1, text: txt || '', score };
    });

    const sorted =
      queryWords.length > 0 ? [...scored].sort((a, b) => b.score - a.score) : scored;

    const chosen = [];
    let len = 0;
    for (const item of sorted) {
      if (!item.text.trim()) continue;
      const chunk = `[Page ${item.pageNum}]\n${item.text.trim()}\n`;
      if (len + chunk.length > maxChars && chosen.length > 0) break;
      chosen.push(item);
      len += chunk.length;
    }
    chosen.sort((a, b) => a.pageNum - b.pageNum);
    return {
      text: chosen.map((c) => `[Page ${c.pageNum}]\n${c.text.trim()}`).join('\n\n')
    };
  }

  async function directBrowserChat({ provider, model, apiKey, messages, systemPrompt, imageBase64 }) {
    if (!apiKey) {
      throw new Error(
        `يرجى الضغط على زر 🔑 Key لإدخال مفتاح ${provider.toUpperCase()} API أولاً.`
      );
    }

    if (provider === 'gemini') {
      const targetModel = model || 'gemini-3.8-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

      const contents = messages.map((m, idx) => {
        const parts = [{ text: m.content }];
        if (idx === messages.length - 1 && imageBase64 && m.role === 'user') {
          const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inline_data: { mime_type: match[1], data: match[2] }
            });
          }
        }
        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts
        };
      });

      const body = { contents };
      if (systemPrompt) {
        body.systemInstruction = { parts: [{ text: systemPrompt }] };
      }

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: activeAbortController?.signal
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || 'Gemini API Error');
      const text = (d.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || '')
        .join('\n');
      return { ok: true, text };
    }

    if (provider === 'openai') {
      const targetModel = model || 'gpt-4o-mini';
      const formatted = [];
      if (systemPrompt) formatted.push({ role: 'system', content: systemPrompt });

      messages.forEach((m, idx) => {
        if (idx === messages.length - 1 && imageBase64 && m.role === 'user') {
          formatted.push({
            role: 'user',
            content: [
              { type: 'text', text: m.content },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          });
        } else {
          formatted.push({ role: m.role, content: m.content });
        }
      });

      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: targetModel, messages: formatted }),
        signal: activeAbortController?.signal
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || 'OpenAI API Error');
      return { ok: true, text: d.choices?.[0]?.message?.content || '' };
    }

    if (provider === 'anthropic') {
      const targetModel = model || 'claude-3-5-sonnet-latest';
      const formatted = messages.map((m, idx) => {
        if (idx === messages.length - 1 && imageBase64 && m.role === 'user') {
          const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (match) {
            return {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: match[1], data: match[2] }
                },
                { type: 'text', text: m.content }
              ]
            };
          }
        }
        return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content };
      });

      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 4096,
          system: systemPrompt || '',
          messages: formatted
        }),
        signal: activeAbortController?.signal
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || 'Claude API Error');
      return {
        ok: true,
        text: (d.content || []).map((b) => b.text || '').join('\n')
      };
    }
  }

  async function sendChatRequest({ provider, model, messages, systemPrompt, imageBase64 }) {
    const apiKey = getStoredApiKey(provider);
    activeAbortController = new AbortController();

    try {
      if (location.hostname.includes('github.io') || location.protocol === 'file:') {
        return await directBrowserChat({
          provider,
          model,
          apiKey,
          messages,
          systemPrompt,
          imageBase64
        });
      }

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
      if (!res.ok || !data.ok) throw new Error(data.error || 'Server AI Error');
      return data;
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('تم إيقاف التوليد.');
      if (apiKey) {
        return await directBrowserChat({
          provider,
          model,
          apiKey,
          messages,
          systemPrompt,
          imageBase64
        });
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

  function renderMarkdown(mdText) {
    if (!mdText) return '';
    let safe = mdText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    safe = safe.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
    safe = safe.replace(/^### (.*)$/gm, '<h4>$1</h4>');
    safe = safe.replace(/^## (.*)$/gm, '<h3>$1</h3>');
    safe = safe.replace(/^# (.*)$/gm, '<h2>$1</h2>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    safe = safe.replace(/\n/g, '<br/>');
    return safe;
  }

  return {
    PROVIDERS,
    STUDY_PROMPTS,
    sendChatRequest,
    stopGeneration,
    buildRelevantDocumentContext,
    renderMarkdown
  };
})();

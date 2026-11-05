/**
 * AHMEDKO — Production Backend Server & Secure AI Proxy
 * File: server.js
 * Run: node server.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Load .env file manually if present (zero external dependencies required)
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let val = trimmed.slice(eqIndex + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  });
}

loadEnvFile();

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

/**
 * Helper to make HTTPS requests and return { status, data }
 */
function httpsRequest(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 60000
    };

    const req = https.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let parsed = raw;
        try {
          parsed = JSON.parse(raw);
        } catch (_) {
          // Keep as string if not JSON
        }
        resolve({ status: res.statusCode, data: parsed });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Upstream API request timed out after 60 seconds.'));
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Read JSON body from incoming request (max 15MB for base64 page images)
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    const maxBytes = 15 * 1024 * 1024;
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > maxBytes) {
        req.destroy();
        reject(new Error('Payload too large (exceeds 15MB limit).'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error('Invalid JSON payload.'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendJSON(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

/**
 * Resolve API key: uses client-supplied session key or server .env key
 */
function resolveApiKey(provider, clientKey) {
  if (clientKey && typeof clientKey === 'string' && clientKey.trim().length > 5) {
    return clientKey.trim();
  }
  if (provider === 'openai') return process.env.OPENAI_API_KEY || '';
  if (provider === 'gemini') return process.env.GEMINI_API_KEY || '';
  if (provider === 'anthropic') return process.env.ANTHROPIC_API_KEY || '';
  return '';
}

/**
 * Call OpenAI Chat Completions API
 */
async function callOpenAI({ apiKey, model, messages, systemPrompt, imageBase64, temperature = 0.4 }) {
  const targetModel = model || 'gpt-4o-mini';
  const formattedMessages = [];

  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (i === messages.length - 1 && imageBase64 && m.role === 'user') {
      formattedMessages.push({
        role: 'user',
        content: [
          { type: 'text', text: m.content },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ]
      });
    } else {
      formattedMessages.push({ role: m.role, content: m.content });
    }
  }

  const response = await httpsRequest(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    },
    {
      model: targetModel,
      messages: formattedMessages,
      temperature
    }
  );

  if (response.status >= 400) {
    const errMsg = response.data?.error?.message || `OpenAI HTTP ${response.status}`;
    throw new Error(errMsg);
  }

  const reply = response.data?.choices?.[0]?.message?.content || '';
  return { text: reply, model: targetModel, provider: 'openai' };
}

/**
 * Call Google Gemini generateContent API
 */
async function callGemini({ apiKey, model, messages, systemPrompt, imageBase64, temperature = 0.4 }) {
  const targetModel = model || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const contents = messages.map((m, idx) => {
    const parts = [{ text: m.content }];
    if (idx === messages.length - 1 && imageBase64 && m.role === 'user') {
      const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inline_data: {
            mime_type: match[1],
            data: match[2]
          }
        });
      }
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts
    };
  });

  const payload = {
    contents,
    generationConfig: { temperature }
  };

  if (systemPrompt) {
    payload.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const response = await httpsRequest(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    payload
  );

  if (response.status >= 400) {
    const errMsg = response.data?.error?.message || `Gemini HTTP ${response.status}`;
    throw new Error(errMsg);
  }

  const parts = response.data?.candidates?.[0]?.content?.parts || [];
  const reply = parts.map((p) => p.text || '').join('\n');
  return { text: reply, model: targetModel, provider: 'gemini' };
}

/**
 * Call Anthropic Claude Messages API
 */
async function callAnthropic({ apiKey, model, messages, systemPrompt, imageBase64, temperature = 0.4 }) {
  const targetModel = model || 'claude-3-5-sonnet-latest';

  const formattedMessages = messages.map((m, idx) => {
    if (idx === messages.length - 1 && imageBase64 && m.role === 'user') {
      const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        return {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: match[1],
                data: match[2]
              }
            },
            { type: 'text', text: m.content }
          ]
        };
      }
    }
    return {
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    };
  });

  const payload = {
    model: targetModel,
    max_tokens: 4096,
    temperature,
    messages: formattedMessages
  };

  if (systemPrompt) {
    payload.system = systemPrompt;
  }

  const response = await httpsRequest(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    },
    payload
  );

  if (response.status >= 400) {
    const errMsg = response.data?.error?.message || `Anthropic HTTP ${response.status}`;
    throw new Error(errMsg);
  }

  const contentBlocks = response.data?.content || [];
  const reply = contentBlocks.map((b) => b.text || '').join('\n');
  return { text: reply, model: targetModel, provider: 'anthropic' };
}

/**
 * Unified AI dispatcher
 */
async function dispatchAIRequest(options) {
  const { provider } = options;
  if (provider === 'openai') return callOpenAI(options);
  if (provider === 'gemini') return callGemini(options);
  if (provider === 'anthropic') return callAnthropic(options);
  throw new Error(`Unsupported AI provider: ${provider}`);
}

/**
 * Main HTTP Server
 */
const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // 1. Health & Preconfigured Server Keys Check
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJSON(res, 200, {
        status: 'ok',
        app: 'Ahmedko Server',
        serverKeys: {
          openai: Boolean(process.env.OPENAI_API_KEY),
          gemini: Boolean(process.env.GEMINI_API_KEY),
          anthropic: Boolean(process.env.ANTHROPIC_API_KEY)
        }
      });
    }

    // 2. Test AI Provider Connection
    if (pathname === '/api/ai/test' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const { provider, model, apiKey: clientKey } = body;
      const apiKey = resolveApiKey(provider, clientKey);

      if (!apiKey) {
        return sendJSON(res, 400, {
          ok: false,
          error: `No API key found for ${provider}. Please enter an API key in Settings or configure it in .env on the server.`
        });
      }

      const result = await dispatchAIRequest({
        provider,
        apiKey,
        model,
        messages: [{ role: 'user', content: 'Reply with the single word: CONNECTED' }],
        systemPrompt: 'You are a connectivity check endpoint. Reply with CONNECTED.',
        temperature: 0
      });

      return sendJSON(res, 200, {
        ok: true,
        provider,
        model: result.model,
        reply: result.text.trim()
      });
    }

    // 3. Main AI Chat / Study Tool / Context Endpoint
    if (pathname === '/api/ai/chat' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const { provider, model, apiKey: clientKey, messages, systemPrompt, imageBase64, temperature } = body;
      const apiKey = resolveApiKey(provider, clientKey);

      if (!apiKey) {
        return sendJSON(res, 400, {
          ok: false,
          error: `Missing API key for ${provider}. Please configure your API key in the AI Panel or .env file.`
        });
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return sendJSON(res, 400, { ok: false, error: 'Messages array is required.' });
      }

      const result = await dispatchAIRequest({
        provider,
        apiKey,
        model,
        messages,
        systemPrompt,
        imageBase64,
        temperature: typeof temperature === 'number' ? temperature : 0.4
      });

      return sendJSON(res, 200, {
        ok: true,
        provider: result.provider,
        model: result.model,
        text: result.text
      });
    }

    // 4. Smart Translation & Dictionary Endpoint
    if (pathname === '/api/translate' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const { text, sourceLang = 'auto', targetLang = 'ar', provider, model, apiKey: clientKey } = body;

      if (!text || !text.trim()) {
        return sendJSON(res, 400, { ok: false, error: 'No text provided for translation.' });
      }

      const trimmedText = text.trim();
      const isSingleWord = trimmedText.split(/\s+/).length === 1 && trimmedText.length < 35;

      // Optional Dictionary Lookup for single English words
      let wordDetails = null;
      if (isSingleWord && /^[a-zA-Z-]+$/.test(trimmedText)) {
        try {
          const dictRes = await httpsRequest(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(trimmedText.toLowerCase())}`
          );
          if (dictRes.status === 200 && Array.isArray(dictRes.data) && dictRes.data[0]) {
            const entry = dictRes.data[0];
            const meaningBlock = entry.meanings?.[0] || {};
            const defBlock = meaningBlock.definitions?.[0] || {};
            const audioObj = (entry.phonetics || []).find((p) => p.audio) || {};
            wordDetails = {
              word: entry.word,
              phonetic: entry.phonetic || audioObj.text || '',
              audio: audioObj.audio || '',
              partOfSpeech: meaningBlock.partOfSpeech || '',
              definition: defBlock.definition || '',
              example: defBlock.example || '',
              synonyms: (meaningBlock.synonyms || []).slice(0, 5)
            };
          }
        } catch (_) {
          // Ignore dictionary error and continue translation
        }
      }

      // If an AI provider key is available and requested, can use AI for rich translation
      const resolvedKey = provider ? resolveApiKey(provider, clientKey) : '';
      if (provider && resolvedKey) {
        try {
          const sys = `You are a professional translator. Translate the user's text from ${sourceLang} to ${targetLang}. Return ONLY a valid JSON object with keys: "translatedText" (string), "detectedSource" (string), and if the input is a single word or short phrase, include "wordDetails": {"partOfSpeech": string, "phonetic": string, "meaning": string, "example": string, "alternatives": [string]}.`;
          const aiRes = await dispatchAIRequest({
            provider,
            apiKey: resolvedKey,
            model,
            messages: [{ role: 'user', content: trimmedText }],
            systemPrompt: sys,
            temperature: 0.2
          });
          const jsonMatch = aiRes.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return sendJSON(res, 200, {
              ok: true,
              engine: `AI (${provider})`,
              translatedText: parsed.translatedText || aiRes.text,
              detectedSource: parsed.detectedSource || sourceLang,
              wordDetails: parsed.wordDetails || wordDetails
            });
          }
        } catch (_) {
          // Fall back to public translation endpoint if AI call fails
        }
      }

      // Fallback Public Translation API (Google GTX endpoint via backend)
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sourceLang
      )}&tl=${encodeURIComponent(targetLang)}&dt=t&dt=bd&q=${encodeURIComponent(trimmedText)}`;

      const transRes = await httpsRequest(gtxUrl);
      if (transRes.status === 200 && Array.isArray(transRes.data)) {
        const sentences = transRes.data[0] || [];
        const translatedText = sentences.map((s) => s[0] || '').join('');
        const detectedSource = transRes.data[2] || sourceLang;

        // Enrich dictionary alternatives if present in GTX response
        if (transRes.data[1] && Array.isArray(transRes.data[1])) {
          const firstPos = transRes.data[1][0];
          if (firstPos) {
            wordDetails = wordDetails || {};
            wordDetails.partOfSpeech = wordDetails.partOfSpeech || firstPos[0] || '';
            wordDetails.alternatives = (firstPos[1] || []).slice(0, 6);
          }
        }

        return sendJSON(res, 200, {
          ok: true,
          engine: 'Standard Translator',
          translatedText,
          detectedSource,
          wordDetails
        });
      }

      return sendJSON(res, 502, { ok: false, error: 'Translation service temporarily unreachable.' });
    }

    // 5. Static File Serving
    let safePath = pathname === '/' ? '/index.html' : pathname;
    safePath = path.normalize(safePath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    // Block access to .env or server.js from browser
    const baseName = path.basename(filePath);
    if (baseName === '.env' || baseName === 'server.js') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
  } catch (err) {
    sendJSON(res, 500, { ok: false, error: err.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log('==========================================================');
  console.log(`  AHMEDKO Smart Workspace Server is running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log('==========================================================');
});

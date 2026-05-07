import { Hono } from 'hono';
import type { Env, Variables } from '../types';

const audio = new Hono<{ Bindings: Env; Variables: Variables }>();

const EDGE_TTS_VOICE = 'zh-CN-XiaoxiaoNeural';

// GET /api/audio/:wordId?speed=normal|slow
audio.get('/:wordId', async (c) => {
  const wordId = c.req.param('wordId');
  const speed = c.req.query('speed') === 'slow' ? 'slow' : 'normal';

  const cacheKey = `audio/${wordId}_${speed}.mp3`;

  // Check R2 cache first
  const cached = await c.env.STORAGE.get(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  }

  // Fetch word text from DB
  const word = await c.env.DB.prepare(
    'SELECT hanzi, pinyin FROM words WHERE id = ?'
  ).bind(wordId).first<{ hanzi: string; pinyin: string }>();

  if (!word) {
    return c.json({ error: 'Үг олдсонгүй' }, 404);
  }

  // Generate TTS via Edge TTS API
  try {
    const rate = speed === 'slow' ? '-30%' : '0%';
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
        <voice name="${EDGE_TTS_VOICE}">
          <prosody rate="${rate}">${word.hanzi}</prosody>
        </voice>
      </speak>`.trim();

    const audioBuffer = await fetchEdgeTTS(ssml);

    if (audioBuffer) {
      // Store in R2
      await c.env.STORAGE.put(cacheKey, audioBuffer, {
        httpMetadata: { contentType: 'audio/mpeg' },
      });

      // Update DB cache reference
      await c.env.DB.prepare(
        `INSERT INTO audio_cache (word_id, audio_key, audio_url)
         VALUES (?, ?, ?)
         ON CONFLICT(word_id) DO UPDATE SET audio_key = excluded.audio_key, audio_url = excluded.audio_url`
      ).bind(wordId, cacheKey, `/api/audio/${wordId}`).run();

      return new Response(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        },
      });
    }
  } catch (e) {
    console.error('TTS error:', e);
  }

  return c.json({ error: 'Дуу үүсгэхэд алдаа гарлаа' }, 500);
});

async function fetchEdgeTTS(ssml: string): Promise<ArrayBuffer | null> {
  // Microsoft Edge TTS uses WebSocket — for Workers, use the REST endpoint
  const trustedClientToken = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
  const connectionId = generateConnectionId();

  const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/realtimetts/api/v1?TrustedClientToken=${trustedClientToken}&ConnectionId=${connectionId}`;

  // For Cloudflare Workers, we use HTTP fetch to a proxy or implement WebSocket
  // Fallback: use a simpler HTTP-based approach via the internal Edge TTS endpoint
  try {
    const response = await fetch(
      `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'ChineseLearningApp/1.0',
          'Ocp-Apim-Subscription-Key': '', // Will use free tier via Edge browser token
        },
        body: ssml,
      }
    );

    if (response.ok) {
      return await response.arrayBuffer();
    }
  } catch {
    // Fallback to Google Translate TTS (free, no key needed)
  }

  // Google Translate TTS fallback (Mandarin)
  const word = ssml.match(/<prosody[^>]*>(.*?)<\/prosody>/)?.[1] ?? '';
  const gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=zh-CN&client=tw-ob`;

  const response = await fetch(gttsUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (response.ok) {
    return await response.arrayBuffer();
  }

  return null;
}

function generateConnectionId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default audio;

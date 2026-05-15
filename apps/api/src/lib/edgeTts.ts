/** SSML текстийн орц — XML тэмдгүүдийг зайлуулна */
export function escapeXmlForSsml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const EDGE_TTS_VOICE_JA = 'ja-JP-NanamiNeural';

/** Japanese TTS (kana/kanji/romaji phrases). */
export function jaSsmlBody(text: string, speed: 'normal' | 'slow'): string {
  const rate = speed === 'slow' ? '-30%' : '0%';
  const inner = escapeXmlForSsml(text.trim());
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ja-JP">
  <voice name="${EDGE_TTS_VOICE_JA}">
    <prosody rate="${rate}">${inner}</prosody>
  </voice>
</speak>`.trim();
}

export async function fetchEdgeTTS(ssml: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'JapaneseLearningApp/1.0',
          'Ocp-Apim-Subscription-Key': '',
        },
        body: ssml,
      }
    );

    if (response.ok) {
      return await response.arrayBuffer();
    }
  } catch {
    /* Google fallback */
  }

  const raw = ssml.match(/<prosody[^>]*>([\s\S]*?)<\/prosody>/)?.[1] ?? '';
  const phrase = raw
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');

  if (!phrase.trim()) return null;

  const gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(phrase)}&tl=ja&client=tw-ob`;
  const response = await fetch(gttsUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (response.ok) {
    return await response.arrayBuffer();
  }

  return null;
}

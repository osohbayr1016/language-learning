function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export function extractJsonDataFromLessonHtml(html: string): unknown {
  const body = typeof html === 'string' ? html : '';
  if (!body.trim()) throw new Error('HTML хоосон байна');

  const match = body.match(/<pre\b[^>]*\bid=["']jsondata["'][^>]*>([\s\S]*?)<\/pre>/i);
  if (!match?.[1]) {
    throw new Error('HTML дотор <pre id="jsondata"> JSON олдсонгүй');
  }

  const raw = decodeHtmlEntities(match[1].trim());
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('jsondata хэсгийн JSON буруу байна');
  }
}

export function extractQuizletTextFromLessonHtml(html: string): string {
  const match = html.match(/<pre\b[^>]*\bid=["']quiz["'][^>]*>([\s\S]*?)<\/pre>/i);
  return match?.[1] ? decodeHtmlEntities(match[1].trim()) : '';
}

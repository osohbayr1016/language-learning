import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

export async function extractPdfText(data: ArrayBuffer): Promise<string> {
  const doc = await getDocument({ data }).promise;
  const parts: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    for (const it of tc.items) {
      if (it && typeof it === 'object' && 'str' in it && typeof (it as { str: string }).str === 'string') {
        parts.push((it as { str: string }).str);
      }
    }
    parts.push('\n');
  }
  return parts.join(' ');
}

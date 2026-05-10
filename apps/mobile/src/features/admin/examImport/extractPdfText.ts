import { Platform } from 'react-native';

/**
 * Metro bundles of pdfjs-dist can surface "import.meta outside a module" in the browser.
 * Load PDF.js as a real browser module from a CDN (not from the Metro bundle).
 */
const PDF_LIB = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.min.mjs';
const PDF_WORKER = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
const READY = 'pdfjs-extract-ns-ready';

type PdfPage = { getTextContent: () => Promise<{ items: Iterable<unknown> }> };
type PdfDoc = { numPages: number; getPage: (n: number) => Promise<PdfPage> };

type PdfjsMod = {
  getDocument: (src: { data: ArrayBuffer }) => { promise: Promise<PdfDoc> };
  GlobalWorkerOptions: { workerSrc: string };
};

/** RN tsconfig omits DOM lib types; keep a minimal surface for Expo web only. */
type WebScriptElm = {
  id: string;
  type: string;
  textContent: string;
  onerror: null | ((e: unknown) => void);
};
type WebDoc = {
  head: { appendChild(node: unknown): void };
  getElementById(id: string): unknown | null;
  createElement(tag: string): WebScriptElm;
};

type PdfHost = {
  document?: WebDoc;
  __PDFJS_MOD__?: PdfjsMod;
  addEventListener: (ev: string, fn: () => void, opts?: { once?: boolean }) => void;
};

function pdfHost(): PdfHost {
  return globalThis as unknown as PdfHost;
}

function isDomEnvironment(): boolean {
  const d = pdfHost().document;
  return d != null;
}

let loadPromise: Promise<PdfjsMod> | null = null;

function loadPdfjsOnWeb(): Promise<PdfjsMod> {
  const h = pdfHost();
  if (h.__PDFJS_MOD__) return Promise.resolve(h.__PDFJS_MOD__);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const docRef = pdfHost().document;
    if (!docRef?.head) {
      reject(new Error('Хөтөчийн document алга'));
      return;
    }

    const failAfter = 25_000;
    const timer = setTimeout(() => reject(new Error('PDF.js ачаалах хугацаа дууссан')), failAfter);

    const finish = () => {
      clearTimeout(timer);
      const m = pdfHost().__PDFJS_MOD__;
      if (m) resolve(m);
      else reject(new Error('PDF.js ачаалагдаагүй'));
    };

    pdfHost().addEventListener(READY, () => finish(), { once: true });

    if (!docRef.getElementById('pdfjs-extract-loader')) {
      const script = docRef.createElement('script');
      script.id = 'pdfjs-extract-loader';
      script.type = 'module';
      script.textContent = [
        `import * as pdfjs from '${PDF_LIB}';`,
        `pdfjs.GlobalWorkerOptions.workerSrc = '${PDF_WORKER}';`,
        `globalThis.__PDFJS_MOD__ = pdfjs;`,
        `globalThis.dispatchEvent(new Event('${READY}'));`,
      ].join('\n');
      script.onerror = () => {
        clearTimeout(timer);
        reject(new Error('PDF.js script ачаалахад алдаа'));
      };
      docRef.head.appendChild(script);
    }
  });

  return loadPromise;
}

export async function extractPdfText(data: ArrayBuffer): Promise<string> {
  if (Platform.OS !== 'web' || !isDomEnvironment()) {
    throw new Error(
      'PDF-аас текст гаргалт зөвхөн хөтөчийн орчинд ажиллана (Expo web). SSR дээр ачаалагдахгүй.'
    );
  }

  const pdfjs = await loadPdfjsOnWeb();
  const doc = await pdfjs.getDocument({ data }).promise;
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

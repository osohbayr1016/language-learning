import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

const APP_TITLE = 'Япон хэл сурах';
const META_DESC =
  'Япон хэл сурах апп — хичээл, тоглоом, дуу сонсох. Learn Japanese with lessons, games, and audio.';

/**
 * Server-rendered HTML shell for the Expo web build. Viewport allows pinch-zoom;
 * global CSS overrides expo-router's body overflow:hidden so tall pages can scroll.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="mn">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="description" content={META_DESC} />
        <meta property="og:title" content={APP_TITLE} />
        <meta property="og:description" content={META_DESC} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <title>{APP_TITLE}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;800&family=Noto+Sans+JP:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang='mn';document.title=${JSON.stringify(APP_TITLE)};`,
          }}
        />
      </head>
      <body>
        <div id="web-boot-splash" aria-hidden="true">
          <div className="boot-inner">
            <div className="boot-logo" />
            <div className="boot-line" />
            <div className="boot-line short" />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}

const globalCss = `
html, body, #root { height: 100%; margin: 0; padding: 0; }
/* Override expo-router ScrollViewStyleReset: allow vertical scroll + zoom elsewhere */
body {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Noto Sans", "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
#root { display: flex; flex-direction: column; min-height: 100%; }
input:focus-visible, textarea:focus-visible {
  outline: 2px solid #58CC02;
  outline-offset: 2px;
}
#web-boot-splash {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F7F7F7;
  transition: opacity 0.2s ease-out;
}
#web-boot-splash .boot-inner { width: 240px; text-align: center; }
#web-boot-splash .boot-logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #58CC02, #1CB0F6);
}
#web-boot-splash .boot-line {
  height: 10px;
  border-radius: 6px;
  background: #E5E7EB;
  margin-bottom: 8px;
}
#web-boot-splash .boot-line.short { width: 65%; margin-left: auto; margin-right: auto; }
`;

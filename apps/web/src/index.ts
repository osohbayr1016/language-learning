export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // Expo Router static export exposes /_sitemap with route structure — hide in production.
    if (url.pathname === '/_sitemap' || url.pathname.endsWith('/_sitemap')) {
      return new Response('Not Found', { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};

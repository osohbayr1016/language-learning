import type { Href } from 'expo-router';

type Nav = {
  back: () => void;
  replace: (href: Href) => void;
  canGoBack?: () => boolean;
};

/** Web: шууд URL / refresh — history хоосон үед `back` дүр эс гаргана. Fallback руу `replace`. */
export function safeBack(router: Nav, fallback: Href): void {
  if (router.canGoBack?.()) {
    router.back();
    return;
  }
  router.replace(fallback);
}

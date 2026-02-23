import { Href, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { usePageTransition } from '@/features/transition/page-transition-context';

export function useTransitionRouter() {
  const router = useRouter();
  const { runWithTransition } = usePageTransition();

  const push = useCallback(
    async (href: Href) => {
      await runWithTransition(() => {
        router.push(href);
      });
    },
    [router, runWithTransition],
  );

  const replace = useCallback(
    async (href: Href) => {
      await runWithTransition(() => {
        router.replace(href);
      });
    },
    [router, runWithTransition],
  );

  const back = useCallback(async () => {
    await runWithTransition(() => {
      router.back();
    });
  }, [router, runWithTransition]);

  return {
    push,
    replace,
    back,
  };
}

"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");

      if (target?.href) {
        const url = new URL(target.href);

        if (
          url.origin === window.location.origin &&
          url.pathname === window.location.pathname &&
          url.hash
        ) {
          e.preventDefault();
          const element = document.querySelector(url.hash) as HTMLElement;

          if (element) {
            lenis.scrollTo(element, {
              offset: -80,
              duration: 1.2,
              immediate: false,
            });

            history.pushState(null, "", url.hash);
          }
        }
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return <>{children}</>;
}

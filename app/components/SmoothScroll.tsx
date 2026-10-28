"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Smooths mouse-wheel and trackpad scrolling into one continuous glide.
 * Touch, keyboard, scrollbar and assistive-tech scrolling stay native, and it
 * is off entirely under reduced motion. Anchor links glide to their gate,
 * leaving room for the fixed header.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.15,
      // Sections carry their own top padding, so land the section edge at the top.
      anchors: { offset: 0, duration: 1.4 },
    });
    // Native smooth-scroll in CSS would fight Lenis; it owns the glide while active.
    document.documentElement.style.scrollBehavior = "auto";
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
  return null;
}

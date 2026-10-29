"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A section label that sticks to the top of the screen on phones. It only
 * takes on its dark, blurred backing once it is actually stuck, so at rest it
 * doesn't lay a band across the background.
 */
export default function StickyLabel({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // Stuck once the line just above the label has scrolled off the top.
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <span ref={sentinel} aria-hidden="true" className="-mb-px block h-px" />
      <div
        data-stuck={stuck || undefined}
        className="sticky top-0 z-20 -mx-6 mb-6 px-6 py-5 transition-colors duration-300 max-lg:data-[stuck]:bg-bg/60 max-lg:data-[stuck]:backdrop-blur-xl md:-mx-12 md:px-12 lg:static lg:mx-0 lg:mb-8 lg:p-0"
      >
        {children}
      </div>
    </>
  );
}

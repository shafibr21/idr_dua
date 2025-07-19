"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollOptions {
  speed?: number;
  ease?: string;
  normalizeScroll?: boolean;
}

export function useSmoothScroll(options: SmoothScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { speed = 1, ease = "none", normalizeScroll = true } = options;

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // Set up smooth scrolling
    let ctx = gsap.context(() => {
      // Get the height difference
      const getScrollAmount = () => {
        const containerHeight = container.offsetHeight;
        const contentHeight = content.offsetHeight;
        return -(contentHeight - containerHeight);
      };

      // Create the smooth scroll animation
      const tween = gsap.to(content, {
        y: getScrollAmount,
        duration: speed,
        ease: ease,
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${content.offsetHeight - container.offsetHeight}`,
          scrub: normalizeScroll ? 1 : true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update scroll position for other components that might need it
            const scrollY = Math.abs(self.progress * getScrollAmount());
            container.dispatchEvent(
              new CustomEvent("smoothscroll", {
                detail: { scrollY, progress: self.progress },
              })
            );
          },
        },
      });

      return () => {
        tween.kill();
      };
    }, container);

    // Cleanup function
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed, ease, normalizeScroll]);

  return { containerRef, contentRef };
}

"use client";

import React, { ReactNode } from "react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

interface SmoothScrollContainerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  ease?: string;
  normalizeScroll?: boolean;
}

export default function SmoothScrollContainer({
  children,
  className = "",
  speed = 1,
  ease = "none",
  normalizeScroll = true,
}: SmoothScrollContainerProps) {
  const { containerRef, contentRef } = useSmoothScroll({
    speed,
    ease,
    normalizeScroll,
  });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ height: "100%" }}
    >
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

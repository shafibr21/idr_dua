"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface HeaderContextType {
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're on mobile - if so, always keep header visible
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsHeaderVisible(true);
        return; // Don't process scroll hiding on mobile
      }

      // For desktop only: implement scroll-based header hiding
      let scrollY = window.scrollY;

      // Only consider main content area for scroll detection
      const mainContent = document.querySelector(".main-content-area");
      if (mainContent) {
        scrollY = Math.max(scrollY, mainContent.scrollTop);
      }

      // More stable thresholds to prevent flickering
      const SHOW_THRESHOLD = 15; // Show header when scrolling up or near top
      const HIDE_THRESHOLD = 50; // Hide header when scrolling down significantly

      if (scrollY < lastScrollY || scrollY < SHOW_THRESHOLD) {
        // Scrolling up or near top - show header
        setIsHeaderVisible(true);
      } else if (scrollY > lastScrollY && scrollY > HIDE_THRESHOLD) {
        // Scrolling down significantly - hide header
        setIsHeaderVisible(false);
      }
      // Don't change header state for small scroll movements to prevent flickering

      setLastScrollY(scrollY);
    };

    // Throttle scroll events for better performance and stability
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Filter out scroll events from mobile overlays
    const handleScrollEvent = (event: Event) => {
      const target = event.target as Element;
      // Ignore scroll events from mobile sidebars and other overlays
      if (
        target &&
        (target.closest(".mobile-sidebar-scroll") ||
          target.closest(".mobile-settings-scroll") ||
          target.closest("[data-scroll-ignore]"))
      ) {
        return; // Don't process scroll from these elements
      }
      throttledScroll();
    };

    // Listen to window scroll (primary)
    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Listen to window resize to handle mobile/desktop transitions
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsHeaderVisible(true); // Always show header on mobile
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Listen to main content scroll (secondary)
    const addMainContentListener = () => {
      const mainContent = document.querySelector(".main-content-area");
      if (mainContent) {
        mainContent.addEventListener("scroll", handleScrollEvent, {
          passive: true,
        });
      }
    };

    // Add listener after components are rendered
    const timeoutId = setTimeout(addMainContentListener, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", handleResize);

      const mainContent = document.querySelector(".main-content-area");
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScrollEvent);
      }
    };
  }, [lastScrollY]);

  return (
    <HeaderContext.Provider value={{ isHeaderVisible, setIsHeaderVisible }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}

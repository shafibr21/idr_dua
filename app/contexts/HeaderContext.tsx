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
      // Get the maximum scroll position from all possible scrollable areas
      let maxScrollY = window.scrollY;

      // Check if any container with overflow-y-auto has been scrolled
      const scrollableContainers =
        document.querySelectorAll(".overflow-y-auto");
      scrollableContainers.forEach((container) => {
        if (container.scrollTop > maxScrollY) {
          maxScrollY = container.scrollTop;
        }
      });

      if (maxScrollY < lastScrollY || maxScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (maxScrollY > lastScrollY && maxScrollY > 30) {
        setIsHeaderVisible(false);
      }

      setLastScrollY(maxScrollY);
    };

    // Throttle scroll events for better performance
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

    // Listen to window scroll
    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Wait for components to mount, then add listeners to scrollable containers
    const addScrollListeners = () => {
      const scrollableContainers =
        document.querySelectorAll(".overflow-y-auto");
      scrollableContainers.forEach((container) => {
        container.addEventListener("scroll", throttledScroll, {
          passive: true,
        });
      });
    };

    // Add listeners after components are rendered
    const timeoutId = setTimeout(addScrollListeners, 500);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", throttledScroll);

      const scrollableContainers =
        document.querySelectorAll(".overflow-y-auto");
      scrollableContainers.forEach((container) => {
        container.removeEventListener("scroll", throttledScroll);
      });
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

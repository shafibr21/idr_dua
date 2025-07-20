"use client";

import type React from "react";
import Header from "./Header";
import NavigationSidebar from "./NavigationSidebar";
import { HeaderProvider, useHeader } from "../contexts/HeaderContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: React.ReactNode;
}

function PageLayoutContent({ children }: PageLayoutProps) {
  const { isHeaderVisible } = useHeader();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* Hide navigation sidebar on mobile or show as overlay */}
      <div className={`${isMobile ? "hidden" : "block"}`}>
        <NavigationSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex">{children}</div>
      </div>
    </div>
  );
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <HeaderProvider>
      <SmoothScrollProvider>
        <PageLayoutContent>{children}</PageLayoutContent>
      </SmoothScrollProvider>
    </HeaderProvider>
  );
}

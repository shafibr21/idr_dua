"use client";

import type React from "react";
import Header from "./Header";
import NavigationSidebar from "./NavigationSidebar";
import { HeaderProvider, useHeader } from "../contexts/HeaderContext";

interface PageLayoutProps {
  children: React.ReactNode;
}

function PageLayoutContent({ children }: PageLayoutProps) {
  const { isHeaderVisible } = useHeader();

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <NavigationSidebar />
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
      <PageLayoutContent>{children}</PageLayoutContent>
    </HeaderProvider>
  );
}

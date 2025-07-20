"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Grid3X3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import the sidebar to avoid SSR issues
const MobileCategoriesSidebar = dynamic(
  () => import("./MobileCategoriesSidebar"),
  {
    ssr: false,
  }
);

export default function MobileCategoriesFAB() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
      >
        <Grid3X3 className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Categories Sidebar */}
      <Suspense fallback={null}>
        <MobileCategoriesSidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          categories={[]} // The mobile sidebar will fetch its own data
          subcategories={{}} // The mobile sidebar will fetch its own data
          expandedCategory={0} // The mobile sidebar will manage its own state
          selectedSubcategoryId={0} // The mobile sidebar will determine this from URL
          onCategoryClick={() => {}} // The mobile sidebar will handle navigation internally
          onSubcategoryClick={() => {}} // The mobile sidebar will handle navigation internally
          isLoading={false} // The mobile sidebar will manage its own loading state
        />
      </Suspense>
    </>
  );
}

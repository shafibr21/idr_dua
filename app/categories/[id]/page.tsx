"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import PageLayout from "../../components/PageLayout";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import MainContent from "../../components/MainContent";
import { DuaProvider, useDuaContext } from "../../components/DuaProvider";

// Dynamically import mobile components to avoid SSR issues
const MobileCategoriesFAB = dynamic(
  () => import("../../components/MobileCategoriesFAB"),
  {
    ssr: false,
  }
);

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

function CategoryPageWithProvider({ categoryId }: { categoryId: number }) {
  const { selectedCategoryId, setSelectedCategory } = useDuaContext();

  useEffect(() => {
    console.log(
      "CategoryPage: URL categoryId:",
      categoryId,
      "current selectedCategoryId:",
      selectedCategoryId
    );
    if (categoryId && categoryId > 0 && categoryId !== selectedCategoryId) {
      console.log("CategoryPage: Setting category ID from URL:", categoryId);
      setSelectedCategory(categoryId);
    }
  }, [categoryId, selectedCategoryId, setSelectedCategory]);

  return (
    <>
      <div className="flex flex-col lg:flex-row flex-1">
        <MainContent />
        <div className="hidden lg:block">
          <SettingsPanel />
        </div>
      </div>

      {/* Mobile FABs - now inside DuaProvider */}
      <Suspense fallback={null}>
        <MobileCategoriesFAB />
      </Suspense>
    </>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [categoryId, setCategoryId] = useState<number>(0);

  useEffect(() => {
    params.then((resolvedParams) => {
      setCategoryId(Number.parseInt(resolvedParams.id));
    });
  }, [params]);

  if (!categoryId) {
    return (
      <PageLayout>
        <div className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row w-full">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <DuaProvider>
          <CategoryPageWithProvider categoryId={categoryId} />
        </DuaProvider>
      </div>
    </PageLayout>
  );
}

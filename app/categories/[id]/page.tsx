"use client";

import { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import Sidebar from "../../components/Sidebar";
import SettingsPanel from "../../components/SettingsPanel";
import MainContent from "../../components/MainContent";
import { DuaProvider, useDuaContext } from "../../components/DuaProvider";

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
      <MainContent />
      <SettingsPanel />
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
      <Sidebar />
      <DuaProvider>
        <CategoryPageWithProvider categoryId={categoryId} />
      </DuaProvider>
    </PageLayout>
  );
}

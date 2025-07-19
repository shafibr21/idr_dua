"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import {
  supabase,
  type Dua,
  type Category,
  type SubCategory,
} from "@/lib/supabase";
import DuaCard from "./DuaCard";
import { useDuaContext } from "./DuaProvider";
import { useHeader } from "../contexts/HeaderContext";

export default function MainContent() {
  const { selectedCategoryId } = useDuaContext();
  const { isHeaderVisible } = useHeader();
  const [subcategoriesWithDuas, setSubcategoriesWithDuas] = useState<
    { subcategory: SubCategory; duas: Dua[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    console.log(
      "MainContent: selectedCategoryId changed to:",
      selectedCategoryId
    );
    if (selectedCategoryId && selectedCategoryId > 0) {
      fetchCategoryWithSubcategoriesAndDuas(selectedCategoryId);
      fetchCategoryInfo(selectedCategoryId);
    } else {
      console.log(
        "MainContent: selectedCategoryId is 0 or null, showing welcome message"
      );
      setSubcategoriesWithDuas([]);
      setCurrentCategory(null);
    }
  }, [selectedCategoryId]);

  const fetchCategoryWithSubcategoriesAndDuas = async (categoryId: number) => {
    try {
      setLoading(true);
      console.log(
        "MainContent: Fetching subcategories and duas for category:",
        categoryId
      );

      // First fetch all subcategories for this category
      const { data: subcategories, error: subcatError } = await supabase
        .from("sub_category")
        .select("*")
        .eq("cat_id", categoryId)
        .order("subcat_id");

      if (subcatError) {
        console.error(
          "MainContent: Error fetching subcategories:",
          subcatError
        );
        throw subcatError;
      }

      console.log(
        "MainContent: Found subcategories:",
        subcategories?.length || 0
      );

      if (!subcategories || subcategories.length === 0) {
        console.log(
          "MainContent: No subcategories found for category:",
          categoryId
        );
        setSubcategoriesWithDuas([]);
        return;
      }

      // Then fetch duas for each subcategory
      const subcategoriesWithDuasData = [];

      for (const subcategory of subcategories) {
        console.log(
          "MainContent: Fetching duas for subcategory:",
          subcategory.subcat_id,
          subcategory.subcat_name_en
        );
        const { data: duas, error: duasError } = await supabase
          .from("dua")
          .select("*")
          .eq("subcat_id", subcategory.subcat_id)
          .order("dua_id");

        if (duasError) {
          console.error(
            "MainContent: Error fetching duas for subcategory:",
            subcategory.subcat_id,
            duasError
          );
          // Continue with empty duas array if there's an error
          subcategoriesWithDuasData.push({ subcategory, duas: [] });
        } else {
          console.log(
            "MainContent: Found duas for subcategory:",
            subcategory.subcat_id,
            duas?.length || 0
          );
          subcategoriesWithDuasData.push({ subcategory, duas: duas || [] });
        }
      }

      console.log(
        "MainContent: Final data - subcategories with duas:",
        subcategoriesWithDuasData.length
      );
      setSubcategoriesWithDuas(subcategoriesWithDuasData);
    } catch (error) {
      console.error("MainContent: Error fetching category data:", error);
      setSubcategoriesWithDuas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryInfo = async (categoryId: number) => {
    try {
      const { data: categoryData } = await supabase
        .from("category")
        .select("*")
        .eq("cat_id", categoryId)
        .maybeSingle();

      setCurrentCategory(categoryData);
    } catch (error) {
      console.error("Error fetching category info:", error);
    }
  };

  // Show welcome message when no category is selected
  if (!selectedCategoryId || selectedCategoryId === 0) {
    return (
      <div
        className={`flex-1 bg-gray-900 p-6 ${
          isHeaderVisible ? "h-[calc(100vh-4rem)]" : "h-screen"
        } overflow-y-auto scroll-smooth`}
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#059669 #1f2937",
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤲</span>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Select a Subcategory
            </h2>
            <p className="text-gray-400 max-w-md">
              Choose a category from the sidebar and then click on a subcategory
              to view its duas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex-1 bg-gray-900 p-6 ${
          isHeaderVisible ? "h-[calc(100vh-4rem)]" : "h-screen"
        } overflow-y-auto scroll-smooth`}
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#059669 #1f2937",
        }}
      >
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="h-20 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 bg-gray-900 p-6 ${
        isHeaderVisible ? "h-[calc(100vh-4rem)]" : "h-screen"
      } overflow-y-auto scroll-smooth`}
      style={{
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        scrollbarColor: "#059669 #1f2937",
      }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
        <div className="flex items-center space-x-1">
          <Home className="w-4 h-4 text-teal-400" />
          <Link href="/" className="text-teal-400 hover:text-teal-300">
            Home
          </Link>
        </div>
        <ChevronRight className="w-4 h-4" />
        <Link
          href="/categories"
          className="text-teal-400 hover:text-teal-300 cursor-pointer"
        >
          Categories of Dua
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-teal-400">{currentCategory.cat_name_en}</span>
          </>
        )}
      </nav>

      {/* Category Summary */}
      {currentCategory && (
        <div className="border border-teal-600 rounded-2xl p-6 mb-8 ">
          <h1 className="text-2xl font-bold text-teal-600 mb-2">
            {currentCategory.cat_name_en}
          </h1>
          <p className="text-teal-400 mb-4">{currentCategory.cat_name_bn}</p>
          <p className="text-gray-400 text-sm">
            <span className="text-teal-400 font-medium">Total Duas:</span>{" "}
            {subcategoriesWithDuas.reduce(
              (total, item) => total + item.duas.length,
              0
            )}
          </p>
        </div>
      )}

      {/* Subcategories and Duas */}
      <div className="space-y-12">
        {subcategoriesWithDuas.length > 0 ? (
          subcategoriesWithDuas.map((item, subcategoryIndex) => (
            <div
              key={item.subcategory.subcat_id}
              id={`subcategory-${item.subcategory.subcat_id}`}
            >
              {/* Subcategory Header */}
              <div className="border border-teal-600 rounded-3xl p-4 ">
                <h2 className="text-xl font-semibold text-teal-400 mb-2">
                  Section: {item.subcategory.subcat_name_en}
                </h2>
                <p className="text-gray-400 text-sm">
                  {item.duas.length} {item.duas.length === 1 ? "Dua" : "Duas"}
                </p>
              </div>

              {/* Duas for this subcategory */}
              {item.duas.length > 0 ? (
                <div className="space-y-6 ml-4 mt-4">
                  {item.duas.map((dua, index) => (
                    <DuaCard
                      key={`${item.subcategory.subcat_id}-${dua.dua_id}-${index}`}
                      dua={dua}
                      index={index + 1}
                      isLast={index === item.duas.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="ml-4 mt-4 text-center py-8 bg-gray-800 rounded-lg">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">📝</span>
                  </div>
                  <p className="text-gray-400">No duas in this subcategory</p>
                </div>
              )}

              {/* Separator between subcategories (except for the last one) */}
              {subcategoryIndex < subcategoriesWithDuas.length - 1 && (
                <div className="flex items-center justify-center my-8">
                  <div className="flex-1 border-t border-gray-700"></div>
                  <div className="px-4">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 border-t border-gray-700"></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-gray-400 text-lg mb-2">No subcategories found</p>
            <p className="text-gray-500">
              This category doesn't have any subcategories yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

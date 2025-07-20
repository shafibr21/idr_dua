"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Home, ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  supabase,
  type Dua,
  type Category,
  type SubCategory,
} from "@/lib/supabase";
import DuaCard from "./DuaCard";
import { useDuaContext } from "./DuaProvider";
import { useHeader } from "../contexts/HeaderContext";
import { useIsMobile } from "@/hooks/use-mobile";

import { useMobileSubcategory } from "@/hooks/use-mobile-subcategory";

export default function MainContent() {
  const { selectedCategoryId, selectedSubcategoryId, setSelectedSubcategory } =
    useDuaContext();
  const { isHeaderVisible } = useHeader();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mobile-specific subcategory data fetching
  const mobileSubcategoryData = useMobileSubcategory(
    isMobile === true ? selectedSubcategoryId : 0,
    isMobile === true ? selectedCategoryId : 0
  );

  // Debug mobile hook
  useEffect(() => {
    console.log("MainContent: Mobile hook status:", {
      isMobile,
      selectedSubcategoryId,
      selectedCategoryId,
      hookParams: {
        subcatId: isMobile === true ? selectedSubcategoryId : 0,
        catId: isMobile === true ? selectedCategoryId : 0,
      },
      hookData: mobileSubcategoryData.data,
      hookLoading: mobileSubcategoryData.loading,
      hookError: mobileSubcategoryData.error,
    });
  }, [
    isMobile,
    selectedSubcategoryId,
    selectedCategoryId,
    mobileSubcategoryData,
  ]);

  const [subcategoriesWithDuas, setSubcategoriesWithDuas] = useState<
    { subcategory: SubCategory; duas: Dua[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // Handle URL subcategory parameter
  useEffect(() => {
    const subcatParam = searchParams.get("subcat");
    if (subcatParam && Number(subcatParam) !== selectedSubcategoryId) {
      setSelectedSubcategory(Number(subcatParam));
    }
  }, [searchParams, selectedSubcategoryId, setSelectedSubcategory]);

  useEffect(() => {
    console.log(
      "MainContent: selectedCategoryId changed to:",
      selectedCategoryId
    );
    if (selectedCategoryId && selectedCategoryId > 0) {
      // If we're in mobile mode and have a specific subcategory selected,
      // don't do a full fetch that might interfere with specific data
      const shouldSkipFullFetch =
        isMobile === true && selectedSubcategoryId > 0;
      fetchCategoryWithSubcategoriesAndDuas(
        selectedCategoryId,
        shouldSkipFullFetch
      );
      fetchCategoryInfo(selectedCategoryId);
    } else {
      console.log(
        "MainContent: selectedCategoryId is 0 or null, showing welcome message"
      );
      setSubcategoriesWithDuas([]);
      setCurrentCategory(null);
    }
  }, [selectedCategoryId]);

  // Mobile subcategory handler - ensure specific subcategory data is available
  const fetchSpecificSubcategoryData = async (
    subcategoryId: number,
    categoryId: number
  ) => {
    try {
      console.log(
        "MainContent: Fetching specific subcategory data:",
        subcategoryId
      );

      // Check if we already have this subcategory's data
      const existingData = subcategoriesWithDuas.find(
        (item) => item.subcategory.subcat_id === subcategoryId
      );
      if (existingData && existingData.duas.length > 0) {
        console.log("MainContent: Subcategory data already available");
        return;
      }

      // Fetch the specific subcategory
      const { data: subcategory, error: subcatError } = await supabase
        .from("sub_category")
        .select("*")
        .eq("subcat_id", subcategoryId)
        .eq("cat_id", categoryId)
        .single();

      if (subcatError || !subcategory) {
        console.error("MainContent: Error fetching subcategory:", subcatError);
        return;
      }

      // Fetch duas for this subcategory
      const { data: duas, error: duasError } = await supabase
        .from("dua")
        .select("*")
        .eq("subcat_id", subcategoryId)
        .order("dua_id");

      if (duasError) {
        console.error(
          "MainContent: Error fetching duas for subcategory:",
          duasError
        );
        return;
      }

      console.log(
        "MainContent: Fetched specific subcategory data:",
        subcategory.subcat_name_en,
        "duas:",
        duas?.length || 0
      );

      // Update subcategoriesWithDuas with this specific data
      setSubcategoriesWithDuas((prev) => {
        // Remove any existing entry for this subcategory
        const filtered = prev.filter(
          (item) => item.subcategory.subcat_id !== subcategoryId
        );
        // Add the new data
        return [...filtered, { subcategory, duas: duas || [] }];
      });
    } catch (error) {
      console.error(
        "MainContent: Error in fetchSpecificSubcategoryData:",
        error
      );
    }
  };

  // Also trigger data loading when subcategory changes and we don't have data yet
  useEffect(() => {
    console.log(
      "MainContent: selectedSubcategoryId changed to:",
      selectedSubcategoryId,
      "with selectedCategoryId:",
      selectedCategoryId,
      "subcategoriesWithDuas.length:",
      subcategoriesWithDuas.length
    );

    if (selectedSubcategoryId > 0 && selectedCategoryId > 0) {
      // Check if we have data for this specific subcategory
      const hasSubcategoryData = subcategoriesWithDuas.some(
        (item) => item.subcategory.subcat_id === selectedSubcategoryId
      );

      if (!hasSubcategoryData) {
        console.log(
          "MainContent: No data for selected subcategory, fetching specific data"
        );
        fetchSpecificSubcategoryData(selectedSubcategoryId, selectedCategoryId);
      } else {
        console.log(
          "MainContent: Data already available for selected subcategory"
        );
      }
    }
  }, [selectedSubcategoryId, selectedCategoryId, subcategoriesWithDuas]);

  // Fetch all subcategories and duas for a category (used for desktop and initial mobile loads)
  const fetchCategoryWithSubcategoriesAndDuas = async (
    categoryId: number,
    skipIfHasData = false
  ) => {
    try {
      // If we're in mobile mode and already have some data, and a specific subcategory is selected,
      // don't refetch everything as it might interfere with specific subcategory fetching
      if (
        skipIfHasData &&
        subcategoriesWithDuas.length > 0 &&
        isMobile === true &&
        selectedSubcategoryId > 0
      ) {
        console.log(
          "MainContent: Skipping full fetch as we have data and specific subcategory selected"
        );
        return;
      }

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

  // Filter subcategories - Use mobile hook data when available, or filter by URL parameter
  const displayedSubcategories = (() => {
    // If a specific subcategory is selected via URL parameter
    if (selectedSubcategoryId > 0) {
      // For mobile, use the mobile hook data if available
      if (
        isMobile === true &&
        mobileSubcategoryData.data &&
        !mobileSubcategoryData.loading &&
        !mobileSubcategoryData.error
      ) {
        console.log(
          "MainContent: Using mobile hook data for subcategory:",
          selectedSubcategoryId
        );
        return [mobileSubcategoryData.data];
      } else {
        // For desktop or fallback, filter the existing data
        console.log(
          "MainContent: Filtering subcategories for selectedSubcategoryId:",
          selectedSubcategoryId
        );
        const filtered = subcategoriesWithDuas.filter(
          (item) => item.subcategory.subcat_id === selectedSubcategoryId
        );
        console.log("MainContent: Filtered result:", filtered.length, "items");
        return filtered;
      }
    }
    // No specific subcategory selected, show all
    console.log(
      "MainContent: No subcategory selected, showing all",
      subcategoriesWithDuas.length,
      "subcategories"
    );
    return subcategoriesWithDuas;
  })();

  // Debug logging - Enhanced for mobile debugging
  useEffect(() => {
    console.log("MainContent DEBUG ENHANCED:", {
      isMobile,
      selectedSubcategoryId,
      selectedCategoryId,
      subcategoriesWithDuasCount: subcategoriesWithDuas.length,
      displayedSubcategoriesCount: displayedSubcategories.length,
      subcategoryIds: subcategoriesWithDuas.map(
        (item) =>
          `${item.subcategory.subcat_id}:${item.subcategory.subcat_name_en}`
      ),
      filterCondition: `isMobile === true: ${
        isMobile === true
      }, selectedSubcategoryId > 0: ${selectedSubcategoryId > 0}`,
      displayedItems: displayedSubcategories.map(
        (item) =>
          `${item.subcategory.subcat_id}:${item.subcategory.subcat_name_en} (${item.duas.length} duas)`
      ),
      isFiltering: isMobile === true && selectedSubcategoryId > 0,
      hasSelectedSubcategoryData: subcategoriesWithDuas.some(
        (item) => item.subcategory.subcat_id === selectedSubcategoryId
      ),
      mobileHookData: {
        hasData: !!mobileSubcategoryData.data,
        loading: mobileSubcategoryData.loading,
        error: mobileSubcategoryData.error,
        subcategoryName: mobileSubcategoryData.data?.subcategory.subcat_name_en,
        duasCount: mobileSubcategoryData.data?.duas.length || 0,
      },
    });
  }, [
    isMobile,
    selectedSubcategoryId,
    subcategoriesWithDuas,
    displayedSubcategories,
    mobileSubcategoryData,
  ]);

  // Handle back navigation in mobile view
  const handleBackToAllSubcategories = () => {
    setSelectedSubcategory(0);
    // Update URL to remove subcat parameter
    router.push(`/categories/${selectedCategoryId}`);
  };

  // Show welcome message when no category is selected
  if (!selectedCategoryId || selectedCategoryId === 0) {
    return (
      <div
        className={`flex-1 bg-gray-900 p-4 md:p-6 main-content-area ${
          isHeaderVisible
            ? "h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]"
            : "h-screen"
        } overflow-y-auto scroll-smooth`}
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#059669 #1f2937",
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🤲</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
              Select a Subcategory
            </h2>
            <p className="text-gray-400 max-w-md text-sm md:text-base">
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
        className={`flex-1 bg-gray-900 p-4 md:p-6 ${
          isHeaderVisible
            ? "h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]"
            : "h-screen"
        } overflow-y-auto scroll-smooth`}
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#059669 #1f2937",
        }}
      >
        <div className="animate-pulse space-y-4 md:space-y-6">
          <div className="space-y-2">
            <div className="h-3 md:h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 md:h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 md:h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4"
            >
              <div className="h-5 md:h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 md:h-4 bg-gray-700 rounded"></div>
                <div className="h-3 md:h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="h-16 md:h-20 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 bg-gray-900 p-4 md:p-6 main-content-area ${
        isHeaderVisible
          ? "h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]"
          : "h-screen"
      } overflow-y-auto scroll-smooth`}
      style={{
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        scrollbarColor: "#059669 #1f2937",
      }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-400 mb-4 md:mb-6">
        <div className="flex items-center space-x-1">
          <Home className="w-3 h-3 md:w-4 md:h-4 text-teal-400" />
          <Link href="/" className="text-teal-400 hover:text-teal-300">
            Home
          </Link>
        </div>
        <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        <Link
          href="/categories"
          className="text-teal-400 hover:text-teal-300 cursor-pointer"
        >
          Categories of Dua
        </Link>
        {currentCategory && (
          <>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-teal-400 truncate">
              {currentCategory.cat_name_en}
            </span>
            {/* Show current subcategory in mobile view */}
            {isMobile === true &&
              selectedSubcategoryId > 0 &&
              displayedSubcategories.length > 0 && (
                <>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-gray-300 truncate">
                    {displayedSubcategories[0].subcategory.subcat_name_en}
                  </span>
                </>
              )}
          </>
        )}
      </nav>

      {/* Category Summary */}
      {currentCategory && (
        <div className="border border-teal-600 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
          {/* Mobile: Back button when viewing specific subcategory - more subtle */}
          {isMobile === true && selectedSubcategoryId > 0 && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToAllSubcategories}
                className="flex items-center space-x-2 text-teal-400 hover:text-teal-300 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All subcategories</span>
              </button>
              <span className="text-xs text-gray-500">
                {displayedSubcategories.length > 0
                  ? `${displayedSubcategories[0].subcategory.subcat_name_en}`
                  : ""}
              </span>
            </div>
          )}

          <h1 className="text-xl md:text-2xl font-bold text-teal-600 mb-2">
            {currentCategory.cat_name_en}
          </h1>
          <p className="text-teal-400 mb-3 md:mb-4 text-sm md:text-base">
            {currentCategory.cat_name_bn}
          </p>
          <p className="text-gray-400 text-xs md:text-sm">
            <span className="text-teal-400 font-medium">Total Duas:</span>{" "}
            {isMobile === true && selectedSubcategoryId > 0
              ? displayedSubcategories.reduce(
                  (total, item) => total + item.duas.length,
                  0
                )
              : subcategoriesWithDuas.reduce(
                  (total, item) => total + item.duas.length,
                  0
                )}
          </p>
        </div>
      )}

      {/* Subcategories and Duas */}
      <div className="space-y-8 md:space-y-12">
        {displayedSubcategories.length > 0 ? (
          displayedSubcategories.map((item, subcategoryIndex) => (
            <div
              key={item.subcategory.subcat_id}
              id={`subcategory-${item.subcategory.subcat_id}`}
            >
              {/* Subcategory Header */}
              <div className="border border-teal-600 rounded-2xl md:rounded-3xl p-3 md:p-4">
                <h2 className="text-lg md:text-xl font-semibold text-teal-400 mb-1 md:mb-2">
                  Section: {item.subcategory.subcat_name_en}
                </h2>
                <p className="text-gray-400 text-xs md:text-sm">
                  {item.duas.length} {item.duas.length === 1 ? "Dua" : "Duas"}
                </p>
              </div>

              {/* Duas for this subcategory */}
              {item.duas.length > 0 ? (
                <div className="space-y-4 md:space-y-6 ml-2 md:ml-4 mt-3 md:mt-4">
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

              {/* Separator between subcategories (except for the last one) - only show if not in mobile single subcategory view */}
              {subcategoryIndex < displayedSubcategories.length - 1 &&
                !(isMobile === true && selectedSubcategoryId > 0) && (
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
        ) : subcategoriesWithDuas.length > 0 ? (
          // Show message when filtered subcategory is not found
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-400 text-lg mb-2">Subcategory not found</p>
            <p className="text-gray-500 mb-4">
              The selected subcategory is not available in this category.
            </p>
            <button
              onClick={handleBackToAllSubcategories}
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              View all subcategories
            </button>
          </div>
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

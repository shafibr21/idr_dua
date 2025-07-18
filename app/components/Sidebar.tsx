"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import {
  getCategoryIcon,
  supabase,
  type Category,
  type SubCategory,
} from "@/lib/supabase";

// Simplified Dua type for sidebar display
interface SidebarDua {
  id: number;
  dua_id: number;
  dua_name_en: string;
  subcat_id: number;
}

export default function Sidebar() {
  console.log("Sidebar component rendering");
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [duas, setDuas] = useState<{ [key: number]: SidebarDua[] }>({}); // Store duas by subcategory ID

  // Use localStorage to persist expanded state across re-renders
  const [expandedCategory, setExpandedCategoryState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sidebarExpandedCategory");
        console.log("Initializing expandedCategory from localStorage:", saved);
        return saved && saved !== "null" && saved !== "undefined"
          ? parseInt(saved, 10)
          : 0;
      } catch (error) {
        console.error(
          "Error parsing expandedCategory from localStorage:",
          error
        );
        localStorage.removeItem("sidebarExpandedCategory");
        return 0;
      }
    }
    return 0;
  });

  // Also persist subcategories data in localStorage
  const [subcategories, setSubcategoriesState] = useState<{
    [key: number]: SubCategory[];
  }>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sidebarSubcategories");
        return saved && saved !== "undefined" ? JSON.parse(saved) : {};
      } catch (error) {
        console.error("Error parsing subcategories from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("sidebarSubcategories");
        return {};
      }
    }
    return {};
  });

  const setExpandedCategory = (categoryId: number) => {
    console.log("Setting expanded category to:", categoryId);
    setExpandedCategoryState(categoryId);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sidebarExpandedCategory", categoryId.toString());
      } catch (error) {
        console.error("Error saving expandedCategory to localStorage:", error);
      }
    }
  };

  const setSubcategories = (newSubcategories: {
    [key: number]: SubCategory[];
  }) => {
    setSubcategoriesState(newSubcategories);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "sidebarSubcategories",
          JSON.stringify(newSubcategories)
        );
      } catch (error) {
        console.error("Error saving subcategories to localStorage:", error);
      }
    }
  };

  const [expandedSubcategories, setExpandedSubcategories] = useState<number[]>(
    []
  );
  const [loadingDuas, setLoadingDuas] = useState<number[]>([]); // Track which subcategories are loading duas
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Sidebar: fetchCategories useEffect triggered");
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    console.log("Sidebar: fetchCategories called");
    try {
      setLoading(true);
      const { data: categoriesData, error } = await supabase
        .from("category")
        .select("*")
        .order("cat_id");

      if (error) throw error;

      console.log("Sidebar: Categories fetched:", categoriesData?.length);
      setCategories(categoriesData || []);

      // Don't auto-expand or auto-select anything - let user click what they want
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      const { data, error } = await supabase
        .from("sub_category")
        .select("*")
        .eq("cat_id", categoryId)
        .order("subcat_id");

      if (error) throw error;

      const updatedSubcategories = {
        ...subcategories,
        [categoryId]: data || [],
      };
      setSubcategories(updatedSubcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchDuasForSubcategory = async (subcategoryId: number) => {
    try {
      console.log("Fetching duas for subcategory:", subcategoryId);
      setLoadingDuas((prev) => [...prev, subcategoryId]);

      const { data: duasData, error } = await supabase
        .from("dua")
        .select("id, dua_id, dua_name_en, subcat_id")
        .eq("subcat_id", subcategoryId)
        .order("dua_id");

      if (error) throw error;

      setDuas((prev) => ({
        ...prev,
        [subcategoryId]: duasData || [],
      }));
    } catch (error) {
      console.error("Error fetching duas for subcategory:", error);
    } finally {
      setLoadingDuas((prev) => prev.filter((id) => id !== subcategoryId));
    }
  };

  const toggleCategory = async (categoryId: number) => {
    console.log(
      "toggleCategory called with:",
      categoryId,
      "current expanded:",
      expandedCategory
    );

    // Always expand the clicked category first (immediate response)
    if (expandedCategory !== categoryId) {
      console.log("Expanding category:", categoryId);
      setExpandedCategory(categoryId);
      setExpandedSubcategories([]); // Clear expanded subcategories when switching categories

      // Fetch subcategories if not already loaded
      if (!subcategories[categoryId]) {
        console.log("Fetching subcategories for category:", categoryId);
        await fetchSubcategories(categoryId);
      } else {
        console.log(
          "Subcategories already loaded for category:",
          categoryId,
          subcategories[categoryId].length
        );
      }
    }

    // Navigate to URL after expansion (this might cause re-render but expansion is already done)
    router.push(`/categories/${categoryId}`);
  };

  const handleSubcategoryClick = async (
    subcategoryId: number,
    event: React.MouseEvent
  ) => {
    // Accordion behavior: if clicking on already expanded subcategory, collapse it
    // If clicking on a different subcategory, collapse all others and expand this one
    if (expandedSubcategories.includes(subcategoryId)) {
      // Collapse the currently expanded subcategory
      setExpandedSubcategories([]);
    } else {
      // Collapse all others and expand only this one (accordion behavior)
      setExpandedSubcategories([subcategoryId]);

      // Fetch duas if not already loaded
      if (!duas[subcategoryId]) {
        await fetchDuasForSubcategory(subcategoryId);
      }
    }

    // Scroll to the subcategory in MainContent
    const subcategoryElement = document.getElementById(
      `subcategory-${subcategoryId}`
    );
    if (subcategoryElement) {
      subcategoryElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });

      // Add a highlight effect
      subcategoryElement.classList.add(
        "ring-2",
        "ring-teal-500",
        "ring-opacity-50"
      );
      setTimeout(() => {
        subcategoryElement.classList.remove(
          "ring-2",
          "ring-teal-500",
          "ring-opacity-50"
        );
      }, 2000);
    }
  };

  const handleDuaClick = (duaId: number) => {
    console.log("Dua clicked:", duaId);

    // Scroll to the specific dua in MainContent
    const duaElement = document.getElementById(`dua-${duaId}`);
    if (duaElement) {
      duaElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // Add a highlight effect
      duaElement.classList.add("ring-2", "ring-teal-500", "ring-opacity-75");
      setTimeout(() => {
        duaElement.classList.remove(
          "ring-2",
          "ring-teal-500",
          "ring-opacity-75"
        );
      }, 3000);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.cat_name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.cat_name_bn?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="w-80 bg-gray-800 border-r border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search By Category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.cat_id}
                className="bg-gray-700 rounded-lg overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-600 transition-colors ${
                    expandedCategory === category.cat_id ? "bg-gray-600" : ""
                  }`}
                  onClick={() => toggleCategory(category.cat_id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={`/${category.cat_icon}.png`}
                        alt={category.cat_name_en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement!.innerHTML = `<span class="text-lg text-white">${getCategoryIcon(
                            category.cat_icon || "custom_image"
                          )}</span>`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">
                        {category.cat_name_en}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {category.no_of_subcat || 0} Subcategories |{" "}
                        {category.no_of_dua || 0} Duas
                      </p>
                    </div>
                  </div>
                  {subcategories[category.cat_id] &&
                    subcategories[category.cat_id].length > 0 &&
                    (expandedCategory === category.cat_id ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    ))}
                </div>

                {/* Subcategories */}
                {expandedCategory === category.cat_id &&
                  subcategories[category.cat_id] && (
                    <div className="bg-gray-750">
                      {subcategories[category.cat_id].map((item) => (
                        <div key={item.subcat_id}>
                          {/* Subcategory Item */}
                          <div
                            className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors border-l-4 hover:bg-gray-600 text-gray-300 border-transparent`}
                            onClick={(e) =>
                              handleSubcategoryClick(item.subcat_id, e)
                            }
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.subcat_name_en}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.no_of_dua || 0} Duas
                                </p>
                              </div>
                            </div>

                            {/* Chevron for expanding duas */}
                            <div className="chevron-area p-1">
                              {item.no_of_dua &&
                                item.no_of_dua > 0 &&
                                (expandedSubcategories.includes(
                                  item.subcat_id
                                ) ? (
                                  <ChevronDown className="w-3 h-3 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-gray-400" />
                                ))}
                            </div>
                          </div>

                          {/* Individual Duas - Only show when expanded */}
                          {expandedSubcategories.includes(item.subcat_id) && (
                            <div className="bg-gray-800">
                              {loadingDuas.includes(item.subcat_id) ? (
                                <div className="px-10 py-4 text-center">
                                  <div className="animate-pulse space-y-2">
                                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                  </div>
                                </div>
                              ) : duas[item.subcat_id] &&
                                duas[item.subcat_id].length > 0 ? (
                                duas[item.subcat_id].map((dua, index) => (
                                  <div
                                    key={`${item.subcat_id}-${dua.dua_id}-${index}`}
                                    className="flex items-start space-x-3 px-10 py-2 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                    onClick={() => handleDuaClick(dua.id)}
                                  >
                                    <div className="flex-shrink-0 mt-2">
                                      <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs leading-relaxed">
                                        {dua.dua_name_en}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-10 py-4 text-center text-gray-500 text-xs">
                                  No duas found in this subcategory
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

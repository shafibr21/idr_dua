"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import { gsap } from "gsap";
import {
  getCategoryIcon,
  supabase,
  type Category,
  type SubCategory,
} from "@/lib/supabase";
import { useHeader } from "../contexts/HeaderContext";
import Image from "next/image";

// Simplified Dua type for sidebar display
interface SidebarDua {
  id: number;
  dua_id: number;
  dua_name_en: string;
  subcat_id: number;
}

interface MobileCategoriesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  subcategories: { [key: number]: SubCategory[] };
  expandedCategory: number;
  selectedSubcategoryId?: number;
  onCategoryClick: (categoryId: number) => void;
  onSubcategoryClick: (subcatId: number) => void;
  isLoading?: boolean;
}

export default function MobileCategoriesSidebar({
  isOpen,
  onClose,
  categories: propCategories,
  subcategories: propSubcategories,
  expandedCategory: propExpandedCategory,
  selectedSubcategoryId = 0,
  onCategoryClick: propOnCategoryClick,
  onSubcategoryClick: propOnSubcategoryClick,
  isLoading: propIsLoading = false,
}: MobileCategoriesSidebarProps) {
  const router = useRouter();
  const { isHeaderVisible } = useHeader();

  const [categories, setCategories] = useState<Category[]>([]);
  const [duas, setDuas] = useState<{ [key: number]: SidebarDua[] }>({}); // Store duas by subcategory ID
  const [isHydrated, setIsHydrated] = useState(false);

  // Use safe initial state for SSR
  const [expandedCategory, setExpandedCategoryState] = useState<number>(0);

  // Safe initial state for subcategories
  const [subcategories, setSubcategoriesState] = useState<{
    [key: number]: SubCategory[];
  }>({});

  // Handle hydration and load from localStorage after client-side hydration
  useEffect(() => {
    setIsHydrated(true);

    // Load expanded category from localStorage after hydration
    try {
      const saved = localStorage.getItem("mobileSidebarExpandedCategory");
      console.log("Loading mobile expandedCategory from localStorage:", saved);
      if (saved && saved !== "null" && saved !== "undefined") {
        setExpandedCategoryState(parseInt(saved, 10));
      }
    } catch (error) {
      console.error(
        "Error loading mobile expandedCategory from localStorage:",
        error
      );
      localStorage.removeItem("mobileSidebarExpandedCategory");
    }

    // Load subcategories from localStorage after hydration
    try {
      const saved = localStorage.getItem("mobileSidebarSubcategories");
      if (saved && saved !== "undefined") {
        setSubcategoriesState(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        "Error loading mobile subcategories from localStorage:",
        error
      );
      localStorage.removeItem("mobileSidebarSubcategories");
    }
  }, []);

  const setExpandedCategory = (categoryId: number) => {
    console.log("Setting mobile expanded category to:", categoryId);
    setExpandedCategoryState(categoryId);
    if (isHydrated && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "mobileSidebarExpandedCategory",
          categoryId.toString()
        );
      } catch (error) {
        console.error(
          "Error saving mobile expandedCategory to localStorage:",
          error
        );
      }
    }
  };

  const setSubcategories = (newSubcategories: {
    [key: number]: SubCategory[];
  }) => {
    setSubcategoriesState(newSubcategories);
    if (isHydrated && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "mobileSidebarSubcategories",
          JSON.stringify(newSubcategories)
        );
      } catch (error) {
        console.error(
          "Error saving mobile subcategories to localStorage:",
          error
        );
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
    console.log("Mobile Sidebar: fetchCategories useEffect triggered");
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    console.log("Mobile Sidebar: fetchCategories called");
    try {
      setLoading(true);
      const { data: categoriesData, error } = await supabase
        .from("category")
        .select("*")
        .order("cat_id");

      if (error) throw error;

      console.log(
        "Mobile Sidebar: Categories fetched:",
        categoriesData?.length
      );
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
    // Always expand this subcategory and fetch duas when clicked
    setExpandedSubcategories([subcategoryId]);

    // Fetch duas if not already loaded
    if (!duas[subcategoryId]) {
      await fetchDuasForSubcategory(subcategoryId);
    }

    // Close mobile sidebar and navigate
    onClose();

    // Navigate to the subcategory
    // Find the category that contains this subcategory
    let categoryId = 0;
    for (const catId in subcategories) {
      const subCats = subcategories[Number(catId)];
      if (subCats.some((sub) => sub.subcat_id === subcategoryId)) {
        categoryId = Number(catId);
        break;
      }
    }

    if (categoryId > 0) {
      router.push(`/categories/${categoryId}?subcat=${subcategoryId}`);
    }

    // Wait for navigation, then scroll to the subcategory in MainContent
    setTimeout(() => {
      const subcategoryElement = document.getElementById(
        `subcategory-${subcategoryId}`
      );
      if (subcategoryElement) {
        // Calculate header height offset
        const isMobile = window.innerWidth < 768;
        const headerHeight = isMobile ? 64 : 56; // h-16 = 64px, h-14 = 56px
        const additionalOffset = 20; // Extra spacing for better UX

        // Get element position and scroll with offset
        const elementRect = subcategoryElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const targetScrollPosition =
          absoluteElementTop - headerHeight - additionalOffset;

        // Smooth scroll to calculated position
        window.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        });

        // Wait for scroll to complete, then animate
        setTimeout(() => {
          // GSAP scale and pulse animation for subcategory (more subtle)
          gsap.fromTo(
            subcategoryElement,
            {
              scale: 1,
              boxShadow: "0 0 0 0px rgba(20, 184, 166, 0)",
            },
            {
              scale: 1.015,
              boxShadow: "0 0 25px 4px rgba(20, 184, 166, 0.4)",
              duration: 0.8,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                // Fade out the glow effect
                gsap.to(subcategoryElement, {
                  boxShadow: "0 0 0 0px rgba(20, 184, 166, 0)",
                  duration: 1.5,
                  ease: "power2.out",
                });
              },
            }
          );
        }, 800); // Wait for scroll animation to mostly complete
      }
    }, 500); // Wait for navigation to complete
  };

  const handleDuaClick = (duaId: number) => {
    console.log("Dua clicked:", duaId);

    // Close mobile sidebar first
    onClose();

    // Wait for sidebar to close, then scroll to the specific dua in MainContent
    setTimeout(() => {
      const duaElement = document.getElementById(`dua-${duaId}`);
      if (duaElement) {
        // Calculate header height offset
        const isMobile = window.innerWidth < 768;
        const headerHeight = isMobile ? 64 : 56; // h-16 = 64px, h-14 = 56px
        const additionalOffset = 20; // Extra spacing for better UX

        // Get element position and scroll with offset
        const elementRect = duaElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const targetScrollPosition =
          absoluteElementTop - headerHeight - additionalOffset;

        // Smooth scroll to calculated position
        window.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        });

        // Wait for scroll to complete, then animate
        setTimeout(() => {
          // GSAP scale and pulse animation for individual dua
          gsap.fromTo(
            duaElement,
            {
              scale: 1,
              boxShadow: "0 0 0 0px rgba(20, 184, 166, 0)",
            },
            {
              scale: 1.015,
              boxShadow: "0 0 25px 4px rgba(20, 184, 166, 0.4)",
              duration: 0.8,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                // Create a pulsing glow effect
                const tl = gsap.timeline({ repeat: 2 });
                tl.to(duaElement, {
                  boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.4)",
                  duration: 0.4,
                  ease: "power2.inOut",
                })
                  .to(duaElement, {
                    boxShadow: "0 0 0 1px rgba(20, 184, 166, 0.2)",
                    duration: 0.4,
                    ease: "power2.inOut",
                  })
                  .to(duaElement, {
                    boxShadow: "0 0 0 0px rgba(20, 184, 166, 0)",
                    duration: 1,
                    ease: "power2.out",
                  });
              },
            }
          );
        }, 800); // Wait for scroll animation to mostly complete
      }
    }, 300); // Wait for sidebar close animation
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.cat_name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.cat_name_bn?.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Sidebar Panel */}
      <div
        className="fixed left-0 top-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto mobile-sidebar-scroll"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#059669 #1f2937",
        }}
      >
        <div className="p-4">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search By Category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-teal-700 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-700 rounded"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            /* Categories */
            <div className="space-y-2">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.cat_id}
                    className="bg-gray-900 rounded-2xl overflow-hidden"
                  >
                    {/* Category Header */}
                    <div
                      className={`flex items-center justify-between p-3 cursor-pointer hover:text-teal-500 ${
                        expandedCategory === category.cat_id
                          ? "bg-gray-900"
                          : ""
                      }`}
                      onClick={() => toggleCategory(category.cat_id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                          <img
                            src={`/${category.cat_icon}.png`}
                            alt={category.cat_name_en}
                            className="w-full h-full object-cover "
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
                          <h3 className="text-sm font-medium text-teal-700 hover:text-teal-500">
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
                        <div className="bg-gray-750 relative">
                          {/* Continuous vertical line for entire subcategory section */}
                          <div
                            className="absolute left-8 top-0 w-0.5 h-full opacity-80"
                            style={{
                              backgroundImage:
                                "linear-gradient(to bottom, #134e4a 50%, transparent 50%)",
                              backgroundSize: "2px 12px",
                              backgroundRepeat: "repeat-y",
                            }}
                          ></div>

                          {subcategories[category.cat_id].map(
                            (item, subcatIndex) => (
                              <div key={item.subcat_id}>
                                {/* Subcategory Item */}
                                <div
                                  className={`flex items-center justify-between px-6 py-3 cursor-pointer  hover:text-teal-500 relative  ${
                                    expandedSubcategories.includes(
                                      item.subcat_id
                                    )
                                      ? "text-teal-700  "
                                      : "border-transparent"
                                  }`}
                                  onClick={(e) =>
                                    handleSubcategoryClick(item.subcat_id, e)
                                  }
                                >
                                  {/* Tree structure - horizontal connector */}
                                  <div
                                    className="absolute left-8 top-1/2 w-6 h-0.5 opacity-80"
                                    style={{
                                      backgroundImage:
                                        "linear-gradient(to right, #134e4a 40%, transparent 40%)",
                                      backgroundSize: "10px 2px",
                                      backgroundRepeat: "repeat-x",
                                    }}
                                  ></div>

                                  <div className="flex items-center space-x-3 flex-1 relative z-10 ml-8">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium ml-4 text-teal-700 hover:text-teal-500">
                                        {item.subcat_name_en}
                                      </p>
                                      <p className="text-xs text-gray-400 ml-4">
                                        {item.no_of_dua || 0} Duas
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Individual Duas - Show when expanded */}
                                {expandedSubcategories.includes(
                                  item.subcat_id
                                ) && (
                                  <div>
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
                                          className="flex items-start space-x-3 px-7 py-2 cursor-pointer text-teal-700 hover:text-teal-400   relative"
                                          onClick={() => handleDuaClick(dua.id)}
                                        >
                                          <div className="flex items-center space-x-2 ml-10">
                                            <div className="relative flex-shrink-0 w-4 h-3">
                                              {/* Curved dotted line */}
                                              <div
                                                className="absolute top-0 left-0 w-4 h-3"
                                                style={{
                                                  borderLeft:
                                                    "2px dotted #0d9488",
                                                  borderBottom:
                                                    "2px dotted #0d9488",
                                                  borderBottomLeftRadius: "8px",
                                                }}
                                              ></div>
                                              {/* Arrow head */}
                                              <div
                                                className="absolute w-0 h-0"
                                                style={{
                                                  borderTop:
                                                    "4px solid transparent",
                                                  borderBottom:
                                                    "4px solid transparent",
                                                  borderLeft:
                                                    "6px solid #0d9488",
                                                  left: "12px",
                                                  bottom: "-3px",
                                                }}
                                              ></div>
                                            </div>
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
                            )
                          )}
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
          )}
        </div>
      </div>
    </div>
  );
}

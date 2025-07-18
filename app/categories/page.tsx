"use client";

import { useState, useEffect } from "react";
import { Search, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { supabase, getCategoryIcon, type Category } from "@/lib/supabase";
import PageLayout from "../components/PageLayout";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("cat_id");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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
      <PageLayout>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <div className="flex items-center space-x-1">
            <Home className="w-4 h-4 text-teal-400" />
            <Link href="/" className="text-teal-400 hover:text-teal-300">
              Home
            </Link>
          </div>
          <ChevronRight className="w-4 h-4" />
          <span>Categories of Dua</span>
        </nav>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              Categories of Dua
            </h1>
            <p className="text-teal-400">
              Total Categories: {categories.length}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Dua Categories"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <Link
              key={category.cat_id}
              href={`/categories/${category.cat_id}`}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg p-4 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 group-hover:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={`/${category.cat_icon}.png`}
                    alt={category.cat_name_en}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span class="text-2xl text-white">${getCategoryIcon(
                        category.cat_icon || ""
                      )}</span>`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm mb-1 truncate">
                    {category.cat_name_en}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {category.no_of_subcat || 0} Subcategories
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No categories found matching your search.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

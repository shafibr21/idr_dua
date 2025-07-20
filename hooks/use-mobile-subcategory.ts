import { useState, useEffect } from "react";
import { supabase, type SubCategory, type Dua } from "@/lib/supabase";

interface MobileSubcategoryData {
  subcategory: SubCategory;
  duas: Dua[];
}

export function useMobileSubcategory(
  subcategoryId: number,
  categoryId: number
) {
  const [data, setData] = useState<MobileSubcategoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "useMobileSubcategory: Effect triggered with subcategoryId:",
      subcategoryId,
      "categoryId:",
      categoryId
    );
    if (subcategoryId > 0 && categoryId > 0) {
      console.log(
        "useMobileSubcategory: Conditions met, calling fetchSubcategoryData"
      );
      fetchSubcategoryData();
    } else {
      console.log("useMobileSubcategory: Conditions not met, clearing data");
      setData(null);
    }
  }, [subcategoryId, categoryId]);

  const fetchSubcategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "useMobileSubcategory: Fetching data for subcategory:",
        subcategoryId,
        "in category:",
        categoryId
      );

      // Fetch the subcategory
      const { data: subcategory, error: subcatError } = await supabase
        .from("sub_category")
        .select("*")
        .eq("subcat_id", subcategoryId)
        .eq("cat_id", categoryId)
        .single();

      if (subcatError) {
        throw new Error(`Failed to fetch subcategory: ${subcatError.message}`);
      }

      if (!subcategory) {
        throw new Error("Subcategory not found");
      }

      // Fetch duas for this subcategory
      const { data: duas, error: duasError } = await supabase
        .from("dua")
        .select("*")
        .eq("subcat_id", subcategoryId)
        .order("dua_id");

      if (duasError) {
        throw new Error(`Failed to fetch duas: ${duasError.message}`);
      }

      console.log(
        "useMobileSubcategory: Fetched subcategory:",
        subcategory.subcat_name_en,
        "with",
        duas?.length || 0,
        "duas"
      );

      setData({
        subcategory,
        duas: duas || [],
      });
    } catch (err) {
      console.error("useMobileSubcategory: Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchSubcategoryData };
}

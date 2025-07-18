import { createClient } from "@supabase/supabase-js"

// Make sure these environment variables are set correctly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ktmnpavbvbzkfhmwkjay.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "sb_publishable_Ciu9WZWMd_aV3Qcx9kdh8w_LY37OiyY"

console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key:", supabaseAnonKey ? "Key loaded" : "Key missing")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Updated types based on your actual CSV schema
export interface Category {
  id: number
  cat_id: number
  cat_name_bn: string
  cat_name_en: string
  no_of_subcat: number
  no_of_dua: number
  cat_icon: string
}

export interface SubCategory {
  id: number
  cat_id: number
  subcat_id: number
  subcat_name_bn: string
  subcat_name_en: string
  no_of_dua: number
}

export interface Dua {
  isLastInSubcategory: any
  id: number
  cat_id: number
  subcat_id: number
  dua_id: number
  dua_name_bn: string
  dua_name_en: string
  top_bn: string
  top_en: string
  dua_arabic: string
  dua_indopak: string
  clean_arabic: string
  transliteration_bn: string
  transliteration_en: string
  translation_bn: string
  translation_en: string
  bottom_bn: string
  bottom_en: string
  refference_bn: string
  refference_en: string
  audio: string
}

// Updated API functions to match your schema
export async function getCategories() {
  console.log("Fetching categories...")
  const { data, error } = await supabase.from("category").select("*").order("cat_id")

  if (error) {
    console.error("Error fetching categories:", error)
    throw error
  }

  console.log("Categories fetched:", data?.length)
  return data
}

export async function getSubCategories(categoryId: number) {
  console.log("Fetching subcategories for category:", categoryId)
  const { data, error } = await supabase.from("sub_category").select("*").eq("cat_id", categoryId).order("subcat_id")

  if (error) {
    console.error("Error fetching subcategories:", error)
    throw error
  }

  console.log("Subcategories fetched:", data?.length)
  return data
}

export async function getDuas(subcategoryId: number) {
  console.log("Fetching duas for subcategory:", subcategoryId)
  const { data, error } = await supabase.from("dua").select("*").eq("subcat_id", subcategoryId).order("dua_id")

  if (error) {
    console.error("Error fetching duas:", error)
    throw error
  }

  console.log("Duas fetched:", data?.length)
  return data
}

export async function getDuasByCategory(categoryId: number) {
  console.log("Fetching duas for category:", categoryId)
  const { data, error } = await supabase.from("dua").select("*").eq("cat_id", categoryId).order("dua_id")

  if (error) {
    console.error("Error fetching duas by category:", error)
    throw error
  }

  console.log("Duas by category fetched:", data?.length)
  return data
}

// Helper function to get category icon mapping
export function getCategoryIcon(iconName: string): string {
  const iconMap: { [key: string]: string } = {
    azan_ikamot: "🕌",
    dua_importance: "📖",
    dua_excellence: "⭐",
    time_of_dua: "🕐",
    dua_acceptance: "✅",
    morning_evening: "🌅",
    sleeping: "😴",
    waking_up: "☀️",
    eating: "🍽️",
    traveling: "✈️",
    mosque: "🕌",
    prayer: "🤲",
    quran: "📖",
    protection: "🛡️",
    forgiveness: "🤲",
    guidance: "🧭",
    health: "💊",
    family: "👨‍👩‍👧‍👦",
    knowledge: "📚",
    wealth: "💰",

  }
  
  return iconMap[iconName] || "📖"
}

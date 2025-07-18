// Test Supabase connection
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = "https://ktmnpavbvbzkfhmwkjay.supabase.co"
const supabaseKey = "sb_publishable_Ciu9WZWMd_aV3Qcx9kdh8w_LY37OiyY"

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log("Testing Supabase connection...")

    // Test basic connection
    const { data, error } = await supabase.from("categories").select("*").limit(1)

    if (error) {
      console.error("❌ Connection failed:", error.message)
      return
    }

    console.log("✅ Connection successful!")
    console.log("Sample data:", data)

    // Test table structure
    const { data: tables } = await supabase.rpc("get_table_info").catch(() => ({ data: null }))

    console.log("📊 Database ready for your dua app!")
  } catch (err) {
    console.error("❌ Unexpected error:", err.message)
  }
}

testConnection()

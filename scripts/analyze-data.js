// Analyze the CSV data structure
async function analyzeData() {
  try {
    console.log("Fetching and analyzing your data...")

    // Fetch category data
    const categoryResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/category-rz6cRziN4WoWnTbmG93TpZR2hOfn68.csv",
    )
    const categoryText = await categoryResponse.text()

    // Fetch subcategory data
    const subcategoryResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sub_category-StlWMReLBBU4KfFDTYuyVEiK589uIE.csv",
    )
    const subcategoryText = await subcategoryResponse.text()

    // Fetch dua data
    const duaResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dua-T6aq69wiEWp2ct15JV9zEFwWpSHH0b.csv",
    )
    const duaText = await duaResponse.text()

    console.log("✅ Data fetched successfully!")
    console.log("Categories sample:", categoryText.split("\n").slice(0, 3))
    console.log("Subcategories sample:", subcategoryText.split("\n").slice(0, 3))
    console.log("Duas sample:", duaText.split("\n").slice(0, 3))

    return { categoryText, subcategoryText, duaText }
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

analyzeData()

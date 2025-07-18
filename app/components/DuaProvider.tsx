"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface DuaContextType {
  selectedCategoryId: number;
  selectedSubcategoryId: number;
  selectedDuaId: number;
  setSelectedCategory: (categoryId: number) => void;
  setSelectedSubcategory: (subcategoryId: number) => void;
  setSelectedDua: (duaId: number) => void;
}

const DuaContext = createContext<DuaContextType | undefined>(undefined);

export function DuaProvider({ children }: { children: ReactNode }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(0);
  const [selectedDuaId, setSelectedDuaId] = useState(0);

  const setSelectedCategory = (categoryId: number) => {
    console.log(
      "DuaProvider: Setting category ID:",
      categoryId,
      "current:",
      selectedCategoryId
    );
    if (categoryId !== selectedCategoryId) {
      setSelectedCategoryId(categoryId);
      // Reset subcategory and dua when category changes
      setSelectedSubcategoryId(0);
      setSelectedDuaId(0);
    } else {
      console.log("DuaProvider: Category ID already set, skipping update");
    }
  };

  const setSelectedSubcategory = (subcategoryId: number) => {
    console.log("DuaProvider: Setting subcategory ID:", subcategoryId);
    setSelectedSubcategoryId(subcategoryId);
  };

  const setSelectedDua = (duaId: number) => {
    console.log("DuaProvider: Setting dua ID:", duaId);
    setSelectedDuaId(duaId);
  };

  return (
    <DuaContext.Provider
      value={{
        selectedCategoryId,
        selectedSubcategoryId,
        selectedDuaId,
        setSelectedCategory,
        setSelectedSubcategory,
        setSelectedDua,
      }}
    >
      {children}
    </DuaContext.Provider>
  );
}

export function useDuaContext() {
  const context = useContext(DuaContext);
  if (context === undefined) {
    throw new Error("useDuaContext must be used within a DuaProvider");
  }
  return context;
}

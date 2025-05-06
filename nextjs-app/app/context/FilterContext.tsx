"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Category = "all" | "uni" | "pluri" | "equip";

type FilterContextType = {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  return (
    <FilterContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

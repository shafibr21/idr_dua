"use client";

import { Search, Heart } from "lucide-react";
import { useHeader } from "../contexts/HeaderContext";

export default function Header() {
  const { isHeaderVisible } = useHeader();

  return (
    <header
      className={`bg-gray-800 px-6 transition-all duration-300 ease-in-out sticky top-0 z-50 ${
        isHeaderVisible
          ? "py-4 h-16 border-b border-gray-700"
          : "py-0 h-0 overflow-hidden border-b-0"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-white">Dua & Ruqyah</h1>
            <p className="text-sm text-gray-400">Hisnul Muslim</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Search className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <button className="bg-teal-600 hover:bg-teal-700 px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Support Us</span>
          </button>
        </div>
      </div>
    </header>
  );
}

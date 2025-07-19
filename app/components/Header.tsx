"use client";

import { Search, Heart } from "lucide-react";
import { useHeader } from "../contexts/HeaderContext";

export default function Header() {
  const { isHeaderVisible } = useHeader();

  return (
    <header
      className={`bg-gray-900 border-b border-teal-700 px-6 transition-all duration-300 ease-in-out sticky top-0 z-50 ${
        isHeaderVisible ? "py-1 h-14 " : "py-0 h-0 overflow-hidden border-b-0"
      }`}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-white">Dua <span className="text-teal-500">&</span> Ruqyah</h1>
            <p className="text-sm text-gray-400 ">Hisnul Muslim</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Search className="bg-gray-800 rounded-full w-9 h-9 p-2 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <button className="bg-teal-600 hover:bg-teal-700 px-6 py-2.5 rounded-full flex items-center space-x-2 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Support Us</span>
          </button>
        </div>
      </div>
    </header>
  );
}

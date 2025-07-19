"use client";

import { Home, Grid3X3, Bookmark, Settings, Menu } from "lucide-react";

export default function NavigationSidebar() {
  return (
    <div className="w-18 bg-gray-800 h-screen flex flex-col border-r border-teal-700">
      <div className="flex flex-col h-full ">
        {/* Logo Section */}
        <div className="p-3">
          <div
            className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center relative group"
            title="Dua & Ruqyah"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-teal-600 rounded-sm"></div>
            </div>
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Dua & Ruqyah
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
          <div className="space-y-4 px-3 flex flex-col justify-center h-full">
            {/* Home */}
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-teal-400 hover:text-teal-700 cursor-pointer">
                <Home className="w-6 h-6" />
              </div>
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Home
              </div>
            </div>

            {/* Categories - Active */}
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-teal-400 hover:text-teal-700 cursor-pointer">
                <Grid3X3 className="w-6 h-6" />
              </div>
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Categories
              </div>
            </div>

            {/* Bookmarks */}
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-teal-400 hover:text-teal-700 cursor-pointer">
                <Bookmark className="w-6 h-6" />
              </div>
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Bookmarks
              </div>
            </div>

            {/* Settings */}
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-teal-400 hover:text-teal-700 cursor-pointer">
                <Settings className="w-6 h-6" />
              </div>
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Settings
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="p-3">
          <div className="relative group">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-teal-400 hover:text-teal-700 cursor-pointer">
              <Menu className="w-6 h-6" />
            </div>
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Menu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

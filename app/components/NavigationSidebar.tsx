"use client";

import { Home, Grid3X3, Bookmark, Settings, Menu } from "lucide-react";

export default function NavigationSidebar() {
  return (
    <div className="w-20 bg-gray-800 border-r border-gray-700 h-screen flex flex-col ">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-teal-600 rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
          <div className="space-y-4 px-4 flex flex-col items-center justify-center h-full">
            {/* Home */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
              <Home className="w-6 h-6" />
            </div>

            {/* Categories - Active */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-teal-600 text-white">
              <Grid3X3 className="w-6 h-6" />
            </div>

            {/* Bookmarks */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
              <Bookmark className="w-6 h-6" />
            </div>

            {/* Settings */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
              <Settings className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="p-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Home, Grid3X3, Bookmark, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({
  isOpen,
  onClose,
}: MobileNavigationProps) {
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Grid3X3, label: "Categories", href: "/categories" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Navigation Panel */}
      <div className="fixed left-0 top-0 h-full w-75 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-600 rounded-sm"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Dua <span className="text-teal-500">&</span> Ruqyah
              </h1>
              <p className="text-xs text-gray-400">Hisnul Muslim</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 ml-5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="py-6">
          <nav className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/categories" &&
                  pathname.startsWith("/categories"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-400">© 2025 Dua & Ruqyah App</p>
          </div>
        </div>
      </div>
    </div>
  );
}

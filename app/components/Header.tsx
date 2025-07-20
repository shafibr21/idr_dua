"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Search, Heart, Menu, Settings } from "lucide-react";
import { useHeader } from "../contexts/HeaderContext";
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import MobileNavigation to avoid SSR issues
const MobileNavigation = dynamic(() => import("./MobileNavigation"), {
  ssr: false,
});

// Dynamically import SettingsPanel to avoid SSR issues
const SettingsPanel = dynamic(() => import("./SettingsPanel"), {
  ssr: false,
});

export default function Header() {
  const { isHeaderVisible } = useHeader();
  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header
        className={`bg-gray-900 border-b border-teal-700 px-4 md:px-6 transition-all duration-300 ease-in-out sticky top-0 z-40 ${
          isHeaderVisible
            ? "py-2 md:py-1 h-16 md:h-14"
            : "py-0 h-0 overflow-hidden border-b-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                className="p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsMobileNavOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-white">
                Dua <span className="text-teal-500">&</span> Ruqyah
              </h1>
              <p className="text-xs md:text-sm text-gray-400">Hisnul Muslim</p>
            </div>
          </div>
          {/* Settings button */}
          {isMobile && (
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && (
        <Suspense fallback={null}>
          <MobileNavigation
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
          />
        </Suspense>
      )}

      {/* Mobile Settings */}
      {isMobile && isSettingsOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSettingsOpen(false)}
          />

          {/* Settings Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-2 mx-2 border-b border-gray-700 sticky top-0 bg-gray-900">
              <h2 className="text-lg font-semibold text-teal-700">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Settings Content */}
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <SettingsPanel />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}

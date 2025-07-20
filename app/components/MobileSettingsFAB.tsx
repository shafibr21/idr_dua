"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { X, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import SettingsPanel to avoid SSR issues
const SettingsPanel = dynamic(() => import("./SettingsPanel"), {
  ssr: false,
});

export default function MobileSettingsFAB() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Settings Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Settings Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto mobile-settings-scroll">
            {/* Header */}
            <div className="flex items-center justify-between p-2 mx-2 border-b border-gray-700 sticky top-0 bg-gray-900">
              <h2 className="text-lg font-semibold text-teal-700">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-4">
              <Suspense
                fallback={<div className="text-gray-400">Loading...</div>}
              >
                <SettingsPanel />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

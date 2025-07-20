"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Type,
  Eye,
  Palette,
} from "lucide-react";
import { useHeader } from "../contexts/HeaderContext";
import SmoothScrollContainer from "@/components/SmoothScrollContainer";

export default function SettingsPanel() {
  const { isHeaderVisible } = useHeader();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "language",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const settingSections = [
    {
      id: "language",
      title: "Language Settings",
      icon: Globe,
      content: (
        <div className="space-y-3">
          <div>
            <p className="text-xs md:text-sm text-gray-400 mb-2">
              Selected Language
            </p>
            <div className="flex items-center justify-between p-2 md:p-3 bg-teal-800 rounded-lg cursor-pointer hover:bg-teal-500">
              <span className="text-white text-sm md:text-base">English</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "font",
      title: "Font Setting",
      icon: Type,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-400">Font Size</span>
            <div className="flex space-x-1 md:space-x-2">
              <button className="w-7 h-7 md:w-8 md:h-8 bg-gray-700 rounded hover:bg-gray-600 text-xs">
                A
              </button>
              <button className="w-7 h-7 md:w-8 md:h-8 bg-gray-700 rounded hover:bg-gray-600 text-sm">
                A
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "view",
      title: "View Setting",
      icon: Eye,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-400">
              Display Mode
            </span>
            <select className="bg-gray-900 border border-gray-600 rounded px-2 md:px-3 py-1 text-xs md:text-sm">
              <option>Normal</option>
              <option>Compact</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "appearance",
      title: "Appearance Settings",
      icon: Palette,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-400">Theme</span>
            <div className="flex space-x-1 md:space-x-2">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-800 rounded border-2 border-teal-500 cursor-pointer"></div>
              <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded cursor-pointer"></div>
              <div className="w-5 h-5 md:w-6 md:h-6 bg-green-600 rounded cursor-pointer"></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`w-full md:w-80 bg-gray-900 ${
        isHeaderVisible ? "h-[calc(100vh-4rem)]" : "h-screen"
      }`}
    >
      <SmoothScrollContainer
        className="h-full"
        speed={0.9}
        ease="power2.out"
        normalizeScroll={true}
      >
        <div className="p-3 md:p-4">
          <div className="space-y-2">
            {settingSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);

              return (
                <div key={section.id} className="rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-3 md:p-4 cursor-pointer hover:text-teal-400 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-teal-700" />
                      <span className="text-xs md:text-sm font-medium text-teal-400">
                        {section.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="px-3 md:px-4 pb-3 md:pb-4">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SmoothScrollContainer>
    </div>
  );
}

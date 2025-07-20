"use client";

import { Bookmark, Copy, Share2, MoreHorizontal } from "lucide-react";
import type { Dua } from "@/lib/supabase";
import Image from "next/image";

interface DuaCardProps {
  dua: Dua;
  index: number;
  isLast?: boolean;
}

export default function DuaCard({ dua, index, isLast = false }: DuaCardProps) {
  const handlePlayAudio = () => {
    if (dua.audio) {
      const audio = new Audio(dua.audio);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleCopy = async () => {
    const arabicText =
      dua.dua_indopak || dua.dua_arabic || "Arabic text not available";
    const transliterationText =
      dua.transliteration_en || "Transliteration not available";
    const translationText = dua.translation_en || "Translation not available";
    const referenceText = dua.refference_en || "Reference not available";

    const textToCopy = `${dua.dua_name_en}\n\nArabic: ${arabicText}\n\nTransliteration: ${transliterationText}\n\nTranslation: ${translationText}\n\nReference: ${referenceText}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const translationText =
          dua.translation_en || "Translation not available";
        await navigator.share({
          title: dua.dua_name_en,
          text: `${dua.dua_name_en}\n\n${translationText}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div id={`dua-${dua.id}`} className="rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between p-4 md:p-7 pb-3 md:pb-4">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="pl-2 md:pl-3">
            <Image
              src="/name_dua.png"
              alt="Dua Image"
              width={24}
              height={24}
              className="md:w-[30px] md:h-[30px]"
            />
          </div>
          <h3 className="text-base md:text-lg font-medium text-teal-400">
            {index.toString().padStart(2, "0")}. {dua.dua_name_en}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        {/* Top Description */}
        {dua.top_en && (
          <div className="my-3 md:my-4 px-2 md:px-4">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {dua.top_en}
            </p>
          </div>
        )}

        {/* Arabic Text */}
        <div className="p-4 md:p-6 mb-3 md:mb-4">
          {dua.dua_indopak || dua.dua_arabic ? (
            <p className="text-right text-2xl md:text-3xl leading-loose text-white font-arabic">
              {dua.dua_indopak || dua.dua_arabic}
            </p>
          ) : (
            <p className="text-center text-gray-500 italic text-sm md:text-base">
              Arabic text not available
            </p>
          )}
        </div>

        {/* Transliteration */}
        <div className="p-3 md:p-4 mb-3 md:mb-4">
          {dua.transliteration_en ? (
            <p className="text-gray-300 italic leading-relaxed text-sm md:text-base">
              {dua.transliteration_en}
            </p>
          ) : (
            <p className="text-center text-gray-500 italic text-sm md:text-base">
              Transliteration not available
            </p>
          )}
        </div>

        {/* Translation */}
        <div className="p-3 md:p-4">
          <p className="py-2 text-teal-600 text-sm md:text-base">Translation</p>
          {dua.translation_en ? (
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {dua.translation_en}
            </p>
          ) : (
            <p className="text-center text-gray-500 italic text-sm md:text-base">
              Translation not available
            </p>
          )}
        </div>

        {/* Bottom Description */}
        {dua.bottom_en && (
          <div className="mt-3 md:mt-4 p-3 md:p-4 rounded-lg">
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              {dua.bottom_en}
            </p>
          </div>
        )}

        {/* Reference and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 md:mt-6 px-3 md:px-4 space-y-3 sm:space-y-0">
          {/* Reference */}
          <div className="flex-1">
            <p className="text-xs md:text-sm text-gray-400 mb-1">
              <span className="font-medium">Reference</span>
            </p>
            {dua.refference_en ? (
              <p className="text-xs md:text-sm text-gray-300">
                {dua.refference_en}
              </p>
            ) : (
              <p className="text-xs md:text-sm text-gray-500 italic">
                Reference not available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 md:space-x-2 justify-end sm:justify-start">
            <button
              onClick={() => {}}
              className="p-1.5 md:p-2 hover:bg-gray-700 rounded-2xl transition-colors"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 md:p-2 hover:bg-gray-700 rounded-2xl transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 md:p-2 hover:bg-gray-700 rounded-2xl transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              className="p-1.5 md:p-2 hover:bg-gray-700 rounded-2xl transition-colors"
              title="More"
            >
              <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
      {!isLast && <hr className="border-teal-900" />}
    </div>
  );
}

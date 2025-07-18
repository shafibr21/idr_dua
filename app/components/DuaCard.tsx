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
    <div id={`dua-${dua.id}`} className="">
      {/* Header */}
      <div className="flex items-start justify-between p-7 pb-4">
        <div className="flex items-center space-x-4">
          <div className="pl-3">
            <Image
              src="/name_dua.png"
              alt="Dua Image"
              width={30}
              height={30}
              className=""
            />
          </div>
          <h3 className="text-lg font-medium text-teal-400 ">
            {index.toString().padStart(2, "0")}. {dua.dua_name_en}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Top Description */}
        {dua.top_en && (
          <div className="my-4 px-4">
            <p className="text-gray-300 leading-relaxed">{dua.top_en}</p>
          </div>
        )}

        {/* Arabic Text */}
        <div className="p-6 mb-4">
          {dua.dua_indopak || dua.dua_arabic ? (
            <p className="text-right text-3xl leading-loose text-white font-arabic">
              {dua.dua_indopak || dua.dua_arabic}
            </p>
          ) : (
            <p className="text-center text-gray-500 italic">
              Arabic text not available
            </p>
          )}
        </div>

        {/* Transliteration */}
        <div className=" p-4 mb-4">
          {dua.transliteration_en ? (
            <p className="text-gray-300 italic leading-relaxed">
              {dua.transliteration_en}
            </p>
          ) : (
            <p className="text-center text-gray-500 italic">
              Transliteration not available
            </p>
          )}
        </div>

        {/* Translation */}
        <div className=" p-4">
          <p className="py-2 text-teal-600">Translation</p>
          {dua.translation_en ? (
            <p className="text-gray-300 leading-relaxed">
              {dua.translation_en}
            </p>
          ) : (
            <p className="text-center text-gray-500 italic">
              Translation not available
            </p>
          )}
        </div>

        {/* Bottom Description */}
        {dua.bottom_en && (
          <div className="mt-4 p-4  rounded-lg">
            <p className="text-sm text-gray-400 leading-relaxed">
              {dua.bottom_en}
            </p>
          </div>
        )}

        {/* Reference and Actions */}
        <div className="flex items-center justify-between mt-6 px-4">
          {/* Reference */}
          <div>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-medium">Reference</span>
            </p>
            {dua.refference_en ? (
              <p className="text-sm text-gray-300">{dua.refference_en}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Reference not available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {}}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              <Copy className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="More"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
      {!isLast && <hr className="border-gray-700" />}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to category 1 by default
    router.push("/categories/1");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤲</span>
        </div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}

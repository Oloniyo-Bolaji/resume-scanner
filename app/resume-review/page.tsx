import { Suspense } from "react";
import ReviewPageClient from "@/components/ReviewPageClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003285] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your results...</p>
          </div>
        </div>
      }
    >
      <ReviewPageClient />
    </Suspense>
  );
}

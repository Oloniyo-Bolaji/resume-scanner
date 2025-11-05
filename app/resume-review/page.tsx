import { Suspense } from "react";
import ReviewPageClient from "@/components/ReviewPageClient";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading review...</div>}
    >
      <ReviewPageClient />
    </Suspense>
  );
}

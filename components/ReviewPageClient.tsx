"use client";

import Review from "@/components/Review";
import { AnalysisData } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const ReviewPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Read and parse data directly - no state needed!
  const { analysisData, error, loading } = useMemo(() => {
    if (!id) {
      return {
        analysisData: null,
        error: "No scan ID provided",
        loading: false,
      };
    }

    const storageKey = `resumeAnalysis_${id}`;
    const storedData = sessionStorage.getItem(storageKey);

    if (!storedData) {
      return {
        analysisData: null,
        error: "No analysis data found. Please try scanning again.",
        loading: false,
      };
    }

    try {
      const parsedData: AnalysisData = JSON.parse(storedData);
      console.log(parsedData);
      return {
        analysisData: parsedData,
        error: null,
        loading: false,
      };
    } catch (err) {
      console.error("Error parsing stored data:", err);
      return {
        analysisData: null,
        error: "Failed to parse analysis data",
        loading: false,
      };
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || "No data available"}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const gradeScore = (value: number) => {
    if (value >= 90) return "A+";
    if (value >= 75) return "A";
    if (value >= 60) return "B";
    if (value >= 50) return "C";
    if (value >= 40) return "D";
    return "F";
  };

  const { analysis, images } = analysisData;

  return (
    <main className="bg-gradient lg:px-20 sm:px-10 px-2.5">
      <div className="flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
          YourResumeSanner Review
        </h1>
        <p className="my-3 text-sm md:text-base text-slate-600 max-w-2xl">
          Your Resume scored a {gradeScore(analysis.overallScore)}
        </p>
      </div>

      <Review analysis={analysis} images={images} />
    </main>
  );
};

export default ReviewPage;

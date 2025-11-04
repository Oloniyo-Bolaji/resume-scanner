"use client";

import Review from "@/components/Review";
import { AnalysisData } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ReviewPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Retrieve data from sessionStorage
      const storageKey = `resumeAnalysis_${id}`;
      const storedData = sessionStorage.getItem(storageKey);

      if (storedData) {
        try {
          const parsedData: AnalysisData = JSON.parse(storedData);
          console.log(parsedData);
          setAnalysisData(parsedData);

          // Optional: Clean up sessionStorage after retrieving data
          // sessionStorage.removeItem(storageKey);
        } catch (err) {
          setError("Failed to parse analysis data");
          console.error("Error parsing stored data:", err);
        }
      } else {
        setError("No analysis data found. Please try scanning again.");
      }
      setLoading(false);
    } else {
      setError("No scan ID provided");
      setLoading(false);
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
    <main className="bg-gradient">
      <h1>Your Resume scored a {gradeScore(analysis.overallScore)}</h1>
      <p>{analysis.summary}</p>
      <Review  analysis={analysis} images={images}/>
    </main>
  );
};

export default ReviewPage;

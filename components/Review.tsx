import { AnalysisData } from "@/types";
import React from "react";
import { ChartRadialShape } from "./ScoreChart";
import Insights from "./Insights";
import Analysis from "./Analysis";

const Review = ({ analysis, images }: AnalysisData) => {
  return (
    <section className="w-full flex gap-5 flex-col lg:flex-row">
      <div className="w-full sm:w-[40%] px-4 sm:px-6 lg:px-10 bg-white flex flex-col gap-6 items-center py-6">
        <ChartRadialShape score={analysis.overallScore} />
        <p className="text-sm sm:text-md text-center">{analysis.summary}</p>

        <div className="w-full flex flex-col gap-4 items-center">
          {images &&
            images.map((image, index) => (
              <div
                key={index}
                className="relative shadow-lg rounded-lg overflow-hidden w-full max-w-md aspect-[8.5/11] bg-gray-50"
              >
                <img
                  src={image.url}
                  alt={`Resume page ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
        </div>
      </div>

      <div className="w-full sm:w-[60%]">
        <Insights feedback={analysis.feedback} />
        <Analysis categoryScores={analysis.categoryScores} />
      </div>
    </section>
  );
};

export default Review;

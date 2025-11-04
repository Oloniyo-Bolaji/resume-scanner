"use client";

import { AnalysisData } from "@/types";
import Image from "next/image";
import React from "react";
import { ChartRadialShape } from "./ScoreChart";
import Insights from "./Insights";
import Analysis from "./Analysis";

const Review = ({ analysis, images }: AnalysisData) => {
  console.log(analysis.categoryScores);
  return (
    <section>
      <div>
        <ChartRadialShape score={analysis.overallScore} />
        <Insights feedback={analysis.feedback} />
        <Analysis categoryScores={analysis.categoryScores} />
      </div>
      <div>
        {images &&
          images.map((image, index) => (
            <div
              key={index}
              className="relative w-40 h-40 rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
      </div>
    </section>
  );
};

export default Review;

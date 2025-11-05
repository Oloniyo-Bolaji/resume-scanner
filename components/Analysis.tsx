import { CategoryScore } from "@/types";
import React from "react";
import ProgressBar from "./ProgressBar";

interface AnalysisProps {
  categoryScores: {
    formatting: CategoryScore;
    content: CategoryScore;
    experience: CategoryScore;
    skills: CategoryScore;
    impact: CategoryScore;
  };
}

const Analysis = ({ categoryScores }: AnalysisProps) => {
  return (
    <section>
      <h1 className="font-bold text-base lg:text-xl">Feedback Overview</h1>
      <div className="flex flex-col gap-2.5 text-sm">

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold">Formatting</h4>
          <ProgressBar score={categoryScores.formatting.score} />
          <p>{categoryScores.formatting.feedback}</p>
          <h6 className="font-semibold italic">Suggestions</h6>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {categoryScores.formatting.suggestions.map((suggestion, index) => {
              return <li key={index}>{suggestion}</li>;
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold">Content</h4>
          <ProgressBar score={categoryScores.content.score} />
          <p>{categoryScores.content.feedback}</p>
          <h6 className="font-semibold italic">Suggestions</h6>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {categoryScores.content.suggestions.map((suggestion, index) => {
              return <li key={index}>{suggestion}</li>;
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold">Experience</h4>
          <ProgressBar score={categoryScores.experience.score} />
          <p>{categoryScores.experience.feedback}</p>
          <h6 className="font-semibold italic">Suggestions</h6>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {categoryScores.experience.suggestions.map((suggestion, index) => {
              return <li key={index}>{suggestion}</li>;
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold">Skills</h4>
          <ProgressBar score={categoryScores.skills.score} />
          <p>{categoryScores.skills.feedback}</p>
          <h6 className="font-semibold italic">Suggestions</h6>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {categoryScores.skills.suggestions.map((suggestion, index) => {
              return <li key={index}>{suggestion}</li>;
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold">Impact</h4>
          <ProgressBar score={categoryScores.impact.score} />
          <p>{categoryScores.impact.feedback}</p>
          <h6 className="font-semibold italic">Suggestions</h6>
          <ul className="list-disc list-inside space-y-1.5 text-balance">
            {categoryScores.impact.suggestions.map((suggestion, index) => {
              return <li key={index}>{suggestion}</li>;
            })}
          </ul>
        </div>
        
      </div>
    </section>
  );
};

export default Analysis;

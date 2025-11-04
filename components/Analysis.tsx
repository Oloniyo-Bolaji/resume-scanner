import { CategoryScore } from "@/types";
import React from "react";

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
    <div className="grid grid-cols-2 gap-3 mt-3">
      <div>
        <h4 className="font-semibold">Formatting</h4>
        <p>Score: {categoryScores.formatting.score}</p>
        <p>{categoryScores.formatting.feedback}</p>
        <h6>Suggestions</h6>
        <ul>
          {categoryScores.formatting.suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion}</li>;
          })}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold">Content</h4>
        <p>Score: {categoryScores.content.score}</p>
        <p>{categoryScores.content.feedback}</p>
        <h6>Suggestions</h6>
        <ul>
          {categoryScores.content.suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion}</li>;
          })}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold">Experience</h4>
        <p>Score: {categoryScores.experience.score}</p>
        <p>{categoryScores.experience.feedback}</p>
        <h6>Suggestions</h6>
        <ul>
          {categoryScores.experience.suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion}</li>;
          })}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold">Skills</h4>
        <p>Score: {categoryScores.skills.score}</p>
        <p>{categoryScores.skills.feedback}</p>
        <h6>Suggestions</h6>
        <ul>
          {categoryScores.skills.suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion}</li>;
          })}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold">Impact</h4>
        <p>Score: {categoryScores.impact.score}</p>
        <p>{categoryScores.impact.feedback}</p>
        <h6>Suggestions</h6>
        <ul>
          {categoryScores.impact.suggestions.map((suggestion, index) => {
            return <li key={index}>{suggestion}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Analysis;

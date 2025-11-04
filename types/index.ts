import { ReactNode } from "react";

export type User = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type AlertProps = {
  icon?: ReactNode;
  title: string;
  message: string;
};

interface images {
  url: string;
  pageNumber: number;
}
export type FormsData = {
  company: string;
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  resume?: File;
  imagePaths?: images[];
};

export interface CategoryScore {
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
}

export type FeedbackProps = {
  overallScore: number; // 0-100
  summary: string;
  atsCompatibility: number; // 0-100
  categoryScores: {
    formatting: CategoryScore;
    content: CategoryScore;
    experience: CategoryScore;
    skills: CategoryScore;
    impact: CategoryScore;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    actionableImprovements: string[];
  };
};

export type  AnalysisData = {
  analysis: FeedbackProps;
  images: images[];
  id?: string;
  timestamp?: string;
}

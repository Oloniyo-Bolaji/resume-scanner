"use client";

import React, { useState } from "react";

import { Progress } from "@/components/ui/progress";
interface ProgressBarProps {
  score: number;
}
const ProgressBar = ({ score }: ProgressBarProps) => {
  const [progress, setProgress] = useState<number>();

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  return <Progress value={progress} className="w-full" />;
};

export default ProgressBar;

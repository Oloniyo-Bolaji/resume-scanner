"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ChartRadialShapeProps {
  score: number;
}

const chartConfig = {
  score: {
    label: "Resume Score",
  },
} satisfies ChartConfig;

const ScoreChart = ({ score }: ChartRadialShapeProps) => {
  const safeScore = Math.min(Math.max(score, 0), 100);

  const chartData = [
    { name: "score", value: safeScore, fill: getScoreColor(safeScore) },
  ];

  return (
    <Card className="w-fit p-2 shadow-none border-none bg-transparent">
      <CardContent className="p-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="w-[80px] h-[80px]" 
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={-180}
            innerRadius={30} 
            outerRadius={38} 
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[32, 26]}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background
              fill={chartData[0].fill}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-base font-bold"
                        >
                          {safeScore}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          className="fill-muted-foreground text-[10px]"
                        >
                          {getGradeLabel(safeScore)}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ScoreChart;

// 🎨 Helper: Dynamic color based on score
function getScoreColor(score: number): string {
  if (score >= 90) return "#16a34a"; // green
  if (score >= 70) return "#84cc16"; // lime
  if (score >= 50) return "#facc15"; // yellow
  if (score >= 30) return "#f97316"; // orange
  return "#dc2626"; // red
}

// 🧠 Helper: Text label based on score
function getGradeLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Weak";
  return "Poor";
}

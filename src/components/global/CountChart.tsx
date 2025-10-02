"use client";

import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Mars, MoreHorizontal, Venus } from "lucide-react";

const data = [
  {
    name: "Total",
    count: 106,
    fill: "white",
  },
  {
    name: "Girls",
    count: 53,
    fill: "oklch(62.7% 0.265 303.9)",
  },
  {
    name: "Boys",
    count: 53,
    fill: "oklch(79.5% 0.184 86.047)",
  },
];

const CountChart = () => {
  return (
    <Card className="w-full py-4 h-full rounded-md bg-muted">
      {/* HEADER */}
      <CardHeader className="flex px-4 flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Students</CardTitle>
        <MoreHorizontal className="size-5" />
      </CardHeader>

      {/* CHART */}
      <CardContent className="relative px-4 h-[250px]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="gap-0 size-[50px] justify-center  absolute top-1/2 left-1/2 -translate-1/2 flex items-center">
          <Mars className="size-10 text-yellow-500" />
          <Venus className="size-10 text-purple-500" />
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex px-4 justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-yellow-500 rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-muted-foreground">Boys (55%)</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-purple-500 rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-muted-foreground">Girls (45%)</h2>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CountChart;

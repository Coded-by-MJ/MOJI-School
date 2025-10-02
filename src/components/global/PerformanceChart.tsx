"use client";
import Image from "next/image";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Group A", value: 92, fill: "oklch(62.7% 0.265 303.9)" },
  { name: "Group B", value: 8, fill: "oklch(79.5% 0.184 86.047)" },
];

const PerformanceChart = () => {
  return (
    <Card className=" py-4 bg-muted rounded-md h-80 relative">
      <CardHeader className="flex px-4 items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <MoreHorizontal className="size-5" />
      </CardHeader>

      <CardContent className="relative px-4  h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              fill="#8884d8"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">9.2</h1>
        <p className="text-xs text-secondary/80">of 10 max LTS</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        1st Semester - 2nd Semester
      </h2>
    </Card>
  );
};

export default PerformanceChart;

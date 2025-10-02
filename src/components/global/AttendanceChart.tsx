"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Mon", present: 60, absent: 40 },
  { name: "Tue", present: 70, absent: 60 },
  { name: "Wed", present: 90, absent: 75 },
  { name: "Thu", present: 90, absent: 75 },
  { name: "Fri", present: 65, absent: 55 },
];

const AttendanceChart = () => {
  return (
    <Card className="w-full py-4 h-full rounded-md">
      {/* HEADER */}
      <CardHeader className="flex px-4 flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
        <MoreHorizontal className="size-5" />
      </CardHeader>

      {/* CHART */}
      <CardContent className="h-[300px] px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
            />
            <Bar
              dataKey="present"
              fill="oklch(79.5% 0.184 86.047)"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="absent"
              fill="oklch(62.7% 0.265 303.9)"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;

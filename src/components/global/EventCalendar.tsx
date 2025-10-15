"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

type ValuePiece = Date | undefined;

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Date | undefined>(new Date());

  return (
    <Card className="p-4 bg-muted">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        className="w-full mb-6"
      />
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="text-xl">Events</CardTitle>
        <MoreHorizontal className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        {events.map((event, i) => (
          <Card
            key={event.id}
            className={`p-3 rounded-md border-2 even:border-t-purple-500 odd:border-t-yellow-500`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold ">{event.title}</h2>
              <span className="text-muted-foreground text-xs">
                {event.time}
              </span>
            </div>
            <p className="mt-2 text-sm">{event.description}</p>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default EventCalendar;

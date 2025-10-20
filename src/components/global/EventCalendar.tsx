"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { usePathname, useSearchParams } from "next/navigation";
import { Event } from "@prisma/client";
import { format } from "date-fns";

type ValuePiece = Date | undefined;

// TEMPORARY

type EventCalendarProps = {
  defaultDate?: string | undefined;
  events: Event[];
};

const EventCalendar = ({ defaultDate, events }: EventCalendarProps) => {
  const [value, onChange] = useState<ValuePiece>(
    defaultDate ? new Date(defaultDate) : new Date()
  );
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDateSelect = (date: ValuePiece) => {
    onChange(date);
    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set("date", date.toISOString());
    } else {
      params.delete("date");
    }
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Card className="p-4 bg-muted">
      <Calendar
        mode="single"
        selected={value}
        onSelect={handleDateSelect}
        className="w-full mb-6"
      />
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="text-xl">Events</CardTitle>
        <MoreHorizontal className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        {events.length === 0 && (
          <p className="text-muted-foreground">No events found for this date</p>
        )}
        {events.map((event) => (
          <Card
            key={event.id}
            className={`p-3 rounded-md border-2 even:border-t-purple-500 odd:border-t-yellow-500`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold ">{event.title}</h2>
              <span className="text-muted-foreground text-xs">
                {format(new Date(event.startTime), "hh:mm a")} -{" "}
                {format(new Date(event.endTime), "hh:mm a")}
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

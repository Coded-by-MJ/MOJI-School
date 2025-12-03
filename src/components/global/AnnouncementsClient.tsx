"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Announcement } from "@/generated/prisma";
import { formatDate } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { announcementsQueries } from "@/queries/announcements";
import { Skeleton } from "@/components/ui/skeleton";

const AnnouncementsClient = () => {
  const { data, isLoading } = useQuery(announcementsQueries.getRecent());

  if (isLoading && !data) {
    return (
      <Card className="py-4 bg-muted rounded-md">
        <CardHeader className="flex px-4 items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent className="flex px-4 flex-col gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 bg-muted rounded-md">
      <CardHeader className="flex px-4 items-center justify-between">
        <CardTitle className="text-xl font-semibold">Announcements</CardTitle>
        <Link href="/list/announcements">
          <span className="text-xs text-muted-foreground">View All</span>
        </Link>
      </CardHeader>
      <CardContent className="flex px-4 flex-col gap-4 mt-4">
        {data && data.length > 0 ? (
          data.map((item: Announcement) => (
            <div
              key={item.id}
              className="odd:bg-purple-300 even:bg-yellow-300 rounded-md p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-primary">{item.title}</h2>
                <span className="text-xs text-primary bg-secondary rounded-md p-1">
                  {formatDate(item.date, "MMM dd, yyyy")}
                </span>
              </div>
              <p className="text-sm text-primary mt-1">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No announcements</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsClient;

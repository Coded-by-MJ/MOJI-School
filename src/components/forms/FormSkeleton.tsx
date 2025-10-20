"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function FormSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Section Title */}
      <Skeleton className="h-5 w-1/3" />

      {/* Grid Layout like your form */}
      <div className="flex justify-between flex-wrap gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full md:w-[30%] flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
          </div>
        ))}

        {/* Upload field */}
        <div className="w-full md:w-[30%] flex flex-col gap-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button disabled className="bg-primary text-secondary">
        <Skeleton className="h-5 w-16" />
      </Button>
    </div>
  );
}

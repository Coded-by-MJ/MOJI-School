"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// List Page Skeleton
export function ListSkeleton() {
  return (
    <section className="bg-muted w-full gap-4 rounded-md flex-col justify-between flex flex-1">
      {/* Header Section */}
      <div className="flex p-4 w-full justify-between items-center">
        <Skeleton className="h-7 w-32 hidden md:block" />
        <div className="flex w-max flex-1 md:justify-end flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="flex gap-4 items-center self-end">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-3 w-full p-4">
          {/* Table Header */}
          <div className="flex gap-4 pb-2 border-b">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          {/* Table Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center gap-2 p-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </section>
  );
}

// Form Skeleton
export function FormSkeleton() {
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

// Single Teacher/Student Page Skeleton
export function SinglePersonPageSkeleton() {
  return (
    <section className="flex flex-col xl:flex-row gap-4 w-full">
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          {/* Person Card */}
          <div className="bg-primary flex gap-4 flex-1 py-6 px-4 rounded-md">
            <div className="w-1/3">
              <Skeleton className="rounded-full w-36 h-36" />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2 text-xs font-medium justify-between items-center flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3"
                  >
                    <Skeleton className="size-4 shrink-0" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Info Cards */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 bg-muted rounded-md items-start gap-4"
              >
                <Skeleton className="size-6" />
                <div className="flex flex-col gap-0.5">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Schedule Skeleton */}
        <div className="bg-muted rounded-md p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* Shortcuts Skeleton */}
        <div className="w-full flex gap-4 flex-col p-4 bg-muted rounded-md">
          <Skeleton className="h-6 w-24" />
          <div className="flex flex-wrap text-xs gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
        </div>
        {/* Chart Skeleton */}
        <div className="bg-muted rounded-md p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        {/* Announcements Skeleton */}
        <div className="bg-muted rounded-md p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4 w-full">
      {/* Table Header */}
      <div className="flex gap-4 pb-2 border-b">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-24" />
        ))}
      </div>
      {/* Table Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-12 w-24" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="p-4 bg-muted rounded-md">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// Schedule Skeleton
export function ScheduleSkeleton() {
  return (
    <div className="bg-muted rounded-md p-4">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-muted rounded-md p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

// Announcements Skeleton
export function AnnouncementsSkeleton() {
  return (
    <div className="bg-muted rounded-md p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client"

import { ITEMS_PER_PAGE } from "@/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "../ui/button";

type Props = {
  page: number;
  count: number;
};

const Pagination = ({ page, count }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const hasPrev = ITEMS_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params}`, { scroll: false });
  };
  return (
    <div className="w-full p-4 flex items-center justify-between text-secondary">
      <Button
        disabled={!hasPrev}
        onClick={() => {
          changePage(page - 1);
        }}
        className="py-2 px-4 rounded-md bg-primary text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </Button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          { length: Math.ceil(count / ITEMS_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <Button
                size="icon"
                key={pageIndex}
                className={`px-2 rounded-sm ${
                  page === pageIndex ? "bg-primary" : ""
                }`}
                onClick={() => {
                  changePage(pageIndex);
                }}
              >
                {pageIndex}
              </Button>
            );
          }
        )}
      </div>
      <Button
         disabled={!hasNext}
        onClick={() => {
          changePage(page + 1);
        }}
        className="py-2 px-4 rounded-md bg-primary text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;

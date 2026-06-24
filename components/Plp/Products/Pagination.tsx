import { useQueryState, parseAsInteger } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pagination as PaginationType } from "@/types";

interface PaginationProps {
  pagination: PaginationType | undefined;
}

const Pagination = ({ pagination }: PaginationProps) => {
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Range around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push("...");
      }
    }
    return pages.filter((v, idx, self) => self.indexOf(v) === idx);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <Button
        variant="outline"
        className="size-8"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-sm text-muted-foreground select-none"
            >
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <Button
            key={`page-${p}`}
            variant={isCurrent ? "default" : "outline"}
            className={`size-8 transition-all duration-200 ${
              isCurrent
                ? "bg-foreground text-background font-extrabold shadow-md border-foreground ring-2 ring-foreground/20 scale-110 hover:bg-foreground/90"
                : "hover:scale-105"
            }`}
            onClick={() => handlePageChange(p as number)}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={isCurrent ? `Current Page, Page ${p}` : `Go to page ${p}`}
          >
            {p}
          </Button>
        );
      })}

      <Button
        variant="outline"
        className="size-8"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;

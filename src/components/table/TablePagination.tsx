import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TablePaginationProps {
  currentPage: number;
  currentPageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  currentPage,
  currentPageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalRows / currentPageSize);

  return (
    <div className="sticky bottom-0 right-0 flex items-center justify-between gap-2 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 py-3 z-30">
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rows per page
        </p>
        <Select
          value={currentPageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={currentPageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalRows / currentPageSize)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.ceil(totalRows / currentPageSize))}
            disabled={currentPage >= Math.ceil(totalRows / currentPageSize)}
            className="h-8 w-8 p-0"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 
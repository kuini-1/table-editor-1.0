import { Skeleton } from "./skeleton";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

export function DataTableSkeleton({ columnCount = 5, rowCount = 10 }: DataTableSkeletonProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header Skeleton */}
      <div className="px-4 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-md" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <div className="rounded-lg border border-gray-800 bg-white dark:bg-gray-900 shadow-xl h-full flex flex-col">
          <div className="relative flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="sticky top-0 z-30">
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <th className="sticky left-0 z-40 bg-gray-50 dark:bg-gray-800 w-[50px] px-4 py-3">
                    <Skeleton className="h-4 w-4 rounded mx-auto" />
                  </th>
                  {[...Array(columnCount)].map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                  ))}
                  <th className="sticky right-0 z-40 bg-gray-50 dark:bg-gray-800 w-[120px] px-4 py-3 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(rowCount)].map((_, i) => (
                  <tr key={i}>
                    <td className="sticky left-0 z-20 bg-white dark:bg-gray-900 w-[50px] px-4 py-3">
                      <Skeleton className="h-4 w-4 rounded mx-auto" />
                    </td>
                    {[...Array(columnCount)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    <td className="sticky right-0 z-20 bg-white dark:bg-gray-900 w-[120px] px-4 py-3">
                      <div className="flex items-center justify-end space-x-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="px-4 py-4 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}




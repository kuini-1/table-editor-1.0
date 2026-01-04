import { Skeleton } from "./skeleton";

export function UsersPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-24" />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-32" />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-20" />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-24" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(8)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-4 rounded" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-48" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-16 rounded" />
                            <Skeleton className="h-8 w-16 rounded" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




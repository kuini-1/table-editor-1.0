'use client';

import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Error Loading Data
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
        <Button 
          onClick={onRetry}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
} 
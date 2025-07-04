import React from 'react';
import { cn } from '@/lib/utils';

const TeacherCardSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-full mx-auto">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={cn(
          "relative overflow-hidden rounded-xl p-6 shadow-lg border-2 border-gray-600 bg-zinc-950 bg-opacity-70",
          "animate-pulse"
        )}>
          {/* Top section with badge and title */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-5 w-20 bg-gray-700 bg-opacity-70 rounded"></div> {/* Placeholder for badge */}
            <div className="h-8 w-4/5 bg-gray-700 bg-opacity-70 rounded"></div> {/* Placeholder for title */}
          </div>
          {/* Details */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-1/3 bg-gray-700 bg-opacity-70 rounded"></div> {/* Placeholder for degree */}
            <div className="h-4 w-1/4 bg-gray-700 bg-opacity-70 rounded"></div> {/* Placeholder for faculty */}
          </div>
          {/* Tasks/Subject */}
          <div className="h-4 w-2/5 bg-gray-700 bg-opacity-70 rounded mb-4"></div> {/* Placeholder for subject */}
          {/* Reviews/Stars */}
          <div className="h-4 w-1/5 bg-gray-700 bg-opacity-70 rounded"></div> {/* Placeholder for reviews */}
        </div>
      ))}
    </div>
  );
};

export { TeacherCardSkeleton }; 
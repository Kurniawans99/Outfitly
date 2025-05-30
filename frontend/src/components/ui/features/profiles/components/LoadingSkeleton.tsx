// src/components/features/profile/components/LoadingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"; // Pastikan path ini sesuai dengan instalasi shadcn/ui Anda

export const ProfileLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <Skeleton className="h-48 w-full" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
                <div className="flex-1 md:mb-4 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <Skeleton className="h-7 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation Skeleton */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-md" />
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6" />
            <Skeleton className="h-32 w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

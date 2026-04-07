import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-48 h-8" />
        </div>
        <Skeleton className="w-10 h-10 rounded-[1.25rem]" />
      </div>

      {/* Quote Skeleton */}
      <Skeleton className="w-full h-24 rounded-2xl" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Daily Goal Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-full h-16 rounded-2xl" />
      </div>

      {/* Today's Focus Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-6" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function WorkoutsSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Skeleton className="w-32 h-8 mb-2" />
          <Skeleton className="w-48 h-4" />
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        <Skeleton className="w-24 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-24 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-24 h-10 rounded-xl shrink-0" />
        <Skeleton className="w-24 h-10 rounded-xl shrink-0" />
      </div>

      {/* Workout Cards Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-full h-32 rounded-3xl" />
        <Skeleton className="w-full h-32 rounded-3xl" />
        <Skeleton className="w-full h-32 rounded-3xl" />
      </div>
    </div>
  );
}

export function RoutineSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-48 h-4" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex p-1 bg-white/5 rounded-2xl">
        <Skeleton className="flex-1 h-10 rounded-xl" />
        <Skeleton className="flex-1 h-10 rounded-xl" />
      </div>

      {/* Progress Skeleton */}
      <Skeleton className="w-full h-32 rounded-3xl" />

      {/* List Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-6" />
        <div className="space-y-3">
          <Skeleton className="w-full h-16 rounded-2xl" />
          <Skeleton className="w-full h-16 rounded-2xl" />
          <Skeleton className="w-full h-16 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-48 h-4" />
      </div>

      {/* Weight Tracker Skeleton */}
      <Skeleton className="w-full h-64 rounded-3xl" />

      {/* Photos Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-6" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

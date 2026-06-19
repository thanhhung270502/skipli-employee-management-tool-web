import type { CSSProperties } from "react";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ width = "100%", height = 16, className = "", style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card skeleton-card">
      <Skeleton width={40} height={40} className="rounded-[10px] mb-4" />
      <Skeleton width="60%" height={12} className="mb-2" />
      <Skeleton width="40%" height={28} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <div className="page-header">
        <div className="flex-1">
          <Skeleton width={180} height={32} className="mb-2" />
          <Skeleton width={320} height={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="card skeleton-card" key={i}>
            <Skeleton width={140} height={18} className="mb-5" />
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="flex gap-3 mb-4">
                <Skeleton width="70%" height={14} />
                <Skeleton width={60} height={22} className="rounded-[20px]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card skeleton-card">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3.5 border-b border-[var(--border-subtle)] last:border-b-0"
        >
          <Skeleton width={36} height={36} className="rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton width="40%" height={14} className="mb-2" />
            <Skeleton width="60%" height={12} />
          </div>
          <Skeleton width={72} height={24} className="rounded-[20px]" />
        </div>
      ))}
    </div>
  );
}

export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card skeleton-card !p-5" key={i}>
          <Skeleton width="50%" height={18} className="mb-2.5" />
          <Skeleton width="80%" height={14} className="mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton width={100} height={12} />
            <Skeleton width={72} height={24} className="rounded-[20px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

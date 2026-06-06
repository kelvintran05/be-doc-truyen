import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200 border border-[#4A3F35]/10 rounded-2xl animate-pulse",
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white/80 border border-[#4A3F35]/12 rounded-[28px] p-5 shadow-[0_10px_30px_-5px_rgba(74,63,53,0.03)] animate-pulse flex flex-col justify-between min-h-[300px]">
      <div>
        <Skeleton className="aspect-[16/9] mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

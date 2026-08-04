export default function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-card animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-card rounded animate-pulse" />
        
        {/* Subtitle skeleton */}
        <div className="h-3 bg-card rounded animate-pulse w-3/4" />
        
        {/* Footer skeletons */}
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-card rounded animate-pulse w-1/3" />
          <div className="h-3 bg-card rounded animate-pulse w-1/4" />
        </div>
      </div>
    </div>
  );
}

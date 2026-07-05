import { Skeleton } from "@/components/shared/Skeleton";
import { SlideOverHeader } from "@/components/consumer/overlay/SlideOverShell";

// Skeleton bodies for the detail modals' loading.tsx files. These render
// INSIDE the shell mounted by the segment's layout.tsx (SlideOverShell /
// BottomSheetShell), so the panel slides in once and the skeleton resolves
// to content in place — never a separate spinner screen.

// Hero image band + section rows, mirroring PlaceDetailBody / CouponDetailBody
// silhouettes closely enough that content arrival doesn't jump the layout.
export function DetailBodySkeleton() {
  return (
    <div aria-hidden className="space-y-4 p-4">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

// Full slide-over loading state: real header chrome (title still resolving,
// back button already works — a slow fetch can be cancelled) over the body
// skeleton.
export function SlideOverLoadingSkeleton() {
  return (
    <>
      <SlideOverHeader title={<Skeleton className="mx-auto h-4 w-32" />} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <DetailBodySkeleton />
      </div>
    </>
  );
}

// Bottom-sheet loading state (ticket modal): receipt-shaped rows.
export function SheetBodySkeleton() {
  return (
    <div aria-hidden className="space-y-4 p-4">
      <Skeleton className="mx-auto h-5 w-40" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

import { cn } from "@/lib/cn";

/**
 * A photograph or drawing in the system's frame: clipped to its corners,
 * on a quiet tone while it loads, never tinted. `doc` shows the whole
 * sheet on white; photographs fill the frame. Give the frame its size and
 * corner radius with `className` (e.g. "aspect-[4/3] rounded-3xl").
 *
 * `responsive` offers the 720px "-sm.webp" beside the original (made by
 * scripts/make-thumbnails.mjs), so a phone on mobile data downloads the
 * small one. Only set it for images that have that variant, and pass
 * `sizes` to say how wide the frame renders.
 */
export function Media({
  src,
  alt,
  doc = false,
  zoom = false,
  priority = false,
  responsive = false,
  sizes,
  position,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  doc?: boolean;
  /** Ease the image in a little on hover (of this frame or a parent .group). */
  zoom?: boolean;
  priority?: boolean;
  responsive?: boolean;
  sizes?: string;
  /** CSS object-position, e.g. "50% 30%". */
  position?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={cn("media", doc && "media-doc", zoom && "media-zoom", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={responsive ? `${src.replace(/\.webp$/, "-sm.webp")} 720w, ${src} 1600w` : undefined}
        sizes={responsive ? (sizes ?? "100vw") : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
        className={cn(
          "h-full w-full",
          doc ? "object-contain p-3" : "object-cover",
          imgClassName,
        )}
      />
    </div>
  );
}

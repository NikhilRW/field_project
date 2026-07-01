import { ImageIcon } from "lucide-react";

/**
 * Descriptive placeholder for real NGO photos.
 * Search codebase for [INSERT IMAGE:] to find every location.
 */
export function ImagePlaceholder({
  label,
  className = "",
  aspect = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 ${className}`}
      role="img"
      aria-label={label}
      data-image-placeholder={label}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,var(--color-foreground)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="relative flex max-w-[80%] flex-col items-center gap-3 p-6 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
          <ImageIcon className="size-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Insert Image
        </p>
        <p className="text-sm font-medium text-foreground/80">{label}</p>
      </div>
    </div>
  );
}

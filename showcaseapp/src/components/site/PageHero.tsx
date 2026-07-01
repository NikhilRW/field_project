import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imageLabel,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  imageLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-soft)] pt-36 pb-20">
      <div className="absolute -left-24 top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-secondary/15 blur-3xl" />
      <div className="container-page relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </span>
            <h1 className="mt-3 text-5xl md:text-6xl lg:text-7xl">{title}</h1>
            {subtitle && (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div
            className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-accent/15 to-secondary/15 shadow-[var(--shadow-lift)]"
            role="img"
            aria-label={imageLabel}
            data-image-placeholder={imageLabel}
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,var(--color-foreground)_1px,transparent_0)] [background-size:16px_16px]" />
            <div className="relative max-w-[75%] rounded-2xl bg-card/80 p-6 text-center shadow backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Insert Image</p>
              <p className="mt-1 text-sm font-medium text-foreground/80">{imageLabel}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

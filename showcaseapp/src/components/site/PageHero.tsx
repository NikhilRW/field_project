import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  className,
  imageClassName,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  imageSrc?: string;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden bg-[image:var(--gradient-soft)] pt-36 pb-20${className ? ` ${className}` : ""}`}>
      <div className="absolute -left-24 top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-secondary/15 blur-3xl" />
      <div className={`container-page relative${imageSrc ? " grid gap-10 lg:grid-cols-2 lg:items-center" : " mx-auto max-w-3xl text-center"}`}>
        <Reveal>
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </span>
            <h1 className="mt-3 text-5xl md:text-6xl lg:text-7xl">{title}</h1>
            {subtitle && (
              <p className={`mt-5 text-lg leading-relaxed text-muted-foreground${imageSrc ? " max-w-xl" : ""}`}>
                {subtitle}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </Reveal>
        {imageSrc && (
          <Reveal delay={200}>
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
              <img
                src={imageSrc}
                alt={typeof title === "string" ? title : "NGO activity"}
                className={`size-full${imageClassName ? ` ${imageClassName}` : " object-contain"}`}
                loading="lazy"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {show && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </div>
  );
}

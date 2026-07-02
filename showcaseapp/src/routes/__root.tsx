import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-bold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="btn-primary mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Helping Hands · Samajik Seva Sanstha" },
      {
        name: "description",
        content:
          "Helping Hands (Samajik Seva Sanstha) — a registered NGO in Kalyan, Maharashtra providing education, health camps, food distribution, women empowerment and community support since 2018.",
      },
      { name: "author", content: "Helping Hands · Samajik Seva Sanstha" },
      { name: "theme-color", content: "#E8880C" },
      { property: "og:title", content: "Helping Hands · Samajik Seva Sanstha" },
      {
        property: "og:description",
        content:
          "Together, we create opportunities, spread hope and transform lives — one community at a time.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Helping Hands" },
      { property: "og:image", content: "/landscape-photo-all-people-in-view.jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Helping Hands · Samajik Seva Sanstha" },
      {
        name: "twitter:description",
        content: "Empowering communities through education, healthcare, food and hope.",
      },
      { name: "twitter:image", content: "/landscape-photo-all-people-in-view.jpeg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          name: "Helping Hands (Samajik Seva Sanstha)",
          url: "https://www.helpingshands.org",
          logo: "https://www.helpingshands.org/icon.png",
          description: "Registered NGO in Kalyan, Maharashtra providing education, health camps, food distribution and community support since 2018.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Near Manali Palace",
            addressLocality: "Kalyan West",
            addressRegion: "Maharashtra",
            postalCode: "421301",
            addressCountry: "IN",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-8898235366",
            contactType: "customer service",
          },
          sameAs: ["https://www.youtube.com/@helpingshands"],
          areaServed: {
            "@type": "State",
            name: "Maharashtra",
          },
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/icon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </QueryClientProvider>
  );
}

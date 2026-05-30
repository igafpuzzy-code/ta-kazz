import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { MOUNTAINS } from "@/lib/mountains";

const MountainMap = lazy(() => import("@/components/MountainMap"));

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/auth";
      } else {
        setAuthorized(true);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => { if (authorized) setMounted(true); }, [authorized]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950 text-emerald-100">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-stone-100">
      <nav className="border-b border-emerald-800/40 bg-emerald-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="TA KAZZ Logo" className="h-10 w-10 rounded-full object-cover border border-emerald-700" />
            <span className="font-bold text-xl">TA KAZZ</span>
          </Link>
          <Link to="/landing" className="text-sm text-emerald-300 hover:text-amber-300">← Back</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold">Trail Map</h1>
        <p className="text-emerald-200/70 mt-2">
          Every destination pinned on Negros Island. Click a marker to view the trail guide.
        </p>

        <div className="mt-8">
          {mounted ? (
            <Suspense
              fallback={
                <div className="h-[600px] rounded-xl bg-emerald-900/40 animate-pulse flex items-center justify-center">
                  Loading map…
                </div>
              }
            >
              <MountainMap height="600px" />
            </Suspense>
          ) : (
            <div className="h-[600px] rounded-xl bg-emerald-900/40" />
          )}
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOUNTAINS.map((m) => (
            <Link
              key={m.slug}
              to="/mountains/$slug"
              params={{ slug: m.slug }}
              className="rounded-lg bg-emerald-900/40 border border-emerald-800/40 p-4 hover:border-amber-400/60"
            >
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-emerald-200/60 mt-1">
                {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

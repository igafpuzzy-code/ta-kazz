import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { getMountain } from "@/lib/mountains";
import ReviewsSection from "@/components/ReviewsSection";
import PhotoGallery from "@/components/PhotoGallery";

const SingleMap = lazy(() => import("@/components/SingleMountainMap"));

export const Route = createFileRoute("/mountains/$slug")({
  component: MountainPage,
});

function MountainPage() {
  const { slug } = Route.useParams();
  const m = getMountain(slug);
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

  if (!m) {
    return (
      <div className="min-h-screen bg-emerald-950 text-stone-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Trail not found</h1>
          <Link to="/landing" className="mt-4 inline-block text-amber-300">← Back to guides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-stone-100">
      <nav className="border-b border-emerald-800/40 bg-emerald-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="TA KAZZ Logo" className="h-10 w-10 rounded-full object-cover border border-emerald-700" />
            <span className="font-bold text-xl">TA KAZZ</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link to="/map" className="hover:text-amber-300">Map</Link>
            <Link to="/landing" className="hover:text-amber-300">All guides</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <span className="text-xs uppercase tracking-wider px-3 py-1 rounded bg-emerald-800/60 text-emerald-200">
          {m.type}
        </span>
        <h1 className="text-5xl font-bold mt-3">{m.name}</h1>
        <p className="text-emerald-200/70 mt-2">{m.location}</p>

        <div className="grid md:grid-cols-3 gap-3 mt-8">
          <Stat label="Elevation" value={m.elevation ?? "—"} />
          <Stat label="Difficulty" value={m.difficulty} />
          <Stat label="Duration" value={m.duration} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-3">About</h2>
          <p className="text-stone-300/90 leading-relaxed">{m.description}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-3">Highlights</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {m.highlights.map((h) => (
              <li
                key={h}
                className="px-4 py-3 rounded-lg bg-emerald-900/40 border border-emerald-800/40"
              >
                ✦ {h}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-3">Location</h2>
          <div className="text-sm text-emerald-200/70 mb-3">
            {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
          </div>
          {mounted && (
            <Suspense
              fallback={<div className="h-[400px] rounded-xl bg-emerald-900/40 animate-pulse" />}
            >
              <SingleMap lat={m.lat} lng={m.lng} name={m.name} />
            </Suspense>
          )}
        </section>

        {/* Photo Gallery */}
        {mounted && <PhotoGallery slug={m.slug} />}

        {/* Reviews */}
        {mounted && <ReviewsSection slug={m.slug} />}

        <div className="mt-12">
          <Link
            to="/map"
            className="inline-block px-5 py-3 rounded-md bg-amber-400 text-emerald-950 font-semibold hover:bg-amber-300"
          >
            View on full map →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-emerald-900/40 border border-emerald-800/40 p-5">
      <div className="text-xs uppercase tracking-wider text-emerald-200/60">{label}</div>
      <div className="text-xl font-bold text-amber-300 mt-1">{value}</div>
    </div>
  );
}

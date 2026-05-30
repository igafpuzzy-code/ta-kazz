import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { MOUNTAINS } from "@/lib/mountains";

export const Route = createFileRoute("/landing")({
  component: Landing,
});

function Landing() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/auth";
        return;
      }
      setEmail(user.email ?? "Hiker");
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    window.location.href = "/auth";
  };


  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950 text-emerald-100">
        Loading your trail...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-stone-100">
      <nav className="border-b border-emerald-800/40 backdrop-blur sticky top-0 z-50 bg-emerald-950/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="TA KAZZ Logo" className="h-10 w-10 rounded-full object-cover border border-emerald-700" />
            <span className="font-bold text-xl tracking-tight">TA KAZZ</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/map" className="hover:text-amber-300">Map</Link>
            <a href="#guides" className="hover:text-amber-300">Guides</a>
            <span className="text-xs text-emerald-300 hidden sm:inline">{email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
          <img src="/logo.jpg" alt="TA KAZZ Logo" className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 shadow-xl mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Welcome back,<br />
            <span className="text-amber-300">explorer.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-emerald-100/80">
            Your complete guide to the mountains, campsites, and grasslands of Negros — from
            Mt. Mandalagan to Magtahos.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link
              to="/map"
              className="px-6 py-3 rounded-md bg-amber-400 text-emerald-950 font-semibold hover:bg-amber-300"
            >
              Open the Map
            </Link>
            <a
              href="#guides"
              className="px-6 py-3 rounded-md border border-emerald-300/40 hover:bg-emerald-800/40"
            >
              Browse Guides
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { n: MOUNTAINS.length, l: "Destinations" },
          { n: "2,465", l: "Highest MASL" },
          { n: "3", l: "Difficulty Levels" },
          { n: "∞", l: "Sea of clouds" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-emerald-900/40 border border-emerald-700/30 p-5">
            <div className="text-3xl font-bold text-amber-300">{s.n}</div>
            <div className="text-xs uppercase tracking-wider text-emerald-200/70 mt-1">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Guides */}
      <section id="guides" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-2">Trail Guides</h2>
        <p className="text-emerald-200/70 mb-8">Detailed information for every peak and campsite.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOUNTAINS.map((m) => (
            <Link
              key={m.slug}
              to="/mountains/$slug"
              params={{ slug: m.slug }}
              className="group rounded-xl bg-stone-900/60 border border-emerald-800/40 p-5 hover:border-amber-400/60 transition"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold group-hover:text-amber-300">{m.name}</h3>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-emerald-800/60 text-emerald-200">
                  {m.type}
                </span>
              </div>
              <div className="text-xs text-emerald-200/60 mt-1">{m.location}</div>
              <div className="flex gap-3 mt-3 text-xs text-stone-300">
                {m.elevation && <span>⛰ {m.elevation}</span>}
                <span>🎯 {m.difficulty}</span>
              </div>
              <p className="text-sm text-stone-300/80 mt-3 line-clamp-3">{m.description}</p>
              <div className="mt-4 text-amber-300 text-sm font-semibold">View guide →</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-emerald-800/40 mt-16 py-8 text-center text-xs text-emerald-200/50">
        TA KAZZ · A mountain guide system · Hike responsibly. Leave no trace.
      </footer>
    </div>
  );
}

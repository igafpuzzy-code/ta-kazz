import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { MOUNTAINS, getMountain } from "@/lib/mountains";
import {
  subscribeToAllReviews,
  deleteReview,
  type Review,
} from "@/lib/reviews";
import {
  subscribeToAllPhotos,
  deleteTrailPhoto,
  type TrailPhoto,
} from "@/lib/photos";

export const Route = createFileRoute("/landing")({
  component: Landing,
});

function Landing() {
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [feedTab, setFeedTab] = useState<"reviews" | "photos">("reviews");
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [allReviewsLoading, setAllReviewsLoading] = useState(true);
  const [allPhotos, setAllPhotos] = useState<TrailPhoto[]>([]);
  const [allPhotosLoading, setAllPhotosLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/auth";
        return;
      }
      setEmail(user.email ?? "Hiker");
      setUid(user.uid);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (checking) return;
    const unsubReviews = subscribeToAllReviews(
      (data) => {
        setAllReviews(data);
        setAllReviewsLoading(false);
      },
      () => setAllReviewsLoading(false)
    );
    const unsubPhotos = subscribeToAllPhotos(
      (data) => {
        setAllPhotos(data);
        setAllPhotosLoading(false);
      },
      () => setAllPhotosLoading(false)
    );
    return () => {
      unsubReviews();
      unsubPhotos();
    };
  }, [checking]);

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
              className="px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
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
              className="px-6 py-3 rounded-md border border-emerald-300/40 hover:bg-emerald-800/40 transition"
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

      {/* Community Hub */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-emerald-800/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Community Hub</h2>
            <p className="text-emerald-200/70 mt-1">Explore real-time reviews and photos shared by hikers.</p>
          </div>
          <div className="flex bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/40 self-start">
            <button
              onClick={() => setFeedTab("reviews")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                feedTab === "reviews"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-200/80 hover:text-white"
              }`}
            >
              📝 Reviews ({allReviews.length})
            </button>
            <button
              onClick={() => setFeedTab("photos")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                feedTab === "photos"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-200/80 hover:text-white"
              }`}
            >
              📷 Photo Wall ({allPhotos.length})
            </button>
          </div>
        </div>

        {feedTab === "reviews" ? (
          /* All Reviews Feed */
          allReviewsLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-emerald-900/30 animate-pulse border border-emerald-800/20" />
              ))}
            </div>
          ) : allReviews.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-emerald-800/40 text-emerald-200/60">
              No reviews have been posted yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {allReviews.map((r) => {
                const mountain = getMountain(r.trailSlug);
                return (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-5 transition hover:border-amber-400/40 ${
                      r.userId === uid
                        ? "bg-emerald-900/50 border-amber-400/30"
                        : "bg-emerald-900/25 border-emerald-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{r.userName}</span>
                          {r.userId === uid && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase tracking-wider font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        {/* Star Display */}
                        <div className="flex text-amber-400 text-xs mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < r.rating ? "text-amber-400" : "text-emerald-800"}>★</span>
                          ))}
                        </div>
                      </div>
                      {mountain && (
                        <Link
                          to="/mountains/$slug"
                          params={{ slug: mountain.slug }}
                          className="text-xs px-2.5 py-1 rounded bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 hover:text-amber-300 transition"
                        >
                          🏞️ {mountain.name}
                        </Link>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-stone-300/90 leading-relaxed italic">
                      "{r.comment}"
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-emerald-900/40 text-[10px] text-emerald-200/50">
                      <span>
                        {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                      </span>
                      {r.userId === uid && (
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete your review?")) {
                              await deleteReview(r.id);
                            }
                          }}
                          className="text-red-400 hover:underline hover:text-red-300 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* All Photos Gallery Grid */
          allPhotosLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-emerald-900/30 animate-pulse border border-emerald-800/20" />
              ))}
            </div>
          ) : allPhotos.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-emerald-800/40 text-emerald-200/60">
              No photos have been uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allPhotos.map((p) => {
                const mountain = getMountain(p.trailSlug);
                return (
                  <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-square border border-emerald-900/60 shadow-lg">
                    <img
                      src={p.photoUrl}
                      alt={`Hiker upload by ${p.userName}`}
                      className="w-full h-full object-cover cursor-pointer transition duration-300 group-hover:scale-105 group-hover:brightness-75"
                      onClick={() => setLightboxUrl(p.photoUrl)}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3 bg-gradient-to-t from-black/85 via-black/30 to-transparent">
                      <p className="text-xs text-white font-semibold truncate flex items-center gap-1">
                        👤 {p.userName}
                        {p.userId === uid && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 uppercase">
                            You
                          </span>
                        )}
                      </p>
                      {mountain && (
                        <Link
                          to="/mountains/$slug"
                          params={{ slug: mountain.slug }}
                          className="text-[10px] text-amber-300 hover:underline mt-0.5 block truncate"
                        >
                          📍 {mountain.name}
                        </Link>
                      )}
                      {p.userId === uid && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this photo?")) {
                              await deleteTrailPhoto(p);
                            }
                          }}
                          className="mt-1.5 self-start px-2 py-0.5 text-[10px] rounded bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out animate-fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Hiker shared preview"
            className="max-w-4xl max-h-[90vh] w-full object-contain rounded-xl shadow-2xl p-4"
          />
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-amber-400 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <footer className="border-t border-emerald-800/40 mt-16 py-8 text-center text-xs text-emerald-200/50">
        TA KAZZ · A mountain guide system · Hike responsibly. Leave no trace.
      </footer>
    </div>
  );
}

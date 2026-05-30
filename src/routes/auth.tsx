import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) window.location.href = "/landing";
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName,
          });
        }
        window.location.href = "/landing";
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/landing";
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex bg-emerald-950 text-stone-100">
      {/* Left visual */}
      <div
        className="hidden lg:flex flex-1 relative items-end p-12"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(6,46,32,0.9), rgba(6,46,32,0.3)), url('https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <img src="/logo.jpg" alt="TA KAZZ Logo" className="w-20 h-20 rounded-full object-cover border-4 border-amber-300 shadow-xl mb-4" />
          <h1 className="text-5xl font-bold leading-tight">
            TA KAZZ
          </h1>
          <p className="mt-4 max-w-md text-emerald-100/80">
            Your complete guide to Mt. Mandalagan, Mt. Talinis, N&N Farm, Magtahos, and every
            campsite worth climbing.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="text-sm text-emerald-300 hover:text-amber-300">← Home</Link>
          <h2 className="text-3xl font-bold mt-4">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-emerald-200/70 mt-1">
            {mode === "login"
              ? "Sign in to access your trail guides."
              : "Sign up to start planning your next climb."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-emerald-200/70">Display name</label>
                <input
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-md bg-emerald-900/50 border border-emerald-700 focus:outline-none focus:border-amber-400"
                  placeholder="Juan Hiker"
                />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-emerald-200/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-md bg-emerald-900/50 border border-emerald-700 focus:outline-none focus:border-amber-400"
                placeholder="you@trail.com"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-emerald-200/70">Password</label>
              <input
                type="password"
                required
                minLength={1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-md bg-emerald-900/50 border border-emerald-700 focus:outline-none focus:border-amber-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-900/30 border border-red-700/40 rounded p-2">
                {error}
              </div>
            )}
            {info && (
              <div className="text-sm text-amber-200 bg-amber-900/20 border border-amber-700/40 rounded p-2">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-amber-400 text-emerald-950 font-semibold hover:bg-amber-300 disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-emerald-200/70">
            {mode === "login" ? (
              <>
                No account yet?{" "}
                <button onClick={() => setMode("signup")} className="text-amber-300 font-semibold hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-amber-300 font-semibold hover:underline">
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

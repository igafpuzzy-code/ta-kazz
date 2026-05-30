import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      } else if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/landing";
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setInfo("A password reset link has been sent to your email. Please check your inbox!");
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
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
          </h2>
          <p className="text-sm text-emerald-200/70 mt-1">
            {mode === "login"
              ? "Sign in to access your trail guides."
              : mode === "signup"
                ? "Sign up to start planning your next climb."
                : "Enter your email to receive a password reset link."}
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
            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-wider text-emerald-200/70">Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError(null);
                        setInfo(null);
                      }}
                      className="text-xs text-amber-300 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={1}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-md bg-emerald-900/50 border border-emerald-700 focus:outline-none focus:border-amber-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-amber-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

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
              className="w-full py-3 rounded-md bg-amber-400 text-emerald-950 font-semibold hover:bg-amber-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Please wait..." : mode === "login" ? "Log in" : mode === "signup" ? "Sign up" : "Send reset link"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-emerald-200/70">
            {mode === "login" ? (
              <>
                No account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-amber-300 font-semibold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            ) : mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-amber-300 font-semibold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setInfo(null);
                }}
                className="text-amber-300 font-semibold hover:underline cursor-pointer"
              >
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

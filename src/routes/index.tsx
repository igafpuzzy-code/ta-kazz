import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      window.location.href = user ? "/landing" : "/auth";
    });
    return unsubscribe;
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 text-emerald-100">
      🏔️ Loading TA KAZZ…
    </div>
  );
}


import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Map user to session object to maintain compatibility with existing pages
  const session = user ? { user } : null;

  return { session, user, loading };
}


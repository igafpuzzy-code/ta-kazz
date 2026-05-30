import { db, auth } from "@/integrations/firebase/client";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type Review = {
  id: string;
  trailSlug: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/** Subscribe to real-time reviews for a given trail slug */
export function subscribeToReviews(
  slug: string,
  cb: (reviews: Review[]) => void,
  errCb?: (err: Error) => void
) {
  const q = query(
    collection(db, "reviews"),
    where("trailSlug", "==", slug),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
    },
    (err) => {
      console.error("Firestore subscription error for reviews:", err);
      if (errCb) errCb(err);
    }
  );
}

/** Create a new review */
export async function addReview(slug: string, rating: number, comment: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return addDoc(collection(db, "reviews"), {
    trailSlug: slug,
    userId: user.uid,
    userName: user.displayName || user.email || "Hiker",
    rating,
    comment,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Update an existing review */
export async function updateReview(
  id: string,
  rating: number,
  comment: string
) {
  return updateDoc(doc(db, "reviews", id), {
    rating,
    comment,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a review by Firestore document id */
export async function deleteReview(id: string) {
  return deleteDoc(doc(db, "reviews", id));
}

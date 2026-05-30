import { db, auth, storage } from "@/integrations/firebase/client";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export type TrailPhoto = {
  id: string;
  trailSlug: string;
  userId: string;
  userName: string;
  photoUrl: string;
  storagePath: string;
  createdAt: Timestamp;
};

/** Subscribe to real-time photos for a given trail slug */
export function subscribeToPhotos(
  slug: string,
  cb: (photos: TrailPhoto[]) => void,
  errCb?: (err: Error) => void
) {
  const q = query(
    collection(db, "trailPhotos"),
    where("trailSlug", "==", slug),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TrailPhoto)));
    },
    (err) => {
      console.error("Firestore subscription error for photos:", err);
      if (errCb) errCb(err);
    }
  );
}

/** Upload a photo to Firebase Storage and save metadata to Firestore */
export async function uploadTrailPhoto(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const path = `trailPhotos/${slug}/${user.uid}_${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, "trailPhotos"), {
          trailSlug: slug,
          userId: user.uid,
          userName: user.displayName || user.email || "Hiker",
          photoUrl: url,
          storagePath: path,
          createdAt: serverTimestamp(),
        });
        resolve();
      }
    );
  });
}

/** Delete a photo from Firebase Storage and Firestore */
export async function deleteTrailPhoto(photo: TrailPhoto): Promise<void> {
  const storageRef = ref(storage, photo.storagePath);
  await deleteObject(storageRef);
  await deleteDoc(doc(db, "trailPhotos", photo.id));
}

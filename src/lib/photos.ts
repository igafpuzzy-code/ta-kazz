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

/** Subscribe to all real-time photos across all trails */
export function subscribeToAllPhotos(
  cb: (photos: TrailPhoto[]) => void,
  errCb?: (err: Error) => void
) {
  const q = query(
    collection(db, "trailPhotos"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TrailPhoto)));
    },
    (err) => {
      console.error("Firestore subscription error for all photos:", err);
      if (errCb) errCb(err);
    }
  );
}

/** Helper to resize and compress image to base64 string */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/** Upload a photo directly to Firestore as a compressed Base64 string */
export async function uploadTrailPhoto(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  if (onProgress) onProgress(20);
  const compressedBase64 = await compressImage(file);
  if (onProgress) onProgress(70);

  await addDoc(collection(db, "trailPhotos"), {
    trailSlug: slug,
    userId: user.uid,
    userName: user.displayName || user.email || "Hiker",
    photoUrl: compressedBase64,
    storagePath: "base64",
    createdAt: serverTimestamp(),
  });

  if (onProgress) onProgress(100);
}

/** Delete a photo from Firestore */
export async function deleteTrailPhoto(photo: TrailPhoto): Promise<void> {
  await deleteDoc(doc(db, "trailPhotos", photo.id));
}

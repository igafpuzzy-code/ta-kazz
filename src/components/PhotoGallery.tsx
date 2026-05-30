import { useEffect, useRef, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import {
  subscribeToPhotos,
  uploadTrailPhoto,
  deleteTrailPhoto,
  type TrailPhoto,
} from "@/lib/photos";

export default function PhotoGallery({ slug }: { slug: string }) {
  const [uid, setUid] = useState<string | null>(null);
  const [photos, setPhotos] = useState<TrailPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Track auth state client-side to avoid SSR hydration mismatch
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return unsub;
  }, []);

  // upload state
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<TrailPhoto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // lightbox
  const [lightbox, setLightbox] = useState<TrailPhoto | null>(null);

  useEffect(() => {
    const unsub = subscribeToPhotos(
      slug,
      (data) => {
        setPhotos(data);
        setLoading(false);
        setErrorMsg(null);
      },
      (err) => {
        setLoading(false);
        setErrorMsg(
          "Permission denied. Make sure to configure your Firebase Firestore security rules for the 'trailPhotos' collection."
        );
      }
    );
    return unsub;
  }, [slug]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      setUploadError(`File too large. Max size is ${maxMB} MB.`);
      return;
    }
    setUploadError(null);
    setUploading(true);
    setProgress(0);
    try {
      await uploadTrailPhoto(slug, file, setProgress);
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTrailPhoto(deleteTarget);
      setDeleteTarget(null);
    } catch (err: any) {
      /* silent */
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trail Photos</h2>
        {uid && (
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition ${
              uploading
                ? "bg-emerald-800 text-emerald-300 cursor-not-allowed"
                : "bg-amber-400 text-emerald-950 hover:bg-amber-300"
            }`}
          >
            {uploading ? `Uploading ${progress}%…` : "📷 Upload Photo"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-xl bg-red-900/20 border border-red-800/50 p-5 text-sm text-red-200 space-y-2">
          <p className="font-bold flex items-center gap-2 text-red-400">
            ⚠️ {errorMsg}
          </p>
          <p className="text-xs text-stone-300">
            To resolve this error and enable photo sharing, please paste the following rules into the <strong>Rules</strong> tab of your <strong>Cloud Firestore</strong> database in the Firebase Console:
          </p>
          <pre className="p-3 bg-black/40 rounded text-xs text-amber-300/90 overflow-x-auto select-all font-mono">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /trailPhotos/{photoId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}`}
          </pre>
        </div>
      )}

      {/* Upload progress bar */}
      {uploading && (
        <div className="mb-4 h-2 rounded-full bg-emerald-900/40 overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {uploadError && (
        <p className="mb-4 text-sm text-red-300 bg-red-900/30 border border-red-700/40 rounded px-3 py-2">
          {uploadError}
        </p>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-emerald-900/40 animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-emerald-800/60 text-emerald-200/50">
          <span className="text-4xl mb-2">📸</span>
          <p className="text-sm">No photos yet. Be the first to share one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((p) => (
            <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img
                src={p.photoUrl}
                alt={`Trail photo by ${p.userName}`}
                className="w-full h-full object-cover cursor-pointer transition duration-300 group-hover:scale-105 group-hover:brightness-75"
                onClick={() => setLightbox(p)}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3 bg-gradient-to-t from-black/70">
                <p className="text-xs text-white font-semibold truncate">
                  {p.userName}
                </p>
                {p.userId === uid && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(p);
                    }}
                    className="mt-1 self-start px-2 py-1 text-xs rounded bg-red-600/80 hover:bg-red-600 text-white transition"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Delete photo?</h3>
            <p className="text-sm text-emerald-200/70 mb-4">
              This will permanently remove the photo. This cannot be undone.
            </p>
            <img
              src={deleteTarget.photoUrl}
              className="rounded-lg w-full h-40 object-cover mb-6"
              alt="To be deleted"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-500 font-semibold text-sm disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-md border border-emerald-700 text-sm hover:bg-emerald-800/40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          {/* Main Container */}
          <div className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.photoUrl}
              alt={`Uploaded by ${lightbox.userName}`}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-emerald-950"
            />
            
            {/* Info and Action Bar */}
            <div className="mt-4 w-full max-w-xl bg-emerald-950/90 border border-emerald-800/40 rounded-xl p-4 flex items-center justify-between shadow-lg backdrop-blur">
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-emerald-300">Shared by</p>
                <p className="text-sm font-semibold text-stone-100 mt-0.5">{lightbox.userName}</p>
              </div>
              
              <div className="flex gap-2">
                {lightbox.userId === uid && (
                  <button
                    onClick={() => {
                      setDeleteTarget(lightbox);
                      setLightbox(null);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow cursor-pointer"
                  >
                    🗑️ Delete Photo
                  </button>
                )}
                <button
                  onClick={() => setLightbox(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-emerald-700 text-emerald-200 hover:bg-emerald-800/40 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-amber-400 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}

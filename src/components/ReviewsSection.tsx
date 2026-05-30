import { useEffect, useState } from "react";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import {
  subscribeToReviews,
  addReview,
  updateReview,
  deleteReview,
  type Review,
} from "@/lib/reviews";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-transform hover:scale-110"
        >
          <span className={(hovered || value) >= n ? "text-amber-400" : "text-emerald-800"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ value }: { value: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={value >= n ? "text-amber-400" : "text-emerald-800"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({ slug }: { slug: string }) {
  const [uid, setUid] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Track auth state client-side to avoid SSR hydration mismatch
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return unsub;
  }, []);

  // form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToReviews(
      slug,
      (data) => {
        setReviews(data);
        setLoading(false);
        setErrorMsg(null);
      },
      (err) => {
        setLoading(false);
        setErrorMsg(
          "Permission denied. Make sure to configure your Firebase Firestore security rules for the 'reviews' collection."
        );
      }
    );
    return unsub;
  }, [slug]);

  const myReview = reviews.find((r) => r.userId === uid);
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!comment.trim()) {
      setFormError("Please write a comment.");
      return;
    }
    setSubmitting(true);
    try {
      await addReview(slug, rating, comment.trim());
      setComment("");
      setRating(5);
    } catch (err: any) {
      setFormError(err.message ?? "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    if (!editId) return;
    setEditSubmitting(true);
    try {
      await updateReview(editId, editRating, editComment.trim());
      setEditId(null);
    } catch {
      /* silent */
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteReview(deleteId);
      setDeleteId(null);
    } catch {
      /* silent */
    } finally {
      setDeleting(false);
    }
  };

  const startEdit = (r: Review) => {
    setEditId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment);
  };

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Hiker Reviews</h2>
        {avg && (
          <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-800/40 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-lg font-bold">{avg}</span>
            <StarDisplay value={Math.round(Number(avg))} />
            <span className="text-xs text-emerald-200/60">({reviews.length})</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-xl bg-red-900/20 border border-red-800/50 p-5 text-sm text-red-200 space-y-2">
          <p className="font-bold flex items-center gap-2 text-red-400">
            ⚠️ {errorMsg}
          </p>
          <p className="text-xs text-stone-300">
            To resolve this error and make reviews functional, please paste the following rules into the <strong>Rules</strong> tab of your <strong>Cloud Firestore</strong> database in the Firebase Console:
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

      {/* Write a review (only if user hasn't posted one yet) */}
      {uid && !myReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl bg-emerald-900/30 border border-emerald-800/40 p-5 space-y-3"
        >
          <p className="text-sm font-semibold text-emerald-200">Write a review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience on this trail…"
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-emerald-950/60 border border-emerald-700 text-sm focus:outline-none focus:border-amber-400 resize-none"
          />
          {formError && (
            <p className="text-xs text-red-300">{formError}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-md bg-amber-400 text-emerald-950 font-semibold text-sm hover:bg-amber-300 disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-emerald-900/40 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-emerald-200/50 text-sm">
          No reviews yet. Be the first to review this trail!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border p-5 ${
                r.userId === uid
                  ? "bg-emerald-900/50 border-amber-400/30"
                  : "bg-emerald-900/30 border-emerald-800/40"
              }`}
            >
              {editId === r.id ? (
                /* Edit form */
                <div className="space-y-3">
                  <StarPicker value={editRating} onChange={setEditRating} />
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-emerald-950/60 border border-emerald-700 text-sm focus:outline-none focus:border-amber-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      disabled={editSubmitting}
                      className="px-4 py-1.5 rounded-md bg-amber-400 text-emerald-950 font-semibold text-sm hover:bg-amber-300 disabled:opacity-50"
                    >
                      {editSubmitting ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-4 py-1.5 rounded-md border border-emerald-700 text-sm hover:bg-emerald-800/40"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{r.userName}</span>
                        {r.userId === uid && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                      <StarDisplay value={r.rating} />
                    </div>
                    {r.userId === uid && (
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => startEdit(r)}
                          className="px-2.5 py-1 rounded bg-emerald-700/50 hover:bg-emerald-700 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(r.id)}
                          className="px-2.5 py-1 rounded bg-red-900/50 hover:bg-red-900 text-red-300 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-stone-300/90 leading-relaxed">
                    {r.comment}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Delete review?</h3>
            <p className="text-sm text-emerald-200/70 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-500 font-semibold text-sm disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-md border border-emerald-700 text-sm hover:bg-emerald-800/40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

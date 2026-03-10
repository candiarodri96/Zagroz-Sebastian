import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

function StarRating({ rating, onRate, interactive = false, size = 20 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-colors ${interactive ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={size}
            className={
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-600"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ adId, contractStatus }) {
  const [myReview, setMyReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = import.meta.env.VITE_API_URL;
  
  const token = JSON.parse(localStorage.getItem("user"))?.access_token;

  useEffect(() => {
    checkMyReview();
  }, [adId]);

  const checkMyReview = async () => {
    try {
      const res = await fetch(`${API}/ads/${adId}/review/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.reviewed) {
        setHasReviewed(true);
        setMyReview(data);
      }
    } catch (err) {
      console.error("Failed to check review:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/ads/${adId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment: comment || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to submit review");
        setLoading(false);
        return;
      }

      setSuccess("Review submitted! ⭐");
      setHasReviewed(true);
      setMyReview({ rating, comment });
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (contractStatus !== "completed") return null;

  if (hasReviewed) {
    return (
      <div className="bg-gray-900 border border-slate-700 rounded-xl p-6 mt-6">
        <h3 className="text-white font-semibold mb-3">Your Review</h3>
        <StarRating rating={myReview?.rating || 0} />
        {myReview?.comment && (
          <p className="text-slate-400 text-sm mt-3">"{myReview.comment}"</p>
        )}
        <p className="text-green-400 text-xs mt-2">✓ Review submitted</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-slate-700 rounded-xl p-6 mt-6">
      <h3 className="text-white font-semibold mb-1">Leave a Review</h3>
      <p className="text-slate-400 text-sm mb-4">
        How was your experience with the other party?
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Rating</label>
          <StarRating rating={rating} onRate={setRating} interactive />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export { StarRating };
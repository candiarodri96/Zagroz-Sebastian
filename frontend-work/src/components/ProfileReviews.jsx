import React, { useState, useEffect } from "react";
import { StarRating } from "./ReviewSection";

export default function ProfileReviews({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!userId) return;
    fetchReviews();
    fetchRating();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/reviews`);
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/rating`);
      if (res.ok) {
        const data = await res.json();
        setRating(data.average_rating);
        setCount(data.review_count);
      }
    } catch (err) {
      console.error("Failed to fetch rating:", err);
    }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading reviews...</p>;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-bold text-white">Reviews</h3>
        {rating !== null && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(rating)} />
            <span className="text-white font-semibold">{rating}</span>
            <span className="text-slate-400 text-sm">
              ({count} review{count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
        {rating === null && (
          <span className="text-slate-500 text-sm">No reviews yet</span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="bg-gray-900 border border-slate-700 rounded-xl p-8 text-center">
          <p className="text-slate-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-900 border border-slate-700 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} size={16} />
                  <span className="text-white text-sm font-medium">
                    {review.reviewer_name}
                  </span>
                </div>
                <span className="text-slate-500 text-xs">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-slate-400 text-sm mt-1">"{review.comment}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
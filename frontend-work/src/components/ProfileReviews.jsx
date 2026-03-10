import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { StarRating } from "./ReviewSection";

const API = import.meta.env.VITE_API_URL;

export default function ProfileReviews({ userId, token }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchReviews();
    fetchRating();
    if (token) fetchContracts();
  }, [userId, token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/reviews`);
      if (res.ok) setReviews(await res.json());
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

  const fetchContracts = async () => {
    try {
      const res = await fetch(`${API}/users/me/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContracts(data.filter(c => ["fully_signed", "completed"].includes(c.status)));
      }
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
    }
  };

  const downloadPdf = async (adId, existingFilename) => {
    setPdfLoading(true);
    try {
      const res = await fetch(`${API}/ads/${adId}/contract/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("PDF not found"); return; }
      const data = await res.json();
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.pdf_data}`;
      link.download = data.pdf_filename || existingFilename;
      link.click();
    } catch {
      alert("Failed to download PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading reviews...</p>;

  return (
    <div className="mt-8 space-y-8">
      {/* ── Reviews ── */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xl font-bold text-white">Reviews</h3>
          {rating !== null ? (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(rating)} />
              <span className="text-white font-semibold">{rating}</span>
              <span className="text-slate-400 text-sm">
                ({count} review{count !== 1 ? "s" : ""})
              </span>
            </div>
          ) : (
            <span className="text-slate-500 text-sm">No reviews yet</span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-gray-900 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-sm">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-900 border border-slate-700 rounded-xl px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size={14} />
                    <span className="text-white text-xs font-medium">
                      {review.reviewer_name}
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-slate-400 text-xs mt-1">"{review.comment}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Signed Contracts ── */}
      {token && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Signed Contracts</h3>
          {contracts.length === 0 ? (
            <div className="bg-gray-900 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-sm">No signed contracts yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contracts.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-900 border border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        Contract #{c.id} — Ad #{c.ad_id}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {c.agreed_amount} kr · {new Date(c.created_at).toLocaleDateString()} ·{" "}
                        <span className={c.status === "completed" ? "text-emerald-400" : "text-green-400"}>
                          {c.status.replace(/_/g, " ")}
                        </span>
                      </p>
                    </div>
                  </div>
                  {c.pdf_filename && (
                    <button
                      onClick={() => downloadPdf(c.ad_id, c.pdf_filename)}
                      disabled={pdfLoading}
                      className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 shrink-0 ml-4"
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
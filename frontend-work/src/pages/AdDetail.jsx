import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import categoryImages from "../utils/categoryImages";

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchAd();
  }, [id]);

  const fetchAd = async () => {
    try {
      const response = await fetch(`http://localhost:8000/ads/${id}`);
      if (!response.ok) {
        navigate("/results");
        return;
      }
      const data = await response.json();
      setAd(data);
    } catch (err) {
      console.error("Failed to fetch ad:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    setOfferError("");
    setOfferLoading(true);

    if (!user?.access_token) {
      setOfferError("You must be logged in to make an offer");
      setOfferLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/ads/${id}/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          amount: parseInt(offerAmount),
          message: offerMessage || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setOfferError(data.detail || "Failed to submit offer");
        return;
      }

      setOfferSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setOfferSuccess(false);
        setOfferAmount("");
        setOfferMessage("");
      }, 2000);
    } catch (err) {
      setOfferError("Could not connect to server");
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-24">Loading...</p>;
  if (!ad) return <p className="text-center mt-24">Ad not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 mt-24 pb-16">
      {/* Hero image */}
      <div className="w-full h-72 rounded-xl overflow-hidden mb-8">
        <img
          src={categoryImages[ad.category] || categoryImages.other}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ad info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
          <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            {ad.category}
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">Budget</p>
          <p className="text-2xl font-bold text-green-400">{ad.budget} kr</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin size={18} />
          <span>{ad.city}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar size={18} />
          <span>Posted {new Date(ad.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {ad.description}
        </p>
      </div>

      {/* Make offer button — only show when ad is open */}
      {ad.status === "open" && (
        <button
          onClick={() => {
            if (!user?.access_token) {
              navigate("/login");
              return;
            }
            setShowModal(true);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          Make an Offer
        </button>
      )}

      {ad.status !== "open" && (
        <div className="w-full text-center py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-400">
          This ad is currently in: <span className="font-medium text-white">{ad.status}</span>
        </div>
      )}

      {/* ===================== */}
      {/* OFFER MODAL           */}
      {/* ===================== */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-900 border border-slate-700 rounded-xl p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {offerSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-400">Offer Submitted!</h3>
                <p className="text-slate-400 mt-2">The ad owner will review your offer.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOffer} className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Your Offer</h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-slate-400">
                  Submitting offer for: <span className="text-white font-medium">{ad.title}</span>
                </p>

                {offerError && (
                  <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-sm">
                    {offerError}
                  </div>
                )}

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Your Price (kr)
                  </label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-slate-600 p-3 pl-10 rounded-lg bg-slate-800 text-white"
                      placeholder="e.g. 15000"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Ad budget: {ad.budget} kr
                  </p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Message <span className="text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    className="w-full border border-slate-600 p-3 rounded-lg bg-slate-800 text-white h-28 resize-none"
                    placeholder="Describe your experience, availability, etc."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={offerLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {offerLoading ? "Submitting..." : "Submit Offer"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
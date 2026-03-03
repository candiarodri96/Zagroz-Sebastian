import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

export default function MyOffers() {
  const [ads, setAds] = useState([]);
  const [myOffers, setMyOffers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchAdsAndOffers();
  }, []);

  const fetchAdsAndOffers = async () => {
    try {
      // Get all open ads
      const adsRes = await fetch("http://localhost:8000/ads/");
      const adsData = await adsRes.json();
      setAds(adsData);

      // For each ad, check if we have an offer
      const offersObj = {};
      for (const ad of adsData) {
        try {
          const offerRes = await fetch(
            `http://localhost:8000/ads/${ad.id}/offers`,
            { headers: { Authorization: `Bearer ${user.access_token}` } }
          );
          if (offerRes.ok) {
            const offerData = await offerRes.json();
            if (offerData.length > 0) {
              offersObj[ad.id] = { ad, offers: offerData };
            }
          }
        } catch {
          // Skip ads where we can't fetch offers
        }
      }
      setMyOffers(offersObj);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const withdrawOffer = async (adId, offerId) => {
    if (!confirm("Are you sure you want to withdraw this offer?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/ads/${adId}/offers/${offerId}/withdraw`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to withdraw offer");
        return;
      }

      alert("Offer withdrawn.");
      fetchAdsAndOffers();
    } catch (err) {
      alert("Could not connect to server");
    }
  };

  const statusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      selected: "bg-blue-500/20 text-blue-400",
      withdrawn: "bg-slate-500/20 text-slate-400",
      rejected: "bg-red-500/20 text-red-400",
      failed_negotiation: "bg-red-500/20 text-red-400",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || "bg-slate-500/20 text-slate-400"}`}>
        {status}
      </span>
    );
  };

  if (loading) return <p className="text-center mt-24">Loading...</p>;

  const entries = Object.values(myOffers);

  return (
    <div className="max-w-4xl mx-auto px-6 mt-24 pb-16">
      <h1 className="text-3xl font-bold mb-8">My Offers</h1>

      {entries.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 mb-4">You haven't made any offers yet.</p>
          <button
            onClick={() => navigate("/results")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Ads
          </button>
        </div>
      )}

      <div className="space-y-4">
        {entries.map(({ ad, offers }) =>
          offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gray-900 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-semibold">{ad.title}</h2>
                    {statusBadge(offer.status)}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    {ad.city} · Budget: {ad.budget} kr
                  </p>
                  <div className="text-sm">
                    <span className="text-green-400 font-medium">
                      Your offer: {offer.amount} kr
                    </span>
                    {offer.estimated_time && (
                      <span className="text-slate-400 ml-3">
                        · {offer.estimated_time}
                      </span>
                    )}
                  </div>
                  {offer.message && (
                    <p className="text-sm text-slate-300 mt-2 italic">
                      "{offer.message}"
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Version {offer.version}
                  </p>
                </div>

                <div className="flex gap-2">
                  {offer.status === "selected" && (
                    <>
                      <button
                        onClick={() => navigate(`/chat/${ad.id}`)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MessageSquare size={14} /> Chat
                      </button>
                      <button
                        onClick={() => navigate(`/contract/${ad.id}`)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Contract
                      </button>
                    </>
                  )}

                  {offer.status === "pending" && (
                    <button
                      onClick={() => withdrawOffer(ad.id, offer.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, ChevronDown, ChevronUp, Check, X, MessageSquare } from "lucide-react";
import categoryImages from "../utils/categoryImages";

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [offersMap, setOffersMap] = useState({});
  const [expandedAd, setExpandedAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const response = await fetch("http://localhost:8000/ads/", {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      const data = await response.json();
      // Filter to only show ads created by current user
      const myAds = data.filter ? data : [];
      setAds(myAds);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async (adId) => {
    if (offersMap[adId]) {
      setExpandedAd(expandedAd === adId ? null : adId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/ads/${adId}/offers`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      const data = await response.json();
      setOffersMap((prev) => ({ ...prev, [adId]: data }));
      setExpandedAd(adId);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    }
  };

  const selectOffer = async (adId, offerId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/ads/${adId}/offers/${offerId}/select`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to select offer");
        return;
      }

      alert("Offer selected! Negotiation has started.");
      // Refresh data
      setOffersMap((prev) => ({ ...prev, [adId]: undefined }));
      setExpandedAd(null);
      fetchMyAds();
    } catch (err) {
      alert("Could not connect to server");
    }
  };

  const failNegotiation = async (adId, offerId) => {
    if (!confirm("Are you sure you want to cancel this negotiation?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/ads/${adId}/offers/${offerId}/fail`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to cancel negotiation");
        return;
      }

      alert("Negotiation cancelled. Ad is open again.");
      setOffersMap((prev) => ({ ...prev, [adId]: undefined }));
      setExpandedAd(null);
      fetchMyAds();
    } catch (err) {
      alert("Could not connect to server");
    }
  };

  const createContract = async (adId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/ads/${adId}/contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({ details: null }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to create contract");
        return;
      }

      alert("Contract created! Both parties need to sign.");
      navigate(`/contract/${adId}`);
    } catch (err) {
      alert("Could not connect to server");
    }
  };

  const statusBadge = (status) => {
    const colors = {
      open: "bg-green-500/20 text-green-400",
      negotiation: "bg-yellow-500/20 text-yellow-400",
      active_contract: "bg-blue-500/20 text-blue-400",
      closed: "bg-slate-500/20 text-slate-400",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || "bg-slate-500/20 text-slate-400"}`}>
        {status}
      </span>
    );
  };

  const offerStatusBadge = (status) => {
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

  return (
    <div className="max-w-4xl mx-auto px-6 mt-24 pb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Ads</h1>
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Ad
        </button>
      </div>

      {ads.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 mb-4">You haven't posted any ads yet.</p>
          <button
            onClick={() => navigate("/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your First Ad
          </button>
        </div>
      )}

      <div className="space-y-4">
        {ads.map((ad) => {
          const selectedOffer = offersMap[ad.id]?.find((o) => o.status === "selected");

          return (
            <div key={ad.id} className="bg-gray-900 border border-slate-700 rounded-xl overflow-hidden">
              {/* Ad header */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-semibold">{ad.title}</h2>
                      {statusBadge(ad.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {ad.city}
                      </span>
                      <span>{ad.budget} kr</span>
                      <span className="uppercase text-xs">{ad.category}</span>
                    </div>
                  </div>

                  <img
                    src={categoryImages[ad.category] || categoryImages.other}
                    alt={ad.category}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>

                {/* Action buttons based on status */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => fetchOffers(ad.id)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-sm px-3 py-2 rounded-lg transition-colors"
                  >
                    {expandedAd === ad.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    View Offers
                  </button>

                  {ad.status === "negotiation" && (
                    <>
                      <button
                        onClick={() => navigate(`/chat/${ad.id}`)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        <MessageSquare size={16} /> Chat
                      </button>
                      <button
                        onClick={() => createContract(ad.id)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        <Check size={16} /> Create Contract
                      </button>
                    </>
                  )}

                  {ad.status === "active_contract" && (
                    <button
                      onClick={() => navigate(`/contract/${ad.id}`)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      View Contract
                    </button>
                  )}
                </div>
              </div>

              {/* Offers dropdown */}
              {expandedAd === ad.id && offersMap[ad.id] && (
                <div className="border-t border-slate-700 bg-slate-800/50 p-5">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">
                    Offers ({offersMap[ad.id].length})
                  </h3>

                  {offersMap[ad.id].length === 0 && (
                    <p className="text-sm text-slate-500">No offers yet.</p>
                  )}

                  <div className="space-y-3">
                    {offersMap[ad.id].map((offer) => (
                      <div
                        key={offer.id}
                        className="bg-gray-900 border border-slate-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{offer.amount} kr</span>
                              {offerStatusBadge(offer.status)}
                            </div>
                            {offer.estimated_time && (
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={12} /> {offer.estimated_time}
                              </p>
                            )}
                            {offer.message && (
                              <p className="text-sm text-slate-300 mt-2">{offer.message}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              Version {offer.version} · Company #{offer.user_id}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {offer.status === "pending" && ad.status === "open" && (
                              <button
                                onClick={() => selectOffer(ad.id, offer.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Select
                              </button>
                            )}

                            {offer.status === "selected" && ad.status === "negotiation" && (
                              <button
                                onClick={() => failNegotiation(ad.id, offer.id)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
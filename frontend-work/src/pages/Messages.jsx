import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function Messages() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      // Get all ads, then filter to ones with active negotiations/contracts
      const res = await fetch(`${API}/ads/`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const allAds = await res.json();

      // For each ad in negotiation/active_contract, check if user is involved
      const activeChats = [];

      for (const ad of allAds.filter((a) =>
        ["negotiation", "active_contract"].includes(a.status)
      )) {
        // Check if this user owns the ad
        if (ad.user_id === user.id) {
          activeChats.push(ad);
          continue;
        }

        // Check if this user has a selected offer
        try {
          const offersRes = await fetch(`${API}/ads/${ad.id}/offers`, {
            headers: { Authorization: `Bearer ${user.access_token}` },
          });
          if (offersRes.ok) {
            const offers = await offersRes.json();
            const hasSelected = offers.some(
              (o) => o.user_id === user.id && o.status === "selected"
            );
            if (hasSelected) {
              activeChats.push(ad);
            }
          }
        } catch {
          // ignore
        }
      }

      setChats(activeChats);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "negotiation":
        return { text: "Negotiating", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
      case "active_contract":
        return { text: "Active Contract", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
      default:
        return { text: status, color: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
    }
  };

  if (loading) return <p className="text-center mt-24">Loading messages...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 mt-24 pb-16">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      {chats.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No active conversations</p>
          <p className="text-slate-500 text-sm mt-2">
            Chats appear here when you're in a negotiation or have an active contract.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((ad) => {
            const label = statusLabel(ad.status);
            return (
              <button
                key={ad.id}
                onClick={() => navigate(`/chat/${ad.id}`)}
                className="w-full flex items-center justify-between p-4 bg-gray-900 border border-slate-700 rounded-xl hover:border-slate-500 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{ad.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{ad.city} · {ad.budget} kr</p>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${label.color}`}
                  >
                    {label.text}
                  </span>
                  <ArrowRight size={18} className="text-slate-500" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
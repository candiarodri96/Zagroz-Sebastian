import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ChevronRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/conversations`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (res.ok) setConversations(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-24 text-slate-400">Loading messages...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 mt-24 pb-16">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-sm text-slate-400 mb-8">Your active conversations</p>

      {conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No active conversations</p>
          <p className="text-slate-500 text-sm mt-2">
            Chats appear here when you're in a negotiation or have an active contract.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.ad_id}
              onClick={() => navigate(`/messages/${conv.ad_id}`)}
              className="w-full flex items-center gap-4 p-4 bg-gray-900 border border-slate-700 rounded-xl hover:border-slate-500 transition-colors text-left"
            >
              {/* Avatar placeholder */}
              <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-semibold text-sm">
                {conv.other_user_name.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-semibold text-sm truncate">
                    {conv.other_user_name}
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0 ml-2">
                    {timeAgo(conv.last_message_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mb-1">{conv.ad_title}</p>
                <p className={`text-xs truncate ${conv.has_unread ? "text-white font-medium" : "text-slate-500"}`}>
                  {conv.last_message ?? "No messages yet — start the conversation"}
                </p>
              </div>

              {/* Unread dot + chevron */}
              <div className="flex items-center gap-2 shrink-0">
                {conv.has_unread && (
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                <ChevronRight size={16} className="text-slate-600" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

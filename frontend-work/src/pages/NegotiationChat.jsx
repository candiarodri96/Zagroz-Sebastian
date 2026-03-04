import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";

export default function NegotiationChat() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchMessages();

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [adId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/ads/${adId}/messages`,
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to load messages");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessages(data);
      setError("");
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);

    try {
      const response = await fetch(
        `http://localhost:8000/ads/${adId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to send message");
        return;
      }

      setNewMessage("");
      fetchMessages();
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setSending(false);
    }
  };

  // We need the current user's ID to align messages
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${user.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.id);
        }
      } catch {
        // ignore
      }
    };
    fetchMe();
  }, []);

  if (loading) return <p className="text-center mt-24">Loading chat...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-24 pb-8 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pb-4 border-b border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Negotiation Chat</h1>
        <span className="text-sm text-slate-400">Ad #{adId}</span>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 mt-8">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 border border-slate-700 text-slate-200"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-medium text-slate-400 mb-1">
                    {msg.sender_name}
                  </p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-slate-500"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="px-6 pt-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
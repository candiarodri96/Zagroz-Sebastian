import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, FileText, Plus } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function NegotiationChat() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [ad, setAd] = useState(null);
  const [contract, setContract] = useState(null);
  const [showContractForm, setShowContractForm] = useState(false);
  const [contractDetails, setContractDetails] = useState("");
  const [contractLoading, setContractLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchMessages();
    fetchMe();
    fetchAd();
    fetchContract();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [adId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API}/users/me`, {
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

  const fetchAd = async () => {
    try {
      const res = await fetch(`${API}/ads/${adId}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAd(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchContract = async () => {
    try {
      const res = await fetch(`${API}/ads/${adId}/contract`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContract(data);
      } else {
        setContract(null);
      }
    } catch {
      setContract(null);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API}/ads/${adId}/messages`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

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
      const response = await fetch(`${API}/ads/${adId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to send message");
      }
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setSending(false);
    }
  };

  const createContract = async (e) => {
    e.preventDefault();
    setContractLoading(true);

    try {
      const response = await fetch(`${API}/ads/${adId}/contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ details: contractDetails || null }),
      });

      if (response.ok) {
        setShowContractForm(false);
        setContractDetails("");
        fetchContract();
        fetchAd();
      } else {
        const data = await response.json();
        alert(data.detail || "Failed to create contract");
      }
    } catch {
      alert("Could not connect to server");
    } finally {
      setContractLoading(false);
    }
  };

  const isAdOwner = currentUserId && ad && currentUserId === ad.user_id;

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
        <div className="flex-1">
          <h1 className="text-xl font-bold">Negotiation Chat</h1>
          {ad && <p className="text-sm text-slate-400">{ad.title}</p>}
        </div>
      </div>

      {/* Contract action bar */}
      <div className="px-6 py-3 border-b border-slate-700 bg-slate-900/50">
        {/* Negotiation phase — no contract yet */}
        {ad?.status === "negotiation" && !contract && isAdOwner && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Ready to proceed? Create a contract to finalize the deal.
            </p>
            <button
              onClick={() => setShowContractForm(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={16} /> Create Contract
            </button>
          </div>
        )}

        {ad?.status === "negotiation" && !contract && !isAdOwner && (
          <p className="text-sm text-yellow-400 text-center">
            ⏳ Waiting for the customer to create a contract...
          </p>
        )}

        {/* Contract exists but not fully signed */}
        {contract && !["fully_signed", "completed", "cancelled"].includes(contract.status) && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-400">
              📄 Contract created — {contract.status.replace(/_/g, " ")}
            </p>
            <button
              onClick={() => navigate(`/contract/${adId}`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText size={16} /> View & Sign
            </button>
          </div>
        )}

        {/* Contract fully signed */}
        {contract?.status === "fully_signed" && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-400">✅ Contract signed — work in progress</p>
            <button
              onClick={() => navigate(`/contract/${adId}`)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText size={16} /> View Contract
            </button>
          </div>
        )}

        {/* Completed */}
        {contract?.status === "completed" && (
          <p className="text-sm text-emerald-400 text-center">🎉 Job completed!</p>
        )}
      </div>

      {/* Contract creation form modal */}
      {showContractForm && (
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/80">
          <form onSubmit={createContract} className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Create Contract</h3>
            <textarea
              value={contractDetails}
              onChange={(e) => setContractDetails(e.target.value)}
              placeholder="Add contract details (scope of work, timeline, etc.)..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm h-24 resize-none focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowContractForm(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={contractLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors"
              >
                {contractLoading ? "Creating..." : "Create Contract"}
              </button>
            </div>
          </form>
        </div>
      )}

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

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 ${
                msg.sender_id === currentUserId
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              <p className="text-xs font-medium mb-1 opacity-70">{msg.sender_name}</p>
              <p className="text-sm">{msg.content}</p>
              <p className="text-[10px] opacity-50 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
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
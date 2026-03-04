import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Check, X, ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ContractView() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchContract();
    fetchMe();
  }, [adId]);

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

  const fetchContract = async () => {
    try {
      const response = await fetch(
        `${API}/ads/${adId}/contract`,
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Contract not found");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setContract(data);
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const signContract = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `${API}/ads/${adId}/contract/sign`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to sign contract");
        return;
      }

      alert("Contract signed!");
      fetchContract();
    } catch (err) {
      alert("Could not connect to server");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelContract = async () => {
    if (!confirm("Are you sure you want to cancel this contract?")) return;
    setActionLoading(true);

    try {
      const response = await fetch(
        `${API}/ads/${adId}/contract/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to cancel contract");
        return;
      }

      alert("Contract cancelled. Ad is open again.");
      navigate(-1);
    } catch (err) {
      alert("Could not connect to server");
    } finally {
      setActionLoading(false);
    }
  };

  const completeContract = async () => {
    if (!confirm("Mark this work as completed?")) return;
    setActionLoading(true);

    try {
      const response = await fetch(
        `${API}/ads/${adId}/contract/complete`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.access_token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to complete contract");
        return;
      }

      alert("Work marked as completed! 🎉");
      fetchContract();
    } catch (err) {
      alert("Could not connect to server");
    } finally {
      setActionLoading(false);
    }
  };

  const statusColors = {
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    signed_by_company: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    signed_by_customer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    fully_signed: "bg-green-500/20 text-green-400 border-green-500/30",
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const hasUserSigned = () => {
    if (!contract || !currentUserId) return false;
    if (currentUserId === contract.company_id && 
        (contract.status === "signed_by_company" || contract.status === "fully_signed")) return true;
    if (currentUserId === contract.customer_id && 
        (contract.status === "signed_by_customer" || contract.status === "fully_signed")) return true;
    return false;
  };

  const canSign = () => {
    if (!contract || !currentUserId) return false;
    if (contract.status === "fully_signed" || contract.status === "completed" || contract.status === "cancelled") return false;
    return !hasUserSigned();
  };

  if (loading) return <p className="text-center mt-24">Loading contract...</p>;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 mt-24 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={() => navigate(-1)} className="text-blue-400 mt-4 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 mt-24 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Contract</h1>
      </div>

      {/* Contract card */}
      <div className="bg-gray-900 border border-slate-700 rounded-xl p-6 space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-slate-400" />
            <span className="text-lg font-semibold">Ad #{contract.ad_id}</span>
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full border ${
              statusColors[contract.status] || ""
            }`}
          >
            {contract.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Agreed Amount</p>
            <p className="text-xl font-bold text-green-400">{contract.agreed_amount} kr</p>
          </div>
          <div>
            <p className="text-slate-500">Created</p>
            <p>{new Date(contract.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Customer (ID)</p>
            <p>#{contract.customer_id}</p>
          </div>
          <div>
            <p className="text-slate-500">Company (ID)</p>
            <p>#{contract.company_id}</p>
          </div>
          {contract.signed_at && (
            <div className="col-span-2">
              <p className="text-slate-500">Fully Signed At</p>
              <p className="text-green-400">
                {new Date(contract.signed_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {contract.details && (
          <div>
            <p className="text-slate-500 text-sm mb-1">Details</p>
            <p className="text-slate-300 text-sm">{contract.details}</p>
          </div>
        )}

        {/* Signing status visual */}
        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-slate-500 mb-3">Signatures</p>
          <div className="flex gap-4">
            <div
              className={`flex-1 p-3 rounded-lg border text-center text-sm ${
                contract.status === "signed_by_customer" ||
                contract.status === "fully_signed" ||
                contract.status === "completed"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-slate-700 bg-slate-800 text-slate-500"
              }`}
            >
              {contract.status === "signed_by_customer" ||
              contract.status === "fully_signed" ||
              contract.status === "completed"
                ? "✅ Customer signed"
                : "⏳ Customer pending"}
            </div>
            <div
              className={`flex-1 p-3 rounded-lg border text-center text-sm ${
                contract.status === "signed_by_company" ||
                contract.status === "fully_signed" ||
                contract.status === "completed"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-slate-700 bg-slate-800 text-slate-500"
              }`}
            >
              {contract.status === "signed_by_company" ||
              contract.status === "fully_signed" ||
              contract.status === "completed"
                ? "✅ Company signed"
                : "⏳ Company pending"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-700 pt-4">
          {canSign() && (
            <button
              onClick={signContract}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
            >
              <Check size={18} /> Sign Contract
            </button>
          )}

          {contract.status !== "fully_signed" &&
            contract.status !== "completed" &&
            contract.status !== "cancelled" && (
              <button
                onClick={cancelContract}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                <X size={18} /> Cancel
              </button>
            )}

          {contract.status === "fully_signed" &&
            currentUserId === contract.customer_id && (
              <button
                onClick={completeContract}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Check size={18} /> Mark as Completed
              </button>
            )}

          {contract.status === "completed" && (
            <div className="flex-1 text-center py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-medium">
              ✅ Work Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Check, X, ArrowLeft, Download } from "lucide-react";
import ReviewSection from "../components/ReviewSection";

const API = import.meta.env.VITE_API_URL;

export default function ContractView() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [ad, setAd] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
    fetchContract();
    fetchMe();
  }, [adId]);

  useEffect(() => {
    if (contract) fetchAd();
  }, [contract]);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.id);
        setCurrentUser(data);
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

  const generateAndUploadPdf = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageW = 210;
      const margin = 14;

      const companyName = currentUser
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : `Company #${contract.company_id}`;
      const signedDate = contract.signed_at
        ? new Date(contract.signed_at).toLocaleDateString("sv-SE")
        : new Date(contract.created_at).toLocaleDateString("sv-SE");
      const amount = contract.agreed_amount;
      const moms = Math.round(amount * 0.25);
      const total = amount + moms;

      // ── Header ──────────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(companyName, margin, 20);

      doc.setFontSize(16);
      doc.text("Kontrakt", 130, 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Datum", 130, 22);
      doc.text(signedDate, 155, 22);
      doc.text("Kundnr:", 130, 28);
      doc.text(`#${contract.customer_id}`, 155, 28);
      doc.text("Kontraktnr:", 130, 34);
      doc.text(`#${contract.ad_id}`, 155, 34);

      // ── Divider ─────────────────────────────────────────────
      doc.setDrawColor(180);
      doc.line(margin, 40, pageW - margin, 40);

      // ── Billing address ─────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Fakturaadress", margin, 48);
      doc.setFont("helvetica", "normal");
      if (ad?.address) {
        doc.text(ad.address, margin, 55);
        if (ad.city) doc.text(ad.city, margin, 61);
      } else {
        doc.text("-", margin, 55);
      }

      // ── References ──────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Er referens", margin, 74);
      doc.text("Vår referens", 70, 74);
      doc.text("Startdatum", 120, 74);
      doc.text("Betalningsvillkor", 160, 74);

      doc.setFont("helvetica", "normal");
      doc.text(`Kund #${contract.customer_id}`, margin, 80);
      doc.text(companyName, 70, 80);
      doc.text(ad?.start_date ? new Date(ad.start_date).toLocaleDateString("sv-SE") : "-", 120, 80);
      doc.text("30 dagar", 160, 80);

      // ── Table header ─────────────────────────────────────────
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, 88, pageW - margin * 2, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Beskrivning", margin + 2, 94);
      doc.text("Antal", 140, 94);
      doc.text("Pris", 158, 94);
      doc.text("Belopp", 178, 94);

      // ── Table row ────────────────────────────────────────────
      doc.setFont("helvetica", "normal");
      const jobTitle = ad?.title || `Uppdrag #${contract.ad_id}`;
      const titleLines = doc.splitTextToSize(jobTitle, 120);
      doc.text(titleLines, margin + 2, 102);
      doc.text("1", 140, 102);
      doc.text(`${amount} kr`, 152, 102);
      doc.text(`${amount} kr`, 172, 102);

      // details as small subtext
      if (contract.details) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        const detailLines = doc.splitTextToSize(contract.details, 120);
        doc.text(detailLines, margin + 2, 108 + (titleLines.length - 1) * 5);
        doc.setTextColor(0);
        doc.setFontSize(9);
      }

      // ── Table bottom border ──────────────────────────────────
      doc.setDrawColor(180);
      doc.line(margin, 190, pageW - margin, 190);

      // ── Summary ──────────────────────────────────────────────
      doc.setFont("helvetica", "normal");
      doc.text("Summa:", 150, 200);
      doc.text(`${amount} kr`, 183, 200);
      doc.text("Moms 25%:", 150, 208);
      doc.text(`${moms} kr`, 183, 208);
      doc.line(150, 212, pageW - margin, 212);
      doc.setFont("helvetica", "bold");
      doc.text("Att betala:", 150, 219);
      doc.text(`${total} kr`, 183, 219);

      // ── Footer ───────────────────────────────────────────────
      doc.setDrawColor(180);
      doc.line(margin, 275, pageW - margin, 275);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("WorkFlow", margin, 281);
      doc.setFont("helvetica", "normal");
      doc.text(`Kontrakt #${contract.ad_id}  |  ${signedDate}  |  Status: ${contract.status.replace(/_/g, " ")}`, margin, 286);

      // ── Save & upload ────────────────────────────────────────
      const filename = `kontrakt-${contract.ad_id}-${Date.now()}.pdf`;
      const base64 = doc.output("datauristring").split(",")[1];

      await fetch(`${API}/ads/${adId}/contract/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ pdf_data: base64, pdf_filename: filename }),
      });

      doc.save(filename);
      fetchContract();
    } catch (err) {
      alert("Failed to generate PDF. Make sure jspdf is installed.");
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadExistingPdf = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(`${API}/ads/${adId}/contract/pdf`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (!res.ok) { alert("PDF not found"); return; }
      const data = await res.json();
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.pdf_data}`;
      link.download = data.pdf_filename;
      link.click();
    } catch {
      alert("Failed to download PDF");
    } finally {
      setPdfLoading(false);
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

        {ad?.address && ["fully_signed", "completed"].includes(contract.status) && (
          <div>
            <p className="text-slate-500 text-sm mb-1">Job Address</p>
            <p className="text-slate-300 text-sm">{ad.address}{ad.city ? `, ${ad.city}` : ""}</p>
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

          {(contract.status === "fully_signed" || contract.status === "completed") && (
            contract.pdf_filename ? (
              <button
                onClick={downloadExistingPdf}
                disabled={pdfLoading}
                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white py-3 px-5 rounded-lg font-medium transition-colors"
              >
                <Download size={18} /> {pdfLoading ? "Downloading..." : "Download PDF"}
              </button>
            ) : (
              <button
                onClick={generateAndUploadPdf}
                disabled={pdfLoading}
                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white py-3 px-5 rounded-lg font-medium transition-colors"
              >
                <Download size={18} /> {pdfLoading ? "Generating..." : "Generate PDF"}
              </button>
            )
          )}
        </div>
      </div>
      <ReviewSection adId={adId} contractStatus={contract?.status} />
    </div>
  );
}
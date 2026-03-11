import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Users, Mail, Plus, UserRoundCog, Save, X } from 'lucide-react';
import ProfileReviews from "../components/ProfileReviews";
import { StarRating } from "../components/ReviewSection";
import categoryImages from "../utils/categoryImages";

const API = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
  open:            "bg-green-500/15 text-green-400 border border-green-500/30",
  negotiation:     "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  active_contract: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  closed:          "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

// Safe wrapper around JSON.parse — returns fallback if the key is missing or
// the stored value is corrupted (e.g. truncated by a storage quota error).
function readLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const EMPTY_EXTRA = {
  job_title: "",
  skills: "",
  location: "",
  references: [],
  languages: [],
};

// ─── EditableList ────────────────────────────────────────────────────────────
// Defined outside Profile so React never remounts it between renders.
// In edit mode: shows inputs with remove buttons and an Add button.
// In view mode: shows a plain list or an empty-state label.
function EditableList({ editMode, saved, draft, onUpdate, onRemove, onAdd, placeholder, emptyLabel }) {
  if (editMode) {
    return (
      <div className="space-y-2">
        {draft.map((item, i) => (
          <div key={i} className="flex gap-1">
            <input
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={() => onRemove(i)}
              className="text-slate-400 hover:text-red-500"
            >
              <X size={15} />
            </button>
          </div>
        ))}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
        >
          <Plus size={16} /> Add
        </button>
      </div>
    );
  }

  return saved.length === 0
    ? <span className="text-slate-400">{emptyLabel}</span>
    : <ul className="space-y-1">{saved.map((item, i) => <li key={i} className="text-slate-800">{item}</li>)}</ul>;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Profile() {
  const user      = readLocalStorage("user", null);
  const isCompany = user?.role === "company";

  // ── Remote data ──────────────────────────────────────────────────────────
  const [reviews, setReviews]             = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [reviewCount, setReviewCount]     = useState(0);
  const [loading, setLoading]             = useState(true);

  const [myAds, setMyAds]           = useState([]);
  const [adsLoading, setAdsLoading] = useState(!isCompany);

  // ── Profile extra (localStorage) ─────────────────────────────────────────
  // Lazy initializer runs once — no risk of re-reading localStorage on every render.
  const profileKey = `profile_extra_${user?.id}`;
  const [profile, setProfile] = useState(() => ({
    ...EMPTY_EXTRA,
    ...readLocalStorage(profileKey, {}),
  }));
  // draft mirrors profile while editing; discarded on Cancel.
  const [draft, setDraft]       = useState(profile);
  const [editMode, setEditMode] = useState(false);

  const bannerImage = categoryImages[user?.category] || categoryImages.other;

  // ── Data fetching ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setAdsLoading(false);
      return;
    }

    // Fetch reviews and rating in parallel — they are independent requests
    // and can both start at the same time instead of waiting for each other.
    Promise.all([
      fetch(`${API}/users/${user.id}/reviews`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/users/${user.id}/rating`).then(r => r.ok ? r.json() : null),
    ])
      .then(([reviewData, ratingData]) => {
        setReviews(reviewData);
        if (ratingData) {
          setOverallRating(ratingData.average_rating);
          setReviewCount(ratingData.review_count);
        }
      })
      .catch(err => console.error("Failed to load profile data:", err))
      .finally(() => setLoading(false));

    if (!isCompany) {
      fetch(`${API}/ads/mine`, { headers: { Authorization: `Bearer ${user.access_token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(setMyAds)
        .catch(err => console.error("Failed to fetch ads:", err))
        .finally(() => setAdsLoading(false));
    }
  }, [user?.id, isCompany]);

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleEditOpen = () => {
    // Snapshot current saved state into draft so Cancel can cleanly discard changes.
    setDraft({ ...profile, references: [...profile.references], languages: [...profile.languages] });
    setEditMode(true);
  };

  const handleSave = () => {
    setProfile(draft);
    localStorage.setItem(profileKey, JSON.stringify(draft));
    setEditMode(false);
  };

  const handleCancel = () => setEditMode(false);

  // ── Generic list helpers ──────────────────────────────────────────────────
  // All list mutations go through a single setDraft call, keeping draft immutable.
  const updateDraftList = (field, index, value) =>
    setDraft(d => ({ ...d, [field]: d[field].map((item, i) => i === index ? value : item) }));

  const removeDraftItem = (field, index) =>
    setDraft(d => ({ ...d, [field]: d[field].filter((_, i) => i !== index) }));

  const addDraftItem = (field) =>
    setDraft(d => ({ ...d, [field]: [...d[field], ""] }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen w-full mt-15 justify-center bg-[#fafafa] shadow-2xl'>
      <div
        className='h-48 w-full bg-cover bg-center shadow-lg'
        style={{ backgroundImage: `url('${bannerImage}')` }}
      />

      <div className='max-w-6xl mx-auto px-8 text-black'>
        <div className="grid grid-cols-12 gap-12">

          {/* ── Sidebar ── */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 -mt-16">
            <div className="flex flex-col">

              {/* Avatar */}
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-200 mb-4 shadow-sm">
                <img
                  src={user?.profile_image || "https://media.tenor.com/kLddcBbInzwAAAAe/serious-dog.png"}
                  alt={`${user?.first_name} ${user?.last_name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-2xl font-semibold mb-6">
                {user?.first_name} {user?.last_name}
              </h1>

              {/* Manage / Save / Cancel buttons */}
              {!editMode ? (
                <button
                  onClick={handleEditOpen}
                  className="w-full py-2 px-2 bg-gray-200 hover:bg-blue-200 text-slate-700 font-medium rounded transition-colors mb-8"
                >
                  <div className="flex items-center gap-3">
                    <UserRoundCog size={18} /> <span>Manage Profile</span>
                  </div>
                </button>
              ) : (
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Save size={16} /> Save
                    </div>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 px-2 bg-gray-200 hover:bg-gray-300 text-slate-700 font-medium rounded transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X size={16} /> Cancel
                    </div>
                  </button>
                </div>
              )}

              {/* Sidebar info */}
              <div className="space-y-6 text-sm text-slate-600">

                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">About</h2>
                  <div className="space-y-4">

                    {/* Job title — company only */}
                    {isCompany && (
                      <div className="flex items-start gap-3">
                        <Briefcase size={18} className="mt-0.5 shrink-0" />
                        {editMode ? (
                          <input
                            value={draft.job_title}
                            onChange={(e) => setDraft(d => ({ ...d, job_title: e.target.value }))}
                            placeholder="Your job title"
                            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                          />
                        ) : (
                          <span className={profile.job_title ? "text-slate-800" : "text-slate-400"}>
                            {profile.job_title || "Your job title"}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Skills — company only */}
                    {isCompany && (
                      <div className="flex items-start gap-3">
                        <Users size={18} className="mt-0.5 shrink-0" />
                        {editMode ? (
                          <input
                            value={draft.skills}
                            onChange={(e) => setDraft(d => ({ ...d, skills: e.target.value }))}
                            placeholder="Your skills"
                            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                          />
                        ) : (
                          <span className={profile.skills ? "text-slate-800" : "text-slate-400"}>
                            {profile.skills || "Your skills"}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Location — both roles */}
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 shrink-0" />
                      {editMode ? (
                        <input
                          value={draft.location}
                          onChange={(e) => setDraft(d => ({ ...d, location: e.target.value }))}
                          placeholder="Your location"
                          className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                        />
                      ) : (
                        <span className={profile.location ? "text-slate-800" : "text-slate-400"}>
                          {profile.location || "Your location"}
                        </span>
                      )}
                    </div>

                  </div>
                </section>

                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">Contact</h2>
                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    <span className="text-blue-600">{user?.email}</span>
                  </div>
                </section>

                {/* References — company only */}
                {isCompany && (
                  <section>
                    <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">References</h2>
                    <EditableList
                      editMode={editMode}
                      saved={profile.references}
                      draft={draft.references}
                      onUpdate={(i, v) => updateDraftList("references", i, v)}
                      onRemove={(i) => removeDraftItem("references", i)}
                      onAdd={() => addDraftItem("references")}
                      placeholder="Reference name"
                      emptyLabel="No references added"
                    />
                  </section>
                )}

                {/* Languages — both roles */}
                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">Languages</h2>
                  <EditableList
                    editMode={editMode}
                    saved={profile.languages}
                    draft={draft.languages}
                    onUpdate={(i, v) => updateDraftList("languages", i, v)}
                    onRemove={(i) => removeDraftItem("languages", i)}
                    onAdd={() => addDraftItem("languages")}
                    placeholder="Language"
                    emptyLabel="No languages added"
                  />
                </section>

              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 py-8">

            {isCompany ? (
              /* ── Company: Previous Work ── */
              <section className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-lg font-medium">Previous Work</h2>
                    <p className="text-xs text-slate-500">Others will only see what they can access.</p>
                  </div>
                  <button className="text-sm text-blue-600 font-medium hover:underline">View all</button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  {loading ? (
                    <div className="p-4 text-sm text-slate-500">Loading...</div>
                  ) : reviews.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">No completed work yet.</div>
                  ) : (
                    reviews.slice(0, 4).map((review, idx) => (
                      <div
                        key={review.id || idx}
                        className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-4 font-bold text-xs">≡</div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {review.ad_title || "Completed Job"}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {new Date(review.created_at).toLocaleDateString("sv-SE")}
                            </div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                    ))
                  )}
                  <button className="w-full py-3 text-xs text-slate-600 font-medium hover:bg-slate-50 border-t border-slate-100">
                    Show more
                  </button>
                </div>
              </section>
            ) : (
              /* ── Customer: My Ads ── */
              <section className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-lg font-medium">My Ads</h2>
                    <p className="text-xs text-slate-500">Jobs you have posted.</p>
                  </div>
                  <button className="text-sm text-blue-600 font-medium hover:underline">View all</button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  {adsLoading ? (
                    <div className="p-4 text-sm text-slate-500">Loading...</div>
                  ) : myAds.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">You haven't posted any ads yet.</div>
                  ) : (
                    myAds.slice(0, 4).map((ad, idx) => (
                      <div
                        key={ad.id || idx}
                        className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-4 font-bold text-xs">≡</div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">{ad.title}</div>
                            <div className="text-[11px] text-slate-500">
                              {new Date(ad.created_at).toLocaleDateString("sv-SE")}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[ad.status] || ""}`}>
                          {ad.status?.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))
                  )}
                  <button className="w-full py-3 text-xs text-slate-600 font-medium hover:bg-slate-50 border-t border-slate-100">
                    Show more
                  </button>
                </div>
              </section>
            )}

            {/* ── Overall Rating (both roles) ── */}
            <section className="mb-8">
              <h2 className="text-lg font-medium mb-4">Overall Rating</h2>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                {overallRating !== null ? (
                  <div className="flex items-center gap-4">
                    <StarRating rating={Math.round(overallRating)} size={24} />
                    <span className="text-2xl font-bold text-slate-800">{overallRating.toFixed(1)}</span>
                    <span className="text-sm text-slate-500">
                      ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No ratings yet.</p>
                )}
              </div>
            </section>

          </div>
        </div>

        <ProfileReviews userId={user?.id} token={user?.access_token} />
      </div>
    </div>
  );
}

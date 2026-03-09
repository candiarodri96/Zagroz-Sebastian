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

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isCompany = user?.role === "company";

  // Reviews / rating
  const [reviews, setReviews]           = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [reviewCount, setReviewCount]   = useState(0);
  const [loading, setLoading]           = useState(true);

  // Customer ads
  const [myAds, setMyAds]               = useState([]);
  const [adsLoading, setAdsLoading]     = useState(!isCompany);

  // Profile edit
  const profileKey = `profile_extra_${user?.id}`;
  const savedExtra = JSON.parse(localStorage.getItem(profileKey) || "{}");
  const [editMode, setEditMode]         = useState(false);
  const [jobTitle, setJobTitle]         = useState(savedExtra.job_title || "");
  const [skills, setSkills]             = useState(savedExtra.skills || "");
  const [location, setLocation]         = useState(savedExtra.location || "");
  // drafts used while editing so cancel reverts cleanly
  const [draftTitle, setDraftTitle]     = useState(jobTitle);
  const [draftSkills, setDraftSkills]   = useState(skills);
  const [draftLocation, setDraftLocation] = useState(location);

  const bannerImage = categoryImages[user?.category] || categoryImages.other;

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setAdsLoading(false);
      return;
    }
    fetchReviews();
    fetchRating();
    if (!isCompany) fetchMyAds();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API}/users/${user.id}/reviews`);
      if (res.ok) setReviews(await res.json());
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const res = await fetch(`${API}/users/${user.id}/rating`);
      if (res.ok) {
        const data = await res.json();
        setOverallRating(data.average_rating);
        setReviewCount(data.review_count);
      }
    } catch (err) {
      console.error("Failed to fetch rating:", err);
    }
  };

  const fetchMyAds = async () => {
    try {
      const res = await fetch(`${API}/ads/`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (res.ok) setMyAds(await res.json());
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleEditOpen = () => {
    setDraftTitle(jobTitle);
    setDraftSkills(skills);
    setDraftLocation(location);
    setEditMode(true);
  };

  const handleSave = () => {
    setJobTitle(draftTitle);
    setSkills(draftSkills);
    setLocation(draftLocation);
    localStorage.setItem(profileKey, JSON.stringify({
      job_title: draftTitle,
      skills: draftSkills,
      location: draftLocation,
    }));
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

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

                    {/* Job title */}
                    <div className="flex items-start gap-3">
                      <Briefcase size={18} className="mt-0.5 shrink-0" />
                      {editMode ? (
                        <input
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          placeholder="Your job title"
                          className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                        />
                      ) : (
                        <span className={jobTitle ? "text-slate-800" : "text-slate-400"}>
                          {jobTitle || "Your job title"}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex items-start gap-3">
                      <Users size={18} className="mt-0.5 shrink-0" />
                      {editMode ? (
                        <input
                          value={draftSkills}
                          onChange={(e) => setDraftSkills(e.target.value)}
                          placeholder="Your skills"
                          className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                        />
                      ) : (
                        <span className={skills ? "text-slate-800" : "text-slate-400"}>
                          {skills || "Your skills"}
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 shrink-0" />
                      {editMode ? (
                        <input
                          value={draftLocation}
                          onChange={(e) => setDraftLocation(e.target.value)}
                          placeholder="Your location"
                          className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-400"
                        />
                      ) : (
                        <span className={location ? "text-slate-800" : "text-slate-400"}>
                          {location || "Your location"}
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

                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">References</h2>
                  <button className="flex items-center gap-3 text-blue-600 hover:underline">
                    <Plus size={18} /> <span>Add</span>
                  </button>
                </section>

                <section>
                  <h2 className='text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3'>Languages</h2>
                  <button className="flex items-center gap-3 text-blue-600 hover:underline">
                    <Plus size={18} /> <span>Add</span>
                  </button>
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

        <ProfileReviews userId={user?.id} />
      </div>
    </div>
  );
}

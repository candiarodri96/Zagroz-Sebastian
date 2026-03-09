import React from 'react';
import { Briefcase, MapPin, Building, Users, Mail, Plus, UserRoundCog } from 'lucide-react';
import ProfileReviews from "../components/ProfileReviews";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const bannerImage = categoryImages[user?.category] || categoryImages.other;

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetchReviews();
    fetchRating();
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

  return (
    <div className='min-h-screen w-full mt-15 justify-center bg-[#fafafa] shadow-2xl'>
      <div
        className='h-48 w-full bg-cover bg-center shadow-lg'
        style={{ backgroundImage: `url('${bannerImage}')` }}
      />

      <div className='max-w-6xl mx-auto px-8 text-black'>
        <div className="grid grid-cols-12 gap-12">

          {/* Sidebar column */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 -mt-16">
            <div className="flex flex-col">
              {/* Profile image */}
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

              <button className="w-full py-2 px-2 bg-gray-200 hover:bg-blue-200 text-slate-700 font-medium rounded transition-colors mb-8">
                <div className="flex items-center gap-3"><UserRoundCog size={18} /> <span>Manage Profile</span></div>
              </button>

              {/* Sidebar info sections */}
              <div className="space-y-6 text-sm text-slate-600">
                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">About</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><Briefcase size={18} /> <span>Your job title</span></div>
                    <div className="flex items-center gap-3"><Users size={18} /> <span>Your skills</span></div>
                    <div className="flex items-center gap-3"><MapPin size={18} /> <span>Your location</span></div>
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

          {/* Main content column */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 py-8">

            {/* Previous Work */}
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
                      className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
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

            {/* Overall Rating */}
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

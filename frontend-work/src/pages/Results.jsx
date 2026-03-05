import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import ServiceCard from "../components/Card";
import categoryImages from "../utils/categoryImages";

const API = import.meta.env.VITE_API_URL;

export default function Results() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch(`${API}/ads/`);
      const data = await response.json();
      setAds(data);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-24">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-25">
      <div className="flex gap-4 mb-12 justify-center">
        <SearchBar />
      </div>

      {ads.length === 0 && (
        <p className="text-center text-slate-400">No ads posted yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div
            key={ad.id}
            onClick={() => navigate(`/ad/${ad.id}`)}
            className="cursor-pointer"
          >
            <ServiceCard
              image={categoryImages[ad.category] || categoryImages.other}
              title={ad.title}
              location={ad.city}
              author={ad.owner_name}
              description={ad.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
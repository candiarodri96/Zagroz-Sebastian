import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import categoryImages from "../utils/categoryImages";

const categories = [
  { value: "renovation", label: "Renovation" },
  { value: "construction", label: "Construction" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "painting", label: "Painting" },
  { value: "roofing", label: "Roofing" },
  { value: "cleaning", label: "Cleaning" },
  { value: "landscaping", label: "Landscaping" },
  { value: "moving", label: "Moving" },
  { value: "other", label: "Other" },
];

const API = import.meta.env.VITE_API_URL;
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const MAPS_LIBRARIES = ["places"];

function AddressInput({ onChange }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const { suggestions } =
        await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          { input }
        );
      setSuggestions(
        suggestions.map((s) => ({
          placeId: s.placePrediction.placeId,
          text: s.placePrediction.text.text,
        }))
      );
    } catch {
      setSuggestions([]);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setValue(val);
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (text) => {
    setValue(text);
    onChange(text);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
        placeholder="e.g. Sveavägen 12, 111 57"
        value={value}
        onChange={handleInput}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-slate-700 border border-slate-600 rounded-lg mt-1 shadow-lg overflow-hidden">
          {suggestions.map(({ placeId, text }) => (
            <li
              key={placeId}
              className="p-3 hover:bg-slate-600 cursor-pointer text-white text-sm border-b border-slate-600 last:border-0"
              onClick={() => handleSelect(text)}
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.access_token) {
      setError("You must be logged in to create a post");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/ads/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          title,
          description: content,
          category,
          city,
          address: address || null,
          start_date: startDate || null,
          end_date: endDate || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to create post");
        return;
      }

      navigate("/results");
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="max-w-2xl mx-auto px-6 mt-24">
      <h1 className="text-3xl font-bold mb-8">Create a New Ad</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
            placeholder="e.g. Renovera kök i Stockholm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Category</label>
          <select
            className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {category && (
            <div className="mt-3">
              <p className="text-sm text-gray-400 mb-2">This image will be shown on your ad:</p>
              <img
                src={categoryImages[category]}
                alt={category}
                className="w-full h-48 object-cover rounded-lg border border-slate-600"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white h-40 resize-none"
            placeholder="Describe the work in detail..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">City</label>
          <input
            type="text"
            className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
            placeholder="e.g. Stockholm, Gothenburg, Malmö"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Address <span className="text-gray-400 text-xs">(hidden until job is accepted)</span>
          </label>
          {MAPS_KEY ? (
            <AddressInput onChange={setAddress} />
          ) : (
            <input
              type="text"
              className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
              placeholder="e.g. Sveavägen 12, 111 57"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Start Date</label>
            <input
              type="date"
              className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">End Date</label>
            <input
              type="date"
              className="w-full border border-slate-300 p-3 rounded-lg bg-slate-800 text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Posting..." : "Post Ad"}
        </button>
      </form>
    </div>
  );

  if (!MAPS_KEY) return formContent;

  return (
    <LoadScript googleMapsApiKey={MAPS_KEY} libraries={MAPS_LIBRARIES} version="beta">
      {formContent}
    </LoadScript>
  );
}

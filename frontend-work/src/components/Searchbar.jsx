import React, { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Renovation",
  "Construction",
  "Plumbing",
  "Electrical",
  "Painting",
  "Roofing",
  "Cleaning",
  "Landscaping",
  "Moving",
  "Other",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export default function SearchBar({ onFilter }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (q = query, cat = category, sort = sortBy) => {
    onFilter?.({ query: q.trim(), category: cat, sortBy: sort });
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    applyFilters();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    applyFilters(query, val, sortBy);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    applyFilters(query, category, val);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("All Categories");
    setSortBy("newest");
    applyFilters("", "All Categories", "newest");
  };

  const hasActiveFilters =
    query.trim() || category !== "All Categories" || sortBy !== "newest";

  return (
    <div className="w-full max-w-3xl mt-8">
      {/* Main search bar */}
      <form onSubmit={handleSearch}>
        <div className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg focus-within:border-blue-500/50 transition-colors">
          <div className="flex items-center pl-4 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent px-4 py-4 outline-none text-white placeholder-slate-500 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 border-l border-slate-700 transition-colors ${
              showFilters || hasActiveFilters
                ? "text-blue-400 bg-blue-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={20} />
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-semibold text-sm transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 bg-slate-800/80 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white text-sm font-semibold">Filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full appearance-none bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Sort by
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full appearance-none bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
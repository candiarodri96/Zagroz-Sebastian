function SearchBar() {
    return (
        <div className="w-full max-w-3xl mt-8">
          <div className="flex bg-slate-800 rounded-xl overflow-hidden shadow-lg">
            <input
            type="text"
            placeholder="Describe your need of help..."
            className="flex-1 bg-gray-500 px-6 py-4 outline-none text-black-200"
            />
            <button className="bg-white-600 hover:bg-blue-700 text-white px-6 py-4">
            Search
            </button>
          </div>
        </div>
    );
}

export default SearchBar;
function Navbar({ showButtons = true }) {
  return (
    <div className="fixed top-0 left-0 w-full bg-linear-to-r from-blue-500 to-purple-500 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex justify-end gap-8 px-8 py-4 text-sm text-white/80">

        {showButtons && (
          <>
            <button className="hover:text-white transition-colors duration-200">
              Login
            </button>
            <button className="hover:text-white transition-colors duration-200">
              About
            </button>
            <button className="hover:text-white transition-colors duration-200">
              Help
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Navbar;

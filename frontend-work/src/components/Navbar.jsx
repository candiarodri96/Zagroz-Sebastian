import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ showButtons = true, openChat }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAboutClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById("about")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-linear-to-r from-blue-500 to-blue-800 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex justify-end gap-8 px-8 py-4 text-sm text-white/80">

        {showButtons && (
          <>
            <Link
              to="/login"
              className="hover:text-white transition-colors duration-200"
            >
              Login
            </Link>

            <button
              onClick={handleAboutClick}
              className="hover:text-white transition-colors duration-200"
            >
              About
            </button>

            <button
              onClick={openChat}
              className="hover:text-white transition-colors duration-200"
            >
              Help
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Navbar;
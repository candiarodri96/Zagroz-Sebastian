import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  User,
  Building2,
  FileText,
  PlusCircle,
  Search,
  LogOut,
  LogIn,
  UserPlus,
  HelpCircle,
  Info,
  Home,
} from "lucide-react";

function Navbar({ showButtons = true, openChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user?.access_token;
  const role = user?.role;

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleAboutClick = () => {
    setSidebarOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setSidebarOpen(false);
    navigate("/");
  };

  const handleHelp = () => {
    setSidebarOpen(false);
    if (openChat) openChat();
  };

  const SidebarLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );

  const SidebarButton = ({ onClick, icon: Icon, children, variant = "default" }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        variant === "danger"
          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </button>
  );

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-linear-to-r from-blue-500 to-blue-800 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo / Home */}
          <Link to="/" className="text-white font-bold text-lg hover:text-white/90 transition-colors">
            WorkFlow
          </Link>

          {/* Right side — minimal links + menu button */}
          {showButtons && (
            <div className="flex items-center gap-6 text-sm text-white/80">
              {isLoggedIn && role === "company" && (
                <Link to="/results" className="hidden sm:block hover:text-white transition-colors">
                  Browse Ads
                </Link>
              )}

              {isLoggedIn && role === "customer" && (
                <Link to="/my-ads" className="hidden sm:block hover:text-white transition-colors">
                  My Ads
                </Link>
              )}

              {!isLoggedIn && (
                <Link to="/login" className="hidden sm:block hover:text-white transition-colors">
                  Login
                </Link>
              )}

              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white hover:text-white/80 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 bg-gray-950 border-l border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          {isLoggedIn ? (
            <div>
              <p className="text-white font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-slate-400 capitalize">{role} account</p>
            </div>
          ) : (
            <p className="text-white font-semibold">Menu</p>
          )}

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {isLoggedIn ? (
            <>
              {/* Navigation section */}
              <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Navigation
              </p>

              <SidebarLink to="/" icon={Home}>Home</SidebarLink>

              {role === "customer" && (
                <>
                  <SidebarLink to="/my-ads" icon={FileText}>My Ads</SidebarLink>
                  <SidebarLink to="/create" icon={PlusCircle}>Post New Ad</SidebarLink>
                  <SidebarLink to="/results" icon={Search}>Browse Ads</SidebarLink>
                </>
              )}

              {role === "company" && (
                <>
                  <SidebarLink to="/results" icon={Search}>Browse Ads</SidebarLink>
                  <SidebarLink to="/my-offers" icon={FileText}>My Offers</SidebarLink>
                </>
              )}

              {/* Account section */}
              <div className="border-t border-slate-800 mt-4 pt-4">
                <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Account
                </p>

                <SidebarLink to="/profile" icon={role === "company" ? Building2 : User}>
                  Profile
                </SidebarLink>
              </div>

              {/* Support section */}
              <div className="border-t border-slate-800 mt-4 pt-4">
                <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Support
                </p>

                <SidebarButton onClick={handleHelp} icon={HelpCircle}>
                  Help
                </SidebarButton>
                <SidebarButton onClick={handleAboutClick} icon={Info}>
                  About
                </SidebarButton>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-800 mt-4 pt-4">
                <SidebarButton onClick={handleLogout} icon={LogOut} variant="danger">
                  Log out
                </SidebarButton>
              </div>
            </>
          ) : (
            <>
              {/* Not logged in */}
              <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Navigation
              </p>

              <SidebarLink to="/" icon={Home}>Home</SidebarLink>
              <SidebarLink to="/results" icon={Search}>Browse Ads</SidebarLink>

              <div className="border-t border-slate-800 mt-4 pt-4">
                <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Account
                </p>

                <SidebarLink to="/login" icon={LogIn}>Log in</SidebarLink>
                <SidebarLink to="/register" icon={UserPlus}>Create account</SidebarLink>
              </div>

              <div className="border-t border-slate-800 mt-4 pt-4">
                <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Support
                </p>

                <SidebarButton onClick={handleHelp} icon={HelpCircle}>
                  Help
                </SidebarButton>
                <SidebarButton onClick={handleAboutClick} icon={Info}>
                  About
                </SidebarButton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
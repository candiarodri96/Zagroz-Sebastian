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
  Bell,
  MessageSquare,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function Navbar({ showButtons = true, openChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const sidebarRef = useRef(null);
  const notifRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user?.access_token;
  const role = user?.role;

  // Fetch unread count
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(`${API}/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${user.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch {}
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Fetch notifications when bell clicked
  const toggleNotifications = async () => {
    if (!notifOpen) {
      try {
        const res = await fetch(`${API}/notifications/`, {
          headers: { Authorization: `Bearer ${user.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch {}
    }
    setNotifOpen(!notifOpen);
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);
    setNotifOpen(false);

    if (notif.ad_id) {
      if (["new_message", "offer_selected"].includes(notif.type)) {
        navigate(`/chat/${notif.ad_id}`);
      } else if (["contract_created", "contract_signed", "contract_completed"].includes(notif.type)) {
        navigate(`/contract/${notif.ad_id}`);
      } else if (notif.type === "new_offer") {
        navigate("/my-ads");
      } else {
        navigate(`/ad/${notif.ad_id}`);
      }
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    if (sidebarOpen || notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, notifOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
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

  const notifIcon = (type) => {
    switch (type) {
      case "new_offer": return "💰";
      case "offer_selected": return "✅";
      case "new_message": return "💬";
      case "contract_created": return "📄";
      case "contract_signed": return "✍️";
      case "contract_completed": return "🎉";
      case "negotiation_failed": return "❌";
      case "contract_cancelled": return "🚫";
      default: return "🔔";
    }
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
          <Link to="/" className="text-white font-bold text-lg hover:text-white/90 transition-colors">
            WorkFlow
          </Link>

          {showButtons && (
            <div className="flex items-center gap-4 text-sm text-white/80">
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

              {/* Notification bell */}
              {isLoggedIn && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative text-white hover:text-white/80 transition-colors"
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                        <p className="text-white font-semibold text-sm">Notifications</p>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-blue-400 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                          <p className="text-center text-slate-500 py-8 text-sm">
                            No notifications yet
                          </p>
                        )}

                        {notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full text-left px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${
                              !notif.is_read ? "bg-blue-500/5" : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <span className="text-lg">{notifIcon(notif.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notif.is_read ? "text-white font-medium" : "text-slate-400"}`}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-slate-600 mt-1">
                                  {new Date(notif.created_at).toLocaleString()}
                                </p>
                              </div>
                              {!notif.is_read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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

        <div className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {isLoggedIn ? (
            <>
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

              <div className="border-t border-slate-800 mt-4 pt-4">
                <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Account
                </p>
                <SidebarLink to="/profile" icon={role === "company" ? Building2 : User}>
                  Profile
                </SidebarLink>
              </div>

              <div className="border-t border-slate-800 mt-4 pt-4">
                <p className="px-4 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Support
                </p>
                <SidebarButton onClick={handleHelp} icon={HelpCircle}>Help</SidebarButton>
                <SidebarButton onClick={handleAboutClick} icon={Info}>About</SidebarButton>
              </div>

              <div className="border-t border-slate-800 mt-4 pt-4">
                <SidebarButton onClick={handleLogout} icon={LogOut} variant="danger">
                  Log out
                </SidebarButton>
              </div>
            </>
          ) : (
            <>
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
                <SidebarButton onClick={handleHelp} icon={HelpCircle}>Help</SidebarButton>
                <SidebarButton onClick={handleAboutClick} icon={Info}>About</SidebarButton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
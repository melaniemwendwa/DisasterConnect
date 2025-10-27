import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';
import { FaUserCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdLogout, MdEmail } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileExpanded, setProfileExpanded] = useState(false);

  const menuItems = [
    { path: "/home", label: "Home"},
    { path: "/report", label: "Report" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#224266] text-white h-screen p-6 flex flex-col sticky top-0 overflow-y-auto">
      {/* Logo and Brand */}
      <div className="flex items-center mb-10">
        <img src={logo} alt="Logo" className="h-10 mr-3" />
        <h1 className="font-bold text-xl">DisasterConnect</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-white text-[#224266] font-semibold"
                    : "hover:bg-[#2d5580] text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Section */}
      {user ? (
        <div className="mt-auto pt-6 border-t border-[#2d5580]">
          <div className="bg-[#2d5580] rounded-lg overflow-hidden">
            {/* Profile Toggle Button */}
            <button
              onClick={() => setProfileExpanded(!profileExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#3a6698] transition"
            >
              <div className="flex items-center space-x-3">
                <FaUserCircle className="text-3xl" />
                <div className="text-left">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-300">View Profile</p>
                </div>
              </div>
              {profileExpanded ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {/* Expanded Profile Details */}
            {profileExpanded && (
              <div className="bg-[#1d3756] px-4 py-3 space-y-3">
                {/* Email */}
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MdEmail className="text-lg" />
                  <p className="truncate">{user.email}</p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
                >
                  <MdLogout className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-6 border-t border-[#2d5580]">
          <Link
            to="/login"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-white text-[#224266] rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            <FaUserCircle className="text-xl" />
            <span>Login</span>
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4">
        <p className="text-xs text-gray-400 text-center">
          © 2025 DisasterConnect
        </p>
      </div>
    </aside>
  );
}

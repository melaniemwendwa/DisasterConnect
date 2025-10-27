import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { MdLogout, MdEmail } from "react-icons/md";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#224266] text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-8 mr-2" />
        <h1 className="font-bold text-lg">DisasterConnect</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/home" className="hover:text-gray-300 transition">Home</Link>
        <Link to="/report" className="hover:text-gray-300 transition">Report</Link>
        <Link to="/dashboard" className="hover:text-gray-300 transition">Dashboard</Link>
        
        {/* Profile Dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 hover:text-gray-300 transition focus:outline-none"
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden md:inline">{user.username}</span>
              <FaChevronDown className={`text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">{user.username}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <MdEmail className="mr-1" />
                    <p>{user.email}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center space-x-2 text-red-600 font-medium"
                >
                  <MdLogout className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
        )}
      </div>
    </nav>
  );
}
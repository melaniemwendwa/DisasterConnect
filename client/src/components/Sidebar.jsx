import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/home", label: "Home"},
    { path: "/report", label: "Report" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/login", label: "Profile"},
  ];

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

      {/* Footer Section */}
      <div className="mt-auto pt-6 border-t border-[#2d5580]">
        <p className="text-sm text-gray-300 text-center">
          © 2025 DisasterConnect
        </p>
      </div>
    </aside>
  );
}

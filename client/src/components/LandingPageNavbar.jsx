import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function LandingNavbar() {
  return (
    <nav className="bg-[#224266] text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo / App Name */}
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-semibold">Disaster Connect</h1>
        </div>

        {/* Right links */}
        <div className="space-x-6">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link
            to="/signup"
            className="border border-white px-3 py-1 rounded hover:bg-white hover:text-[#224266] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;


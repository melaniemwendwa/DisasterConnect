import { Link } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <nav className="bg-[#224266] text-white p-4 flex justify-between">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-8 mr-2" />
        <h1 className="font-bold text-lg">DisasterConnect</h1>
      </div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/report">Report</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Profile</Link>
      </div>
    </nav>
  );
}
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import DonationForm from "./pages/DonationForm";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ReportDetail  from "./pages/ReportDetail";
import EditReport from "./pages/EditReport";

function AppContent() {
  const location = useLocation();

  const showFooterPaths = ["/", "/report", "/home", "/donate"];
  const showNavbarPaths = ["/report", "/home", "/donate"];
  const isDashboardPath = location.pathname === "/dashboard";

  const shouldShowFooter = showFooterPaths.includes(location.pathname);
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  // If it's the dashboard path, use DashboardLayout
  if (isDashboardPath) {
    return (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/reports/:id/edit" element={<EditReport />} />
        </Routes>
      </main>

    
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



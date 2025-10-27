// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPageNavbar from "./components/LandingPageNavbar";
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
import AboutUs from "./pages/AboutUs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ResetPassword from "./pages/ResetPassword";
function AppContent() {
  const location = useLocation();

  const showFooterPaths = ["/", "/report", "/home", "/donate", "/about"];
  const showNavbarPaths = ["/report", "/home", "/donate"];
  const isDashboardPath = location.pathname === "/dashboard";
  const isAdminDashboardPath = location.pathname === "/admin/dashboard";
  const isAdminLoginPath = location.pathname === "/admin/login";
  const isReportDetailPath = location.pathname.startsWith("/reports/");
  const isAboutPath = location.pathname === "/about";
  const shouldShowFooter = showFooterPaths.includes(location.pathname);
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  // If it's the admin login path, render without layout
  if (isAdminLoginPath) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AdminLogin />
        </main>
      </div>
    );
  }

  // If it's the admin dashboard path, render without layout
  if (isAdminDashboardPath) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  // If it's the dashboard path, use DashboardLayout
  if (isDashboardPath) {
    return (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    );
  }

  // If it's a report detail or edit path, render without navbar/footer
  if (isReportDetailPath) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/reports/:id/edit" element={<EditReport />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isAboutPath && <LandingPageNavbar />}
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
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



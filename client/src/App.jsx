// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppContent() {
  const location = useLocation();

  const showFooterPaths = ["/", "/report", "/home"];
  const showNavbarPaths = ["/report", "/home"];

  const shouldShowFooter = showFooterPaths.includes(location.pathname);
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/home" element={<Home />} />
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



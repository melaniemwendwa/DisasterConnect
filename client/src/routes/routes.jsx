import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx"; 
import Dashboard from "../pages/Dashboard.jsx";
import ReportForm from "../pages/ReportForm.jsx";
import DonationForm from "../pages/DonationForm.jsx";
import Signup from "../pages/Signup.jsx";
import LandingPage from "../pages/Landingpage.jsx";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";
import EditReport from "../pages/EditReport.jsx";
import ReportDetail from "../pages/ReportDetail.jsx"
import EditReport from "../pages/EditReport.jsx";


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/reports/:id",
        element: (
          <ProtectedRoute>
            <ReportDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ReportForm",
        element: (
          <ProtectedRoute>
            <ReportForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/donate",
        element: <DonationForm />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/reports/:id/edit",
        element:(
          <ProtectedRoute>
            <EditReport/>
          </ProtectedRoute>
        )
      }
    ]
  }
];

export default routes;
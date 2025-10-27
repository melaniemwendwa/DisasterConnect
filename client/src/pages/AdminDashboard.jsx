import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api, { BASE_URL } from "../Services/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const response = await Api.get("/admin/check-session");
      setAdmin(response.data);
      fetchStats();
    } catch (error) {
      console.error("Not authenticated as admin:", error);
      navigate("/admin/login");
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/admin/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/admin/donations");
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This will also delete all their reports.")) {
      try {
        await Api.delete(`/admin/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
        fetchStats(); // Refresh stats
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.response?.data?.error || "Failed to delete user");
      }
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await Api.delete(`/admin/reports/${id}`);
        setReports(reports.filter((r) => r.id !== id));
        fetchStats(); // Refresh stats
      } catch (error) {
        console.error("Error deleting report:", error);
        alert(error.response?.data?.error || "Failed to delete report");
      }
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await Api.delete(`/admin/donations/${id}`);
        setDonations(donations.filter((d) => d.id !== id));
        fetchStats(); // Refresh stats
      } catch (error) {
        console.error("Error deleting donation:", error);
        alert(error.response?.data?.error || "Failed to delete donation");
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "users" && users.length === 0) fetchUsers();
    if (tab === "reports" && reports.length === 0) fetchReports();
    if (tab === "donations" && donations.length === 0) fetchDonations();
  };

  const handleLogout = async () => {
    try {
      await Api.delete("/admin/logout");
      localStorage.removeItem('admin');
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/admin/login");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "bg-red-100 text-red-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "minor":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, reports, and donations</p>
        </div>
        <div className="flex items-center gap-4">
          {admin && (
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{admin.username}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_users}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm font-medium">Total Reports</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_reports}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
            <p className="text-gray-500 text-sm font-medium">Total Donations</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_donations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <p className="text-gray-500 text-sm font-medium">Severe</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.severe_reports}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-medium">Moderate</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.moderate_reports}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-medium">Minor</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.minor_reports}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => handleTabChange("stats")}
            className={`px-6 py-3 font-medium ${
              activeTab === "stats"
                ? "border-b-2 border-[#224266] text-[#224266]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`px-6 py-3 font-medium ${
              activeTab === "users"
                ? "border-b-2 border-[#224266] text-[#224266]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleTabChange("reports")}
            className={`px-6 py-3 font-medium ${
              activeTab === "reports"
                ? "border-b-2 border-[#224266] text-[#224266]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => handleTabChange("donations")}
            className={`px-6 py-3 font-medium ${
              activeTab === "donations"
                ? "border-b-2 border-[#224266] text-[#224266]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Donations
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-xl">Loading...</div>
            </div>
          ) : (
            <>
              {/* Statistics Tab */}
              {activeTab === "stats" && stats && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">System Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">User Statistics</h3>
                      <p className="text-gray-600">Total Users: <span className="font-bold">{stats.total_users}</span></p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Report Statistics</h3>
                      <p className="text-gray-600">Total Reports: <span className="font-bold">{stats.total_reports}</span></p>
                      <p className="text-gray-600">Severe: <span className="font-bold text-red-600">{stats.severe_reports}</span></p>
                      <p className="text-gray-600">Moderate: <span className="font-bold text-yellow-600">{stats.moderate_reports}</span></p>
                      <p className="text-gray-600">Minor: <span className="font-bold text-green-600">{stats.minor_reports}</span></p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Donation Statistics</h3>
                      <p className="text-gray-600">Total Donations: <span className="font-bold">{stats.total_donations}</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">User</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">All Reports</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reports.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{r.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(r.severity)}`}>
                                {r.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.reporter_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button
                                onClick={() => navigate(`/reports/${r.id}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteReport(r.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Donations Tab */}
              {activeTab === "donations" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">All Donations</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donation Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disaster Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {donations.map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.amount}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {d.report_type ? (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {d.report_type}
                                </span>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={d.report_location}>
                              {d.report_location || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDeleteDonation(d.id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

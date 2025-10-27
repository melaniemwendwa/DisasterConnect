import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api, { BASE_URL } from "../Services/api";
import { useAuth } from "../context/AuthContext";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdCreate } from "react-icons/md";
import { FaDonate } from "react-icons/fa"; 
import { FaExclamationCircle } from "react-icons/fa"; 
import { FaLocationDot } from "react-icons/fa6";
import { PiCalendarDotsThin } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { MdDescription } from "react-icons/md"; 





export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
    // Debug: Check user object
    console.log("Current user:", user);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/reports/my-reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      if (error.response?.status === 401) {
        // User not logged in, redirect to login
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await Api.delete(`/reports/${id}`);
        setReports(reports.filter((report) => report.id !== id));
      } catch (error) {
        console.error("Error deleting report:", error);
        const errorMsg = error.response?.data?.error || "Failed to delete report";
        alert(errorMsg);
      }
    }
  };

  // Check if current user owns the report
  const canModifyReport = (report) => {
    const canModify = user && report.user_id === user.id;
    console.log("Checking ownership:", {
      hasUser: !!user,
      userId: user?.id,
      userIdType: typeof user?.id,
      reportUserId: report.user_id,
      reportUserIdType: typeof report.user_id,
      match: user?.id === report.user_id,
      canModify: canModify
    });
    return canModify;
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "bg-red-100 text-red-800 border-red-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "minor":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Build proper image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http') || image.startsWith('//')) {
      return image;
    }
    // Images are served from Flask at /uploads/<filename>
    // With Vite proxy, we need to use /api/uploads/<filename>
    if (image.startsWith('/uploads/')) {
      return `/api${image}`;
    } else if (image.startsWith('/')) {
      return `/api${image}`;
    } else {
      return `/api/${image}`;
    }
  };

  // Separate reports into created and donated
  const createdReports = reports.filter((report) => report.user_id === user?.id);
  const donatedReports = reports.filter((report) => report.user_id !== user?.id);

  // Apply filter to both categories
  const filteredCreatedReports = createdReports.filter((report) => {
    if (filter === "all") return true;
    return report.severity?.toLowerCase() === filter.toLowerCase();
  });

  const filteredDonatedReports = donatedReports.filter((report) => {
    if (filter === "all") return true;
    return report.severity?.toLowerCase() === filter.toLowerCase();
  });

  const stats = {
    total: reports.length,
    created: createdReports.length,
    donated: donatedReports.length,
    severe: reports.filter((r) => r.severity?.toLowerCase() === "severe").length,
    moderate: reports.filter((r) => r.severity?.toLowerCase() === "moderate").length,
    minor: reports.filter((r) => r.severity?.toLowerCase() === "minor").length,
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Dashboard</h1>
        <p className="text-gray-600">View and manage your disaster reports and donations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Reports</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl"><LiaClipboardListSolid /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Created</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.created}</p>
            </div>
            <div className="text-4xl text-blue-500"><MdDescription /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Donated</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.donated}</p>
            </div>
            <div className="text-4xl" ><FaDonate /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Severe</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.severe}</p>
            </div>
            <div className="text-4xl text-red-500"><FaExclamationCircle /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Moderate</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.moderate}</p>
            </div>
            <div className="text-4xl text-yellow-500"><FaExclamationCircle /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Minor</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.minor}</p>
            </div>
            <div className="text-4xl text-green-500"><FaExclamationCircle /></div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Filter by severity:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-[#224266] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("severe")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "severe"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Severe
          </button>
          <button
            onClick={() => setFilter("moderate")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "moderate"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Moderate
          </button>
          <button
            onClick={() => setFilter("minor")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "minor"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Minor
          </button>
        </div>
      </div>

      {/* Reports Sections */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-xl">Loading reports...</div>
        </div>
      ) : (
        <>
          {/* My Created Reports Section */}
          {filteredCreatedReports.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Reports</h2>
                <p className="text-gray-600">Reports you have created</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreatedReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Section */}
              {report.image && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={getImageUrl(report.image)}
                    alt={report.type}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 capitalize">
                    {report.type}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                      report.severity
                    )}`}
                  >
                    {report.severity}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {report.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <span className="mr-2 text-blue-500"><FaLocationDot /></span>
                    <span className="font-medium">{report.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="mr-2">👤</span>
                    <span>{report.reporter_name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="mr-2 text-blue-400"><PiCalendarDotsThin /></span>
                    <span>
                      {new Date(report.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/reports/${report.id}`)}
                    className="flex-1 bg-[#224266] text-white py-2 rounded-lg hover:bg-[#2d5580] transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  {canModifyReport(report) && (
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="px-4 bg-white-500 text-white-500 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      title="Delete report"
                    >
                      <FaTrash />

                    </button>
                  )}
                </div>
              </div>
            </div>
                ))}
              </div>
            </div>
          )}

          {/* Donated Incidents Section */}
          {filteredDonatedReports.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Donated Incidents</h2>
                <p className="text-[#224266]-600">Reports you have donated to</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image Section */}
                    {report.image && (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={getImageUrl(report.image)}
                          alt={report.type}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800 capitalize">
                          {report.type}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                            report.severity
                          )}`}
                        >
                          {report.severity}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {report.description}
                      </p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <span className="mr-2">📍</span>
                          <span className="font-medium">{report.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <span className="mr-2">👤</span>
                          <span>{report.reporter_name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <span className="mr-2">📅</span>
                          <span>
                            {new Date(report.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/reports/${report.id}`)}
                          className="flex-1 bg-[#224266] text-white py-2 rounded-lg hover:bg-[#2d5580] transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Reports Message */}
          {filteredCreatedReports.length === 0 && filteredDonatedReports.length === 0 && (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Reports Found
              </h3>
              <p className="text-gray-500">
                There are no reports matching your filter criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

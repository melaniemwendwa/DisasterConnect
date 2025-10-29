// src/pages/reportdetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api, { BASE_URL } from "../Services/api";
import { useAuth } from "../context/AuthContext";

// Update these helpers to match your app's routes if different
const EDIT_ROUTE = (id) => `/reports/${id}/edit`; // e.g., '/reports/:id/edit' => (id) => `/reports/${id}/edit`
const DONATE_ROUTE = (id) => `/donate?reportId=${id}`; // navigates to donation form with optional reportId

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await Api.get(`/reports/${id}`);
        if (!mounted) return;
        setReport(res?.data || null);
      } catch (e) {
        if (!mounted) return;
        setErr("Failed to load report.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const imageUrl = useMemo(() => {
    const src = report?.image || report?.image_url || "";
    if (!src) return "";
    // If it's already a full URL (Cloudinary or full backend URL), use as-is
    if (src.startsWith("http") || src.startsWith("//")) return src;
    // For relative paths, prepend the backend URL
    if (src.startsWith("/")) return `${BASE_URL}${src}`;
    return `${BASE_URL}/${src}`;
  }, [report]);

  const title = useMemo(() => {
    if (!report) return "";
    if (report.title) return report.title;
    if (report.type && report.location) return `${report.type} in ${report.location}`;
    return "Report";
  }, [report]);

  const severity = (report?.severity || "High");

  // Check if current user owns the report
  const canEditReport = useMemo(() => {
    return user && report && report.user_id === user.id;
  }, [user, report]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-72 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-red-600">
        {err}
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8">
      {/* Header and actions */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reported by {report.reporter_name || "Anonymous"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-slate-700 border-slate-300 hover:bg-slate-50"
          >
            Back
          </button>
          {canEditReport && (
            <button
              onClick={() => navigate(EDIT_ROUTE(id))}
              className="inline-flex items-center rounded-md bg-[#224266] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1d3756]"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Main layout: content + sidebar - always side by side */}
      <div className="flex gap-4 md:gap-8">
        {/* Left: content - takes remaining space */}
        <div className="flex-1 min-w-0">
          {/* Hero image */}
          {imageUrl ? (
            <div className="w-full overflow-hidden rounded-md shadow-sm">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-[620px] object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-[420px] bg-gray-100 rounded-md" />
          )}

          {/* Severity */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Severity</h3>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                {/* warning triangle */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 2c.35 0 .68.18.86.49l9.02 15.6c.36.62-.09 1.41-.86 1.41H2.98c-.77 0-1.22-.79-.86-1.41l9.02-15.6c.18-.31.51-.49.86-.49zm0 6a1 1 0 00-1 1v4a1 1 0 002 0V9a1 1 0 00-1-1zm0 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                </svg>
              </span>
              <span className="text-sm font-medium text-red-700">
                {severity}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Description</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 max-w-3xl">
              {report.description || "No description provided."}
            </p>
          </div>

          {/* Primary action */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate(DONATE_ROUTE(id))}
              className="inline-flex items-center rounded-md bg-[#224266] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d3756] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#224266]"
            >
              Donate
            </button>
          </div>
        </div>

        {/* Right: sidebar donations - fixed width, always on right */}
        <aside className="w-[240px] md:w-[280px] lg:w-[320px] flex-shrink-0">
          <h2 className="text-base font-semibold text-slate-800">Donations</h2>
          <ul className="mt-4 space-y-4">
            {(report.donations || []).map((d, idx) => (
              <li key={idx} className="text-sm text-slate-700">
                <span className="font-medium">
                  {d.name || d.full_name || d.donor_name || "Donor"}
                </span>
                <span className="text-slate-500">
                  {" - "}
                  {d.type || d.category || d.kind || "Donation"}
                </span>
              </li>
            ))}
            {!report.donations?.length && (
              <li className="text-sm text-slate-500">No donations yet.</li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Api, { BASE_URL } from "../Services/api";

const validationSchema = Yup.object({
  reporter_name: Yup.string()
    .min(3, "Reporter name must be at least 3 characters")
    .required("Reporter name is required"),
  type: Yup.string().required("Disaster type is required"),
  location: Yup.string().required("Location is required"),
  date: Yup.date().nullable(),
  description: Yup.string()
    .min(10, "Description should be at least 10 characters")
    .required("Description is required"),
});

export default function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await Api.get(`/reports/${id}`);
        const r = res.data;

        // Normalize date for <input type="date">
        const dateStr = r.date ? new Date(r.date).toISOString().slice(0, 10) : "";

        const ivals = {
          reporter_name: r.reporter_name || "Anonymous",
          type: r.type || "",
          location: r.location || "",
          date: dateStr,
          description: r.description || "",
          image: r.image || "", // preview only, not editable here
        };
        if (mounted) setInitialValues(ivals);
      } catch (e) {
        if (mounted) setErr("Failed to load report.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        reporter_name: values.reporter_name,
        type: values.type,
        location: values.location,
        date: values.date || null, // server should parse "YYYY-MM-DD" to date/datetime
        description: values.description,
        // image change not handled here (PATCH is JSON)
      };

      await Api.patch(`/reports/${id}`, payload);
      navigate(`/reports/${id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to update report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700">Loading...</div>
      </div>
    );
  }

  if (err || !initialValues) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{err || "Could not load report."}</div>
      </div>
    );
  }

  const previewSrc =
    typeof initialValues.image === "string" && initialValues.image
      ? (initialValues.image.startsWith("http")
          ? initialValues.image
          : `${BASE_URL}${initialValues.image}`)
      : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#224266]">Edit Report</h1>
          <div className="flex w-full md:w-auto justify-between md:justify-end gap-3">
            <button
              onClick={() => navigate(`/reports/${id}`)}
              className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const form = document.getElementById("edit-report-form");
                if (form) form.requestSubmit();
              }}
              className="px-5 py-2 rounded-lg bg-[#224266] text-white hover:bg-[#1d3756]"
            >
              Save
            </button>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form id="edit-report-form" className="space-y-5">
              <div>
                <label className="block font-medium">Reporter</label>
                <Field
                  name="reporter_name"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="Enter reporter name"
                />
                <ErrorMessage name="reporter_name" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Disaster Type</label>
                <Field as="select" name="type" className="w-full border rounded-lg p-2 mt-1">
                  <option value="">Select type</option>
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Fire">Fire</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Drought">Drought</option>
                  <option value="Locust">Locust invasion</option>
                </Field>
                <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Location</label>
                <Field
                  name="location"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="Enter location"
                />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Date</label>
                <Field name="date" type="date" className="w-full border rounded-lg p-2 mt-1" />
                <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="5"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              {previewSrc && (
                <div>
                  <label className="block font-medium mb-2">Current Image</label>
                  <img
                    src={previewSrc}
                    alt="Current"
                    className="w-full h-100 object-cover rounded-xl border"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Image change is not supported in this form.
                  </p>
                </div>
              )}

              {/* Hidden submit so the top Save button can trigger form submission */}
              <button type="submit" disabled={isSubmitting} className="hidden">
                Save
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
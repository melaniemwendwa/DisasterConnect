import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Api, { BASE_URL } from "../Services/api";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await Api.get(`/reports/${id}`);
        const r = res.data;

        // Authorization check: only the creator can edit
        if (user && r.user_id !== user.id) {
          if (mounted) {
            setErr("You are not authorized to edit this report.");
            setLoading(false);
          }
          return;
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // If there's a new image, use FormData; otherwise use JSON
      if (newImage) {
        const formData = new FormData();
        formData.append('reporter_name', values.reporter_name);
        formData.append('type', values.type);
        formData.append('location', values.location);
        formData.append('date', values.date || '');
        formData.append('description', values.description);
        formData.append('image', newImage);

        await Api.patch(`/reports/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const payload = {
          reporter_name: values.reporter_name,
          type: values.type,
          location: values.location,
          date: values.date || null,
          description: values.description,
        };
        await Api.patch(`/reports/${id}`, payload);
      }

      navigate(`/reports/${id}`, { replace: true });
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.error || "Failed to update report";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveNewImage = () => {
    setNewImage(null);
    setImagePreview(null);
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-red-600 text-xl mb-4">{err || "Could not load report."}</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-[#224266] text-white rounded-lg hover:bg-[#1d3756]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const existingImageUrl =
    typeof initialValues.image === "string" && initialValues.image
      ? (initialValues.image.startsWith("http")
          ? initialValues.image
          : `/api${initialValues.image}`)
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

              {/* Image Upload Section */}
              <div>
                <label className="block font-medium mb-2">Image</label>
                
                {/* Show new image preview if selected, otherwise show current image */}
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="New preview"
                      className="w-full h-500 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveNewImage}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Remove New Image
                    </button>
                    <p className="text-sm text-green-600 mt-2">✓ New image selected</p>
                  </div>
                ) : existingImageUrl ? (
                  <div>
                    <img
                      src={existingImageUrl}
                      alt="Current"
                      className="w-full h-64 object-cover rounded-xl border mb-3"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
                      }}
                    />
                    <p className="text-sm text-gray-500 mb-3">Current image</p>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-xl border mb-3 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* Upload new image button */}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg border border-[#224266] text-[#224266] hover:bg-[#224266] hover:text-white transition"
                  >
                    {imagePreview ? 'Change Image' : 'Upload New Image'}
                  </label>
                  {imagePreview && (
                    <span className="text-sm text-gray-600">{newImage?.name}</span>
                  )}
                </div>
              </div>

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
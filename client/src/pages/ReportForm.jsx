import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import background from "../assets/backround image.png";

export default function ReportForm() {
  const [message, setMessage] = useState("");


  const validationSchema = Yup.object({
    reporter_name: Yup.string()
      .min(3, "Reporter name must be at least 3 characters")
      .required("Reporter name is required"),
    type: Yup.string().required("Disaster type is required"),
    location: Yup.string().required("Location is required"),
    date: Yup.date().required("Date is required"),
    description: Yup.string()
      .min(10, "Description should be at least 10 characters")
      .required("Description is required"),
    image: Yup.mixed().required("Please upload an image"),
  });

  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const response = await fetch("http://127.0.0.1:5555/reports", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Report submitted successfully!");
        resetForm();
      } else {
        setMessage(" Failed to submit report. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(" Something went wrong. Please try again.");
    }
  };

  return (
    
    <div
      className="flex flex-col items-center justify-center py-8 text-white px-4"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: 'calc(100vh - 200px)'
      }}
    >

      {/* card with slight backdrop so the form is readable over the image */}
  <div className="w-full max-w-md md:max-w-2xl bg-white/90 text-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-sm">
        <img />
        <h2 className="text-2xl font-bold text-left mb-6 text-[#224266]">
          Report a Disaster
        </h2>

        <Formik
          initialValues={{
            reporter_name: "",
            type: "",
            location: "",
            date: "",
            description: "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block font-medium">Reporter Name</label>
                <Field
                  name="reporter_name"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="reporter_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              
              <div>
                <label className="block font-medium">Disaster Type</label>
                <Field
                  as="select"
                  name="type"
                  className="w-full border rounded-lg p-2 mt-1"
                >
                  <option value="">Select type</option>
                  <option value="Flood">Flood</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Fire">Fire</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Drought">Drought</option>
                  <option value="Locust">Locust invasion </option>

                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              
              <div>
                <label className="block font-medium">Location</label>
                <Field
                  name="location"
                  type="text"
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="Enter location"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

            
              <div>
                <label className="block font-medium">Date</label>
                <Field
                  name="date"
                  type="date"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              
              <div>
                <label className="block font-medium">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              
              <div className="mb-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-4 bg-gray-50">
                <div className="w-full text-center">
                  <span className="block text-lg font-semibold mb-2">Upload images</span>
                  <span className="block text-gray-600 mb-4">Drag and drop or click to upload images</span>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  id="image-upload-input"
                  onChange={(event) =>
                    setFieldValue("image", event.currentTarget.files[0])
                  }
                />
                <button
                  type="button"
                  className="bg-[#224266] hover:bg-[#1d3756] text-white font-semibold py-2 px-4 rounded-lg mb-2"
                  onClick={() => document.getElementById('image-upload-input').click()}
                >
                  Upload 
                </button>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#224266] hover:bg-[#1d3756] text-white font-semibold py-2 px-6 rounded-[8px] transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit "}
                </button>
              </div>
            </Form>
          )}
        </Formik>

    
        {message && (
          <p className="mt-4 text-center font-medium text-blue-800">{message}</p>
        )}
      </div>
    </div>
  );
}


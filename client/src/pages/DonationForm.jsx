import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSearchParams, useNavigate } from "react-router-dom";
import background from "../assets/backround image.png";
import Api from "../Services/api";

export default function DonationForm() {
	const [params] = useSearchParams();
	const reportId = params.get("reportId");
	const navigate = useNavigate();
	const [message, setMessage] = useState("");

	const validationSchema = Yup.object({
		full_name: Yup.string()
			.min(3, "Full name must be at least 3 characters")
			.required("Full name is required"),
		email: Yup.string().email("Invalid email").required("Email is required"),
		phone: Yup.string()
			.matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
			.required("Phone number is required"),
		type: Yup.string().required("Donation type is required"),
		amount: Yup.string()
			.required("Amount is required")
			.test(
				"valid-amount",
				"Amount must be a positive number or a non-empty text description",
				(value) => {
					if (!value) return false;
					// allow numeric values (e.g., 100, 100.50)
					const cleaned = String(value).replace(/,/g, "");
					const n = Number(cleaned);
					if (!isNaN(n)) return n > 0;
					// allow any non-empty text (words)
					return String(value).trim().length > 0;
				}
			),
	});

	const handleSubmit = async (values, { resetForm }) => {
		try {
			// keep amount as provided (string). If it's numeric, also include amount_number for backend
			const cleaned = String(values.amount).replace(/,/g, "");
			const parsed = Number(cleaned);
			const amount_number = !isNaN(parsed) && isFinite(parsed) ? parsed : null;
			const payload = { ...values, amount: String(values.amount), amount_number };

			// If reportId is present, POST to /reports/:id/donations; otherwise fallback to /donations
			const endpoint = reportId ? `/reports/${reportId}/donations` : "/donations";
			const res = await Api.post(endpoint, payload, {
				headers: { "Content-Type": "application/json" },
			});

			if (res.status === 201 || res.status === 200) {
				setMessage("Donation submitted successfully!");
				resetForm();
				// Navigate back to report detail if reportId exists
				if (reportId) {
					setTimeout(() => navigate(`/reports/${reportId}`), 1500);
				}
			} else {
				setMessage("Failed to submit donation. Try again.");
			}
		} catch (err) {
			console.error("Donation error:", err);
			setMessage("Something went wrong. Please try again.");
		}
	};

	return (
		<div
			className="flex flex-col items-center justify-center py-8 text-white px-4"
			style={{
				backgroundImage: `url(${background})`,
				backgroundPosition: "center",
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				minHeight: "calc(100vh - 200px)",
			}}
		>
			<div className="w-full max-w-md md:max-w-2xl bg-white/90 text-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-sm">
				<h2 className="text-2xl font-bold text-left mb-6 text-[#224266]">
					Make a Donation
				</h2>

				<Formik
					initialValues={{
						full_name: "",
						email: "",
						phone: "",
						type: "",
						amount: "",
					}}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting }) => (
						<Form className="space-y-4">
							<div>
								<label className="block font-medium">Full Name</label>
								<Field
									name="full_name"
									type="text"
									className="w-full border rounded-lg p-2 mt-1"
									placeholder="Enter your full name"
								/>
								<ErrorMessage
									name="full_name"
									component="div"
									className="text-red-500 text-sm"
								/>
							</div>

							<div>
								<label className="block font-medium">Email</label>
								<Field
									name="email"
									type="email"
									className="w-full border rounded-lg p-2 mt-1"
									placeholder="Enter your email"
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="text-red-500 text-sm"
								/>
							</div>

							<div>
								<label className="block font-medium">Phone Number</label>
								<Field
									name="phone"
									type="tel"
									pattern="\d{10}"
									maxLength={10}
									className="w-full border rounded-lg p-2 mt-1"
									placeholder="Enter phone number"
									onKeyPress={(e) => {
										const isNumber = /[0-9]/.test(e.key);
										const isControl = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key);
										if (!isNumber && !isControl) {
											e.preventDefault();
										}
									}}
								/>
								<ErrorMessage
									name="phone"
									component="div"
									className="text-red-500 text-sm"
								/>
							</div>

											<div>
												<label className="block font-medium">Type</label>
												<Field
													name="type"
													type="text"
													className="w-full border rounded-lg p-2 mt-1"
													placeholder="What are you donating? (e.g., money, food, clothes)"
												/>
												<ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
											</div>

							<div>
								<label className="block font-medium">Amount</label>
								<Field
									name="amount"
									type="text"
									className="w-full border rounded-lg p-2 mt-1"
									placeholder="Enter amount (number or words, e.g., 100 or 'food and blankets')"
								/>
								<ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
							</div>

							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isSubmitting}
									className="bg-[#224266] hover:bg-[#1d3756] text-white font-semibold py-2 px-6 rounded-[8px] transition"
								>
									{isSubmitting ? "Submitting..." : "Submit"}
								</button>
							</div>
						</Form>
					)}
				</Formik>

				{message && <p className="mt-4 text-center font-medium text-blue-800">{message}</p>}
			</div>
		</div>
	);
}


import React, { useState } from 'react';
import logo from '../assets/logo.png';
import background from '../assets/backround image.png';
import { FaEnvelope } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import Api from '../Services/api';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showEmailPlaceholder, setShowEmailPlaceholder] = useState(true);
  const [showPasswordPlaceholder, setShowPasswordPlaceholder] = useState(true);
  const [showVerifyPasswordPlaceholder, setShowVerifyPasswordPlaceholder] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await Api.post("/signup", {
        email,
        password,
        username: email.split("@")[0], // use part of email as username
      });

      console.log("Signup success:", res.data);
      alert("Signup successful!");
      window.location.href = "/login"; // redirect to login
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.error || "Something went wrong. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#224266] text-white px-12 py-3 flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
          <span className="font-bold text-lg">Disaster Connect</span>
        </div>

        <div className="p-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Sign up now
          </h2>
          <p className="text-gray-500 mb-8 text-center">
            Create a free account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder={showEmailPlaceholder ? 'Enter email address' : ''}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowEmailPlaceholder(e.target.value === '');
                  }}
                  onFocus={() => setShowEmailPlaceholder(false)}
                  onBlur={() => setShowEmailPlaceholder(email === '')}
                  required
                  className="w-full pr-12 pl-4 py-4 text-lg bg-gray-200 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaEnvelope className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder={showPasswordPlaceholder ? 'Password' : ''}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowPasswordPlaceholder(e.target.value === '');
                  }}
                  onFocus={() => setShowPasswordPlaceholder(false)}
                  onBlur={() => setShowPasswordPlaceholder(password === '')}
                  required
                  className="w-full pr-12 p-4 text-lg bg-gray-200 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                <IoMdLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
              </div>
            </div>

            {/* Verify Password */}
            <div>
              <label htmlFor="verify-password" className="sr-only">Verify password</label>
              <div className="relative">
                <input
                  type="password"
                  id="verify-password"
                  placeholder={showVerifyPasswordPlaceholder ? 'Verify password' : ''}
                  value={verifyPassword}
                  onChange={(e) => {
                    setVerifyPassword(e.target.value);
                    setShowVerifyPasswordPlaceholder(e.target.value === '');
                  }}
                  onFocus={() => setShowVerifyPasswordPlaceholder(false)}
                  onBlur={() => setShowVerifyPasswordPlaceholder(verifyPassword === '')}
                  required
                  className="w-full pr-12 p-4 text-lg bg-gray-200 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                <IoMdLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#224266] text-white font-bold text-xl rounded-xl hover:bg-[#1d3756] focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 mt-8"
            >
              Sign up
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center text-base">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#224266] hover:text-[#1d3756] font-medium transition duration-150">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

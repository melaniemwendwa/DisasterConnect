import React from 'react';
import logo from '../assets/logo.png';
import { FaEnvelope } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";



const SignupPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for handling sign up submission goes here
    console.log('Sign up attempt submitted');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Container size matched to the large size requested for the Login page */}
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header/Title Bar (Dark Blue) - Logo Removed */}
        

        <div className="bg-[#224266] text-white px-12 py-3 flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
          <span className="font-bold text-lg">Disaster Connect</span>
        </div>

        {/* Form Content */}
        <div className="p-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Sign up now
          </h2>
          <p className="text-gray-500 mb-8 text-center">
            Create a free account
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Address Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  required
                  className="w-full pr-12 pl-4 py-4 text-lg font-normal bg-gray-200 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />

                {/* Envelope icon positioned on the right side of the input */}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaEnvelope className="w-5 h-5" />
                </span>
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  required
                  className="w-full pr-12 p-4 text-lg font-normal bg-gray-200 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                {/* Lock icon for Password */}
                <IoMdLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
              </div>
            </div>
            
            {/* Verify Password Input */}
            <div>
              <label htmlFor="verify-password" className="block text-sm font-medium text-gray-700 sr-only">Verify password</label>
              <div className="relative">
                <input
                  type="password"
                  id="verify-password"
                  placeholder="Verify password"
                  required
                  className="w-full pr-12 p-4 text-lg font-normal bg-gray-200 border-2 border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                <IoMdLock  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6"/>

              </div>
            </div>
            
            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#224266] text-white font-bold text-xl rounded-xl hover:bg-[#1d3756] focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 mt-8"
            >
              Sign up
            </button>
          </form>

          {/* Login Link */}
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
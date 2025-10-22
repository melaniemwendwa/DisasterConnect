import React from 'react';
import logo from '../assets/logo.png';
const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt submitted');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Changed max-w-md to max-w-3xl to increase the size */}
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header/Title Bar */}
        <div className="bg-[#224266] text-white p-3 flex items-center">
          <div className="mr-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
          </div>
          <span className="font-bold">Disaster Connect</span>
        </div>

        {/* Form Content - Increased padding (p-12) to scale content inside the larger card */}
        <div className="p-12">
          <h2 className="text-3xl font-semibold text-center text-[#224266] mb-10">
            Welcome Back!
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#224266] text-white font-bold text-xl rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-base">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#224266] hover:text-blue-900 font-medium transition duration-150">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

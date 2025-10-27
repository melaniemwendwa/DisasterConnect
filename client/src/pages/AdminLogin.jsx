import React, { useState } from 'react';
import logo from '../assets/logo.png';
import background from '../assets/backround image.png';
import { useNavigate } from 'react-router-dom';
import Api from '../Services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await Api.post('/admin/login', { email, password });
      
      if (response.data) {
        // Store admin data in localStorage
        localStorage.setItem('admin', JSON.stringify(response.data));
        console.log("Admin login successful!");
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
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
        
        {/* Header/Title Bar */}
        <div className="bg-[#224266] text-white p-3 flex items-center">
          <div className="mr-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
          </div>
          <span className="font-bold">Disaster Connect - Admin Portal</span>
        </div>

        {/* Form Content */}
        <div className="p-12">
          <h2 className="text-3xl font-semibold text-center text-[#224266] mb-10">
            Admin Login
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 text-lg bg-[#224266] border border-gray-300 rounded-[24px] text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-[#id3756] focus:border-transparent transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center bg-red-50 p-3 rounded-[24px] border border-red-200">
                {error}
              </div>
            )}
          </form>

          {/* Regular Login Link */}
          <div className="mt-8 text-center text-base">
            <p className="text-gray-600">
              Not an admin?{' '}
              <a href="/login" className="text-[#224266] hover:text-blue-900 font-medium transition duration-150">
                User Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

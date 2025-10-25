import React, { useState } from 'react';
import logo from '../assets/logo.png';
import background from '../assets/backround image.png';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showUsernamePlaceholder, setShowUsernamePlaceholder] = useState(true);
  const [showPasswordPlaceholder, setShowPasswordPlaceholder] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: username,
          password: password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Login failed');
        return;
      }

      const data = await res.json();
      console.log("Login successful:", data);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError('Something went wrong. Please try again.');
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
      {/* Changed max-w-md to max-w-3xl to increase the size */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        
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
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder={showPasswordPlaceholder ? 'Password' : ''}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowPasswordPlaceholder(e.target.value === '');
                }}
                onFocus={() => setShowPasswordPlaceholder(false)}
                onBlur={() => setShowPasswordPlaceholder(password === '')}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Login Button */}
              <button
              type="submit"
              className="w-full p-4 text-lg bg-[#224266] border border-gray-300 rounded-[24px] text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-[#id3756] focus:border-transparent transition duration-150"
            >
              Login
            </button>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-[#224266] hover:text-[#1d3756] text-sm transition duration-150">
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center bg-red-50 p-3 rounded-[24px] border border-red-200">
                {error}
              </div>
            )}
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

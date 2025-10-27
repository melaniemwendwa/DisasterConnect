import React, { useState } from 'react';
import logo from '../assets/logo.png';
import background from '../assets/backround image.png';
import { useNavigate, Link } from 'react-router-dom';
import Api from '../Services/api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await Api.post('/reset-password', {
        email: email,
        password: newPassword
      });

      if (response.status === 200) {
        setSuccess('Password has been reset successfully. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
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
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        {/* Header/Title Bar */}
        <div className="bg-[#224266] text-white p-3 flex items-center">
          <div className="mr-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
          </div>
          <span className="font-bold">Disaster Connect</span>
        </div>

        {/* Form Content */}
        <div className="p-12">
          <h2 className="text-3xl font-semibold text-center text-[#224266] mb-6">
            Reset Password
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please enter your email and new password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* New Password Input */}
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-4 text-lg bg-gray-200 border border-gray-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            
            {/* Reset Button */}
            <button
              type="submit"
              className="w-full p-4 text-lg bg-[#224266] border border-gray-300 rounded-[24px] text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-[#id3756] focus:border-transparent transition duration-150"
            >
              Reset Password
            </button>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center bg-red-50 p-3 rounded-[24px] border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 text-green-500 text-sm text-center bg-green-50 p-3 rounded-[24px] border border-green-200">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

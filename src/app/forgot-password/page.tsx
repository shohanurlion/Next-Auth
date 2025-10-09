'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Forgot Password Page Component
 * Allows users to request a password reset by entering their email address
 * Sends a reset link to the user's email if the account exists
 */
const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  /**
   * Handles the form submission for requesting a password reset
   * Sends the email to the backend API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Sending forgot password request for email:', email);
      // Send POST request to the forgot password API endpoint
      const response = await axios.post('/api/users/forgotpassword', { email });
      console.log('Forgot password response:', response.data);
      toast.success(response.data.message || 'Password reset email sent successfully');
      setEmailSent(true);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles resending the password reset email
   * Useful if the user didn't receive the first email
   */
  const handleResendEmail = async () => {
    setLoading(true);
    
    try {
      console.log('Resending forgot password request for email:', email);
      // Send POST request to the forgot password API endpoint again
      const response = await axios.post('/api/users/forgotpassword', { email });
      console.log('Resend email response:', response.data);
      toast.success(response.data.message || 'Password reset email resent successfully');
    } catch (error: any) {
      console.error('Resend email error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {emailSent ? 'Check Your Email' : 'Forgot Password'}
        </h1>
        
        {/* Show the email input form if email hasn't been sent yet */}
        {!emailSent ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: For testing, emails can only be sent to the account owner's email (rahmanliton387@gmail.com)
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          /* Show success message and options after email is sent */
          <div className="text-center">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-left">
              <p className="text-sm text-yellow-700">
                <strong>Note for Testing:</strong> Resend is in test mode and can only send emails to rahmanliton387@gmail.com. 
                For production use, verify your domain at resend.com/domains
              </p>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Didn't receive the email? Check your spam folder or click below to resend.
            </p>
            <button
              onClick={handleResendEmail}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-4"
              disabled={loading}
            >
              {loading ? 'Resending...' : 'Resend Email'}
            </button>
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Change Email
            </button>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
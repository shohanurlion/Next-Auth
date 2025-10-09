'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/verifyemail', { token });
      toast.success(response.data.message);
      setVerified(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Toaster />
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Verifying Email</h1>
          <p className="text-gray-600">Please wait while we verify your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Toaster />
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-6">
            Invalid or expired verification token. Please request a new verification email.
          </p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Toaster />
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Email Verified Successfully</h1>
          <p className="text-gray-600 mb-6">
            Your email has been verified. You can now log in to your account.
          </p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmailPage;
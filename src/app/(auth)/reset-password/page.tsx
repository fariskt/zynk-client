"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AxiosInstance from '@/src/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { PulseLoader } from 'react-spinners';

const resetPasswordFn = async (resetForm: { newPassword: string; token: string | null }) => {
  const { data } = await AxiosInstance.post("/auth/reset-password", resetForm);
  return data;
};

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordFn,
    onSuccess: (data) => {
      setMessage(data.message);
    },
    onError: (error: any) => {
      setMessage(error.response?.data?.message || "Cannot reset password");
    }
  });

  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    mutate({ newPassword, token });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full p-3 bg-black text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300"
          >
            {isPending ? <PulseLoader color="#ffffff" size={5} /> : 'Reset Password'}
          </button>
        </form>
        {message && <div className="mt-2 mb-4 text-center text-red-500">{message}</div>}
      </div>
    </div>
  );
};

const ResetPassword = () => (
  <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPassword;

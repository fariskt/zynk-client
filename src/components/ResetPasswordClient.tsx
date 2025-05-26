'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AxiosInstance from '@/src/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

const resetPasswordFn = async (resetForm: {
  newPassword: string;
  token: string | null;
}) => {
  const { data } = await AxiosInstance.post('/auth/reset-password', resetForm);
  return data;
};

const ResetPasswordClient = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordFn,
    onSuccess: (data) => {
      setMessage(data.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Cannot reset password');
      } else {
        setMessage('Cannot reset password');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    mutate({ newPassword, token });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
              New Password
            </label>
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
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
        {message && <div className="mt-2 mb-4">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPasswordClient;

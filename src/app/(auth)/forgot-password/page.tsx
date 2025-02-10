"use client";

import AxiosInstance from "@/src/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";

const forgotPassword = async (formData: { email: string }) => {
  const { data } = await AxiosInstance.post("/auth/forgot-password", formData);
  return data;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setMessage(data.message);
    },
    onError: (error: any) => {
      setMessage(error.response?.data?.message || "Error sending password")
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email: email });
  };

  return (
    <div className=" flex min-h-screen justify-center mt-16 h-fit">
      <div className="bg-white h-fit p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded-md hover:bg-gray-700"
          >
            {isPending ? <PulseLoader color="#ffffff" size={5} /> : "Send Link"}
          </button>
        </form>
        {message && (
          <h2 className="mt-10 text-green-600 text-center mb-4">{message}</h2>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

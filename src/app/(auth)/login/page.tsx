"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/src/hooks/useAuth";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [loginError, setError] = useState<string | null>("");
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = (formInputs: { email: string; password: string }) => {
    login(formInputs, {
      onSuccess: () => {
        toast.success("Login Sucessfull");
        localStorage.setItem("isLogin", "true");
        router.replace("/");
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || "Login failed");
        toast.error(error.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <div className="flex border rounded-2xl justify-between h-full w-full shadow mt-10">
      <div className="rounded-2xl md:w-3/5 flex flex-col justify-center items-center dark:bg-gray-600 bg-[#e5eaf5] shadow-lg">
        <div className="w-full max-w-md py-10 px-10">
          <img
            src="/white-logo.png"
            alt="Logo"
            className="relative right-5 bottom-5 h-20 mb-4"
          />
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold">Sign In</h2>
            <p className="text-gray-500 mt-1">
              Welcome back! Please enter your details
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-3 rounded-md border border-gray-300 outline-none focus:ring-1 focus:ring-gray-800"
                    autoComplete="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full p-3 rounded-md border border-gray-300 outline-none focus:ring-1 focus:ring-gray-800"
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className=" hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 transition"
                  disabled={isPending}
                >
                  {isPending ? (
                    <PulseLoader color="white" size={5} />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </Form>
            )}
          </Formik>
          {loginError && <p className="my-2 text-red-600">{loginError}</p>}

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className=" md:flex py-5 w-4/5 items-center justify-center">
        <img
          src="/green-login.jpg"
          alt="Sales Report"
          className=" rounded-lg object-contain h-[500px]"
        />
      </div>
    </div>
  );
};

export default Login;

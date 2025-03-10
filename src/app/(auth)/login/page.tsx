"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/src/hooks/useAuth";
import { useState } from "react";
import Image from "next/image";

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

  const { mutate: login , isPending} = useLoginMutation();

  const handleSubmit = (formInputs: { email: string; password: string }) => {
    login(formInputs, {
      onSuccess: () => {
        toast.success("Login Sucessfull");
        if(typeof window !== "undefined"){
          localStorage.setItem("isLogin", "true");
        }
        router.replace("/");
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || "Login failed");
        toast.error(error.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
  <div className="flex bg-white/20 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden w-10/12 max-w-4xl border border-white/30">
    <div className="hidden md:flex items-center justify-center w-1/2 relative">
      <Image
        fill
        src="/login-illu.jpg"
        alt="Illustration"
        className="object-cover h-full w-full"
      />
      <div className="absolute inset-0 bg-black/10 rounded-l-3xl"></div>
    </div>

    <div className="w-full md:w-1/2 p-8 text-white">
      <h2 className="text-3xl font-bold text-center">Sign In</h2>
      <p className="text-gray-200 text-center mt-1 text-sm">
        Welcome back! Please enter your details.
      </p>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4 mt-6">
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className={`w-full px-4 py-3 bg-white/80 text-gray-800 text-sm border ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500`}
              />
              <div className="h-4 mt-1">
                <span
                  className={`text-red-400 text-xs ${
                    errors.email && touched.email ? "visible" : "invisible"
                  }`}
                >
                  {errors.email || "Placeholder"}
                </span>
              </div>
            </div>

            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-3 bg-white/80 text-gray-800 text-sm border ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500`}
              />
              <div className="h-4 mt-1">
                <span
                  className={`text-red-400 text-xs ${
                    errors.password && touched.password ? "visible" : "invisible"
                  }`}
                >
                  {errors.password || "Placeholder"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-purple-100 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition duration-300 text-white py-2 rounded-md text-sm shadow-md"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Log In"}
            </button>

            {loginError && (
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            )}
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-center text-gray-200 text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-purple-200 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default Login;

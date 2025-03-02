"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRegisterMutation } from "@/src/hooks/useAuth";
import toast from "react-hot-toast";
import Image from "next/image";

const Register = () => {
  const router = useRouter();

  const registerUserSchema = Yup.object({
    fullname: Yup.string()
      .min(3, "Full name must be at least 3 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password cannot exceed 50 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const { mutate: register, isPending } = useRegisterMutation();

  const handleSubmit = (formInputs: {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    register(formInputs, {
      onSuccess: () => {
        router.replace("/login");
      },
      onError: (error: any) => {
        const catchError =
          error.response?.data?.message || "Registration failed";
        toast.error(catchError);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="flex bg-white/20 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden w-10/12 max-w-4xl border border-white/30">
        <div className="hidden md:flex items-center justify-center w-1/2 relative">
          <Image
            fill
            src="/register-illu.jpg"
            alt="Illustration"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 bg-black/10 rounded-l-3xl"></div>
        </div>

        <div className="w-full md:w-1/2 p-8 text-white">
          <h2 className="text-3xl font-bold text-center">Sign Up</h2>
          <p className="text-gray-200 text-center mt-1 text-sm">
            Join us today!
          </p>

          <Formik
            initialValues={{
              fullname: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={registerUserSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors }) => (
              <Form className="space-y-4 mt-6">
                <div>
                  <Field
                    type="text"
                    name="fullname"
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 bg-white/70 text-gray-800 text-sm border ${
                      errors.fullname && touched.fullname
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500`}
                  />
                  <div className="h-4 mt-1">
                    <span
                      className={`text-red-400 text-xs ${
                        errors.fullname && touched.fullname
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      {errors.fullname || "Placeholder"}
                    </span>
                  </div>
                </div>

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className={`w-full px-4 py-3 bg-white/70 text-gray-800 text-sm border ${
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
                    className={`w-full px-4 py-3 bg-white/70 text-gray-800 text-sm border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500`}
                  />
                  <div className="h-4 mt-1">
                    <span
                      className={`text-red-400 text-xs ${
                        errors.password && touched.password
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      {errors.password || "Placeholder"}
                    </span>
                  </div>
                </div>

                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`w-full px-4 py-3 bg-white/70 text-gray-800 text-sm border ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500`}
                  />
                  <div className="h-4 mt-1">
                    <span
                      className={`text-red-400 text-xs ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      {errors.confirmPassword || "Placeholder"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 transition duration-300 text-white py-2 rounded-md text-sm shadow-md"
                  disabled={isPending}
                >
                  {isPending ? "Signing up..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-center text-gray-200 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-200 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

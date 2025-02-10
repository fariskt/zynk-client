"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import { useRegisterMutation } from "@/src/hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const router = useRouter();
  const [signupError, setSignupError] = useState(null);

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
        setSignupError(null);
      },
      onError: (error: any) => {
        console.log(error);
        
        const catchError =
          error.response?.data?.message || "Registration failed";
        toast.error(catchError);
        setSignupError(catchError);
      },
    });
  };

  return (
    <div className="flex border rounded-lg justify-between shadow mt-5">
      <div className=" md:flex  w-4/5 items-center justify-center">
        <img
          src="/orange-login.jpg"
          alt="Sales Report"
          className=" rounded-lg object-contain h-[450px]"
        />
      </div>
      <div className="rounded-2xl md:w-3/5 flex flex-col justify-center items-center bg-[#E5EAF5]  shadow-md">
        <div className="w-full max-w-md py-5 px-10">
          <img
            src="/white-logo.png"
            alt="Logo"
            className="relative right-5 h-20 mb-4"
          />
          <div className="flex flex-col  mb-3">
            <h2 className="text-2xl font-semibold text-center">
              Create Account
            </h2>
            <p className="text-gray-500 mt-1 text-center">
              Please enter your details
            </p>
          </div>

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
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <Field
                    type="text"
                    name="fullname"
                    placeholder="enter your fullname"
                    className="w-full p-3 rounded-md shadow-inner border border-gray-300 outline-none focus:ring-1 focus:ring-gray-800"
                    autoComplete="fullname"
                  />
                  <ErrorMessage
                    name="fullname"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="enter your email"
                    className="w-full p-3 rounded-md shadow-inner border border-gray-300 outline-none focus:ring-1 focus:ring-gray-800"
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
                    placeholder="enter your password"
                    className="w-full p-3 rounded-md border shadow-inner border-gray-300 outline-none focus:ring-1 focus:ring-gray-800"
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="confirm password"
                    className="w-full p-3 rounded-md border shadow-inner border-gray-300 outline-none focus:ring-1 focus:ring-gray-800"
                    autoComplete="new-password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-black hover:bg-gray-800 shadow-lg  text-white p-3 rounded-md"
                  disabled={isPending}
                >
                  {isPending ? (
                    <PulseLoader color="#ffffff" size={5} />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </Form>
            )}
          </Formik>
          {signupError && <p className="my-2 text-red-600">{signupError}</p>}

          <p className="text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

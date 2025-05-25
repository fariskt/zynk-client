"use client";
import AxiosInstance from "@/src/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import ResendEmailModal from "./ResentEmail";
import Loader from "@/src/utils/Loading";

const Form: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const router = useRouter();
  const inputLength = 6;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [resentotpModal, setOpenResent] = useState(false);

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: async () => {
      const joinedOtp = otp.join("");
      const res = await AxiosInstance.post("/auth/verifyotp", {
        otp: joinedOtp,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully");
      router.replace("/");
    },
    onError: () => {
      toast.error("OTP verification failed!");
    },
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < inputLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp();
  };

  const { mutate: resentOTP, isPending: resentOtpPending } = useMutation({
    mutationFn: async (email: string) => {
      await AxiosInstance.post("/auth/resentotp", { email });
    },
    onSuccess: () => {
      toast.success("OTP resent");
    },
    onError: () => {
      toast.error("OTP resnet failed!");
    },
  });

  const handleResent = (email: string) => {
    resentOTP(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="flex bg-white/20 backdrop-blur-md shadow-xl rounded-3xl border border-white/30">
        <div className="w-[400px] h-[300px] bg-white flex flex-col items-center justify-center p-5 gap-5 relative shadow-lg rounded-xl">
          <form
            className="flex flex-col items-center gap-5 w-full"
            onSubmit={handleSubmit}
          >
            <span className="text-base font-bold text-gray-900">Enter OTP</span>
            <p className="text-base text-black text-center leading-4">
              We have sent a verification code to your email
            </p>

            <div className="w-full flex gap-2 justify-center">
              {[...Array(inputLength)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  required
                  className="bg-gray-300 w-[40px] h-[40px] text-center border-none rounded-md text-gray-800 font-semibold focus:bg-indigo-100 focus:outline-none transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-1 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-colors"
            >
              {isPending ? <Loader /> : "Verify"}
            </button>

            <div className="text-xs text-black text-center flex flex-col items-center gap-1 w-full">
              Didn't receive the code?
              <button
                onClick={() => setOpenResent(true)}
                type="button"
                className="text-indigo-500 font-bold text-sm hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
      {resentotpModal && (
        <ResendEmailModal
          resentOtpPending={resentOtpPending}
          onResend={handleResent}
          isOpen={resentotpModal}
          setOpenResent={setOpenResent}
        />
      )}
    </div>
  );
};

export default Form;

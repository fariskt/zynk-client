import Loader from "@/src/utils/Loading";
import React from "react";

interface ResentEmailProps {
  isOpen: boolean;
  setOpenResent: (value: boolean) => void;
  onResend: (email: string) => void;
  resentOtpPending: boolean;
}

const ResendEmailModal: React.FC<ResentEmailProps> = ({
  isOpen,
  setOpenResent,
  onResend,
  resentOtpPending,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResend(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={() => setOpenResent(false)}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Resend Verification Email
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white rounded-lg py-2 hover:bg-indigo-600 transition duration-300"
          >
            {resentOtpPending ? <Loader /> : " Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendEmailModal;

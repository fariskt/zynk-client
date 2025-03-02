import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LogoutProps {
  setConfirmLogout: React.Dispatch<React.SetStateAction<boolean>>;
  sureLogout: () => void;
}

const ConfirmLogout: FC<LogoutProps> = ({ setConfirmLogout, sureLogout }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex z-30 items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setConfirmLogout(false)}
      >
        <motion.div
          className="dark:bg-[#111] bg-gray-100  dark:text-white p-6 max-w-sm w-full rounded-xl shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Confirm</h2>
            <button onClick={() => setConfirmLogout(false)}>
              <X className="w-5 h-5 text-gray-400 dark:hover:text-white hover:text-gray-500" />
            </button>
          </div>

          <p className="dark:text-gray-300 mb-4">Are you sure you want to logout?</p>

          <hr className="border-gray-700 mb-4" />

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              onClick={sureLogout}
            >
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmLogout;

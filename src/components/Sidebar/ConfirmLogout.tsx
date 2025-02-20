import React, { FC } from "react";

interface LogoutProps {
  setConfirmLogout: React.Dispatch<React.SetStateAction<boolean>>;
  sureLogout: () => void;
}

const ConfirmLogout: FC<LogoutProps> = ({ setConfirmLogout, sureLogout }) => {
  return (
    <div
      className="fixed inset-0 flex z-30 items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={() => setConfirmLogout(false)}
    >
      <div
        className="bg-white dark:bg-gray-900 dark:text-white p-6 max-w-sm w-full rounded-2xl shadow-xl transform transition-all scale-95 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            onClick={() => setConfirmLogout(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
            onClick={sureLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;

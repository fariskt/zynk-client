import React from "react";

const page = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">General Settings</h2>
      <div className="mt-10">
        <h3 className="my-1">Enable Follow me</h3>
        <div className="flex justify-between">
          <p className="dark:text-gray-300">People can follow you, if you enable this</p>
          <button className="border bg-green-400 dark:bg-green-600 rounded-md p-1">
            Enable
          </button>
        </div>
      </div>
      <div>
        <h3 className="my-1">Enable Notification</h3>
        <div className="flex justify-between">
          <p className="dark:text-gray-300">Send me notification like, share or message</p>
          <button className="border bg-green-400 dark:bg-green-600 rounded-md p-1">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;

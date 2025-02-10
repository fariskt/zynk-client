import React from "react";

const page = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700">General Settings</h2>
      <div className="mt-10">
        <h3 className="my-1">Enable Follow me</h3>
        <div className="flex justify-between">
          <p>People can follow you, if you enable this</p>
          <button className="border bg-green-400 rounded-md p-1">
            Enable
          </button>
        </div>
      </div>
      <div>
        <h3 className="my-1">Enable Notification</h3>
        <div className="flex justify-between">
          <p>Send me notification like, share or message</p>
          <button className="border bg-green-400 rounded-md p-1">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;

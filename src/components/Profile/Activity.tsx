import React from "react";

const Activity = () => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white shadow border dark:border-0 w-3/6 mt-5 rounded-md h-72 flex flex-col  gap-4 p-2">
      <h3 className="text-left my-2 mx-4 pb-2 border-b dark:border-b-gray-500 font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h3>
      <div className="flex items-center justify-between w-full gap-4 ">
        <img
          src="/zynk-logo.png"
          className="h-10 w-10 rounded-full object-contain border"
          alt=""
        />
        <div className="">
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing</p>
          <p className="text-xs text-gray-500">1h ago</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-4">
        <img
          src="/zynk-logo.png"
          className="h-10 w-10 rounded-full object-contain border"
          alt=""
        />
        <div className="">
        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing</p>
        <p className="text-xs text-gray-500">1h ago</p>
        </div>
      </div>
    </div>
  );
};

export default Activity;

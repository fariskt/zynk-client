import React from "react";

const SkeletonPostCard = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="dark:bg-gray-900 dark:text-white mb-10 bg-white mt-0 shadow dark:border-0 border rounded-2xl py-1 max-w-4xl min-w-[700px] min-h-44 animate-pulse"
        >
          <div className="flex justify-between items-center border-b dark:border-b-gray-600 p-2">
            <div className="flex items-center gap-4 p-2 pl-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full mr-5"></div>
          </div>

          <div className="flex gap-2 my-2 pl-3">
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          <div className="relative m-4 flex justify-center">
            <div className="w-full max-w-[650px] max-h-[450px] aspect-square bg-gray-300 dark:bg-gray-700 border dark:border-0 rounded-3xl"></div>
          </div>

          <div className="flex justify-between gap-4 my-4 pl-3">
            <div className="flex items-center gap-3 px-5">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="pr-8">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonPostCard;

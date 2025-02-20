import React from "react";

const CommentSkelton = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-between pb-2 mt-2 animate-pulse">
        <div className="flex gap-4 items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div>
            <p className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></p>
            <span className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded block mt-1"></span>
          </div>
        </div>

        <div className="h-3 w-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="flex justify-between pb-2 mt-2 animate-pulse">
        <div className="flex gap-4 items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div>
            <p className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></p>
            <span className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded block mt-1"></span>
          </div>
        </div>

        <div className="h-3 w-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

export default CommentSkelton;

import React from 'react';

const UserCardSkeleton = () => {
  return (
    <div className="w-[250px] min-h-[300px] animate-pulse bg-gray-100 dark:bg-gray-600 dark:border-gray-500 border shadow rounded-lg p-6 flex flex-col items-center space-y-4">
      <div className="w-20 h-20 bg-gray-300 rounded-full"></div>

      <div className="w-2/3 h-4 bg-gray-300 rounded"></div>

      <div className="flex justify-around w-full mt-2">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="flex justify-between gap-4 w-full mt-5">
        <div className="w-5/6 h-8 bg-gray-300 rounded-md"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;

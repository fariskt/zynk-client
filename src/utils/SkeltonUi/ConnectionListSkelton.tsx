const ConnectionListSkeleton = () => {
    return (
      <div className="my-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-3 px-5 cursor-pointer animate-pulse"
          >
            <div className="relative">
              {/* Profile Picture Skeleton */}
              <div className="h-12 w-14 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <div className="flex justify-between w-full">
              <div className="flex flex-col gap-1 w-3/5">
                {/* Username Skeleton */}
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                {/* Last Message Time Skeleton */}
                <div className="h-3 bg-gray-200  dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  export default ConnectionListSkeleton;
  
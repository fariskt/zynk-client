const SkeletonPostCard = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse dark:bg-gray-900 bg-gray-200 rounded-md p-4 mt-5 shadow dark:border-gray-600 border min-w-[560px] min-h-44"
        >
          <div className="flex items-center gap-4">
            <div className="dark:bg-gray-700 bg-gray-300 rounded-full w-14 h-14"></div>
            <div className="flex flex-col gap-1">
              <div className="dark:bg-gray-800 bg-gray-300 h-4 w-24 rounded"></div>
              <div className="dark:bg-gray-800 bg-gray-300 h-3 w-16 rounded"></div>
            </div>
          </div>

          <div className="dark:bg-gray-800 bg-gray-300 h-16 w-full my-3 rounded"></div>
          <div className="dark:bg-gray-800 bg-gray-300 h-[200px] w-full rounded"></div>
          <div className="flex gap-4 mt-3">
            <div className="dark:bg-gray-800 bg-gray-300 h-5 w-10 rounded"></div>
            <div className="dark:bg-gray-800 bg-gray-300 h-5 w-10 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonPostCard;

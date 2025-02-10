import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import { IoMdHeart } from "react-icons/io";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { usePathname } from "next/navigation";
import { useFetchUserPosts, useLikePost } from "@/src/hooks/usePosts";
import SkeletonUserPostCard from "../../utils/SkeltonUi/PostSkelton";
import NoPosts from "../../utils/Animations/NoPostAnimation";
import dayjs from "dayjs";

interface Post {
  _id: string;
  userId: {
    fullname: string;
    profilePicture: string;
  };
  content: string;
  image: string;
  likes?: string[];
  comments?: [];
  isScheduled?:boolean,
  scheduleTime?:string| null,
  createdAt?: string;
}

const UserPostCard = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const userID = user?.id || "";
  console.log(user);
  

  const {
    data: userPost,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useFetchUserPosts(userID);
  console.log(userPost);
  

  const getRelativeTime = (dateString: string) => {
    const postDate = new Date(dateString);
    const diffMs = new Date().getTime() - postDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const postToShow =
    pathname === "/profile"
      ? userPost?.pages.flatMap((page: { posts: Post[] }) => page.posts) || []
      : [];

  const handleScroll = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const bottomPosition = document.documentElement.offsetHeight;

    if (scrollPosition >= bottomPosition - 100) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  const likePostMutation = useLikePost(pathname || "");

  const handleLike = (postId: string) => {
    likePostMutation.mutate({ userId: userID, postId });
  };

  return (
    <div>
      {isLoading && <SkeletonUserPostCard count={3} />}
      {postToShow.length > 0 ? (
        postToShow.filter((post)=> {
          if(!post.isScheduled) return true
          return dayjs(post.scheduleTime).isBefore(dayjs())
        }).map((post: Post) => (
          <div
            key={post._id}
            className="dark:bg-gray-900 dark:text-white bg-white mt-5 shadow dark:border-0 border rounded-md py-1 max-w-xl min-w-[530px] min-h-44"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center gap-4 pl-3">
                <img
                  src={post?.userId?.profilePicture || "/person-demo.jpg"}
                  alt={`${post?.userId?.fullname}'s profile`}
                  className="dark:border-gray-500 border rounded-full w-14 h-14 object-cover"
                />
                <div>
                  <h4 className="text-sm">{post?.userId?.fullname}</h4>
                  <p className="text-xs">
                    {post.createdAt
                      ? getRelativeTime(post.createdAt)
                      : "No Date"}
                  </p>
                </div>
              </div>
              <span className="mr-5 cursor-pointer">
                <BsThreeDots />
              </span>
            </div>

            <div className="px-3 my-2">
              <h4 className="text-gray-700 dark:text-white text-sm">
                {post.content}
              </h4>
            </div>

            {post.image && (
              <div className="flex justify-center">
                <img
                  src={post.image}
                  onDoubleClick={() => handleLike(post._id)}
                  className=" h-[380px] w-[600px] object-cover"
                  alt="post-image"
                />
              </div>
            )}

            <div className="flex gap-4 my-4 pl-3">
              <div className="flex items-center gap-1">
                <span
                  className={`${
                    post?.likes?.includes(userID) &&
                    "text-red-600 scale-110 transition-transform duration-300"
                  } text-2xl cursor-pointer`}
                  onClick={() => handleLike(post._id)}
                >
                  {post?.likes?.includes(userID) ? <IoMdHeart /> : <CiHeart />}
                </span>
                <p>{post?.likes?.length || 0}</p>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xl">
                  <GoComment />
                </span>
                <p>{post.comments?.length || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border-t dark:bg-gray-900 dark:text-white dark:border-t-0 bg-slate-50">
              <img
                src={user?.profilePicture || "/person-demo.jpg"}
                alt="profile"
                className="border dark:border-gray-700 rounded-full object-cover w-10 h-10"
              />
              <input
                type="text"
                placeholder="Add comment here..."
                className="border dark:border-gray-800 w-[90%] text-sm outline-none rounded-full p-2 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="dark:bg-gray-900 dark:text-white bg-white mt-5 shadow dark:border-0 border rounded-md py-1 max-w-xl min-w-[530px] min-h-44">
          <NoPosts />
        </div>
      )}
    </div>
  );
};

export default UserPostCard;

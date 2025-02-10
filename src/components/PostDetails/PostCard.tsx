import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import useAuthStore from "../store/useAuthStore";
import { usePathname } from "next/navigation";
import { useFetchPosts, useLikePost } from "@/src/hooks/usePosts";
import SkeletonPostCard from "../../utils/SkeltonUi/PostSkelton";
import { useEffect } from "react";
import { IoMdHeart } from "react-icons/io";
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
  hideComments?: boolean;
  isScheduled?:boolean,
  scheduleTime?:string| null,
  createdAt?: string;
}

const PostCard = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const userID = user?.id || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFetchPosts();

  const getRelativeTime = (dateString: string) => {
    const postDate = new Date(dateString);
    const diffMs = new Date().getTime() - postDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  let postToShow = data?.pages.flatMap((page: { posts: Post[] }) => page.posts) || [];

  const handleScroll = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const bottomPosition = document.documentElement.offsetHeight;

    if (scrollPosition >= bottomPosition - 100) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);


  const likePostMutation = useLikePost(pathname|| "");

  const handleLike = (postId: string) => {
    likePostMutation.mutate({ userId: userID, postId });
  };  
  
  return (
    <div>
      {isLoading && <SkeletonPostCard count={3} />}
      {!isLoading && postToShow.filter((post)=> {
        if(!post?.isScheduled) return true;
        return dayjs(post.scheduleTime).isBefore(dayjs())
      }).map((post: Post) => (
          <div
            key={post._id}
            className="dark:bg-gray-900 dark:text-white bg-white mt-5 shadow dark:border-0 border rounded-md py-1 max-w-xl min-w-[530px] min-h-44"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 p-2 pl-3">
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
              <span className="mr-5">
                <BsThreeDots />
              </span>
            </div>

            <div className="flex gap-2 my-2 pl-3">
              <h4 className="text-gray-700 dark:text-white text-sm my-2">
                {post.content}
              </h4>
            </div>

            {post.image && <div>
              <img
                src={post.image}
                onDoubleClick={() => handleLike(post._id)}
                className="h-[380px] w-[800px] object-cover"
                alt="post-image"
              />
            </div>}

            <div className="flex gap-4 my-4 pl-3">
              <div className="flex items-center gap-1">
                <span
                  className={`${
                    post?.likes?.includes(userID) &&
                    "text-red-600 focus:text-lg focus:scale-150 duration-300"
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

            <div className="flex items-center gap-2 pl-3 border-t py-2 dark:bg-gray-900 dark:text-white dark:border-t-0 bg-slate-50">
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
        ))}
    </div>
  );
};

export default PostCard;

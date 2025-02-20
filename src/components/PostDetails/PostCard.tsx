import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import useAuthStore from "../../store/useAuthStore";
import { usePathname } from "next/navigation";
import {  useFetchAllComments, useFetchPosts, useLikePost} from "@/src/hooks/usePosts";
import SkeletonPostCard from "../../utils/SkeltonUi/PostSkelton";
import { useEffect, useState } from "react";
import { IoMdHeart } from "react-icons/io";
import dayjs from "dayjs";
import PostModal from "./PostModal";
import { IoBookmarkOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";

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
  isScheduled?: boolean;
  commentCount?:number;
  scheduleTime?: string | null;
  createdAt?: string;
}

const PostCard = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [showHeart, setShowHeart] = useState(false);
  const userID = user?._id || "";
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showOpenDot, setShowOpenDot] = useState<boolean>(false);

  const { data:posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFetchPosts();

  let postToShow = posts?.pages.flatMap((page: { posts: Post[] }) => page.posts) || [];

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

    const post = postToShow.find((item) => item._id === postId);
    const postIsLiked = post?.likes?.includes(userID);
    if (!postIsLiked) {
      setShowHeart(true);
      setTimeout(() => {
        setShowHeart(false);
      }, 1000);
    }
  };
    

  return (
    <div>
      {isLoading && <SkeletonPostCard count={3} />}
      {!isLoading &&
        postToShow
          .filter((post) => {
            if (!post?.isScheduled) return true;
            return dayjs(post.scheduleTime).isBefore(dayjs());
          })
          .map((post: Post) => {
            return (
              <div
                key={post._id}
                className="dark:bg-gray-900 dark:text-white mb-10 bg-white mt-0 shadow dark:border-0 border rounded-2xl py-1 max-w-4xl min-w-[700px] min-h-44"
              >
                <div className="flex justify-between items-center border-b dark:border-b-gray-600 p-2">
                  <div className="flex items-center gap-4 p-2 pl-3">
                    <img
                      src={post?.userId?.profilePicture || "/person-demo.jpg"}
                      alt={`${post?.userId?.fullname}'s profile`}
                      className="dark:border-gray-500 border rounded-full w-10 h-10 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-medium">
                        {post?.userId?.fullname}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {post.createdAt
                          ? getRelativeTime(post.createdAt)
                          : "No Date"}
                      </p>
                    </div>
                  </div>
                  <span
                    className="mr-5"
                    onClick={() => setShowOpenDot(!showOpenDot)}
                  >
                    <BsThreeDots />
                  </span>
                </div>

                <div className="flex gap-2 my-2 pl-3">
                  <h4 className="text-gray-700 dark:text-white text-sm my-2">
                    {post.content}
                  </h4>
                </div>

                {post.image && (
                  <div className="relative m-4 flex justify-center">
                    <img
                      src={post.image}
                      onDoubleClick={() => handleLike(post._id)}
                      className="w-full max-w-[650px] max-h-[450px] aspect-square object-cover border dark:border-0 rounded-3xl"
                      alt="post-image"
                    />

                    {showHeart && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <AiFillHeart className="text-red-600 text-6xl opacity-90" />
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="flex justify-between gap-4 my-4 pl-3">
                  <div className="flex items-center gap-3 px-5">
                    <div className="flex items-center gap-1">
                      <span
                        className={`${
                          post?.likes?.includes(userID) &&
                          "text-red-600 focus:text-lg focus:scale-150 duration-300"
                        } text-2xl cursor-pointer`}
                        onClick={() => handleLike(post._id)}
                      >
                        {post?.likes?.includes(userID) ? (
                          <IoMdHeart />
                        ) : (
                          <CiHeart />
                        )}
                      </span>
                      <p>{post?.likes?.length || 0}</p>
                    </div>
                    {!post.hideComments && (
                      <div
                        className="flex items-center gap-1"
                        onClick={() => setSelectedPost(post)}
                      >
                        <span className="text-xl cursor-pointer">
                          <GoComment />
                        </span>
                        <p>{post?.commentCount || 0}</p>
                      </div>
                    )}
                  </div>
                  <div className="pr-8">
                    <span className="text-xl cursor-pointer">
                      <IoBookmarkOutline />
                    </span>
                  </div>
                </div>
                {selectedPost && (
                  <PostModal
                    userID={userID}
                    handleLike={handleLike}
                    onClose={() => setSelectedPost(null)}
                    post={selectedPost}
                  />
                )}
              </div>
            );
          })}
    </div>
  );
};

export default PostCard;

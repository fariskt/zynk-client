import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import { IoMdHeart } from "react-icons/io";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { useParams, usePathname } from "next/navigation";
import {
  useFetchAllComments,
  useFetchUserPosts,
  useLikePost,
} from "@/src/hooks/usePosts";
import SkeletonUserPostCard from "../../utils/SkeltonUi/PostSkelton";
import NoPosts from "../../utils/Animations/NoPostAnimation";
import dayjs from "dayjs";
import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
import PostModal from "./PostModal";
import PostEditForm from "./PostEditForm";
import ConfirmDelete from "./ConfirmDelete";
import { Post } from "@/src/types";
import { BiLike, BiSolidLike } from "react-icons/bi";

const UserPostCard = () => {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const slug = params?.slug as string;

  const friendId = slug?.split("-").pop(); // e.g., 'john-doe-12345' => '12345'
  const userID = pathname.startsWith("/members")
    ? friendId || ""
    : user?._id || "";

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showOpenDot, setShowOpenDot] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const {
    data: userPost,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useFetchUserPosts(userID || "");

  const postToShow =
    userPost?.pages.flatMap((page: { posts: Post[] }) => page.posts) || [];

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

  const toggleDotMenu = (postId: string)=> {
    setShowOpenDot((prevID)=> prevID === postId ? null : postId)
  }

  return (
    <div>
      {isLoading && <SkeletonUserPostCard count={3} />}
      {postToShow.length > 0 ? (
        postToShow
          .filter(
            (post) =>
              !post.isScheduled || dayjs(post.scheduleTime).isBefore(dayjs())
          )
          .map((post: Post) => {
            return (
              <div
                key={post._id}
                className="dark:bg-gray-900 dark:text-white bg-white mt-5 shadow dark:border-0 border rounded-xl py-1 max-w-xl min-w-[530px] min-h-44 mb-5"
              >
                <div className="flex justify-between items-center p-2 border-b dark:border-b-gray-600">
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
                  <div>
                    {showEditForm && (
                      <PostEditForm
                        post={selectedPost}
                        onClose={() => setShowEditForm(false)}
                      />
                    )}
                    <span
                      className="mr-5 cursor-pointer rotate-12"
                      onClick={() => toggleDotMenu(post._id)}
                    >
                      <BsThreeDotsVertical />
                    </span>
                    {showOpenDot === post._id && !pathname.startsWith("/members") && (
                      <div className="absolute w-28 -ml-20 mb-4 space-y-3 p-2 rounded-xl bg-gray-100 border dark:border-0  dark:bg-gray-600">
                        <h3
                          className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => {
                            setShowEditForm(true);
                            setSelectedPost(post);
                            setShowOpenDot(null);
                          }}
                        >
                          Edit
                        </h3>
                        <h3
                          className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => {
                            setSelectedPost(post);
                            setShowDeleteModal(true);
                            setShowOpenDot(null);
                          }}
                        >
                          Delete
                        </h3>
                        <h3 className="hover:text-gray-700 dark:hover:text-gray-300">
                          Report
                        </h3>
                      </div>
                    )}
                    {showOpenDot === post._id && pathname.startsWith("/members") && (
                      <div className="absolute w-28 -ml-20 mb-4 space-y-3 p-2 rounded-xl bg-gray-100 border dark:border-0  dark:bg-gray-600">
                        <h3 className="hover:text-gray-700 dark:hover:text-gray-300">
                          Report
                        </h3>
                      </div>
                    )}
                    {showDeleteModal && (
                      <ConfirmDelete
                        onClose={() => setShowDeleteModal(false)}
                        post={selectedPost}
                      />
                    )}
                  </div>
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
                      className="w-[500px] max-h-[450px] aspect-square object-cover border dark:border-0 rounded-3xl"
                      alt="post-image"
                    />
                  </div>
                )}

                <div className="flex gap-7 my-4 pl-3">
                  <div className="flex items-center gap-1">
                    <span
                      className={`${
                        post?.likes?.includes(userID) &&
                        "text-gray-800 focus:text-lg focus:scale-150 duration-300"
                      } text-xl text-gray-800 dark:text-gray-300 cursor-pointer`}
                      onClick={() => handleLike(post._id)}
                    >
                      {post?.likes?.includes(userID) ? (
                        <BiSolidLike />
                      ) : (
                        <BiLike />
                      )}
                    </span>
                    <p>{post?.likes?.length || 0} Likes</p>
                  </div>

                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowPostModal(true);
                    }}
                  >
                    <span className="text-xl">
                      <GoComment />
                    </span>
                    <p>{post?.commentCount || 0} Comments</p>
                  </div>
                </div>

                {showPostModal && (
                  <PostModal
                    handleLike={handleLike}
                    onClose={() => setShowPostModal(false)}
                    post={selectedPost}
                  />
                )}
              </div>
            );
          })
      ) : (
        <div className="dark:bg-gray-900 dark:text-white bg-white mt-5 shadow dark:border-0 border rounded-md py-1 max-w-xl min-w-[530px] min-h-44">
          <NoPosts />
        </div>
      )}
    </div>
  );
};

export default UserPostCard;

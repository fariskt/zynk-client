"use client";

import React from "react";
import { useCommentOnPost, useFetchCommentsById } from "@/src/hooks/usePosts";
import { AiOutlineClose } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";
import { IoMdHeart } from "react-icons/io";
import useAuthStore from "../../store/useAuthStore";
import { BiSend } from "react-icons/bi";
import CommentSkelton from "@/src/utils/SkeltonUi/CommentSkelton";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Comments from "./Comments";
import { Post, Comment } from "@/src/types";
import Image from "next/image";

interface ModalProps {
  post: Post | null;
  onClose: () => void;
  handleLike: (postId: string) => void;
}

const PostModal: React.FC<ModalProps> = ({ post, onClose, handleLike }) => {
  const { data: comments, isLoading: commentIsLoading } = useFetchCommentsById(
    post?._id || ""
  );

  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const { user } = useAuthStore();
  const userID = user?._id || "";
  const commentPostMutation = useCommentOnPost(pathname);

  const handleComment = (postId: string) => {
    commentPostMutation.mutate(
      { userId: userID, postId, text: commentText[postId] },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["comments"] });
          setCommentText((prev) => ({ ...prev, [postId]: "" }));
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 flex justify-center md:items-center items-end bg-gray-400 dark:bg-gray-950/5 bg-opacity-5 backdrop-blur-sm z-50 md:p-4 "
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 md:mt-10 mt-28 md:rounded-lg shadow-lg max-w-4xl w-full md:p-5 relative flex rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {post?.image && (
          <div className="hidden md:block w-1/2 flex-shrink-0">
            <div className="flex justify-between items-center gap-4 pb-2">
              <div className="flex items-center gap-4">
                <Image
                  src={post?.userId?.profilePicture || "/person-demo.jpg"}
                  alt="profile"
                  width={40}
                  height={40}
                  className="border h-10 w-10 rounded-full object-cover"
                />
                <h4 className="text-sm font-semibold">
                  {post?.userId?.fullname}
                </h4>
              </div>
              <button className="mr-5">...</button>
            </div>
            <Image
              src={post?.image}
              alt="post-image"
              width={800}
              height={800}
              className="h-[450px] rounded-md object-cover"
            />
            <p className="text-sm my-2">{post?.content}</p>
          </div>
        )}

        <div className="md:w-1/2 flex flex-col md:p-4 md:py-4 py-4">
          <button
            className="hidden md:block absolute top-2 right-2 text-gray-700 dark:text-gray-200 text-2xl"
            onClick={onClose}
          >
            <AiOutlineClose />
          </button>

          <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar md:h-96 h-[550px] md:w-auto w-screen">
            <h2 className="fixed dark:bg-gray-900 min-w-96 md:h-auto h-10 bg-white z-1 text-center">
              Comments
            </h2>
            <div className="mt-8">
              {comments?.data?.length === 0 ? (
                <div>
                  <h3 className="text-gray-800 dark:text-gray-400 text-xl text-center mt-20">
                    No comments yet
                  </h3>
                  <p className="text-sm text-center mt-2">
                    Say something to start the conversation
                  </p>
                </div>
              ) : commentIsLoading ? (
                <CommentSkelton />
              ) : (
                comments?.data?.map((comment: Comment, index: number) => (
                  <Comments key={index} comment={comment} userID={userID} />
                ))
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-4 mt-auto pt-4 border-t border-t-gray-300 dark:border-t-gray-600">
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => handleLike(post?._id || "")}
            >
              <span
                className={`${
                  post?.likes?.includes(userID) ? "text-red-600 scale-110" : ""
                } text-2xl`}
              >
                {post?.likes?.includes(userID) ? <IoMdHeart /> : <CiHeart />}
              </span>
              <p>{post?.likes?.length || 0}</p>
            </div>
            <div className="flex items-center gap-1">
              <GoComment className="text-xl" />
              <p>{comments?.data.length || 0}</p>
            </div>
          </div>
          {!post?.hideComments && (
            <div className="flex items-center gap-2 md:py-4 px-4 md:px-0 dark:bg-gray-900 dark:text-white dark:border-t-0 ">
              <Image
                src={user?.profilePicture || "/person-demo.jpg"}
                alt="profile"
                height={40}
                width={40}
                className="border w-14 h-10 dark:border-gray-700 rounded-full object-cover"
              />
              <input
                type="text"
                placeholder="Add comment here..."
                value={commentText[post?._id || ""]}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post?._id || ""]: e.target.value,
                  }))
                }
                required
                className="border dark:border-gray-800 w-[100%] text-sm outline-none rounded-full p-2 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                onClick={() => handleComment(post?._id || "")}
                className={`${commentPostMutation.isPending ? "animate-pulse" : ""} relative right-1 border text-blue-800 p-2 rounded-full`}
              >
                <BiSend />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
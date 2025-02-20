import AxiosInstance from "@/src/lib/axiosInstance";
import { Comment } from "@/src/types";
import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

interface CommentProps {
  comment: Comment
  userID: string;
}

const Comments: React.FC<CommentProps> = ({ comment, userID }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplayInput, setShowReplayInput] = useState<boolean>(false);
  const [replayValue, setReplayValue] = useState<string>("");
  const queryClient = useQueryClient()
  const { data: commentReplies,  isLoading,  refetch} = useQuery({
    queryKey: ["commentReplay", comment._id],
    queryFn: async () => {
      const res = await AxiosInstance.get( `/post/comment/replay/${comment._id}`);
      return res.data;
    },
    enabled: false,
  });

  const handleReplayComment = async (commentId: string) => {
    try {
      await AxiosInstance.post(`/post/comment/replay/${commentId}`, {
        text: replayValue,
      });
      setReplayValue("");
      setShowReplayInput(false)
      setShowReplies(true)
      refetch()
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    } catch (error: any) {
      console.error(
        "Error posting reply:",
        error.response?.data || error.message
      );
    }
  };

  const toggleReplies = () => {
    if (!showReplies) {
      refetch();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="pb-1 mt-2">
      {/* Main Comment */}
      <div className="flex justify-between">
        <div className="flex gap-5 items-start">
          <img
            src={comment?.user?.profilePicture || "/person-demo.jpg"}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover"
          />

          <div>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <p className="text-xs font-semibold">
                  {comment?.user?.fullname}
                </p>
                <span className="text-xs text-gray-400">
                  {comment?.createdAt && getRelativeTime(comment?.createdAt)}
                </span>
              </div>
              <span className="text-sm">{comment.text}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center ml-12 gap-4 min-h-10">
        <button>
          {comment?.likes?.includes(userID) ? (
            <IoMdHeart className="text-red-500" />
          ) : (
            <CiHeart />
          )}
        </button>
        <span
          className="text-xs cursor-pointer dark:hover:bg-gray-700 py-1 px-2 rounded-2xl w-12"
          onClick={() => setShowReplayInput(!showReplayInput)}
        >
          {showReplayInput ? "cancel" :"reply"}
        </span>
        {(comment?.replyCount ?? 0) > 0 && (
          <div className="relative right-32 w-4 h-16 top-0 border-l-2 border-b-2 border-gray-300 dark:border-gray-500 rounded-bl-lg"></div>
        )}
      </div>

      {(comment?.replyCount ?? 0) > 0 && (
        <button
          className="flex items-center relative bottom-3 text-xs ml-12 text-gray-500 hover:underline"
          onClick={toggleReplies}
        >
          {comment?.replyCount ?? 0} replies
          {showReplies ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
        </button>
      )}

      {showReplayInput && (
        <div className="flex justify-between mt-1 my-3 px-4">
          <input
            type="text"
            placeholder="Add a reply..."
            className="w-[90%] border rounded pl-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 outline-none"
            value={replayValue}
            onChange={(e) => setReplayValue(e.target.value)}
          />
          <button
            className="bg-blue-800 text-white px-2 py-1 text-sm rounded-md ml-2"
            onClick={() => handleReplayComment(comment._id)}
          >
            Reply
          </button>
        </div>
      )}

      {showReplies && (
        <div className="ml-6 mt-2 border-gray-300 dark:border-l-gray-500 pl-3">
          {isLoading ? (
            <p className="text-xs text-gray-400">Loading replies...</p>
          ) : (
            commentReplies?.replies?.map((reply: any) => (
              <div key={reply._id}>
                <Comments comment={reply} userID={userID} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;

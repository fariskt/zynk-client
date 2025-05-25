import React, { useState } from "react";
import { Comment } from "@/src/types";
import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
import AxiosInstance from "@/src/lib/axiosInstance";
import Image from "next/image";

interface CommentReplyProps {
  reply: Comment;
  refetchReplies: () => void;
}

const CommentReply: React.FC<CommentReplyProps> = ({
  reply,
  refetchReplies,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyValue, setReplyValue] = useState("");

  const handleReplyToReply = async () => {
    if (!replyValue.trim()) return;

    try {
      await AxiosInstance.post(`/post/comment/reply/${reply.parentCommentId}`, {
        text: `@${reply?.userId?.fullname}: ${replyValue}`,
      });

      setReplyValue("");
      setShowReplyInput(false);
      refetchReplies();
    } catch (error) {
      console.error("Error posting nested reply:",error);
    }
  };

  return (
    <div key={reply._id} className="flex gap-3 mt-2">
      <Image
        height={24}
        width={24}
        src={reply?.userId?.profilePicture || "/person-demo.jpg"}
        alt="profile"
        className="h-6 w-6 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <p className="text-xs font-semibold">{reply.userId.fullname}</p>
          <small className="text-gray-400 text-xs">
            {reply.createdAt && getRelativeTime(reply.createdAt)}
          </small>
        </div>
        <span className="text-sm">
          {reply.text.split(/(@[\w\s]+)/g).map((part, index) =>
            part.trim().startsWith("@") ? (
              <span key={index} className="text-blue-500">
                {part.replace(":", "").trim()}{" "}
              </span>
            ) : (
              <span key={index}>{part.replace(":", "")}</span>
            )
          )}
        </span>

        <div className="flex items-center gap-2 mt-1">
          <button
            className="text-xs"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            {showReplyInput ? "Cancel" : "Reply"}
          </button>
        </div>

        {showReplyInput && (
          <div className="flex mt-2">
            <input
              type="text"
              placeholder={`Reply to @${reply?.userId?.fullname}`}
              className="w-[90%] border rounded pl-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 outline-none"
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
            />
            <button
              className="bg-blue-800 text-white px-2 py-1 text-xs md:text-sm rounded-md ml-2"
              onClick={handleReplyToReply}
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentReply;

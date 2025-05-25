// import React, { useState } from "react";
// import { Comment } from "@/src/types";
// import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
// import { CiHeart } from "react-icons/ci";
// import {
//   IoMdArrowDropdown,
//   IoMdArrowDropright,
//   IoMdHeart,
// } from "react-icons/io";

// interface CommentReplyProps {
//   reply: Comment;
//   userID: string;
//   comment: Comment;
//   onReplyClick: (replyId: string) => void;
//   toggleReplies: (value: string) => void;
//   showReplies: string | null;
// }

// const CommentReply: React.FC<CommentReplyProps> = ({
//   reply,
//   userID,
//   comment,
//   onReplyClick,
//   toggleReplies,
//   showReplies,
// }) => {
//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyValue, setReplyValue] = useState("");

//   console.log(comment);
//   console.log(reply);

//   return (
//     <div className="ml-6 mt-2">
//       <div className="flex gap-4 items-start">
//         <img
//           src={reply?.user?.profilePicture || "/person-demo.jpg"}
//           alt="profile"
//           className="h-8 w-8 rounded-full object-cover"
//         />
//         <div>
//           <div className="flex items-center gap-4">
//             <p className="text-xs font-semibold">{reply?.user?.fullname}</p>
//             <span className="text-xs text-gray-400">
//               {reply?.createdAt && getRelativeTime(reply?.createdAt)}
//             </span>
//           </div>
//           <span className="text-sm">{reply.text}</span>
//           <div className="flex gap-3 mt-1">
//             <button onClick={() => onReplyClick(reply._id)}>
//               {reply?.likes?.includes(userID) ? (
//                 <IoMdHeart className="text-red-500" />
//               ) : (
//                 <CiHeart />
//               )}
//             </button>
//             <span
//               className="text-xs cursor-pointer hover:underline"
//               onClick={() => setShowReplyInput(!showReplyInput)}
//             >
//               {showReplyInput ? "Cancel" : "Reply"}
//             </span>
//           </div>

//           {showReplyInput && (
//             <div className="mt-2">
//               <input
//                 type="text"
//                 placeholder="Write a reply..."
//                 className="w-[90%] border rounded pl-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 outline-none"
//                 value={replyValue}
//                 onChange={(e) => setReplyValue(e.target.value)}
//               />
//               <button
//                 className="bg-blue-800 text-white px-2 py-1 text-sm rounded-md ml-2"
//                 onClick={() => {
//                   onReplyClick(reply._id);
//                   setReplyValue("");
//                   setShowReplyInput(false);
//                 }}
//               >
//                 Reply
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* {(comment?.replyCount ?? 0) > 0 && ( */}
//       <button
//         className="flex mt-8 items-center relative bottom-3 text-xs ml-12 text-gray-500 hover:underline"
//         onClick={() => toggleReplies(reply._id)}
//       >
//         {comment?.replyCount ?? 0} replies
//         {showReplies[reply._id] ? (
//           <IoMdArrowDropdown />
//         ) : (
//           <IoMdArrowDropright />
//         )}
//       </button>
//       {/* )} */}

//       {showReplies[reply._id] && (
//         <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-3">
//           {reply?.replies?.map((nestedReply: Comment) => (
//             <CommentReply
//               key={nestedReply._id}
//               reply={nestedReply}
//               userID={userID}
//               comment={comment}
//               onReplyClick={onReplyClick}
//               toggleReplies={toggleReplies}
//               showReplies={showReplies}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommentReply;

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
    } catch (error: any) {
      console.error(
        "Error posting nested reply:",
        error.response?.data || error.message
      );
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
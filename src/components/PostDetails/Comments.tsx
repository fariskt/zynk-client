// import AxiosInstance from "@/src/lib/axiosInstance";
// import { Comment } from "@/src/types";
// import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import React, { useState } from "react";
// import { CiHeart } from "react-icons/ci";
// import { IoMdHeart, IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

// interface CommentProps {
//   comment: Comment;
//   userID: string;
// }

// const Comments: React.FC<CommentProps> = ({ comment, userID }) => {
//   const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
//   const [replyValue, setReplyValue] = useState<string>("");
//   const [showReplies, setShowReplies] = useState<boolean>(false);
//   const queryClient = useQueryClient();

//   const { data: replies, refetch, isFetching } = useQuery({
//     queryKey: ["replies", comment._id],
//     queryFn: async () => {
//       const res = await AxiosInstance.get(`/post/comment/replies/${comment._id}`);
//       return res.data.replies;
//     },
//     enabled: false,
//   });
  

//   const handleReplyComment = async () => {
//     try {
//       await AxiosInstance.post(`/post/comment/reply/${comment._id}`, {
//         text: `@${comment?.user?.username} ${replyValue}`,
//       });
//       setReplyValue("");
//       setShowReplyInput(false);
//       refetch(); // Refetch replies after adding
//     } catch (error) {
//       console.error("Error posting reply", error);
//     }
//   };

//   const toggleLike = async () => {
//     try {
//       await AxiosInstance.put(`/post/comment/like/${comment._id}`);
//       queryClient.invalidateQueries({ queryKey: ["comments"] });
//     } catch (error) {
//       console.error("Error toggling like", error);
//     }
//   };

//   const handleToggleReplies = () => {
//     if (!showReplies) refetch(); // Fetch only on first open
//     setShowReplies(!showReplies);
//   };

//   return (
//     <div className="pb-2 mt-2 border-b dark:border-gray-700">
//       {/* Main Comment */}
//       <div className="flex gap-4 items-start">
//         <img
//           src={comment?.user?.profilePicture || "/person-demo.jpg"}
//           alt="profile"
//           className="h-8 w-8 rounded-full object-cover"
//         />
//         <div>
//           <div className="flex items-center gap-4">
//             <p className="text-xs font-semibold">{comment?.user?.fullname}</p>
//             <span className="text-xs text-gray-400">
//               {comment?.createdAt && getRelativeTime(comment?.createdAt)}
//             </span>
//           </div>

//           {/* Display comment text with @mentions */}
//           <span
//             className="text-sm"
//             dangerouslySetInnerHTML={{
//               __html: comment.text.replace(
//                 /@(\w+)/g,
//                 '<a href="/user/$1" class="text-blue-500">@\$1</a>'
//               ),
//             }}
//           />

//           <div className="flex gap-3 mt-1">
//             <button onClick={toggleLike}>
//               {comment?.likes?.includes(userID) ? (
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
//             {(comment?.replyCount ?? 0) > 0 && (
//               <span
//                 className="text-xs cursor-pointer hover:underline"
//                 onClick={handleToggleReplies}
//               >
//                 {showReplies ? "Hide Replies" : `Show ${comment.replyCount} Replies`}
//                 {showReplies ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
//               </span>
//             )}
//           </div>

//           {/* Reply Input */}
//           {showReplyInput && (
//             <div className="flex mt-2">
//               <input
//                 type="text"
//                 placeholder={`Reply to @${comment?.user?.username}`}
//                 className="w-[90%] border rounded pl-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 outline-none"
//                 value={replyValue}
//                 onChange={(e) => setReplyValue(e.target.value)}
//               />
//               <button
//                 className="bg-blue-800 text-white px-2 py-1 text-sm rounded-md ml-2"
//                 onClick={handleReplyComment}
//               >
//                 Reply
//               </button>
//             </div>
//           )}

//           {/* Show Replies */}
//           {showReplies && (
//             <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-3">
//               {isFetching ? (
//                 <p className="text-xs text-gray-400">Loading replies...</p>
//               ) : (
//                 replies?.map((reply: Comment) => (
//                   <div key={reply._id} className="flex gap-3 mt-2">
//                     <img
//                       src={reply?.user?.profilePicture || "/person-demo.jpg"}
//                       alt="profile"
//                       className="h-6 w-6 rounded-full object-cover"
//                     />
//                     <div>
//                       <p className="text-xs font-semibold">{reply.user.fullname}</p>
//                       <span
//                         className="text-sm"
//                         dangerouslySetInnerHTML={{
//                           __html: reply.text.replace(
//                             /@(\w+)/g,
//                             '<a href="/user/$1" class="text-blue-500">@\$1</a>'
//                           ),
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Comments;

"use client";

import AxiosInstance from "@/src/lib/axiosInstance";
import { Comment } from "@/src/types";
import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import {
  IoMdHeart,
  IoMdArrowDropdown,
  IoMdArrowDropright,
} from "react-icons/io";
import CommentReply from "./CommentReplies";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import { useLikeComment } from "@/src/hooks/usePosts";

interface CommentProps {
  comment: Comment;
  userID: string;
}

const Comments: React.FC<CommentProps> = ({ comment, userID }) => {
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [replyValue, setReplyValue] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const {mutate: toggleLike}= useLikeComment()

  const {
    data: replies,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: async () => {
      const res = await AxiosInstance.get(
        `/post/comment/replies/${comment._id}`
      );
      return res.data.replies;
    },
    enabled: false,
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      await AxiosInstance.post(`/post/comment/reply/${comment._id}`, {
        text: `@${comment?.userId?.fullname}: ${replyValue}`,
      });
      setReplyValue("");
      setShowReplyInput(false);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error sending replies ", error);
    },
  });

  const handleReplyComment = async () => {
    replyMutation.mutate();
  };  
  

  const handleToggleReplies = () => {
    if (!showReplies) refetch();
    setShowReplies(!showReplies);
  };

  return (
    <div className="pb-2 mt-2 md:pl-0 pl-4">
      <div className="flex gap-4 items-start">
        <Image
          height={32}
          width={32}
          src={comment?.userId?.profilePicture || "/person-demo.jpg"}
          alt="profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-4">
            <p className="text-xs font-semibold">{comment?.userId?.fullname}</p>
            <span className="text-xs text-gray-400">
              {comment?.createdAt && getRelativeTime(comment?.createdAt)}
            </span>
          </div>

          <span className="text-sm" onDoubleClick={()=> toggleLike({userId: userID, commentId: comment._id})}>{comment.text}</span>

          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <button onClick={() => toggleLike({userId: userID, commentId: comment._id})}>
                {comment?.likes?.includes(userID) ? (
                  <IoMdHeart className="text-red-500 flex items-center" />
                ) : (
                  <CiHeart />
                )}
              </button>
              <small>{comment?.likes?.length}</small>
            </div>
            <span
              className="text-xs cursor-pointer hover:underline"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              {showReplyInput ? "Cancel" : "Reply"}
            </span>
          </div>

          {showReplyInput && (
            <div className="flex mt-2">
              <input
                type="text"
                placeholder={`Reply to @${comment?.userId?.fullname}`}
                className="w-[90%] border rounded pl-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 outline-none"
                value={replyValue}
                onChange={(e) => setReplyValue(e.target.value)}
              />
              <button
                className="bg-background text-center text-white px-2 w-10 py-1 text-sm rounded-md ml-2"
                onClick={handleReplyComment}
              >
                {replyMutation.isPending ? (
                  <PulseLoader size={2} color="white" />
                ) : (
                  "send"
                )}
              </button>
            </div>
          )}

          {(comment?.replyCount ?? 0) > 0 && (
            <div className="mt-3">
              <span
                className="flex items-center gap-2 text-xs cursor-pointer hover:underline"
                onClick={handleToggleReplies}
              >
                {showReplies
                  ? "Hide Replies"
                  : `Show ${comment.replyCount || 0} Replies`}
                {showReplies ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
              </span>
            </div>
          )}

          {showReplies && (
            <div className="md:ml-6 mt-4 md:pl-3">
              {isFetching ? (
                <p className="text-xs text-gray-400">Loading replies...</p>
              ) : (
                replies?.map((reply: Comment) => (
                  <CommentReply
                    key={reply._id}
                    reply={reply}
                    refetchReplies={refetch}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
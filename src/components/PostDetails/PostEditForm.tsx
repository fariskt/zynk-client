import AxiosInstance from "@/src/lib/axiosInstance";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  _id: string;
  content: string;
  hideComments?: boolean;
  image?: string;
}

interface PostEditFormProps {
  post: Post | null;
  onClose: () => void;
}

const PostEditForm: React.FC<PostEditFormProps> = ({ post, onClose  }) => {
  const queryClient = useQueryClient();

  const [postData, setPostData] = useState<Post>({
    _id: post?._id || "",
    content: post?.content || "",
    hideComments: post?.hideComments || false,
    image: post?.image,
  });

  useEffect(() => {
    if (post) {
      setPostData({
        _id: post._id,
        content: post.content,
        hideComments: post.hideComments || false,
        image: post.image,
      });
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setPostData((prev) => ({
      ...prev, 
      [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
    }));
  };

  const updatePostMutation = useMutation({
    mutationFn: async () => {
      return AxiosInstance.put(`/post/update/${postData._id}`, postData);
    },
    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
    onError: (error: any) => {
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data?.message || "Failed to update post");
      }else{
        toast.error("Unexpected error occurred")
      }
    },
  });

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-400 dark:bg-gray-950/5 bg-opacity-5 backdrop-blur-sm z-50 p-4" onClick={onClose}>
      <div onClick={(e)=> e.stopPropagation()} className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-200 text-2xl"
          onClick={onClose}
        >
          <AiOutlineClose />
        </button>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white text-center">
          Edit Post
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatePostMutation.mutate();
          }}
          className="space-y-6 mt-4"
        >
          {/* Caption Field */}
          <div>
            <label className="block mb-2 text-gray-600 dark:text-white font-medium">
              Caption
            </label>
            <textarea
              name="content"
              rows={3}
              value={postData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700"
              placeholder="Edit caption..."
              required
            ></textarea>
          </div>

          {postData.image && (
            <div className="flex justify-center">
              <img
                src={postData.image}
                className="h-[200px] w-[600px] object-cover rounded-lg"
                alt="Post Image"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hideComments"
              checked={postData.hideComments}
              onChange={handleChange}
              className="mr-2 w-4 h-4"
            />
            <label className="text-gray-600 dark:text-white">
              Hide Comments
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={updatePostMutation.isPending}
          >
            {updatePostMutation.isPending ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostEditForm;

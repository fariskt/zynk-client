import AxiosInstance from "@/src/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FC } from "react";
import toast from "react-hot-toast";

interface Post {
  _id: string;
  content: string;
  hideComments?: boolean;
  image?: string;
}

interface PostEditForm {
  post: Post | null;
  onClose: () => void;
}

const ConfirmDelete: React.FC<PostEditForm> = ({ onClose, post }) => {
  const queryClient = useQueryClient();

  const deletPostMutation = useMutation({
    mutationFn: async () => {
      return AxiosInstance.patch(`/post/delete/${post?._id}`);
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });

  const sureDelete = async () => {
    deletPostMutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 flex z-30 items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 dark:text-white p-6 max-w-sm w-full rounded-2xl shadow-xl transform transition-all scale-95 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Are you sure you want to Delete this Post?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
            onClick={sureDelete}
          >
            Sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;

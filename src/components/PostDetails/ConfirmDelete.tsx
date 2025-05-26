"use client"

import AxiosInstance from "@/src/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { X } from "lucide-react";
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
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const sureDelete = async () => {
    deletPostMutation.mutate();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex z-30 items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="dark:bg-[#111] bg-gray-200 dark:text-white p-6 max-w-sm w-full rounded-xl shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()} // Prevent close on inner click
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Confirm</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 dark:text-gray-400 dark:hover:text-white hover:text-gray-600" />
            </button>
          </div>

          {/* Message */}
          <p className="dark:text-gray-300 mb-4">
            Are you sure you want to delete this post?
          </p>

          <hr className="border-gray-700 mb-4" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition"
              onClick={sureDelete}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDelete;

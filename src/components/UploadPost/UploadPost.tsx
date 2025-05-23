"use client";

import { useFetchPosts } from "@/src/hooks/usePosts";
import AxiosInstance from "@/src/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import React, { useState, DragEvent } from "react";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ImageCropper from "./ImageCropper";
import DateTimePickerComponent from "./DatePicker";
import useAuthStore from "../../store/useAuthStore";

interface UploadPostProps {
  onClose: () => void;
}

type EditFormType = {
  image: File | string | null;
  content: string;
  hideComments: boolean;
  scheduleTime: string;
  isScheduled: boolean;
};

const UploadPost: React.FC<UploadPostProps> = ({ onClose }) => {
  const { refetch } = useFetchPosts();
  const{fetchUser}= useAuthStore()
  const [postData, setPostData] = useState<EditFormType>({
    image: "",
    content: "",
    hideComments: false,
    scheduleTime: "",
    isScheduled: false,
  });
  const [isCropping, setIsCropping] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setPostData((prev) => ({ ...prev, image: file }));
    setIsCropping(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFile(e.target.files[0]);
  };

  const handleDragEvents = (e: DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    setDragOver(isOver);
    if (e.type === "drop" && e.dataTransfer.files?.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const postUploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await AxiosInstance.post("/post/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      refetch();
      fetchUser();
      toast.success("Post Uploaded Successfully!");
      onClose();
    },
    onError: () => toast.error("Post Upload Failed"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (postData.image instanceof File) {
      formData.append("image", postData.image);
    }

    if (postData.content) formData.append("content", postData.content);
    if (postData.isScheduled) formData.append("isScheduled", "true");
    if (postData.hideComments) formData.append("hideComments", "true");
    if (postData.scheduleTime) formData.append("scheduleTime", postData.scheduleTime);

    postUploadMutation.mutate(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="dark:bg-[#111] bg-gray-200 dark:text-white  shadow-lg rounded-2xl w-full max-w-2xl p-6 relative border border-gray-700"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-semibold dark:text-white mb-6">Upload Post</h2>

          {isCropping && postData.image instanceof File && (
            <ImageCropper
              onCropComplete={(croppedImage) => {
                setPostData({ ...postData, image: croppedImage });
                setIsCropping(false);
              }}
              onClose={() => setIsCropping(false)}
              imageSrc={URL.createObjectURL(postData.image)}
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div
              className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all ${
                dragOver ? "border-blue-500 bg-blue-900" : "border-gray-600"
              }`}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDrop={(e) => handleDragEvents(e, false)}
            >
              <input type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
              <label htmlFor="fileInput">
                {postData.image instanceof File ? (
                  <img
                    src={URL.createObjectURL(postData.image)}
                    alt="Preview"
                    className="max-h-56 object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400">Drag & Drop or Click to Upload</div>
                )}
              </label>
            </div>

            <textarea
              className="w-full p-3 border border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white outline-none resize-none"
              placeholder="Write your caption..."
              value={postData.content}
              onChange={(e) => setPostData((prev: any) => ({ ...prev, content: e.target.value }))}
            />

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={postData.isScheduled}
                    onChange={(e) => setPostData((prev: any) => ({ ...prev, isScheduled: e.target.checked }))}
                    className="h-5 w-5"
                  />
                  <span>Schedule</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={postData.hideComments}
                    onChange={(e) => setPostData((prev: any) => ({ ...prev, hideComments: e.target.checked }))}
                    className="h-5 w-5"
                  />
                  <span>Disable Comments</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="dark:bg-gray-700 bg-gray-800 text-white dark:text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-background text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  disabled={postUploadMutation.isPending}
                >
                  {postUploadMutation.isPending ? (
                    <PulseLoader color="white" size={4} />
                  ) : postData.isScheduled ? "Schedule Post" : "Post"}
                </button>
              </div>
            </div>

            {postData.isScheduled && (
              <DateTimePickerComponent
                onChange={(date) => setPostData((prev: any) => ({ ...prev, scheduleTime: date || "" }))}
              />
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


export default UploadPost;

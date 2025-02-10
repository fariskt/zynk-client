"use client";

import { useFetchPosts } from "@/src/hooks/usePosts";
import AxiosInstance from "@/src/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import React, { useState, DragEvent } from "react";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import UploadPostAnimation from "@/src/utils/Animations/UploadPostAnimation";
import ImageCropper from "./ImageCropper";
import DateTimePickerComponent from "./DatePicker";

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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg h-fit rounded-2xl w-full max-w-2xl p-6 relative dark:border dark:border-gray-600">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Upload Post</h2>

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
              dragOver ? "border-blue-500 bg-blue-50 dark:bg-gray-800" : "border-gray-300"
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
                <UploadPostAnimation />
              )}
            </label>
          </div>

          <textarea
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white resize-none"
            placeholder="Write your caption..."
            value={postData.content}
            onChange={(e) => setPostData((prev) => ({ ...prev, content: e.target.value }))}
          />
          <div className="flex justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center space-x-2 dark:text-white">
              <input
                type="checkbox"
                checked={postData.isScheduled}
                onChange={(e) => setPostData((prev) => ({ ...prev, isScheduled: e.target.checked }))}
                className="h-5 w-5"
              />
              <span>Schedule</span>
            </label>

            <label className="flex items-center space-x-2 dark:text-white">
              <input
                type="checkbox"
                checked={postData.hideComments}
                onChange={(e) => setPostData((prev) => ({ ...prev, hideComments: e.target.checked }))}
                className="h-5 w-5"
              />
              <span>Disable Comments</span>
            </label>
          </div>


          <div className=" flex justify-end gap-3">
            <button className="bg-gray-300  px-4 py-2 rounded-lg text-sm hover:bg-gray-400" onClick={onClose}>Cancel</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700" disabled={postUploadMutation.isPending}>
              {postUploadMutation.isPending ? <PulseLoader color="white" size={4} /> : postData.isScheduled ? "Schedule Post" : "Post"}
            </button>
          </div>
          </div>
          {postData.isScheduled && <DateTimePickerComponent onChange={(date) => setPostData((prev) => ({ ...prev, scheduleTime: date || "" }))} />}

        </form>
      </div>
    </div>
  );
};

export default UploadPost;

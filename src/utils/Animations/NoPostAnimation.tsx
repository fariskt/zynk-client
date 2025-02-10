import React from "react";
import Lottie from "lottie-react";
import emptyAnimation from "../../assets/nopost-anim.json";

const NoPosts = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Lottie animationData={emptyAnimation} loop={true} className="w-60 h-60" />
      <p className="text-gray-600 text-lg mt-4">No posts yet! Be the first to share something. 🚀</p>
    </div>
  );
};

export default NoPosts;

"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import Lottie to disable SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import emptyAnimation from "../../assets/nopost-anim.json";

const NoPosts = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Lottie animationData={emptyAnimation} loop={true} className="w-60 h-60" />
      <p className="text-gray-600 text-lg mt-4">
        No posts yet! Be the first to share something. 🚀
      </p>
    </div>
  );
};

export default NoPosts;

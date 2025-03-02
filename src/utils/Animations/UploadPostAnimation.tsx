import Lottie from "lottie-react";
import React from "react";
import uploadAnimation from "../../assets/upload-anim.json";

const UploadPostAnimation = () => {
  return (
    <>
      <Lottie
        animationData={uploadAnimation}
        loop={true}
        className="w-32 mx-auto"
      />
      <p className="text-gray-500 pt-2">Drag & Drop or Click to Upload</p>
    </>
  );
};

export default UploadPostAnimation;

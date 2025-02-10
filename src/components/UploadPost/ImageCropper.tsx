import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Slider } from "@mui/material";
import getCroppedImg from "@/src/components/UploadPost/Cropimage";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  onClose: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback((_: Area, croppedAreaPixels: Area) => {
    console.log("Cropped Area:", croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (croppedImage) {
      onCropComplete(croppedImage);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-xl font-bold text-center mb-4">Crop Image</h2>

        <div className="relative w-full h-64 bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        <div className="mt-4">
          <label className="block text-center">Zoom</label>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value as number)}
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-black dark:bg-blue-800 text-white px-4 py-2 rounded-lg" onClick={handleCrop}>
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

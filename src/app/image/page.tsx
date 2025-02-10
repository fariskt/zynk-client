'use client';

import { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper: React.FC = () => {
    const [src, setSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ aspect: 16 / 9 });
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [output, setOutput] = useState<string | null>(null);

    const selectImage = (file: File) => {
        setSrc(URL.createObjectURL(file));
    };

    const cropImageNow = () => {
        if (!image || !crop.width || !crop.height) return;

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        // Converting to base64
        const base64Image = canvas.toDataURL('image/jpeg');
        setOutput(base64Image);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        selectImage(e.target.files[0]);
                    }
                }}
                className="mb-4"
            />
            {src && (
                <div className="mt-4">
                    <ReactCrop 
                        src={src} 
                        onImageLoaded={setImage} 
                        crop={crop} 
                        onChange={setCrop} 
                    />
                    <button onClick={cropImageNow} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Crop
                    </button>
                </div>
            )}
            {output && <img src={output} className="mt-4 border" alt="Cropped" />}
        </div>
    );
};

export default ImageCropper;

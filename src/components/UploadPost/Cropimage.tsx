"use client"

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      console.error("Error loading image:", error);
      reject(error);
    };
  });
};

export default async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: CroppedAreaPixels
): Promise<File | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "croppedImage.jpg", { type: "image/jpeg" }));
        } else {
          resolve(null);
        }
      }, "image/jpeg");
    });
  } catch (error) {
    console.error("Error cropping image:", error);
    return null;
  }
}
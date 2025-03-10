"use client";

import { useUpdateProfilePhotos } from "@/src/hooks/useUser";
import useAuthStore from "@/src/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [profilePreview, setProfilePreview] = useState("");

  const { mutate: updatePhotos } = useUpdateProfilePhotos();

  useEffect(() => {
    setCoverPreview(user?.coverPhoto || "/cover-sample.jpg");
    setProfilePreview(user?.profilePicture || "/person-demo.jpg");
  }, [user]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "profile"
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (type === "cover") {
      setCoverPreview(previewURL);
      updatePhotos({ coverPhoto: file });
    } else if (type === "profile") {
      setProfilePreview(previewURL);
      updatePhotos({ profilePicture: file });
    }
  };

  return (
    <div className="md:max-w-6xl w-screen mt-24 mx-auto">
      <div className="w-full border dark:border-0 shadow-md rounded-xl">
        <div className="">
          <button
            onClick={() => coverInputRef?.current?.click()}
            className="absolute md:right-52 right-5 mt-5 bg-gray-200 border border-gray-400 dark:border-0 h-8 px-2 rounded-md"
          >
            <LuPencilLine />
          </button>
          <Image
            height={224}
            width={100}
            src={coverPreview || "/cover-sample.jpg"}
            className="w-full h-56 rounded-md object-cover"
            alt="Cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            onChange={(e) => handleFileChange(e, "cover")}
            className="hidden"
          />
        </div>

        <div className="flex md:flex-row flex-col justify-between px-6 py-4 bg-white dark:bg-gray-900 dark:text-white">
          <div className="flex items-center">
            <Image
              height={128}
              width={128}
              onClick={() => profileInputRef?.current?.click()}
              title="change picture"
              src={profilePreview || "/person-demo.jpg"}
              className="rounded-full h-32 w-32 object-cover z-10 bg-white -mt-16 border-4 border-gray-900 cursor-pointer"
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              ref={profileInputRef}
              onChange={(e) => handleFileChange(e, "profile")}
              className="hidden"
            />
            <div className="ml-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user?.fullname}</h2>
                {user?.isVerified && (
                  <span className="text-blue-600 font-extrabold text-base pt- hover:text-blue-700">
                    <RiVerifiedBadgeFill />
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Joined :{" "}
                {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <Link href="/profile/settings/edit-profile">
            <button className="md:ml-auto mt-5 md:mt-0 ml-3 md:px-4 px-2 py-2 border dark:border-gray-400 rounded-md bg-gray-800 text-white hover:bg-gray-700">
              Edit Profile
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:text-white flex items-center border-t border-t-gray-700 justify-between px-6 py-1">
          <div className="flex gap-8 p-4 md:p-0">
            <Link href="/profile">
              <h4 className="cursor-pointer">Posts</h4>
            </Link>
            <Link href="/profile/about">
              <h4 className="cursor-pointer">About</h4>
            </Link>
            <Link href="/profile/friends">
              <h4 className="cursor-pointer">Friends</h4>
            </Link>
          </div>
          <div className="absolute md:static mb-36 md:mb-0 flex md:gap-8 gap-2 right-5 pt-2 pb-2">
            <div>
              <h4>Posts</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.postCount || 0}
              </p>
            </div>
            <div>
              <h4>Followers</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.followers?.length || 0}
              </p>
            </div>
            <div>
              <h4>Following</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.following?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 ">{children}</div>
    </div>
  );
}

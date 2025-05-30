"use client";

import useAuthStore from "@/src/store/useAuthStore";
import AxiosInstance from "@/src/lib/axiosInstance";
import { PulseLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useUpdateProfilePhotos } from "@/src/hooks/useUser";

const EditProfile = () => {
  const { user } = useAuthStore();
  const { fetchUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  type EditFormType = {
    fullname: string;
    email: string;
    birthday: string;
    gender: string;
    country: string;
    bio: string;
  };

  const [formData, setFormData] = useState<EditFormType>({
    fullname: "",
    email: "",
    birthday: "",
    gender: "",
    country: "",
    bio: "",
  });

    const {mutate:updatePhotos,isPending} = useUpdateProfilePhotos()
    const [profilePicture, setProfilePreview] = useState(user?.profilePicture)

    useEffect(()=> {
      setProfilePreview(user?.profilePicture || "/person-demo.jpg");
    },[user])
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePreview(URL.createObjectURL(file))
    updatePhotos({profilePicture: file}, {
      onSuccess: ()=> {
        fetchUser()
      }
    })
  };

  const editProfileMutation = useMutation({
    mutationFn: async (editDataToSend: FormData) => {
      return AxiosInstance.put("/user/edit-profile", editDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      fetchUser();
        setIsEditing(false);
    },
  });

  const handleSumbit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const editDataToSend = new FormData();
    if(formData.fullname && formData.fullname !== user?.fullname){
      editDataToSend.append("fullname", formData.fullname);
    }
    if(formData.birthday &&  formData.birthday !== user?.birthday){
      editDataToSend.append("birthday", formData.birthday);
    }
    if(formData.gender && formData.gender !== user?.gender){
      editDataToSend.append("gender", formData.gender);
    }
    if(formData.country && formData.country !== user?.country){
      editDataToSend.append("country", formData.country);
    }
    if(formData.bio && formData.bio !== user?.bio){
      editDataToSend.append("bio", formData.bio);
    }

    editProfileMutation.mutate(editDataToSend);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user?.fullname || "",
        email: user?.email || "",
        birthday: user?.birthday
          ? new Date(user.birthday).toISOString().split("T")[0]
          : "",
        gender: user?.gender || "",
        country: user?.country || "",
        bio: user?.bio || "",
      });
    }
  }, [user]);

  return (
    <div className={editProfileMutation.isPending ? "animate-pulse" : ""}>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100">Edit Profile</h2>
      <div className="flex items-center justify-between gap-4 my-5">
        <div className="flex items-center gap-4">
          <img
            src={profilePicture || "/person-demo.jpg"}
            className={`${isPending && "animate-pulse"} w-16 h-16 border rounded-full`}
            alt="profile-pic"
          />
          <label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="opacity-0 absolute w-32 -mt-3 ml-5"
            />
          </label>
          <h3 className="border p-2 text-sm shadow-md border-gray-400 rounded">
           {isPending ? "Uploading..." : "Change Picture"}
          </h3>
        </div>
        <div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="border px-2 p-1 rounded-md border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700">
            {isEditing ? "Cancel Editing" : "Edit"}
          </button>
        </div>
      </div>

      <form
        className="space-y-4 max-w-3xl mt-5 rounded-lg"
        onSubmit={handleSumbit}
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Fullname</label>
            <input
              type="text"
              className={`${
                isEditing ? "bg-gray-50 dark:bg-gray-700 border-gray-400" : "bg-gray-100 dark:bg-gray-800"
              } p-2 rounded-md border border-gray-300 dark:border-gray-500 focus:ring focus:ring-blue-200 outline-none`}
              placeholder="Full name"
              value={formData.fullname}
              disabled={!isEditing}
              name="fullname"
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              className="p-2 rounded-md bg-gray-100 border border-gray-300 dark:border-gray-600  dark:bg-gray-800 outline-none cursor-not-allowed"
              placeholder="Email"
              value={formData.email}
              name="email"
              disabled
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Birthday</label>
            <input
              type="date"
              value={formData.birthday}
              name="birthday"
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              className={`${
                isEditing ? "bg-gray-50 dark:bg-gray-700 border-gray-400" : "bg-gray-100 dark:bg-gray-800"
              } p-2 rounded-md border border-gray-300 dark:border-gray-500 focus:ring focus:ring-blue-200 outline-none`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Gender</label>
            <select
             className={`${
              isEditing ? "bg-gray-50 dark:bg-gray-700 border-gray-400" : "bg-gray-100 dark:bg-gray-800"
            } p-2 rounded-md border border-gray-300 dark:border-gray-500 focus:ring focus:ring-blue-200 outline-none`}
              value={formData.gender}
              name="gender"
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Country</label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              value={formData.country}
              name="country"
              type="text"
              className={`${
                isEditing ? "bg-gray-50 dark:bg-gray-700 border-gray-400" : "bg-gray-100 dark:bg-gray-800"
              } p-2 rounded-md  border border-gray-300 dark:border-gray-500 focus:ring focus:ring-blue-200 outline-none`}
              placeholder="Country"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-gray-600 font-medium">Bio</label>
          <textarea
            value={formData.bio}
            name="bio"
            disabled={!isEditing}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className={`${
              isEditing ? "bg-gray-50 dark:bg-gray-700 border-gray-400" : "bg-gray-100 dark:bg-gray-800"
            } w-full p-2 rounded-md  border border-gray-300 dark:border-gray-500 focus:ring focus:ring-blue-200 outline-none resize-none h-24`}
            placeholder="Write about yourself..."
          ></textarea>
        </div>

        {isEditing && (
          <div className="mt-6 float-right space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border shadow-sm text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-5 py-2 shadow-sm text-white text-sm rounded-md transition 
              ${
                isEditing
                  ? "bg-black dark:hover:bg-green-500 dark:bg-green-900 dark:border border-gray-200"
                  : "bg-gray-400 cursor-not-allowed opacity-50"
              }`}
              disabled={!isEditing}
            >
              {editProfileMutation.isPending ? (
                <PulseLoader color="white" size={5} />
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;

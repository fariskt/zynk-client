import React from "react";
import { RiUserFill } from "react-icons/ri";
import { FaBirthdayCake } from "react-icons/fa";
import { BsPersonStanding } from "react-icons/bs";
import { FaGlobe } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { RiGraduationCapFill } from "react-icons/ri";
import { TbBrandMinecraft } from "react-icons/tb";
import { PiBagFill } from "react-icons/pi";
import useAuthStore from "../../store/useAuthStore";

const AboutUser = () => {
  const {user} = useAuthStore();
  return (
    <div className="flex justify-between gap-4 pb-5">
      <div className="flex flex-col gap-4 shadow border dark:border-gray-600 w-3/6 mt-5 rounded-md h-fit pb-4 bg-white dark:bg-gray-900 dark:text-white">
        <h3 className="text-left my-4 pb-2 mx-4 border-b font-semibold text-gray-700 dark:text-white">
          Personal info
        </h3>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <RiUserFill />
            </span>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-white">About me</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
           {user?.bio}
          </p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <IoIosMail />
            </span>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-white">Email</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.email}</p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <FaBirthdayCake />
            </span>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-white">Birthday</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
            {user?.birthday && new Date(user.birthday).toISOString().split("T")[0]}
          </p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <BsPersonStanding />
            </span>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-white">Gender</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.gender}</p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <FaGlobe />
            </span>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-white">Country</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.country}</p>
        </div>
      </div>
      <div className="shadow border w-full mt-5 rounded-md bg-white dark:bg-gray-900 dark:border-gray-600">
        <h3 className="text-left my-4 mx-4 pb-2 border-b font-semibold text-gray-700 dark:text-white">
          General Info
        </h3>
        <div className="grid grid-cols-2 px-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="dark:text-white">
                <TbBrandMinecraft />
              </span>
              <h4 className="dark:text-white">Hobbies</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores
              id consequatur officiis ex quos, laborum blanditiis sunt quasi
              vitae incidunt nisi rerum, possimus unde, fugiat eum nostrum
              quaerat maiores saepe.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="dark:text-white">
                <RiGraduationCapFill />
              </span>
              <h4 className="dark:text-white">Education</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id unde
              sed dolorum inventore nulla fuga et! Eveniet ad dignissimos
              possimus iste labore culpa sed, placeat recusandae at ipsam
              nesciunt suscipit!
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="dark:text-white">
                <PiBagFill />
              </span>
              <h4 className="dark:text-white">Work and Experience</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              uia molestias nihil tempore, minus dolores consectetur cumque a
              eius doloremque nesciunt deleniti, blanditiis dolor explicabo!
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default AboutUser;

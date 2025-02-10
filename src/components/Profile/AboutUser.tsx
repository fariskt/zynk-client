import React from "react";
import { RiUserFill } from "react-icons/ri";
import { FaBirthdayCake } from "react-icons/fa";
import { BsPersonStanding } from "react-icons/bs";
import { FaGlobe } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { RiGraduationCapFill } from "react-icons/ri";
import { TbBrandMinecraft } from "react-icons/tb";
import { PiBagFill } from "react-icons/pi";
import useAuthStore from "../store/useAuthStore";

const AboutUser = () => {
  const {user} = useAuthStore();
  return (
    <div className="flex justify-between gap-4 pb-5">
      <div className="flex flex-col gap-4 shadow border w-3/6 mt-5 rounded-md h-fit pb-4 bg-white">
        <h3 className="text-left my-4 pb-2 mx-4 border-b font-semibold text-gray-700">
          Personal info
        </h3>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <RiUserFill />
            </span>
            <h5 className="text-sm font-semibold text-gray-700">About me</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600">
           {user?.bio}
          </p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <IoIosMail />
            </span>
            <h5 className="text-sm font-semibold text-gray-700">Email</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600">{user?.email}</p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <FaBirthdayCake />
            </span>
            <h5 className="text-sm font-semibold text-gray-700">Birthday</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600">
            {user?.birthday && new Date(user.birthday).toISOString().split("T")[0]}
          </p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <BsPersonStanding />
            </span>
            <h5 className="text-sm font-semibold text-gray-700">Gender</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600">{user?.gender}</p>
        </div>
        <div className="ml-4">
          <div className="flex gap-2 items-center">
            <span>
              <FaGlobe />
            </span>
            <h5 className="text-sm font-semibold text-gray-700">Country</h5>
          </div>
          <p className="text-sm ml-6 text-gray-600">{user?.country}</p>
        </div>
      </div>
      <div className="shadow border w-full mt-5 rounded-md bg-white">
        <h3 className="text-left my-4 mx-4 pb-2 border-b font-semibold text-gray-700">
          General Info
        </h3>
        <div className="grid grid-cols-2 px-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span>
                <TbBrandMinecraft />
              </span>
              <h4>Hobbies</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores
              id consequatur officiis ex quos, laborum blanditiis sunt quasi
              vitae incidunt nisi rerum, possimus unde, fugiat eum nostrum
              quaerat maiores saepe.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span>
                <RiGraduationCapFill />
              </span>
              <h4>Education</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id unde
              sed dolorum inventore nulla fuga et! Eveniet ad dignissimos
              possimus iste labore culpa sed, placeat recusandae at ipsam
              nesciunt suscipit!
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span>
                <PiBagFill />
              </span>
              <h4>Work and Experience</h4>
            </div>
            <p className="text-gray-600 text-sm">
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

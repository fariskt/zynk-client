"use client" 

import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { FaBirthdayCake } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa6';
import { RiUserFill } from 'react-icons/ri';
import { useFetchUserById } from '@/src/hooks/useUser';
import UserPostCard from '@/src/components/PostDetails/UserPostCard';
import Activity from '@/src/components/Profile/Activity';


const MemberPage = () => {
  const params = useParams();
  const pathname = usePathname()
  const slug = params?.slug as string;
  const userId = pathname.startsWith("/memebers") && slug?.split('-').pop() || "";  
  
const {data: user} = useFetchUserById(userId)

  return (
    <div >
      <div className="flex md:flex-row flex-col justify-around gap-4">
        <div className="hidden  md:flex flex-col bg-white dark:bg-gray-900 dark:text-gray-200 gap-4 shadow border dark:border-0 md:w-3/6 md:mx-0 mx-3 mt-5 rounded-md h-fit pb-4">
          <h3 className="text-left my-4 mx-4 pb-2 border-b dark:border-b-gray-500 font-semibold text-gray-700 dark:text-gray-200">
            Personal info
          </h3>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <RiUserFill />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">About</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
              {user?.user?.bio}
            </p>
          </div>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <FaBirthdayCake />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Birthday</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
            {user?.user?.birthday && new Date(user?.user?.birthday).toISOString().split("T")[0]}
            </p>
          </div>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <FaGlobe />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Country</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.user?.country}</p>
          </div>
        </div>
        <UserPostCard />
        <Activity />
      </div>
    </div>
  );
};

export default MemberPage;
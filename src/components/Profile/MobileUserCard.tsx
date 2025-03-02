"use client"

import useAuthStore from "@/src/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MobileUserCardProp {
  person: {
    _id: string;
    profilePicture: string;
    fullname: string;
  };
}

const MobileUserCard: React.FC<MobileUserCardProp> = ({ person }) => {
  const slugify = (fullname: string) =>
    fullname.toLowerCase().replace(/\s+/g, "-");

  const { user } = useAuthStore();
  return (
    <div
      key={person._id}
      className="md:hidden block w-full  bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-lg rounded-lg p-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
          height={40}
          width={40}
            src={person.profilePicture || "/person-demo.jpg"}
            className="h-10 w-10 rounded-full object-cover"
            alt="Profile"
          />
          <h5 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center">
            {person.fullname || "Username"}
          </h5>
        </div>

        <div>
          <div className=" right-5 py-2 text-center text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
            <Link
              href={
                person._id === user?._id
                  ? "/profile"
                  : `/members/${slugify(person.fullname)}-${person._id}`
              }
            >
              <button className="w-full px-2">View Profile</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileUserCard;

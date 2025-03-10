"use client"

import Link from "next/link";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex md:flex-row flex-col gap-4 pb-5 mt-10 min-h-96">
      <div className="hidden md:block shadow bg-white p-5 space-y-6 w-1/4 border dark:border-0 rounded dark:bg-gray-900 dark:text-white">
        <div className="flex items-center gap-3">
          <span>
            <IoSettingsOutline />
          </span>
          <Link href="/profile/settings">
            <h4>General settings</h4>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <FaRegEdit />
          </span>
          <Link href="/profile/settings/edit-profile">
            <h4>Edit Profile</h4>
          </Link>
        </div>
      </div>
      <div className="shadow bg-white dark:bg-gray-900 dark:text-white p-5 md:w-3/4 md:mx-0 mx-2 md:px-10 px-5 border dark:border-0 rounded">{children}</div>
    </div>
  );
};

export default SettingsLayout;

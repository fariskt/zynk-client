import { User } from "@/src/types";
import ConnectionListSkeleton from "@/src/utils/SkeltonUi/ConnectionListSkelton";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";

interface SearchUsersProps {
  searchLoading: boolean;
  setSearchInput: (value: string) => void;
  searchedUsers: { data: User[] | null };
  searchInput: string;
}

const SearchUsers: React.FC<SearchUsersProps> = ({
  searchLoading,
  setSearchInput,
  searchedUsers,
  searchInput,
}) => {
  const slugify = (fullname: string) =>
    fullname.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="absolute mt-20 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-y-auto custom-scrollbar max-h-[350px]">
      <button onClick={() => setSearchInput("")} className="text-lg p-2">
        <IoMdArrowBack />
      </button>
      {searchLoading ? (
        <ConnectionListSkeleton />
      ) : searchedUsers?.data && searchedUsers.data.length > 0 ? (
        searchedUsers.data.map((person: any) => (
          <Link
            key={person._id}
            href={`/members/${slugify(person.fullname)}-${person._id}`}
            onClick={() => setSearchInput("")}
          >
            <div
              key={person._id}
              className="flex items-center gap-3 py-3 px-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Image
                src={person.profilePicture || "/person-demo.jpg"}
                height={40}
                width={40}
                alt="User"
                className="h-10 w-10 object-cover rounded-full border border-gray-300"
              />
                <h4 className="flex  items-center gap-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate w-40">
                  {person.fullname || "Username"}
                  {person?.isVerified && (
                  <span className="text-blue-600 font-extrabold text-sm pt- hover:text-blue-700">
                    <RiVerifiedBadgeFill />
                  </span>
                )}
                </h4>

                
            </div>
          </Link>
        ))
      ) : searchInput && !searchLoading ? (
        <div className="text-center text-gray-500 py-4">No users found</div>
      ) : null}
    </div>
  );
};

export default SearchUsers;

import ConnectionListSkeleton from "@/src/utils/SkeltonUi/ConnectionListSkelton";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface User {
  _id: string;
  fullname: string;
  profilePicture?: string;
}

interface SearchUsersProps {
  setSelectChatUser: (user: User | null) => void;
  searchedUsers?: { data?: User[] };
  searchUser: string;
  onClose: () => void;
  setSearchUser: (value: string) => void;
  searchLoading: boolean;
}

const SearchedUsers: React.FC<SearchUsersProps> = ({
  setSelectChatUser,
  searchedUsers,
  searchUser,
  onClose,
  setSearchUser,
  searchLoading,
}) => {
    
    const handleSelectUser = (person: User)=>{
      setSelectChatUser(person)
        onClose()
        setSearchUser("")
    }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-400 dark:bg-gray-900/80 bg-opacity-5 backdrop-blur-sm z-50 p-4">
      {/* Close Button */}
      <button
        className="absolute top-20 right-5 text-gray-700 dark:text-gray-200 text-2xl"
        onClick={onClose}
      >
        <AiOutlineClose />
      </button>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md ">
        <h2 className="text-center my-4 text-lg">Add New Chat</h2>
        {/* Search Input (Moved Outside the Map) */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border dark:border-gray-500 w-full rounded-3xl px-3 pl-10 py-2 bg-transparent focus:outline-none mb-3"
        />
        <div className="h-64 overflow-y-auto custom-scrollbar">
          {searchLoading ? (
            <ConnectionListSkeleton />
          ) : searchedUsers?.data && searchedUsers.data.length > 0 ? (
            searchedUsers.data.map((person) => (
              <div
                key={person._id}
                className="flex items-center gap-3 py-3 px-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/20 rounded-lg"
                onClick={() => handleSelectUser(person) }
              >
                <img
                  src={person.profilePicture || "/person-demo.jpg"}
                  alt="User"
                  className="h-10 w-10 object-cover rounded-full"
                />
                <span className="text-sm font-medium">
                  {person.fullname || "Username"}
                </span>
              </div>
            ))
          ) : searchUser && !searchLoading ? (
            <div className="text-center text-gray-500">No users found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchedUsers;

export interface User {
  _id: string;
  profilePicture: string | null;
  coverPhoto?: string | null;
  fullname: string;
  email: string;
  birthday: string;
  gender: string;
  country: string;
  bio: string;
  postCount: number;
  following: string[];
  followers: string[];
  isVerified:boolean;
  isPremium:boolean;
  role: string;
  createdAt:string;
}

export interface Activity {
  type: "comment" | "like";
  user: {
    fullname: string;
    profilePicture: string;
  };
  postTitle: string;
  postOwner?: {
    fullname: string;
  };
  content?: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  userId:User;
  likes: string[];
  content: string;
  image?: string;
  commentCount?: number;
  isScheduled?:boolean;
  scheduleTime?:string| null;
  hideComments?: boolean;
  createdAt?: string;
}

export interface Comment {
  _id: string;
  createdAt: string;
  likes: string[];
  text: string;
  user: {
    fullname: string;
    username?: string;
    profilePicture: string;
  };
  replyCount?:number
}

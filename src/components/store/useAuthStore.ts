import AxiosInstance from "@/src/lib/axiosInstance";
import { create } from "zustand";

interface User {
  id: string;
  profilePicture: string | null;
  fullname: string;
  email: string;
  birthday: string;
  gender: string;
  country: string;
  bio: string;
  following: string[];
  followers: string[];
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const { data } = await AxiosInstance.get("/auth/me");
      set({ user: data?.user, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ isLoading: false });
    }
  }
}));

export default useAuthStore;

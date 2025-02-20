import AxiosInstance from "@/src/lib/axiosInstance";
import { User } from "@/src/types";
import { create } from "zustand";



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

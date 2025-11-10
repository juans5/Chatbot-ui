import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userState {
  userId: string | null;
  name: string | null;
  setUser: (userId: string, name: string) => void;
  logOut: () => void;
}

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      userId: null,
      name: null,
      setUser: (userId, name) => {
        set({ userId, name });
      },
      logOut: () => {
        set({ userId: null, name: null });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

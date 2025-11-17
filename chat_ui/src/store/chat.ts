import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { useUserStore } from "./user";

interface ChatState {
  message: FormattedMessage[];
  loading: boolean;
  loadChatHistory: () => Promise<void>;
  sendMessage: (messag: string) => Promise<void>;
}

interface ChatMessage {
  message: string;
  reply: string;
}

interface FormattedMessage {
  role: "ai" | "user";
  content: string;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      message: [] as FormattedMessage[],
      loading: false,

      // Load previous chat messages
      loadChatHistory: async () => {
        const userStore = useUserStore.getState();

        if (!userStore.userId) return;
        set({ loading: true });

        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/get-messages`, {
            userId: userStore.userId,
          });

          const formatted = data.message
            .flatMap((msg: ChatMessage): FormattedMessage[] => [
              { role: "user", content: msg.message },
              { role: "ai", content: msg.reply },
            ])
            .filter((msg: FormattedMessage) => msg.content);

          set({ message: formatted });
        } catch (err) {
          console.error(`Something bad happened getting Chat history: `, err);
        } finally {
          set({ loading: false });
        }
      },

      sendMessage: async (messag) => {
        const userStore = useUserStore.getState();

        if (!messag.trim() || !userStore.userId) return;
        // Agregar mensaje de user
        set((state) => ({
          message: [...state.message, { role: "user", content: messag }],
        }));

        set({ loading: true });

        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
            message: messag,
            userId: userStore.userId,
          });

          // Agregar la respuesta de la AI
          set((state) => ({
            message: [...state.message, { role: "ai", content: data.reply }],
          }));
        } catch (err) {
          console.error(`Error Sending message: `, err);
          set((state) => ({
            message: [...state.message, { role: "ai", content: "Error making the request" }],
          }));
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "chat-store",
      partialize: (state) => ({ message: state.message }),
      onRehydrateStorage: () => (state) => {
        console.log("rehidratado:", state?.message?.length, "messages");
      },
    }
  )
);

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { useChatStore } from "../store/chat";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, loading } = useChatStore();
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    try {
      await sendMessage(message);
      setMessage("");

      // Resetear textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error("Error enviando mensaje de input a AI, HandleSendMessage", err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="w-[80%] mx-auto mb-5 rounded-4xl px-4 py-1 bg-gray-800 relative border-t border-gray-700"
    >
      <textarea
        ref={textareaRef}
        className="scrollbar-minimal w-[92%] min-h-14 max-h-52 px-5 py-4 text-base rounded-2xl
         placeholder-gray-500 resize-none outline-none
        transition-all duration-200 overflow-y-hidden"
        placeholder="Type your message... (Shift + Enter for new line)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        maxLength={1000}
        rows={1}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
          el.style.overflowY = el.scrollHeight > el.clientHeight ? "auto" : "hidden";
        }}
      />
      <button
        type="submit"
        disabled={!message || loading}
        className={`
              absolute bottom-3.5 right-3.5
              flex items-center justify-center
              w-11 h-11 rounded-full
              transition-all duration-300 ease-out
              ${
                message && !loading
                  ? "bg-cyan-500 text-black opacity-100 scale-100 shadow-lg shadow-cyan-500/30"
                  : "bg-gray-600 text-gray-400 opacity-50 scale-90"
              }
              hover:bg-cyan-400 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/40
              active:scale-95
              disabled:cursor-not-allowed
            `}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        )}
      </button>
    </form>
  );
};

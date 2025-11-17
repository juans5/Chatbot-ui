import { Header } from "../components/Header";
import { useUserStore } from "../store/user";
import { useChatStore } from "../store/chat";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInput } from "../components/ChatInput";

const ChatView = () => {
  const navigate = useNavigate();

  const userIdStore = useUserStore((state) => state.userId);
  const { message, loading, loadChatHistory } = useChatStore();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // si el usuario no esta loggeado entonces se enviara al home
  if (!userIdStore) {
    navigate("/");
  }

  // Format AI messages for better display
  const formatMessage = (text: string): string => {
    if (!text) return "";

    const formatted: string = text
      // Escapar HTML especial primero para evitar inyecciones
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

      // Enlaces [texto](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300">$1</a>'
      )

      // Código en bloque ```lang\ncodigo```
      .replace(/```([a-z]*)\n([\s\S]*?)```/g, (code: string): string => {
        return `<pre class="bg-gray-900 p-3 rounded my-2 overflow-x-auto"><code class="text-sm text-green-400 font-mono">${code.trim()}</code></pre>`;
      })

      // Negritas **texto**
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-white'>$1</strong>")

      // Itálicas *texto* (pero no **texto**)
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em class='italic text-gray-200'>$1</em>")

      // Código inline `codigo`
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-yellow-400 font-mono text-sm">$1</code>')

      // Titulos # Titulo
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-cyan-300 mt-3 mb-2">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-cyan-200 mt-4 mb-2">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-cyan-100 mt-5 mb-3">$1</h1>')

      // Listas numeradas
      .replace(/^\d+\.\s+(.*?)$/gm, '<li class="ml-4">$1</li>')

      // Listas con guiones
      .replace(/^-\s+(.*?)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^•\s+(.*?)$/gm, '<li class="ml-4">$1</li>')

      // Envolver items en <ul>
      .replace(/(<li class="ml-4">.*?<\/li>)/s, (match: string): string => `<ul class="list-disc my-2">${match}</ul>`)

      // Saltos de línea
      .replace(/\n/g, "<br>")

      // Citas > cita
      .replace(
        /^&gt; (.*?)$/gm,
        '<blockquote class="border-l-4 border-cyan-500 pl-4 italic text-gray-300 my-2">$1</blockquote>'
      )

      // Línea horizontal ---
      .replace(/^---$/gm, '<hr class="border-gray-600 my-4">')

      // Tablas simples | encabezado |
      .replace(/^\|(.+)\|$/gm, (match: string): string => {
        const cells: string[] = match.split("|").filter((c: string) => c.trim());
        return `<div class="flex gap-2 p-2 bg-gray-800 rounded my-1">${cells
          .map((c: string) => `<span class="flex-1">${c.trim()}</span>`)
          .join("")}</div>`;
      });

    return formatted;
  };

  // Funcion para hacer el scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Carga historial en el primer render del chat y scroll to bottom
  useEffect(() => {
    if (userIdStore) {
      loadChatHistory().then(() => {
        scrollToBottom();
      });
    }
  }, [userIdStore, loadChatHistory]);

  // Scroll cada mensaje nuevo
  useEffect(() => {
    scrollToBottom();
  }, [message]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />

      {/* Chat messages */}
      <div
        id="chat-container"
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-minimal"
      >
        {message.map((msg, index) => (
          <div key={index} className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg md:max-w-md ${
                msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            ></div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatView;

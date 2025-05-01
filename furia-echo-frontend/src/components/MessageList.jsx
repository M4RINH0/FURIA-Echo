import { useEffect, useRef } from "react";
import userAvatar from "../assets/avatars/user.jpg";

export default function MessageList({ messages }) {
  const chatRef = useRef(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatRef}
      className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 custom-scrollbar"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
        >
          {/* avatar à esquerda das msgs do eco */}
          {!msg.isUser && (
            <img
              src={msg.avatar ?? "/api/placeholder/36/36"}
              alt={msg.sender}
              className="w-9 h-9 rounded-full mr-3 flex-shrink-0"
            />
          )}

          {/* bolha */}
          <div
            className={`max-w-[70%] sm:max-w-[60%] px-4 py-2 rounded-3xl shadow
              ${
                msg.isUser
                  ? "bg-gray-800/80 rounded-br-none"
                  : "bg-gray-600/70 rounded-bl-none"
              }
              text-white break-words`}
            style={{ whiteSpace: "pre-wrap" }} // Adicionado para respeitar \n
          >
            {msg.content}
          </div>

          {/* avatar do usuário à direita */}
          {msg.isUser && (
            <img
              src={userAvatar}
              alt="User"
              className="w-9 h-9 rounded-full ml-3 flex-shrink-0"
            />
          )}
        </div>
      ))}
    </div>
  );
}
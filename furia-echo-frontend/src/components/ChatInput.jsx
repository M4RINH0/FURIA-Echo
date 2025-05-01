import { useState, useRef, useEffect } from "react";
import { Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function ChatInput({ onSendMessage }) {
  const [text, setText] = useState("");
  const [showPicker, setShow] = useState(false);
  const pickerRef = useRef(null);

  /* fecha o picker ao clicar fora */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText("");
      setShow(false);
    }
  };

  const handleSelectEmoji = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 bg-[rgba(27,31,38,0.6)] backdrop-blur">
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-20 right-4 z-50 bg-[#1d1f23] rounded-xl shadow-lg"
        >
          <EmojiPicker
            theme="dark"
            height={350}
            width={280}
            onEmojiClick={(emojiData /*, event*/) =>
              handleSelectEmoji(emojiData)
            }
          />
        </div>
      )}
      <div className="flex items-center bg-gray-700/60 rounded-full px-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-transparent outline-none text-white py-3"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* botão emoji */}
        <button
          className="text-gray-300 hover:text-white mr-2"
          onClick={() => setShow((prev) => !prev)}
          type="button"
        >
          <Smile size={20} />
        </button>

        {/* botão enviar */}
        <button
          className="text-gray-300 hover:text-white"
          onClick={handleSend}
          type="button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

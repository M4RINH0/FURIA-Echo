import { useState } from 'react';
import { Smile, Calendar, Video } from 'lucide-react';

export default function ChatInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="p-4 border-t border-gray-800 border-opacity-50">
      <div className="flex items-center bg-gray-700 bg-opacity-50 rounded-full">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-transparent border-none focus:outline-none text-white px-4 py-3 rounded-full"
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        <div className="flex space-x-2 px-3">
          <button className="text-gray-400 p-1">
            <Smile size={20} />
          </button>
          <button className="text-gray-400 p-1">
            <Calendar size={20} />
          </button>
          <button className="text-gray-400 p-1" onClick={handleSendMessage}>
            <Video size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
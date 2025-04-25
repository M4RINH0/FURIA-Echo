import React from 'react';

export default function ConversationList({ conversations, activeConversation, onSelectConversation }) {
  return (
    <div className="flex-1">
      {conversations.map(convo => (
        <div 
          key={convo.id} 
          className={`px-4 py-3 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer flex items-center ${
            activeConversation === convo.id ? 'bg-gray-800 bg-opacity-40' : ''
          }`}
          onClick={() => onSelectConversation(convo.id)}
        >
          <div className="flex-shrink-0">
            <img src={convo.avatar} alt={convo.name} className="w-10 h-10 rounded-full" />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <span className="font-medium">{convo.name}</span>
              <span className="text-xs text-gray-400">{convo.time}</span>
            </div>
            <p className="text-sm text-gray-400 truncate">{convo.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
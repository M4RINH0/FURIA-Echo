import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';

export default function ChatSidebar({ conversations, activeConversation, onSelectConversation }) {
  return (
    <div 
      className="flex flex-col" // Adicione h-full aqui
      style={{ 
        backgroundColor: 'rgba(20, 23, 28, 0.9)',
      }}
    >
      <SearchBar />
      <div className="flex-1 overflow-y-auto"> {/* Adicione um contêiner para permitir a rolagem */}
        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={onSelectConversation}
        />
      </div>
    </div>
  );
}
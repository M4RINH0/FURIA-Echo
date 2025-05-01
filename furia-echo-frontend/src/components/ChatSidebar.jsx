import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';

export default function ChatSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
}) {
  const [query, setQuery] = useState('');

  /* filtra por nome ou última mensagem */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  }, [query, conversations]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'rgba(20,23,28,0.9)' }}
    >
      <SearchBar query={query} onChange={setQuery} />

      {/* lista rola se for maior que a área */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={filtered}
          activeConversation={activeConversation}
          onSelectConversation={onSelectConversation}
        />
      </div>
    </div>
  );
}

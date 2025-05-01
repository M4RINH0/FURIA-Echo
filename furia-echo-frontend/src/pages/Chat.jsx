// src/pages/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import backgroundImage from '../assets/background.png';

import ChatSidebar from '../components/ChatSidebar';
import ChatArea    from '../components/ChatArea';

import {
  ECHOS,
  fetchMessages,
  sendMessage,
} from '../services/ChatServices';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [messagesById,  setMessagesById]  = useState({});   // { ecoId: [...] }
  const [activeId,      setActiveId]      = useState(null);
  const [scale,         setScale]         = useState(1);
  const containerRef                      = useRef(null);

  /* ── escala do frame ─────────────────────────────────────────────── */
  useEffect(() => {
    const calcScale = () => {
      const s = Math.min(window.innerWidth / 1366, window.innerHeight / 768, 1.5);
      setScale(s);
    };
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  /* ecos são fixos */
  useEffect(() => {
    setConversations(ECHOS);
    setActiveId(ECHOS[0].id);
  }, []);

  /* ── carrega msgs da conversa ativa ──────────────────────────────── */
  useEffect(() => {
    if (!activeId || messagesById[activeId]) return;
    fetchMessages(activeId)
      .then(ms => setMessagesById(prev => ({ ...prev, [activeId]: ms })))
      .catch(console.error);
  }, [activeId, messagesById]);

  /* ── envio de mensagem ───────────────────────────────────────────── */
  const handleSendMessage = async (text) => {
    if (!activeId) return;

    const msgUser = { id: crypto.randomUUID(), sender: 'User', content: text, isUser: true };
    setMessagesById(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), msgUser],
    }));

    try {
      const { reply, avatar } = await sendMessage(activeId, text);

      const msgEcho = { id: crypto.randomUUID(), sender: 'eco', content: reply, isUser: false, avatar };
      setMessagesById(prev => ({
        ...prev,
        [activeId]: [...prev[activeId], msgEcho],
      }));

      // atualiza lastMessage/time na sidebar
      setConversations(prev =>
        [...prev].map(c =>
          c.id === activeId ? { ...c, lastMessage: reply, time: new Date() } : c
        ).sort((a,b) => new Date(b.time) - new Date(a.time))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ── dados atuais ────────────────────────────────────────────────── */
  const currentConvo = conversations.find(c => c.id === activeId);
  const currentMsgs  = messagesById[activeId] ?? [];

  /* ── UI ──────────────────────────────────────────────────────────── */
  return (
    <div className="flex justify-center items-center min-h-screen bg-no-repeat bg-cover bg-center"
         style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div ref={containerRef}
           className="flex rounded-2xl overflow-hidden shadow-xl"
           style={{ width:'1200px', height:'700px', transform:`scale(${scale})`, transformOrigin:'center' }}>
        <div className="w-[421px] h-full bg-[rgba(20,23,28,0.7)]">
          <ChatSidebar
            conversations={conversations}
            activeConversation={activeId}
            onSelectConversation={setActiveId}
          />
        </div>
        <div className="flex-1 bg-[rgba(27,31,38,0.5)]">
          <ChatArea
            conversation={currentConvo}
            messages={currentMsgs}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import backgroundImage from '../assets/background.png';
import ChatSidebar from '../components/ChatSidebar';
import ChatArea from '../components/ChatArea';
import { fetchConversations, fetchMessages, sendMessage } from '../services/chatService';
import fallen from '../assets/fallen.jpg';
import guerri from '../assets/guerri.webp';
import kscerato from '../assets/kscerato.jpg';
import yuurih from '../assets/yuurih.jpg';
import sidde from '../assets/sidde.jpg';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [currentConversationData, setCurrentConversationData] = useState(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // Calcular a escala baseada na resolução da tela
  useEffect(() => {
    const calculateScale = () => {
      // Tamanho de referência: 1366x768
      const referenceWidth = 1366;
      const referenceHeight = 768;
      
      // Dimensões atuais da janela
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calcular escalas para largura e altura
      const widthScale = windowWidth / referenceWidth;
      const heightScale = windowHeight / referenceHeight;
      
      // Usar a menor escala para garantir que o frame caiba na tela
      const newScale = Math.min(widthScale, heightScale, 1.5); // limitando a escala máxima a 1.5x
      
      setScale(newScale);
    };

    // Calcular escala inicial
    calculateScale();
    
    // Recalcular quando a janela for redimensionada
    window.addEventListener('resize', calculateScale);
    
    // Limpar listener quando o componente for desmontado
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Simular dados para prototipagem
  useEffect(() => {
    // Em produção, substituir por chamadas reais ao serviço
    const convos = [
        { id: 1, name: 'FalleN', lastMessage: 'Saudades Chelo...', time: '12:30', avatar: fallen },
        { id: 2, name: 'Guerri', lastMessage: 'Não foi assim que ensinei sidde', time: '8:06', avatar: guerri },
        { id: 3, name: 'KSCERATO', lastMessage: 'HOJE TEM HEHE', time: '7:35', avatar: kscerato },
        { id: 4, name: 'yuurih', lastMessage: 'Foi por pouco.', time: '5:45', avatar: yuurih },
        { id: 5, name: 'sidde', lastMessage: 'É levantar a cabeça e ir pra proxima', time: '00:35', avatar: sidde },
    ];
    setConversations(convos);
    setActiveConversation(1);
    
    const msgs = [
      { id: 1, sender: 'FalleN', content: 'Tivemos que fazer a troca!', isUser: false },
      { id: 2, sender: 'User', content: 'Mas porque o YEKINDAR?', isUser: true },
      { id: 3, sender: 'FalleN', content: 'Foi a opção que tinhamos no mercado', isUser: false },
      { id: 4, sender: 'User', content: 'Saudades Chelo...', isUser: true },
    ];
    setMessages(msgs);
  }, []);

  // Quando a conversa ativa muda, atualize os dados da conversa atual
  useEffect(() => {
    if (activeConversation) {
      const currentConvo = conversations.find(c => c.id === activeConversation);
      setCurrentConversationData(currentConvo);
    }
  }, [activeConversation, conversations]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversation(conversationId);
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'User',
      content: text,
      isUser: true,
    };
    
    setMessages([...messages, newMessage]);
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen w-full bg-no-repeat bg-cover bg-center" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Chat Frame Container com dimensões exatas e escala */}
      <div 
        ref={containerRef}
        className="flex rounded-2xl overflow-hidden shadow-xl"
        style={{ 
          width: '1200px',
          height: '700px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <div 
          className="flex flex-col" 
          style={{ 
            width: '421px',
            height: '700px',
            backgroundColor: 'rgba(20, 23, 28, 0.7)',
          }}
        >
          <ChatSidebar 
            conversations={conversations} 
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div 
          className="flex-1 flex flex-col" 
          style={{ 
            width: '779px',
            height: '700px',
            backgroundColor: 'rgba(27, 31, 38, 0.5)',
          }}
        >
          <ChatArea 
            conversation={currentConversationData}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
// Aqui você implementará as chamadas para a API/backend

// Obter todas as conversas
export const fetchConversations = async () => {
    // Em produção: const response = await fetch('/api/conversations');
    // return await response.json();
    
    // Dados simulados para desenvolvimento
    return [
      { id: 1, name: 'FalleN', lastMessage: 'Saudades Chelo...', time: '12:30', avatar: '/api/placeholder/40/40' },
      { id: 2, name: 'Guerri', lastMessage: 'Não foi assim que ensinei sidde', time: '8:06', avatar: '/api/placeholder/40/40' },
      { id: 3, name: 'KSCERATO', lastMessage: 'HOJE TEM HEHE', time: '7:35', avatar: '/api/placeholder/40/40' },
      { id: 4, name: 'yuurih', lastMessage: 'Foi por pouco.', time: '5:45', avatar: '/api/placeholder/40/40' },
      { id: 5, name: 'sidde', lastMessage: 'É levantar a cabeça e ir pra proxima', time: '00:35', avatar: '/api/placeholder/40/40' },
    ];
  };
  
  // Obter mensagens de uma conversa específica
  export const fetchMessages = async (conversationId) => {
    // Em produção: const response = await fetch(`/api/conversations/${conversationId}/messages`);
    // return await response.json();
    
    // Dados simulados para desenvolvimento
    const messagesMap = {
      1: [
        { id: 1, sender: 'FalleN', content: 'Tivemos que fazer a troca!', isUser: false },
        { id: 2, sender: 'User', content: 'Mas porque o YEKINDAR?', isUser: true },
        { id: 3, sender: 'FalleN', content: 'Foi a opção que tinhamos no mercado', isUser: false },
        { id: 4, sender: 'User', content: 'Saudades Chelo...', isUser: true },
      ],
      2: [
        { id: 1, sender: 'Guerri', content: 'Não foi assim que ensinei sidde', isUser: false },
        { id: 2, sender: 'User', content: 'Entendi coach', isUser: true },
      ],
      // Adicione outros conforme necessário
    };
    
    return messagesMap[conversationId] || [];
  };
  
  // Enviar uma mensagem
  export const sendMessage = async (conversationId, text) => {
    // Em produção: 
    // const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: text })
    // });
    // return await response.json();
    
    // Simulação de resposta para desenvolvimento
    return {
      id: Date.now(),
      sender: 'User',
      content: text,
      isUser: true,
      timestamp: new Date().toISOString()
    };
  };
  
  // Futuras funções para integração com o backend Django
  export const connectToWebSocket = () => {
    // Implementação da conexão websocket para chat em tempo real
  };
import userAvatar from '../assets/avatars/user.jpg';

export default function MessageList({ messages }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
        >
          {/* avatar à esquerda das msgs do eco */}
          {!msg.isUser && (
            <img
              src={msg.avatar ?? '/api/placeholder/36/36'}
              alt={msg.sender}
              className="w-9 h-9 rounded-full mr-3 flex-shrink-0"
            />
          )}
        
          {/* bolha */}
          <div
            className={`max-w-[70%] sm:max-w-[60%] px-4 py-2 rounded-3xl shadow
                        ${msg.isUser
                          ? 'bg-gray-800/80 rounded-br-none'
                          : 'bg-gray-600/70 rounded-bl-none'}
                        text-white break-words`}
          >
            {/* nome do eco opcional */}
            {!msg.isUser && (
              <span className="block text-xs font-semibold mb-1 text-white">
                {msg.sender}
              </span>
            )}

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

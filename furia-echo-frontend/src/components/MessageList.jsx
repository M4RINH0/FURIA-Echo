export default function MessageList({ messages }) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="flex-shrink-0 mr-3">
                <img src="/api/placeholder/36/36" alt="Avatar" className="w-9 h-9 rounded-full" />
              </div>
            )}
            <div 
              className={`rounded-lg py-2 px-4 max-w-xs ${
                message.isUser 
                  ? 'bg-gray-800 bg-opacity-70 text-white rounded-br-none' 
                  : 'bg-gray-700 bg-opacity-70 text-white rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
            {message.isUser && (
              <div className="flex-shrink-0 ml-3">
                <img src="/api/placeholder/36/36" alt="User" className="w-9 h-9 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
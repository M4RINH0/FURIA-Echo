import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatArea({ conversation, messages, onSendMessage }) {
  return (
    <div 
      className="flex-1 flex flex-col"
      style={{ 
        backgroundColor: 'rgba(27, 31, 38, 0.5)',
      }}
    >
      <ChatHeader name={conversation?.name} />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
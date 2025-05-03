import ChatHeader  from './ChatHeader';
import MessageList from './MessageList';
import ChatInput   from './ChatInput';

export default function ChatArea({
  conversation,
  messages,
  onSendMessage,
  onResetChat,
}) {
  return (
    /*  <- 1 linha importante:  flex + h-full  */
    <div className="flex flex-col h-full flex-1 bg-[rgba(27,31,38,0.5)]">
      <ChatHeader
        name={conversation?.name}
        avatar={conversation?.avatar}
        canReset={true}
        onReset={onResetChat}
      />

      {/* lista ocupa todo o resto do espaço */}
      <MessageList messages={messages} className="flex-1" />

      {/* input fica colado embaixo */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}

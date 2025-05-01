import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatArea({ conversation, messages, onSendMessage }) {
  return (
    <div className="flex flex-col h-full">
      {" "}
      {/* garante colunas e altura total */}
      <ChatHeader name={conversation?.name} avatar={conversation?.avatar} />
      {/* lista ocupa todo o espaço restante, mesmo vazia  */}
      <MessageList messages={messages} />
      {/* fica fixo no rodapé do contêiner */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}

export default function ConversationList({
  conversations,
  activeConversation,
  onSelectConversation,
}) {
  return (
    /* 5 linhas + gap maior */
    <div className="grid grid-rows-5 gap-4 h-full">
      {conversations.map((convo) => {
        const active = activeConversation === convo.id;

        return (
          <button
            key={convo.id}
            onClick={() => onSelectConversation(convo.id)}
            className={`w-full flex items-center px-4 rounded-xl
                        ${active ? 'bg-gray-500/40' : 'hover:bg-gray-500/20'}`}
          >
            <img
              src={convo.avatar}
              alt={convo.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />

            <div className="ml-3 flex-1 overflow-hidden text-left">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white truncate">
                  {convo.name}
                </span>
                {convo.time && (
                  <span className="text-xs text-gray-300 whitespace-nowrap">
                    {convo.time}
                  </span>
                )}
              </div>

              {convo.lastMessage && (
                <p className="text-sm text-gray-300 truncate">
                  {convo.lastMessage}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function ChatHeader({ name, avatar }) {
  if (!name) return null;               // nada selecionado

  return (
    <div className="p-4 border-b border-gray-800/50 flex items-center">
      {/* avatar antes do nome */}
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-lg object-cover mr-3"
      />

      <h2 className="text-xl font-bold text-white">{name}</h2>

      {/* espaço para possíveis ícones de ações à direita */}
      <div className="ml-auto">
        <button className="p-2 text-gray-400 hover:text-white">
          <span className="text-xl">⋯</span>
        </button>
      </div>
    </div>
  );
}

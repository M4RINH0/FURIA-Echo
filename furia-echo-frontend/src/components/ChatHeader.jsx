export default function ChatHeader({ name }) {
    return (
      <div className="p-4 border-b border-gray-800 border-opacity-50 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        <div>
          <button className="p-2 text-gray-400">
            <span className="text-xl">⋯</span>
          </button>
        </div>
      </div>
    );
  }
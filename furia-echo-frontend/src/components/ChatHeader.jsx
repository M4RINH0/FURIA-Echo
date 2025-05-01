import { useState, useRef, useEffect } from 'react';

export default function ChatHeader({ name, avatar, canReset, onReset }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* fecha menu ao clicar fora */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!name) return null;

  return (
    <div className="p-4 border-b border-gray-800/50 flex items-center relative">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-lg object-cover mr-3" />
      <h2 className="text-xl font-bold text-white">{name}</h2>

      {/* botão ⋯ */}
      <div className="ml-auto relative" ref={menuRef}>
        <button
          className="p-2 text-gray-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          <span className="text-xl">⋯</span>
        </button>

        {/* dropdown */}
        {open && canReset && (
          <div className="absolute right-0 mt-1 w-40 bg-gray-700 rounded-md shadow-lg z-20">
            <button
              onClick={() => { onReset(); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              🔄 Reiniciar chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Search } from 'lucide-react';

export default function SearchBar({ query, onChange }) {
  return (
    <div className="p-4">
      <div className="bg-gray-800/60 rounded-full flex items-center px-4 py-2">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquise Aqui"
          className="bg-transparent border-none focus:outline-none text-white ml-2 w-full placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="p-4">
      <div className="bg-gray-800 bg-opacity-50 rounded-full flex items-center px-4 py-2">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Pesquise Aqui" 
          className="bg-transparent border-none focus:outline-none text-white ml-2 w-full"
        />
      </div>
    </div>
  );
}
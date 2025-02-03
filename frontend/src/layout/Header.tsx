import { useState, useEffect } from "react";
import { Search, FilterIcon } from "lucide-react";
import SortButton from "../components/Buttons/SortButton";

interface Note {
  title: string;
  content: string;
  type: string;
  timestamp: Date;
}

interface HeaderProps {
  notes: Note[];
  setFilteredNotes: (notes: Note[]) => void;
}

const Header: React.FC<HeaderProps> = ({ notes, setFilteredNotes }) => {
  const [isAscending, setIsAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const filtered = notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || note.type === filterType;
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      if (isAscending) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      } else {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

    setFilteredNotes(filtered);
  }, [filterType, isAscending, searchTerm, setFilterType]);

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 border-gray-200">
      <div className="flex items-center gap-2 ">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">AI</span>
        </div>
        <h1 className="text-lg font-bold font-sans">Insight.AI</h1>
      </div>
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border-2 shadow-sm border-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/45"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <select
            className="
      appearance-none
      w-full
      pl-3 pr-10
      py-2
      rounded-full
      font-medium
      text-md
      transition-all duration-300 ease-in-out
      bg-gradient-to-br from-indigo-50 to-indigo-100
      hover:from-indigo-100 hover:to-indigo-200
      text-indigo-700/55
      focus:outline-none 
      focus:ring-2 
      focus:ring-indigo-100
      focus:ring-offset-1
      disabled:opacity-50 
      disabled:cursor-not-allowed
    "
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all" className="text-gray-900">
              All Types
            </option>
            <option value="text" className="text-gray-900">
              Text Notes
            </option>
            <option value="audio" className="text-gray-900">
              Audio Notes
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FilterIcon className="w-5 h-5 text-indigo-700/55" />
          </div>
        </div>

        <SortButton isAscending={isAscending} onClick={toggleSortOrder} />
      </div>
    </header>
  );
};

export default Header;

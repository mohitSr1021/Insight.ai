import { useState, useEffect } from "react";
import { Search, FilterIcon } from "lucide-react";
import SortButton from "../components/Buttons/SortButton";
import useLayoutStatus from "../Hooks/useLayoutStatus";

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

const Header: React.FC<HeaderProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const { current } = useLayoutStatus();

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">AI</span>
        </div>
        <h1 className="text-lg font-bold font-sans">Insight.AI</h1>
      </div>

      {/* Mobile / Desktop Layout - Search Input & Filter */}
      <div
        className={`flex ${current === "xs" || current === "sm"
          ? "flex-col items-center gap-2 w-full"
          : "flex-1 items-center gap-2"
          }`}
      >
        {/* Search Input */}
        <div
          className={`relative w-full ${current === "xs" || current === "sm" ? "mb-2" : ""
            }`}
        >
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border-2 shadow-sm border-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/45"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div
          className={` ${current === "xs" || current === "sm"
            ? "flex items-center gap-2"
            : "flex items-center gap-2"
            }`}
        >
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              className="
              appearance-none
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
          {/* Sort Button */}
          <div className="w-full md:w-auto md:mt-0">
            <SortButton isAscending={isAscending} onClick={toggleSortOrder} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

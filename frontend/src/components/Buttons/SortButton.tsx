import { ArrowDown, ArrowUp } from "lucide-react";

interface SortButtonProps {
    isAscending: boolean;
    onClick: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ isAscending, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
          group
          relative
          flex items-center justify-center
          gap-2.5 px-5 py-2
          rounded-full
          font-medium
          text-md        transition-all duration-300 ease-in-out
          ${isAscending
                    ? "bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700/55"
                    : "bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700/55"
                }
          before:absolute
          before:inset-0
          before:rounded-full
          before:transition-opacity
          before:duration-300
          before:bg-white
          before:opacity-0
          hover:before:opacity-5
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-100 
          focus:ring-offset-1
          disabled:opacity-50 
          disabled:cursor-not-allowed
          disabled:active:scale-100
        `}
            aria-label={`Sort ${isAscending ? "ascending" : "descending"}`}
            title={`Sort ${isAscending ? "ascending" : "descending"}`}
        >
            <div className="relative flex items-center gap-2.5">
                <div className="transform transition-transform duration-300 ease-in-out">
                    {isAscending ? (
                        <ArrowUp
                            size={16}
                            className="transition-colors duration-300"
                            strokeWidth={2.5}
                        />
                    ) : (
                        <ArrowDown
                            size={16}
                            className="transition-colors duration-300"
                            strokeWidth={2.5}
                        />
                    )}
                </div>
                <span className="relative tracking-wide">Sort</span>
            </div>
        </button>
    );
};

export default SortButton

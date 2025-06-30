import React, { useState } from "react";
import {
  ChevronDown,
  ArrowUpDown,
  Clock,
  ArrowUp,
  ArrowDown,
  Check,
} from "lucide-react";

type SortOption = "default" | "az" | "za" | "oldest";

interface SortDropdownProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortOption,
  setSortOption,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    {
      value: "default" as const,
      label: "Newest First",
      icon: <Clock size={16} className="text-blue-500" />,
      description: "Most recently added",
    },
    {
      value: "oldest" as const,
      label: "Oldest First",
      icon: <Clock size={16} className="text-amber-500" />,
      description: "First added items",
    },
    {
      value: "az" as const,
      label: "A → Z",
      icon: <ArrowDown size={16} className="text-green-500" />,
      description: "Alphabetical order",
    },
    {
      value: "za" as const,
      label: "Z → A",
      icon: <ArrowUp size={16} className="text-purple-500" />,
      description: "Reverse alphabetical",
    },
  ];

  const currentOption = sortOptions.find((opt) => opt.value === sortOption);

  const handleSelect = (value: SortOption) => {
    setSortOption(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm min-w-[140px]"
      >
        <ArrowUpDown size={16} className="text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium flex-1 text-left">
          {currentOption?.label || "Sort"}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-20 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[180px] p-2 space-y-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  sortOption === option.value
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0">{option.icon}</div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                {sortOption === option.value && (
                  <Check
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;

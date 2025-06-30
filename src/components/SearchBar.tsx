import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exactMatch: boolean;
  setExactMatch: (exact: boolean) => void;
  totalCount: number;
  filteredCount: number;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  exactMatch,
  setExactMatch,
  totalCount,
  filteredCount,
}: SearchBarProps) {
  return (
    <>
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder={
            exactMatch
              ? "Search for exact name..."
              : "Search favorites by name..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.replace(/^\s+/, ""))}
          className="w-full pl-10 pr-44 py-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />

        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex border border-zinc-300 dark:border-zinc-600 rounded-md overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setExactMatch(false)}
            title="Normal searching."
            className={`px-3 py-1 transition-colors cursor-pointer ${
              exactMatch
                ? "bg-zinc-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                : "dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-black bg-zinc-800 hover:bg-zinc-900 text-white"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setExactMatch(true)}
            title="Search for exact name, character for character. Not case-sensitive."
            className={`px-3 py-1 transition-colors cursor-pointer ${
              exactMatch
                ? "dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-black bg-zinc-800 hover:bg-zinc-900 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Strict
          </button>
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        Favorites are saved only on this device.
        {searchQuery && ` Showing ${filteredCount} of ${totalCount} favorites.`}
      </p>
    </>
  );
}

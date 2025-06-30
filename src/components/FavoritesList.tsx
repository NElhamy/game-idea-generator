import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Copy, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import type { FavoriteIdea, SortOption } from "../types";
import { categoryColors } from "../constants";
import { articleFor, parseIdeaString } from "../utils/ideaHelpers";
import IdeaCard from "./IdeaCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";

interface FavoritesListProps {
  favorites: FavoriteIdea[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteIdea[]>>;
  coloredFavorites: boolean;
}

export default function FavoritesList({
  favorites,
  setFavorites,
  coloredFavorites,
}: FavoritesListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [exactMatch, setExactMatch] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", { icon: "📋", duration: 2000 });
  }

  function handleNameIdea(index: number) {
    const currentName = favorites[index].name || "";
    setEditingIndex(index);
    setEditingName(currentName);
  }

  function saveEditingName() {
    if (editingIndex === null) return;

    const updated = [...favorites];
    updated[editingIndex] = {
      ...updated[editingIndex],
      name: editingName.replace(/^\s+/, "") || undefined,
    };

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    setEditingIndex(null);
    setEditingName("");
  }

  function handleRemoveFavorite(idx: number) {
    const ideaToRemove = favorites[idx];

    setFavorites((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });

    toast("Removed from favorites", {
      icon: <Trash2 size={16} className="text-zinc-400" />,
      action: {
        label: "Undo",
        onClick: () => {
          setFavorites((prev) => {
            const restored = [...prev];
            restored.splice(idx, 0, ideaToRemove);
            localStorage.setItem("favorites", JSON.stringify(restored));
            return restored;
          });
          toast("Restored!");
        },
      },
      duration: 4000,
    });
  }

  // Filter favorites
  let filteredFavorites =
    searchQuery.length === 0
      ? [...favorites]
      : favorites.filter((favoriteItem) => {
          const name = favoriteItem.name?.toLowerCase() || "";
          const query = searchQuery.toLowerCase();
          return exactMatch ? name === query : name.includes(query);
        });

  // Sort favorites
  if (sortOption === "az") {
    filteredFavorites.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sortOption === "za") {
    filteredFavorites.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameB.localeCompare(nameA);
    });
  } else if (sortOption === "oldest") {
    filteredFavorites.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
  } else if (sortOption === "default") {
    filteredFavorites.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  }

  if (favorites.length === 0) return null;

  return (
    <div className="max-w-xl w-full mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Star size={20} fill="currentColor" className="text-yellow-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Favorites
          </h2>
        </div>
        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        exactMatch={exactMatch}
        setExactMatch={setExactMatch}
        totalCount={favorites.length}
        filteredCount={filteredFavorites.length}
      />

      {filteredFavorites.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p>No favorites found matching "{searchQuery}"</p>
        </div>
      )}

      <ul className="space-y-4 min-h-[1px]">
        <AnimatePresence mode="popLayout">
          {filteredFavorites.map((favoriteItem) => {
            const originalIdx = favorites.findIndex((f) => f === favoriteItem);
            const idea = favoriteItem.idea;
            const name = favoriteItem.name;

            if (!idea) return null;

            const parts = parseIdeaString(idea);
            const ideaDisplay =
              coloredFavorites && parts ? (
                <>
                  {articleFor(parts.tone)}{" "}
                  <span className={categoryColors.tone}>{parts.tone}</span>{" "}
                  <span className={categoryColors.genre}>{parts.genre}</span>{" "}
                  with{" "}
                  <span className={categoryColors.mechanic}>
                    {parts.mechanic}
                  </span>
                  , seen from {articleFor(parts.perspective).toLowerCase()}{" "}
                  <span className={categoryColors.perspective}>
                    {parts.perspective}
                  </span>{" "}
                  perspective, where{" "}
                  <span className={categoryColors.role}>{parts.role}</span>, and{" "}
                  <span className={categoryColors.twist}>{parts.twist}</span>.
                </>
              ) : null;

            const stableKey = idea;

            return (
              <motion.li
                key={stableKey}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.95,
                  transition: { duration: 0.3 },
                }}
                transition={{
                  layout: { duration: 0.3 },
                  opacity: { duration: 0.3 },
                  y: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between min-h-[2.5rem]">
                  <div className="flex-1">
                    {editingIndex === originalIdx ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditingName();
                        }}
                        onBlur={saveEditingName}
                        className="w-full px-0 py-1 text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-7"
                        placeholder="Enter idea name..."
                        autoFocus
                      />
                    ) : (
                      <h3
                        className="text-lg font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors h-7 flex items-center"
                        onClick={() => handleNameIdea(originalIdx)}
                        title="Click to rename"
                      >
                        {name || `Idea ${originalIdx + 1}`}
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      onClick={() => copyToClipboard(idea)}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-300 cursor-pointer group"
                      title="Copy idea"
                    >
                      <Copy
                        size={18}
                        className="text-gray-600 dark:text-gray-300 dark:group-hover:text-white group-hover:text-black transition-colors duration-300"
                      />
                    </motion.button>

                    <motion.button
                      onClick={() => handleRemoveFavorite(originalIdx)}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-300 cursor-pointer group"
                      title="Remove from favorites"
                    >
                      <Trash2
                        size={18}
                        className="text-gray-600 dark:text-gray-300 group-hover:text-red-400 transition-colors duration-300"
                      />
                    </motion.button>
                  </div>
                </div>

                <IdeaCard
                  idea={idea}
                  ideaDisplay={ideaDisplay}
                  colored={coloredFavorites}
                  onCopy={undefined}
                  onRemove={undefined}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

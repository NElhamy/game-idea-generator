import { useEffect, useState } from "react";
import IdeaCard from "./components/IdeaCard";
import SettingsPanel from "./components/SettingsPanel";
import TooltipInfo from "./components/TooltipInfo";
import {
  genres,
  mechanics,
  twists,
  tones,
  perspectives,
  roles,
} from "./data/ideaParts";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Lock,
  Unlock,
  Gamepad2,
  Star,
  Trash2,
  Copy,
  Search,
  X,
} from "lucide-react";

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function articleFor(word: string) {
  return /^[aeiou]/i.test(word) ? "An" : "A";
}

const categoryColors: Record<string, string> = {
  tone: "text-yellow-500",
  genre: "text-blue-500",
  mechanic: "text-red-500",
  perspective: "text-purple-500",
  role: "text-green-500",
  twist: "text-pink-500",
};

interface FavoriteIdea {
  idea: string;
  name?: string;
}

export default function App() {
  const [favorites, setFavorites] = useState<FavoriteIdea[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [exactMatch, setExactMatch] = useState(false);

  const [coloredFavorites, setColoredFavorites] = useState(() => {
    const stored = localStorage.getItem("coloredFavorites");
    return stored === "true"; // default to false if not set
  });

  const [theme, setTheme] = useState<"system" | "light" | "dark">(
    () =>
      (localStorage.getItem("theme") as "system" | "light" | "dark") || "system"
  );

  useEffect(() => {
    const root = document.documentElement;

    // Remove both classes to avoid buildup
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      // For light mode, don't add any class - Tailwind works by absence of "dark" class
    } else {
      // System mode
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isSystemDark) {
        root.classList.add("dark");
      }
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const [genre, setGenre] = useState("");
  const [mechanic, setMechanic] = useState("");
  const [twist, setTwist] = useState("");
  const [tone, setTone] = useState("");
  const [perspective, setPerspective] = useState("");
  const [role, setRole] = useState("");

  const [locks, setLocks] = useState({
    genre: false,
    mechanic: false,
    twist: false,
    tone: false,
    perspective: false,
    role: false,
  });

  const [isNewIdea, setIsNewIdea] = useState(false);

  useEffect(() => {
    const favicon = document.getElementById("favicon") as HTMLLinkElement;
    const match = window.matchMedia("(prefers-color-scheme: dark)");

    function updateFavicon(e: MediaQueryListEvent | MediaQueryList) {
      favicon.href = e.matches ? "/favicon-dark.png" : "/favicon-light.png";
    }

    updateFavicon(match); // Set on initial load
    match.addEventListener("change", updateFavicon); // Listen for changes

    return () => match.removeEventListener("change", updateFavicon);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", mq.matches);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Handle migration from old string array format to new object format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === "string") {
            // Old format - convert to new format
            const migrated = parsed.map((idea: string) => ({ idea }));
            setFavorites(migrated);
            localStorage.setItem("favorites", JSON.stringify(migrated));
          } else {
            // New format
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error("Error parsing favorites:", error);
        setFavorites([]);
      }
    }
    generateIdea();
  }, []);

  function generateIdea() {
    setIsNewIdea(true); // Trigger staggered animation

    const newTone = locks.tone ? tone : random(tones);
    const newGenre = locks.genre ? genre : random(genres);
    const newMechanic = locks.mechanic ? mechanic : random(mechanics);
    const newPerspective = locks.perspective
      ? perspective
      : random(perspectives);
    const newRole = locks.role ? role : random(roles);
    const newTwist = locks.twist ? twist : random(twists);

    setTone(newTone);
    setGenre(newGenre);
    setMechanic(newMechanic);
    setPerspective(newPerspective);
    setRole(newRole);
    setTwist(newTwist);

    // Reset animation flag after animation completes
    setTimeout(() => setIsNewIdea(false), 2000);
  }

  const ideaString = `${articleFor(
    tone
  )} ${tone} ${genre} with ${mechanic}, seen from ${articleFor(
    perspective
  ).toLowerCase()} ${perspective} perspective, where ${role}, and ${twist}.`;

  const fullIdea = (
    <>
      {articleFor(tone)} <span className={categoryColors.tone}>{tone}</span>{" "}
      <span className={categoryColors.genre}>{genre}</span> with{" "}
      <span className={categoryColors.mechanic}>{mechanic}</span>, seen from{" "}
      {articleFor(perspective).toLowerCase()}{" "}
      <span className={categoryColors.perspective}>{perspective}</span>{" "}
      perspective, where <span className={categoryColors.role}>{role}</span>,
      and <span className={categoryColors.twist}>{twist}</span>.
    </>
  );

  function saveIdea() {
    const existingIndex = favorites.findIndex((f) => f.idea === ideaString);

    if (existingIndex === -1) {
      // Find the highest existing idea number to generate the next default name
      const existingNumbers = favorites
        .map((f) => f.name)
        .filter((name) => name && name.startsWith("Idea "))
        .map((name) => parseInt(name!.replace("Idea ", "")))
        .filter((num) => !isNaN(num));

      const nextNumber =
        existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      const defaultName = `Idea ${nextNumber}`;

      const updated = [...favorites, { idea: ideaString, name: defaultName }];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      toast("Saved! Find favorites below.", { icon: "⭐", duration: 2000 });
    } else {
      const updated = favorites.filter((_, i) => i !== existingIndex);
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      toast("Removed from favorites", {
        icon: <Trash2 size={16} className="text-zinc-400" />,
        duration: 2000,
      });
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", { icon: "📋", duration: 2000 });
  }

  function parseIdeaString(idea: string) {
    if (!idea || typeof idea !== "string") return null;

    const match = idea.match(
      /^An? (.+?) (.+?) with (.+?), seen from an? (.+?) perspective, where (.+?), and (.+?)\.$/
    );
    if (!match) return null;

    const [, tone, genre, mechanic, perspective, role, twist] = match;
    return { tone, genre, mechanic, perspective, role, twist };
  }

  function resolveTheme(theme: "system" | "dark" | "light"): "light" | "dark" {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }

  function handleToggleColoredFavorites() {
    setColoredFavorites((prev) => {
      const next = !prev;
      localStorage.setItem("coloredFavorites", String(next));
      return next;
    });
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
    const updated = favorites.filter((_, i) => i !== idx);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    toast("Removed from favorites", {
      icon: <Trash2 size={16} className="text-zinc-400" />,
      action: {
        label: "Undo",
        onClick: () => {
          // Insert the item back at its original position
          const restored = [...updated];
          restored.splice(idx, 0, ideaToRemove);
          setFavorites(restored);
          localStorage.setItem("favorites", JSON.stringify(restored));
          toast("Restored!");
        },
      },
      duration: 4000,
    });
  }

  function downloadFavorites() {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game-ideas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleGenerateClick() {
    generateIdea();
  }

  // Filter favorites based on search query - NAME ONLY
  const filteredFavorites =
    searchQuery.length === 0
      ? favorites
      : favorites.filter((favoriteItem) => {
          const name =
            typeof favoriteItem === "object" && favoriteItem
              ? favoriteItem.name || ""
              : "";

          const query = searchQuery.toLowerCase();
          const itemName = name.toLowerCase();

          return exactMatch ? itemName === query : itemName.includes(query);
        });

  const isCurrentIdeaFavorited = favorites.some((f) => f.idea === ideaString);

  return (
    <div className="min-h-screen transition-colors duration-200 flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <main className="grow flex flex-col items-center justify-start gap-8 py-24 px-10">
        <h1 className="flex flex-col sm:flex-row items-center gap-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
          <Gamepad2 size={40} className="text-gray-800 dark:text-white" />
          <span>Game Idea Generator</span>
        </h1>

        <motion.button
          onClick={handleGenerateClick}
          whileTap={{ scale: 0.95 }}
          className="bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-black font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center cursor-pointer"
        >
          Generate Idea
        </motion.button>

        <div className="flex items-center">
          <TooltipInfo />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(locks).map(([key, value]) => {
            return (
              <motion.button
                key={key}
                onClick={() => setLocks((prev) => ({ ...prev, [key]: !value }))}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm rounded-md border transition font-medium cursor-pointer ${
                  value
                    ? categoryColors[key]
                    : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-white border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {value ? (
                  <Lock
                    size={16}
                    className={`inline mr-1 ${categoryColors[key]}`}
                  />
                ) : (
                  <Unlock
                    size={16}
                    className={`inline mr-1 ${categoryColors[key]}`}
                  />
                )}{" "}
                {key}
              </motion.button>
            );
          })}
        </div>

        {fullIdea && (
          <div className="max-w-xl w-full">
            {/* Action buttons for generated idea */}
            <div className="flex items-center justify-end gap-2 mb-2">
              <motion.button
                onClick={() => copyToClipboard(ideaString)}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-200 cursor-pointer"
                title="Copy idea"
              >
                <Copy size={18} className="text-gray-600 dark:text-gray-300" />
              </motion.button>

              <motion.button
                onClick={saveIdea}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-200 cursor-pointer"
                title={
                  isCurrentIdeaFavorited
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Star
                  size={18}
                  className={`${
                    isCurrentIdeaFavorited
                      ? "text-yellow-500 fill-current"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                />
              </motion.button>
            </div>

            <IdeaCard
              idea={ideaString}
              ideaDisplay={fullIdea}
              colored={true}
              isNew={isNewIdea}
              onSave={undefined}
              onCopy={undefined}
            />
          </div>
        )}

        {(favorites.length > 0 || filteredFavorites.length > 0) && (
          <div className="max-w-xl w-full mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} fill="currentColor" className="text-yellow-400" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Favorites
              </h2>
            </div>

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
                onChange={(e) =>
                  setSearchQuery(e.target.value.replace(/^\s+/, ""))
                }
                className="w-full pl-10 pr-32 py-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />

              {/* Exact match toggle button */}
              <button
                onClick={() => setExactMatch(!exactMatch)}
                className={`absolute right-10 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded transition-colors focus:outline-none ${
                  exactMatch
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                title={
                  exactMatch
                    ? "Matches the name character by character. Not case sensitive."
                    : "Switch to strict search"
                }
              >
                {exactMatch ? "Strict" : "Normal"}
              </button>

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
              {searchQuery &&
                ` Showing ${filteredFavorites.length} of ${favorites.length} favorites.`}
            </p>

            {filteredFavorites.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Search size={32} className="mx-auto mb-2 opacity-50" />
                <p>No favorites found matching "{searchQuery}"</p>
              </div>
            )}

            <ul className="space-y-4 min-h-[1px]">
              <AnimatePresence mode="popLayout">
                {filteredFavorites.map((favoriteItem) => {
                  // Find the original index in the full favorites array
                  const originalIdx = favorites.findIndex(
                    (f) => f === favoriteItem
                  );

                  // Handle both old string format and new object format
                  const idea =
                    typeof favoriteItem === "string"
                      ? favoriteItem
                      : favoriteItem?.idea;
                  const name =
                    typeof favoriteItem === "object" && favoriteItem
                      ? favoriteItem.name
                      : undefined;

                  if (!idea) return null; // Skip invalid entries

                  const parts = parseIdeaString(idea);

                  const ideaDisplay =
                    coloredFavorites && parts ? (
                      <>
                        {articleFor(parts.tone)}{" "}
                        <span className={categoryColors.tone}>
                          {parts.tone}
                        </span>{" "}
                        <span className={categoryColors.genre}>
                          {parts.genre}
                        </span>{" "}
                        with{" "}
                        <span className={categoryColors.mechanic}>
                          {parts.mechanic}
                        </span>
                        , seen from{" "}
                        {articleFor(parts.perspective).toLowerCase()}{" "}
                        <span className={categoryColors.perspective}>
                          {parts.perspective}
                        </span>{" "}
                        perspective, where{" "}
                        <span className={categoryColors.role}>
                          {parts.role}
                        </span>
                        , and{" "}
                        <span className={categoryColors.twist}>
                          {parts.twist}
                        </span>
                        .
                      </>
                    ) : null;

                  // Use a stable key based on the idea content to prevent re-animations
                  const stableKey = idea;

                  return (
                    <motion.li
                      key={stableKey}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
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
                      {/* Name section with inline editing */}
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
                              title="Click to edit name"
                            >
                              {name || `Idea ${originalIdx + 1}`}
                            </h3>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <motion.button
                            onClick={() => copyToClipboard(idea)}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-200 cursor-pointer"
                            title="Copy idea"
                          >
                            <Copy
                              size={18}
                              className="text-gray-600 dark:text-gray-300"
                            />
                          </motion.button>

                          <motion.button
                            onClick={() => handleRemoveFavorite(originalIdx)}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-200 cursor-pointer"
                            title="Remove from favorites"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Idea card without action buttons */}
                      <IdeaCard
                        idea={idea}
                        ideaDisplay={ideaDisplay}
                        colored={coloredFavorites}
                        // Remove the action buttons from the card
                        onCopy={undefined}
                        onRemove={undefined}
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </main>
      <footer className="text-xs text-gray-500 dark:text-gray-400 text-center p-2">
        <a
          href="https://icons8.com/icon/GFDbOB2OqPWt/game-controller"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 dark:hover:text-white transition-all duration-300"
        >
          Game Controller
        </a>{" "}
        icon by{" "}
        <a
          href="https://icons8.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 dark:hover:text-white transition-all duration-300"
        >
          Icons8
        </a>
      </footer>

      <SettingsPanel
        theme={theme}
        setTheme={setTheme}
        coloredFavorites={coloredFavorites}
        onToggleColoredFavorites={handleToggleColoredFavorites}
        downloadFavorites={downloadFavorites}
        favorites={favorites}
      />

      <Toaster
        position="top-right"
        theme={resolveTheme(theme)}
        toastOptions={{ className: "mt-10" }}
        richColors
      />
    </div>
  );
}

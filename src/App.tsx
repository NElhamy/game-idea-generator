import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Gamepad2, Star, Copy, Trash2 } from "lucide-react";

// Component imports
import IdeaCard from "./components/IdeaCard";
import SettingsPanel from "./components/SettingsPanel";
import TooltipInfo from "./components/TooltipInfo";
import LockButtons from "./components/LockButtons";
import FavoritesList from "./components/FavoritesList";

// Data imports
import {
  genres,
  mechanics,
  twists,
  tones,
  perspectives,
  roles,
} from "./data/ideaParts";

// Type imports
import type { FavoriteIdea, Theme, Locks } from "./types";

// Utility imports
import { random, articleFor, resolveTheme } from "./utils/ideaHelpers";
import { categoryColors } from "./constants";

// Hook imports
import { useTheme } from "./hooks/useTheme";

export default function App() {
  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteIdea[]>([]);

  // Theme state
  const [coloredFavorites, setColoredFavorites] = useState(() => {
    const stored = localStorage.getItem("coloredFavorites");
    return stored === "true";
  });

  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "system"
  );

  // Use theme hook
  useTheme(theme);

  // Idea generation state
  const [genre, setGenre] = useState("");
  const [mechanic, setMechanic] = useState("");
  const [twist, setTwist] = useState("");
  const [tone, setTone] = useState("");
  const [perspective, setPerspective] = useState("");
  const [role, setRole] = useState("");

  const [locks, setLocks] = useState<Locks>({
    genre: false,
    mechanic: false,
    twist: false,
    tone: false,
    perspective: false,
    role: false,
  });

  // Load favorites and generate initial idea
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

      const updated = [
        ...favorites,
        { idea: ideaString, name: defaultName, timestamp: Date.now() },
      ];

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

  function handleToggleColoredFavorites() {
    setColoredFavorites((prev) => {
      const next = !prev;
      localStorage.setItem("coloredFavorites", String(next));
      return next;
    });
  }

  const isCurrentIdeaFavorited = favorites.some((f) => f.idea === ideaString);

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <main className="grow flex flex-col items-center justify-start gap-8 py-24 px-10">
        <h1 className="flex flex-col sm:flex-row items-center gap-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
          <Gamepad2 size={40} className="text-gray-800 dark:text-white" />
          <span>Game Idea Generator</span>
        </h1>

        <motion.button
          onClick={generateIdea}
          whileTap={{ scale: 0.95 }}
          className="bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-black font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center cursor-pointer"
        >
          Generate Idea
        </motion.button>

        <div className="flex items-center">
          <TooltipInfo />
        </div>

        <LockButtons locks={locks} setLocks={setLocks} />

        {fullIdea && (
          <div className="max-w-xl w-full">
            <div className="flex items-center justify-end gap-2 mb-2">
              <motion.button
                onClick={() => copyToClipboard(ideaString)}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-300 cursor-pointer group"
                title="Copy"
              >
                <Copy
                  size={18}
                  className="text-gray-600 dark:text-gray-300 dark:group-hover:text-white group-hover:text-zinc-900 transition-colors duration-300"
                />
              </motion.button>

              <motion.button
                onClick={saveIdea}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md transition-colors duration-300 cursor-pointer group"
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
                      : "text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors duration-300"
                  }`}
                />
              </motion.button>
            </div>

            <IdeaCard
              key={ideaString}
              idea={ideaString}
              ideaDisplay={fullIdea}
              colored={true}
              onSave={undefined}
              onCopy={undefined}
            />
          </div>
        )}

        <FavoritesList
          favorites={favorites}
          setFavorites={setFavorites}
          coloredFavorites={coloredFavorites}
        />
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

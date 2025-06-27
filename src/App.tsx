import { useEffect, useState } from "react";
import IdeaCard from "./components/IdeaCard";
import TooltipInfo from "./components/TooltipInfo";
import {
  genres,
  mechanics,
  twists,
  tones,
  perspectives,
  roles,
} from "./data/ideaParts";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, Unlock, Gamepad2, Star, Trash2 } from "lucide-react";

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

export default function App() {
  const [favorites, setFavorites] = useState<string[]>([]);

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
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
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
    if (!favorites.includes(ideaString)) {
      const updated = [ideaString, ...favorites];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      toast("Saved!", { icon: "⭐", duration: 2000 });
    } else {
      toast("Already in favorites!");
    }
  }

  // const [isSpinning, setIsSpinning] = useState(false);

  function handleGenerateClick() {
    // setIsSpinning(true);
    generateIdea();
    // setTimeout(() => setIsSpinning(false), 500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800">
      <main className="grow flex flex-col items-center justify-start gap-8 py-24 px-10">
        <h1 className="flex flex-col sm:flex-row items-center gap-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
          <Gamepad2 size={40} className="text-gray-800 dark:text-white" />
          <span>Game Idea Generator</span>
        </h1>

        <motion.button
          onClick={handleGenerateClick}
          whileTap={{ scale: 0.95 }}
          className="bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-black font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center hover:cursor-pointer"
        >
          {/* <motion.span
          animate={isSpinning ? { rotate: -360 } : { rotate: 0 }}
          transition={
            isSpinning
              ? { duration: 1, ease: "linear", repeat: Infinity }
              : { duration: 0, ease: "easeInOut" }
          }
          className="inline-block mr-2"
        >
          <RefreshCcw size={16} />
        </motion.span> */}
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
                className={`px-4 py-2 text-sm rounded-md border transition font-medium hover:cursor-pointer ${
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
          <IdeaCard
            idea={ideaString}
            onSave={saveIdea}
            isSaved={favorites.includes(ideaString)}
            ideaDisplay={fullIdea}
          />
        )}

        {favorites.length > 0 && (
          <div className="max-w-xl w-full mt-10">
            <h2 className="flex flex-row gap-2 justify-start items-center text-xl font-semibold text-gray-800 dark:text-white mb-4">
              <Star size={20} fill="currentColor" className="text-yellow-400" />
              Favorites
            </h2>
            <ul className="space-y-4">
              {favorites.map((idea, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  <IdeaCard
                    idea={idea}
                    onRemove={() => {
                      const ideaToRemove = favorites[idx];
                      const updated = favorites.filter((_, i) => i !== idx);
                      setFavorites(updated);
                      localStorage.setItem(
                        "favorites",
                        JSON.stringify(updated)
                      );

                      toast("Removed from favorites", {
                        icon: <Trash2 size={16} className="text-zinc-400" />,
                        action: {
                          label: "Undo",
                          onClick: () => {
                            const restored = [ideaToRemove, ...updated];
                            setFavorites(restored);
                            localStorage.setItem(
                              "favorites",
                              JSON.stringify(restored)
                            );
                            toast("Restored!");
                          },
                        },
                        duration: 4000,
                      });
                    }}
                  />
                </motion.li>
              ))}
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
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Settings, Check, Download } from "lucide-react";
import Switch from "./Switch";
import { toast } from "sonner";

export default function SettingsPanel({
  theme,
  setTheme,
  coloredFavorites,
  onToggleColoredFavorites,
  downloadFavorites,
  favorites,
}: {
  theme: string;
  setTheme: (theme: "system" | "light" | "dark") => void;
  coloredFavorites: boolean;
  onToggleColoredFavorites: () => void;
  downloadFavorites: () => void;
  favorites: any[];
}) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [justOpened, setJustOpened] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle panel opening with animation
  const handleOpen = () => {
    setOpen(true);
    setJustOpened(true);
    // Allow the initial render, then trigger animation
    setTimeout(() => setJustOpened(false), 10);
  };

  // Handle panel closing with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    // Close on Escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        ref={buttonRef}
        onClick={() => {
          if (open && !isClosing) {
            handleClose();
          } else if (!open) {
            handleOpen();
          }
        }}
        className={`p-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white shadow hover:shadow-md cursor-pointer transition-all duration-200 ${
          open && !isClosing ? "ring-2 ring-blue-500/50" : ""
        }`}
        aria-label="Settings"
      >
        <Settings
          size={20}
          className={`transition-transform duration-200 ${
            open && !isClosing ? "rotate-45" : ""
          }`}
        />
      </button>

      {(open || isClosing) && (
        <div
          ref={panelRef}
          className={`absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-5 space-y-5 text-sm transition-all duration-200 ease-out ${
            isClosing
              ? "opacity-0 scale-95 -translate-y-2"
              : justOpened
              ? "opacity-0 scale-95 translate-y-2"
              : "opacity-100 scale-100 translate-y-0"
          }`}
        >
          <div className="space-y-3">
            <label className="font-semibold text-zinc-800 dark:text-white block text-base">
              Theme
            </label>
            <div className="space-y-2">
              {[
                { value: "system", label: "System" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setTheme(option.value as "system" | "light" | "dark")
                  }
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    theme === option.value
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span>{option.label}</span>
                  {theme === option.value && (
                    <Check
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-y border-zinc-200 dark:border-zinc-700 py-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-zinc-800 dark:text-white font-medium">
                  Colorful favorites
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Add colors to saved ideas
                </p>
              </div>
              <Switch
                checked={coloredFavorites}
                onChange={onToggleColoredFavorites}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (favorites.length === 0) {
                toast("No favorites to download.", {
                  icon: <Download size={16} className="text-gray-400" />,
                  duration: 2000,
                });
                return;
              }
              downloadFavorites();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer rounded-md transition-colors"
          >
            <Download size={16} /> Download Favorites
          </button>
        </div>
      )}
    </div>
  );
}

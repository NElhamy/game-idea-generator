import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

export default function TooltipInfo() {
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={() => setShowTooltip((prev) => !prev)}
        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-white focus:outline-none"
        aria-label="Info about locking categories"
      >
        <Info size={16} />
      </button>

      {/* Tooltip container */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 text-white dark:text-black text-xs px-3 py-2 rounded shadow max-w-[90vw] w-max text-center transition-all duration-200 ${
          showTooltip
            ? "opacity-100 translate-y-0 bg-zinc-800 dark:bg-zinc-200"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        Lock a category so it won't change when generating new ideas.
      </div>
    </div>
  );
}

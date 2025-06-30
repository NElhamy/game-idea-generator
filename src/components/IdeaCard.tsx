import React from "react";
import { motion } from "framer-motion";
import { Trash2, Star, Copy } from "lucide-react";

type IdeaCardProps = {
  idea: string;
  onSave?: () => void;
  onCopy?: () => void;
  onRemove?: () => void;
  isSaved?: boolean;
  ideaDisplay?: React.ReactNode;
  colored?: boolean;
};

export default function IdeaCard({
  idea,
  onSave,
  onCopy,
  onRemove,
  isSaved,
  ideaDisplay,
  colored,
}: IdeaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl px-6 py-5 max-w-xl w-full relative"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-md font-medium text-zinc-800 dark:text-white leading-relaxed text-left"
      >
        {colored && ideaDisplay ? ideaDisplay : idea}
      </motion.p>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {onCopy && (
          <button
            onClick={onCopy}
            className="text-zinc-400 hover:text-blue-500 transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Copy idea to clipboard"
          >
            <Copy size={18} />
          </button>
        )}

        {onSave && (
          <button
            onClick={onSave}
            className="text-yellow-400 hover:text-yellow-500 transition-all duration-300 hover:scale-125 cursor-pointer"
            aria-label="Save to favorites"
          >
            <Star
              className={
                isSaved ? "fill-yellow-400 text-yellow-400" : "text-yellow-400"
              }
              size={20}
            />
          </button>
        )}

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-zinc-400 hover:text-red-600 transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Remove from favorites"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

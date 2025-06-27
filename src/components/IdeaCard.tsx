import React from "react";
import { motion } from "framer-motion";
import { Trash2, Star } from "lucide-react";

type IdeaCardProps = {
  idea: string;
  onSave?: () => void;
  onRemove?: () => void;
  isSaved?: boolean;
  ideaDisplay?: React.ReactNode;
};

export default function IdeaCard({
  idea,
  onSave,
  onRemove,
  isSaved,
  ideaDisplay,
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
        transition={{ duration: 0.5 }}
        className="text-md font-medium text-gray-800 dark:text-white pr-10 leading-relaxed text-left"
      >
        {ideaDisplay ?? idea}
      </motion.p>

      {onSave && (
        <button
          onClick={onSave}
          className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-500 transition-transform duration-300 hover:scale-125 hover:cursor-pointer"
          aria-label="Save to favorites"
        >
          <Star fill={isSaved ? "#facc15" : "none"} size={20} />
        </button>
      )}

      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 text-zinc-400 hover:text-red-600 transition-transform duration-300 hover:scale-110 hover:cursor-pointer"
          aria-label="Remove from favorites"
        >
          <Trash2 size={20} />
        </button>
      )}
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Trash2, Star, Copy } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

type IdeaCardProps = {
  idea: string;
  onSave?: () => void;
  onCopy?: () => void;
  onRemove?: () => void;
  isSaved?: boolean;
  ideaDisplay?: React.ReactNode;
  colored?: boolean;
  isNew?: boolean;
};

function articleFor(word: string) {
  return /^[aeiou]/i.test(word) ? "An" : "A";
}

function parseIdeaString(idea: string) {
  const match = idea.match(
    /^An? (.+?) (.+?) with (.+?), seen from an? (.+?) perspective, where (.+?), and (.+?)\.$/
  );
  if (!match) return null;
  const [, tone, genre, mechanic, perspective, role, twist] = match;
  return { tone, genre, mechanic, perspective, role, twist };
}

const categoryColors: Record<string, string> = {
  tone: "text-yellow-500",
  genre: "text-blue-500",
  mechanic: "text-red-500",
  perspective: "text-purple-500",
  role: "text-green-500",
  twist: "text-pink-500",
};

export default function IdeaCard({
  idea,
  onSave,
  onCopy, // ADD THIS
  onRemove,
  isSaved,
  ideaDisplay,
  colored,
  isNew = false, // ADD THIS
}: IdeaCardProps) {
  const parts = parseIdeaString(idea);

  // ADD THIS FUNCTION
  const createStaggeredContent = () => {
    if (!parts || !colored) return null;

    return (
      <motion.span
        variants={containerVariants}
        initial={isNew ? "hidden" : "visible"}
        animate="visible"
      >
        <motion.span variants={itemVariants}>
          {articleFor(parts.tone)}{" "}
        </motion.span>
        <motion.span variants={itemVariants} className={categoryColors.tone}>
          {parts.tone}
        </motion.span>
        <motion.span variants={itemVariants}> </motion.span>
        <motion.span variants={itemVariants} className={categoryColors.genre}>
          {parts.genre}
        </motion.span>
        <motion.span variants={itemVariants}> with </motion.span>
        <motion.span
          variants={itemVariants}
          className={categoryColors.mechanic}
        >
          {parts.mechanic}
        </motion.span>
        <motion.span variants={itemVariants}>
          , seen from {articleFor(parts.perspective).toLowerCase()}{" "}
        </motion.span>
        <motion.span
          variants={itemVariants}
          className={categoryColors.perspective}
        >
          {parts.perspective}
        </motion.span>
        <motion.span variants={itemVariants}> perspective, where </motion.span>
        <motion.span variants={itemVariants} className={categoryColors.role}>
          {parts.role}
        </motion.span>
        <motion.span variants={itemVariants}>, and </motion.span>
        <motion.span variants={itemVariants} className={categoryColors.twist}>
          {parts.twist}
        </motion.span>
        <motion.span variants={itemVariants}>.</motion.span>
      </motion.span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-800 shadow-xl rounded-2xl px-6 py-5 max-w-xl w-full relative"
    >
      <motion.p className="text-md font-medium text-zinc-800 dark:text-white pr-20 leading-relaxed text-left">
        {isNew && colored && parts
          ? createStaggeredContent()
          : colored && ideaDisplay
          ? ideaDisplay
          : idea}
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

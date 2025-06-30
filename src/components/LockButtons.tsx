import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import type { Locks } from "../types";
import { categoryColors } from "../constants";

interface LockButtonsProps {
  locks: Locks;
  setLocks: React.Dispatch<React.SetStateAction<Locks>>;
}

export default function LockButtons({ locks, setLocks }: LockButtonsProps) {
  return (
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
  );
}

import { useState } from "react";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export default function Switch({ checked, onChange, label }: SwitchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
      {label && <span>{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer
          ${checked ? "bg-blue-500" : "bg-zinc-400"}
          ${isFocused ? "ring-2 ring-offset-2 ring-blue-400" : ""}
        `}
        tabIndex={0}
      >
        <span
          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}

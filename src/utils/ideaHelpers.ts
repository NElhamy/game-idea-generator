import { genres } from "../data/ideaParts";

export function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function articleFor(word: string) {
  return /^[aeiou]/i.test(word) ? "An" : "A";
}

export function parseIdeaString(idea: string) {
  if (!idea || typeof idea !== "string") return null;

  const match = idea.match(
    /^(An?)\s+(.+?)\s+with\s+([^,]+),\s+seen from\s+(an?)\s+([^,]+)\s+perspective,\s+where\s+([^,]+),\s+and\s+([^.]+)\.$/
  );

  if (!match) return null;

  const toneAndGenre = match[2];
  let foundGenre = "";
  let tone = "";

  for (const genre of genres) {
    if (toneAndGenre.endsWith(genre)) {
      foundGenre = genre;
      tone = toneAndGenre
        .substring(0, toneAndGenre.length - genre.length)
        .trim();
      break;
    }
  }

  if (!foundGenre) {
    const words = toneAndGenre.split(" ");
    foundGenre = words[words.length - 1];
    tone = words.slice(0, -1).join(" ");
  }

  return {
    tone: tone,
    genre: foundGenre,
    mechanic: match[3].trim(),
    perspective: match[5].trim(),
    role: match[6].trim(),
    twist: match[7].trim(),
  };
}

export function resolveTheme(
  theme: "system" | "dark" | "light"
): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

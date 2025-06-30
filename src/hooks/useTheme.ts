import { useEffect } from "react";
import type { Theme } from "../types";

export function useTheme(theme: Theme) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      // Light mode - no class needed
    } else {
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isSystemDark) {
        root.classList.add("dark");
      }
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const favicon = document.getElementById("favicon") as HTMLLinkElement;
    if (!favicon) return;

    const match = window.matchMedia("(prefers-color-scheme: dark)");

    function updateFavicon(e: MediaQueryListEvent | MediaQueryList) {
      favicon.href = e.matches ? "/favicon-dark.png" : "/favicon-light.png";
    }

    updateFavicon(match);
    match.addEventListener("change", updateFavicon);
    return () => match.removeEventListener("change", updateFavicon);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", mq.matches);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [theme]);
}

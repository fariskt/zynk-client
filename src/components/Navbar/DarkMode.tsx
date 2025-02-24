"use client";

import { useEffect, useState } from "react";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      const isDark = storedTheme === "dark";
      setDarkMode(isDark);

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      setDarkMode((prev) => {
        const newMode = !prev;
        if (newMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
        return newMode;
      });
    }
  };

  if (darkMode === null) return null; // Prevent SSR hydration issues

  return (
    <button onClick={toggleDarkMode} className="rounded-full p-2">
      {darkMode ? <MdDarkMode /> : <MdOutlineDarkMode />}
    </button>
  );
}

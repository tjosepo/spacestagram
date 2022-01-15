import { useCallback, useEffect, useState } from "react";

export const useDarkMode = (): ["dark" | "light", () => void] => {
  const [mode, setMode] = useState<"dark" | "light">("light");

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((mode) => (mode === "light" ? "dark" : "light"));
  }, []);

  return [mode, toggle];
};

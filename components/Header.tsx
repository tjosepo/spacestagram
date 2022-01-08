import { useState, useEffect } from "react";

import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import styles from "./Header.module.css";

export const Header = () => {
  const [mode, setMode] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      return "dark";
    } else {
      return "light";
    }
  });

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [mode]);

  const toggleModes = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <span className={styles.logo}>Spacestagram</span>
        <button onClick={toggleModes}>
          {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </button>
      </div>
    </div>
  );
};

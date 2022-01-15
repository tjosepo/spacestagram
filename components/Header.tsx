import {
  DarkModeOutlined,
  Explore,
  GitHub,
  LightModeOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";

import { useDarkMode } from "../hooks/useDarkMode";
import styles from "./Header.module.css";

export const Header = () => {
  const router = useRouter();
  const [mode, toggle] = useDarkMode();

  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <button
          tabIndex={-1}
          aria-label="Scroll to top"
          onClick={() => {
            if (router.pathname !== "/") {
              router.push("/");
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={styles.logo}
        >
          Spacestagram
        </button>
        <div className="flex gap-4">
          <Link href="/explore/">
            <a>
              <Explore />
            </a>
          </Link>
          <button onClick={toggle} aria-label="Toggle dark mode">
            {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
          </button>
          <a
            href="https://github.com/tjosepo/spacestagram"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub />
          </a>
        </div>
      </div>
    </div>
  );
};

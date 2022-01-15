import { duration, Snackbar } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import styles from "./SnackbarContext.module.css";

const SnackbarContext = createContext<{
  push(message: string): void;
}>({
  push: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: Props) => {
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const push = useCallback((message: string) => {
    setMessageQueue((queue) => [...queue, message]);
  }, []);

  return (
    <SnackbarContext.Provider value={useMemo(() => ({ push }), [])}>
      {children}
      <Snackbar
        className={styles.root}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!isClosing && Boolean(messageQueue[0])}
        onClose={() => {
          setIsClosing(true);
          setTimeout(() => {
            setMessageQueue((queue) => {
              queue.shift();
              return [...queue];
            });
            setIsClosing(false);
          }, duration.leavingScreen);
        }}
        message={messageQueue[0] ?? ""}
        autoHideDuration={2000}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

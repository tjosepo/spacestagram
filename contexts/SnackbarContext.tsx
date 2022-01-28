import { Alert, duration, Snackbar } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const SnackbarContext = createContext<{
  push(message: string, options?: MessageOptions): void;
}>({
  push: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

interface MessageOptions {
  severity?: "error" | "warning" | "info";
}

interface Message extends MessageOptions {
  message: string;
}

export const SnackbarProvider = ({ children }: Props) => {
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const push = useCallback((message: string, options: MessageOptions = {}) => {
    setMessageQueue((queue) => {
      if (message === queue.at(-1)?.message) return queue;
      else return [...queue, { message, ...options }];
    });
  }, []);

  const onClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMessageQueue((queue) => {
        queue.shift();
        return [...queue];
      });
      setIsClosing(false);
    }, duration.leavingScreen);
  };

  const current = messageQueue[0] as Message | undefined;

  return (
    <SnackbarContext.Provider value={useMemo(() => ({ push }), [push])}>
      {children}

      {current && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={!isClosing}
          onClose={onClose}
          message={current.severity ? undefined : current.message}
          autoHideDuration={2000}
        >
          {current.severity && (
            <Alert severity={current.severity}>{current.message}</Alert>
          )}
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);

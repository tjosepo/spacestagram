import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SpacestagramContext = createContext<{
  likes: Set<string>;
  addLike(date: string): void;
  removeLike(date: string): void;
}>({
  likes: new Set(),
  addLike: () => undefined,
  removeLike: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

export const SpacestagramProvider = ({ children }: Props) => {
  const [hasLoadedFromLocalStorage, setHasLoadedFromLocalStorage] =
    useState(false);
  const [likes, setLikes] = useState<Set<string>>(new Set());

  const addLike = useCallback((date: string) => {
    setLikes((prev) => new Set(prev).add(date));
  }, []);

  const removeLike = useCallback((date: string) => {
    setLikes((prev) => {
      const newSet = new Set(prev);
      if (!newSet.delete(date)) return prev;
      else return newSet;
    });
  }, []);

  useEffect(() => {
    const likes = localStorage.getItem("likes");
    if (likes) setLikes(new Set(JSON.parse(likes)));
    setHasLoadedFromLocalStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedFromLocalStorage) return;
    localStorage.setItem("likes", JSON.stringify(Array.from(likes)));
  }, [likes]);

  return (
    <SpacestagramContext.Provider
      value={useMemo(() => ({ likes, addLike, removeLike }), [likes])}
    >
      {children}
    </SpacestagramContext.Provider>
  );
};

export const useSpacestagram = () => useContext(SpacestagramContext);

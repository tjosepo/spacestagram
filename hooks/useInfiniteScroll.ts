import { useEffect, useRef } from "react";
import { debounce } from "../utils/debounce";

const useInfiniteScroll = (callback: () => void) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    const endElement = document.createElement("div");
    ref.current!.after(endElement);

    const observer = new IntersectionObserver(debounce(callback, 50), {
      rootMargin: "0px 0px 300px 0px",
      threshold: 1,
    });
    observer.observe(endElement);

    return () => {
      observer.disconnect();
      endElement.remove();
    };
  }, []);

  return ref;
};

export default useInfiniteScroll;

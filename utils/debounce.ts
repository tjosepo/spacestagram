export const debounce = (callback: () => void, ms: number) => {
  let timeoutId: number | undefined = undefined;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => (timeoutId = undefined), ms);
    }
    timeoutId = window.setTimeout(() => (timeoutId = undefined), ms);
    callback();
  };
};

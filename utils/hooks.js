import {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";

// Custom hook to manage keyboard shortcuts
export function useKeyPress(keys, callback, node = null) {
  // Callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyPress = useCallback(
    (event) => {
      if (event.shiftKey) {
        if (keys.some((key) => event.key === key)) {
          callbackRef.current(event);
        }
      } else {
        if (keys.some((key) => event.key === key)) {
          callbackRef.current(event);
        }
      }
    },
    [keys]
  );

  useEffect(() => {
    const targetNode = node ?? document;
    targetNode && targetNode.addEventListener("keyup", handleKeyPress);

    return () =>
      targetNode && targetNode.removeEventListener("keyup", handleKeyPress);
  }, [handleKeyPress, node]);
}

export function useViewportWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width };
}

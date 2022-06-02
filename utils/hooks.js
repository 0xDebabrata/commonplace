import {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import supabase from "./supabaseClient";

// Custom hook to return logged in user data
export function useUserData() {
  // Set logged in user
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Update user on auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange(async () =>
      checkUser()
    );

    // Check whether user is logged in and update state accordingly
    checkUser();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Check user presence and update state
  const checkUser = async () => {
    const user = supabase.auth.user();
    setUser(user);
  };

  return { user };
}

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
    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
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

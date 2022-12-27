import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useKeyPress } from "../utils/hooks";

const Search = () => {
  const router = useRouter();
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  const [phrase, setPhrase] = useState("");

  const handleClick = () => {
    const searchPhrase = phrase.trim()
    if (searchPhrase) {
      router.push(`/search?phrase=${searchPhrase}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "/") {
      ref.current.focus();
    } else if (e.key === "Enter" && focus) {
      handleClick();
      ref.current.blur();
    }
  };

  // Set keyboard shortcuts
  useKeyPress(["/", "Enter"], handleKeyPress);

  return (
    <div className="relative max-w-[670px] px-10 mx-auto">
      <input
        ref={ref}
        id="search"
        className="text-white w-full py-1 px-4 rounded bg-neutral-700 border border-neutral-700 focus:outline-none focus:border-neutral-500"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setPhrase(e.currentTarget.value)}
        placeholder="Search (Press / to focus)"
        value={phrase}
      />
      {focus && (
        <img className="absolute top-1 right-12 cursor-pointer"
          onClick={handleClick} 
          alt="Search icon" 
          src="/search-icon.svg" />
      )}
    </div>
  );
};

export default Search;

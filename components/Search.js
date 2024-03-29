import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { IconContext } from "react-icons"
import { BiArrowBack } from "react-icons/bi"
import splitbee from "@splitbee/web";

import { useKeyPress } from "../utils/hooks";

const Search = ({ query }) => {
  const router = useRouter();
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  const [phrase, setPhrase] = useState(query ? query : "");

  const handleClick = () => {
    const searchPhrase = phrase.trim()
    if (searchPhrase) {
      // Analytics
      splitbee.track("Search", {
        query: searchPhrase
      })

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

  const handleBack = () => {
    router.push("/")
  }

  // Set keyboard shortcuts
  useKeyPress(["/", "Enter"], handleKeyPress);

  return (
    <div className="pt-5 relative max-w-[670px] px-10 mx-auto">
      {router.pathname === "/search" && (
        <IconContext.Provider value={{ className: "absolute -left-1 top-7 text-white text-xl cursor-pointer" }}>
          <BiArrowBack onClick={handleBack} />
        </IconContext.Provider>
      )}
      <input
        ref={ref}
        id="search"
        className="text-white w-full py-1 px-4 rounded bg-neutral-700 border border-neutral-700 focus:outline-none focus:border-neutral-500"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setPhrase(e.currentTarget.value)}
        placeholder='Search "Launch a startup" (Press / to focus)'
        value={phrase}
      />
      {(focus || phrase) && (
        <img className="absolute top-6 right-12 cursor-pointer"
          onClick={handleClick} 
          alt="Search icon" 
          src="/search-icon.svg" />
      )}
    </div>
  );
};

export default Search;

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useKeyPress, useViewportWidth } from "../utils/hooks";

import styles from "../styles/searchBar.module.css";

const Search = () => {
  const placeholder = "Search                                       ⌘+K";

  const router = useRouter();
  const ref = useRef();
  const iconRef = useRef();
  const { width } = useViewportWidth();
  const [focus, setFocus] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [searchShown, setSearchShown] = useState(false);

  const handleFocus = (e) => {
    setFocus(true);
    e.currentTarget.style.paddingRight = "38px";
  };

  const handleBlur = (e) => {
    setFocus(false);
    e.currentTarget.style.paddingRight = "10px";
  };

  const handleClick = () => {
    router.push(`/search?phrase=${phrase}`);
  };

  const handleMobileClick = () => {
    const searchInput = document.getElementById("search");
    const searchBar = document.getElementById("searchBar");
    if (searchBar.style.display === "none") {
      searchBar.style.display = "block";
      setSearchShown(true);
      searchInput.focus();
    } else {
      searchBar.style.display = "none";
      setSearchShown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (width >= 650) {
      if (e.metaKey || e.ctrlKey) {
        ref.current.focus();
      } else if (e.key === "Enter" && focus) {
        handleClick();
        ref.current.blur();
      }
    }
  };

  const handleClickOutside = (e) => {
    if (width <= 650) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !iconRef.current.contains(e.target)
      ) {
        const searchBar = document.getElementById("searchBar");
        if (searchBar.style.display === "block") {
          searchBar.style.display = "none";
          setSearchShown(false);
        }
      }
    }
  };

  // Set keyboard shortcuts
  useKeyPress(["k", "Enter"], handleKeyPress);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  if (width <= 650) {
    return (
      <>
        <img
          ref={iconRef}
          className={styles.mobileSearch}
          onClick={handleMobileClick}
          alt="Search icon"
          src={!searchShown ? "/search-icon.svg" : "/cross-icon-grey.svg"}
        />
        <div
          id="searchBar"
          style={{ display: "none" }}
          className={styles.mobileWrapper}
        >
          <input
            ref={ref}
            id="search"
            className={styles.mobileInput}
            onChange={(e) => setPhrase(e.currentTarget.value)}
            placeholder="Search"
          />
          <img
            className={styles.searchImg}
            onClick={handleClick}
            alt="Search icon"
            src="/search-icon.svg"
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.wrapper}>
      <input
        ref={ref}
        id="search"
        className={styles.input}
        onFocus={(e) => handleFocus(e)}
        onBlur={(e) => handleBlur(e)}
        onChange={(e) => setPhrase(e.currentTarget.value)}
        placeholder={!focus ? placeholder : "Search"}
        value={phrase}
      />
      {(focus || phrase) && (
        <img onClick={handleClick} alt="Search icon" src="/search-icon.svg" />
      )}
    </div>
  );
};

export default Search;

import React, { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SearchDropdown } from "./SearchDropdown";
import "../../Search.css";
import { SearchIcon, SearchbarCloseIcon } from "@/assets";
import { useSearchQuery } from "../../hooks/useSearchQuery";

export function Searchbar({ loggedIn, searchbarRef, setShowSearchScreen }) {
  const formRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const query = useSearchQuery();

  useEffect(() => {
    let trimmed = query?.trim();
    setSearchQuery(trimmed);
  }, [query]);

  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setSearchQuery("");
    }
  }, [location]);

  const handleEnter = (e) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      setShowSearchDropdown(false);
      setShowSearchScreen(false);
      searchbarRef?.current.blur();
      history.push(`/search/posts?q=${searchQuery.trim()}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    setShowSearchScreen(false);
    formRef.current.submit();
  };
  return (
    <div
      className={
        loggedIn ? "nav-search-bar" : "nav-search-bar nav-search-loggedout"
      }
    >
      <div
        className={`nav-search-stuff${
          showSearchDropdown && searchQuery.length > 0 ? " nav-search-open" : ""
        }`}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          action="/search/posts"
          method="get"
          role="search"
          className="nav-search-input-container"
        >
          <label htmlFor="nav-search-bar">
            <div aria-hidden="true" className="nav-search-btn">
              <SearchIcon height="15" width="15" color="#878a8c" />
            </div>
          </label>
          <input
            type="search"
            id="nav-search-bar"
            ref={searchbarRef}
            value={searchQuery}
            onKeyPress={handleEnter}
            onFocus={(e) => {
              if (e.target.value.length > 0) setShowSearchDropdown(true);
            }}
            onChange={(e) => {
              setShowSearchDropdown(true);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search Ribbit"
            className="nav-input"
            name="q"
          />
        </form>
        {searchQuery && searchQuery.length > 0 && (
          <button
            className="search-close-icon"
            onClick={(e) => {
              setSearchQuery("");
              setShowSearchDropdown(false);
              let element = document.querySelector(".nav-input");
              element.focus();
            }}
          >
            <SearchbarCloseIcon />
          </button>
        )}
      </div>
      {showSearchDropdown && searchQuery && searchQuery.length > 0 && (
        <SearchDropdown
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowSearchDropdown={setShowSearchDropdown}
          setShowSearchScreen={setShowSearchScreen}
        />
      )}
    </div>
  );
}

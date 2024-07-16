import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchTerm as setSearchTermAction } from "../redux/actions/productActions";
import "./SearchBar.css";

const SearchBar = () => {
  const [searchTerm, setSearchTermState] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    dispatch(setSearchTermAction(debouncedSearchTerm));
  }, [debouncedSearchTerm, dispatch]);

  const handleSearch = () => {
    dispatch(setSearchTermAction(searchTerm));
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTermState(e.target.value)}
        placeholder="Search products..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

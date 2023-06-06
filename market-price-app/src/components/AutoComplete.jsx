import React, { useContext } from "react";
import { useState, useEffect } from "react";
import finnHub from "../apis/finnHub";
import { WatchListContext } from "../context/watchListContext";

export const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { addStock } = useContext(WatchListContext);

  const renderDropdown = () => {
    return search ? "show" : null;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await finnHub.get("/search", {
          params: {
            q: search,
          },
        });

        if (isMounted) {
          setResults(response.data.result);
          console.log(results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (search.length > 0) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [search]);

  return (
    <div className="rounded w-50 p-5 mx-auto">
      <div className="form-floating dropdown">
        <input
          type="text"
          id="search"
          className="form-control"
          placeholder="Search..."
          autoComplete="off"
          style={{
            backgroundColor: "rgba(145, 158, 178, 0.04)",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="search">Search</label>
        <ul
          className={`dropdown-menu ${renderDropdown()} overflow-x-hidden overflow-y-scroll w-100`}
          style={{ maxHeight: "25rem" }}
        >
          {results.map((result) => {
            return (
              <li
                key={result.symbol}
                className="dropdown-item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  addStock(result.symbol);
                  setSearch("");
                }}
              >
                {result.description} ({result.symbol})
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

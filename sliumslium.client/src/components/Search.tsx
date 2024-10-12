import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const [name, yearStr, type] = searchTerm
      .split(";")
      .map((part) => part.trim());

    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);
    if (yearStr) queryParams.append("year", yearStr);
    if (type) queryParams.append("type", type);

    navigate(`/search-results?${queryParams.toString()}`);
  };

  return (
    <nav>
      <div className="nav-wrapper search-nav-wrapper">
        <form onSubmit={handleSearch}>
          <div className="input-field">
            <input
              id="search"
              type="search"
              placeholder="Search (name; year; type)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label className="label-icon">
              <FontAwesomeIcon icon={faSearch} />
            </label>
            <i className="material-icons">
              Press enter to search&emsp;
              <FontAwesomeIcon icon={faX} />
            </i>
          </div>
        </form>
      </div>
    </nav>
  );
}

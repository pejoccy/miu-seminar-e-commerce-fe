import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    setKeyword(""); // Clear input after search
  };

  return (
    <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.15)", width: "100%", maxWidth: "400px", height: "44px" }}>
      <input
        type="text"
        placeholder="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          flex: 1,
          padding: "0.75rem 1rem",
          border: "none",
          fontSize: "1rem",
          outline: "none",
          height: "100%",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: "0 1rem",
          backgroundColor: "#ff6f61",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <MdSearch size={20} />
      </button>
    </div>
  );
};

export default Search;

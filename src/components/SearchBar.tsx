import { useState } from "react";
import { useCities } from "../store/cities";
import { findCityIdByName } from "../api/weather";
import "./SearchBar.css"; // Fixed import to use SearchBar.css

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const add = useCities((s) => s.add);

  async function onAdd() {
    const term = q.trim();
    if (!term || busy) return;
    setBusy(true);
    try {
      const hit = await findCityIdByName(term);
      if (hit) { 
        add({ id: hit.id, name: hit.name }); 
        setQ(""); 
      } else { 
        alert("City not found"); 
      }
    } catch (error) {
      alert("Error searching for city");
    } finally { 
      setBusy(false); 
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter a city"
          className="search-input"
          disabled={busy}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={busy || !q.trim()}
        >
          {busy ? "Adding..." : "Add City"}
        </button>
      </form>
    </div>
  );
}
import React, { useMemo } from "react";
import SearchBar from "../components/SearchBar";
import CityCard from "../components/CityCard";
import { useCities } from "../store/cities";
import type { City } from "../store/cities";
import "./Home.css";

function isValidCity(c: any): c is City {
  return (
    c &&
    typeof c.id === "number" &&
    !Number.isNaN(c.id) &&
    typeof c.name === "string" &&
    c.name.length > 0
  );
}

export default function Home() {
  const cities = useCities((s) => s.cities);

  const safeCities = useMemo<City[]>(
    () => (Array.isArray(cities) ? cities.filter(isValidCity) : []),
    [cities]
  );

  return (
    <div className="home-container">
      {/* Background Image */}
      <div className="home-background"></div>
      
      {/* Content */}
      <div className="home-content">
        {/* Header */}
        <div className="home-header">
          <h1 className="home-title">🌤️ Weather App</h1>
          <SearchBar />
        </div>

        {/* Main Content Area */}
        <div className="home-main-content">
          {/* 2-Column Grid */}
          {safeCities.length > 0 ? (
            <div className="cities-grid-two-column">
              {safeCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No cities yet — add one above.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="home-footer">
          <p>2024 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
}
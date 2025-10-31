import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCities } from "../store/cities";
import type { City } from "../store/cities";
import { getWeatherById, type WeatherData } from "../api/weather";
import "./CityCard.css";


export default function CityCard({
  city,
  refreshKey = 0,
}: { city: City; refreshKey?: number }) {
  const nav = useNavigate();
  const remove = useCities((s) => s.remove);
  const [w, setW] = useState<WeatherData | null>(null);

  useEffect(() => {
    let ok = true;
    getWeatherById(city.id).then((d) => ok && setW(d)).catch(console.warn);
    return () => { ok = false; };
  }, [city.id, refreshKey]);

  const handleCardClick = () => {
    nav(`/city/${city.id}`);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when removing
    remove(city.id);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when refreshing
    getWeatherById(city.id, true).then(setW);
  };

  return (
    <div className="city-card" onClick={handleCardClick}>
      {/* Top Section - 2 Columns */}
      <div className="card-top-section">
        <div className="top-section-background"></div>
        <div className="top-section-content">
          {/* Left Column - City Info */}
          <div className="city-info-column">
            <div className="city-header">
              <div className="city-info">
                <h3 className="city-name">{w?.name ?? city.name}</h3>
                <div className="city-meta">
                  <span className="city-time">{w?.time ?? "9.19am, Feb 8"}</span>
                  <span className="city-condition">{w?.condition ?? "Few Clouds"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Temperature Info */}
          <div className="temperature-column">
            <div className="temperature-section">
              <div className="main-temperature">{w ? `${w.temp}°C` : "—"}</div>
              <div className="temperature-range">
                <span>Temp Min: {w ? `${w.tempMin}°C` : "—"}</span>
                <span>Temp Max: {w ? `${w.tempMax}°C` : "—"}</span>
              </div>
            </div>
          </div>

          {/* Close Button - Absolute positioned */}
          <button 
            className="remove-btn"
            onClick={handleRemove}
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Bottom Section - 3 Columns */}
      <div className="card-bottom-section">
        <div className="bottom-column">
          <div className="detail-item">Pressure: {w ? `${w.pressure}hPa` : "1018hPa"}</div>
          <div className="detail-item">Humidity: {w ? `${w.humidity}%` : "78%"}</div>
          <div className="detail-item">Visibility: {w ? `${w.visibility}km` : "8.0km"}</div>
        </div>
        
        <div className="bottom-column">
          <div className="detail-item">4.0m/s 120 Degree</div>
        </div>
        
        <div className="bottom-column">
          <div className="detail-item">Sunrise: {w?.sunrise ?? "6:05am"}</div>
          <div className="detail-item">Sunset: {w?.sunset ?? "6:05am"}</div>
        </div>
      </div>
    </div>
  );
}
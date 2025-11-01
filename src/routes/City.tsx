import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCities } from "../store/cities";
import { getWeatherById, type WeatherData } from "../api/weather";
import "./City.css";
import { getWeatherIcon } from "../utils/weatherIcons";

export default function City() {
  const nav = useNavigate();
  const { id } = useParams();
  const cityId = Number(id);
  const city = useCities((s) => s.cities.find((c) => c.id === cityId));
  const [w, setW] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (Number.isFinite(cityId)) {
      getWeatherById(cityId).then(setW).catch(console.warn);
    }
  }, [cityId]);

  return (
    <div className="city-detail-page">
      {/* Full Page Background */}
      <div className="city-background"></div>
      
      {/* Content */}
      <div className="city-content">
        {/* Header Section */}
        <header className="detail-header">
          <h1 className="app-title">🌤️ Weather App</h1>
        </header>

        {/* Body Section - Weather Card */}
        <main className="detail-body">
          <div className="weather-card">
            {/* Top Section */}
            <div className="card-top-section">
              {/* First Row - Back Arrow, City Name, Time & Date */}
              <div className="top-first-row">
                <button 
                  className="back-arrow" 
                  onClick={() => nav(-1)}
                  aria-label="Go back"
                >
                  ←
                </button>
                <div className="city-time-info">
                  <div className="city-name">
                    {w ? `${w.name}${w.country ? `, ${w.country}` : ''}` : city?.name ?? "Colombo, LK"}
                  </div>
                  <div className="time-date">{w?.time ?? "9.19am, Feb 8"}</div>
                </div>
                <div className="spacer"></div>
              </div>

              {/* Second Row - 2 Columns */}
              <div className="top-second-row">
                <div className="weather-condition-column">
                  <div className="weather-condition">
                    <span className="weather-icon">{getWeatherIcon(w?.condition)}</span>
                    {w?.condition ?? "Few Clouds"}
                  </div>
                </div>
                
                <div className="vertical-line"></div>
                
                <div className="temperature-column">
                  <div className="main-temperature">{w ? `${Math.round(w.temp)}°C` : "27°C"}</div>
                  <div className="temperature-range">
                    <div className="temp-min">Temp Min: {w ? `${Math.round(w.tempMin)}°C` : "25°C"}</div>
                    <div className="temp-max">Temp Max: {w ? `${Math.round(w.tempMax)}°C` : "28°C"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
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
        </main>

        {/* Footer Section */}
        <footer className="detail-footer">
          <p>2024 Fidenz Technologies</p>
        </footer>
      </div>
    </div>
  );
}
// src/utils/weatherIcons.ts
export const getWeatherIcon = (condition: string | undefined) => {
  if (!condition) return "⛅";
  
  const iconMap: Record<string, string> = {
    // Clear
    "Clear": "☀️",
    
    // Clouds
    "Clouds": "☁️",
    "Few Clouds": "🌤️",
    "Scattered Clouds": "⛅",
    "Broken Clouds": "☁️",
    "Overcast Clouds": "☁️",
    
    // Rain
    "Rain": "🌧️",
    "Drizzle": "🌦️",
    "Shower Rain": "🌦️",
    "Thunderstorm": "⛈️",
    "Storm": "⛈️",
    
    // Snow
    "Snow": "❄️",
    "Sleet": "🌨️",
    
    // Atmosphere
    "Mist": "🌫️",
    "Smoke": "🌫️",
    "Haze": "🌫️",
    "Dust": "🌫️",
    "Fog": "🌫️",
    "Sand": "🌫️",
    "Ash": "🌫️",
    "Squall": "💨",
    "Tornado": "🌪️",
  };
  
  return iconMap[condition] || "⛅";
};
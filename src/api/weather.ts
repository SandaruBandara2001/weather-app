// src/api/weather.ts
import axios from "axios";

/** Data your cards/detail pages render */
export type WeatherData = {
  name: string;
  condition: string;        // e.g. "Clouds"
  description: string;      // e.g. "few clouds"
  temp: number;             // °C
  tempMin: number;          // °C
  tempMax: number;          // °C
  pressure: number;         // hPa
  humidity: number;         // %
  visibility: number;       // km
  sunrise: string;          // local time string (12h)
  sunset: string;           // local time string (12h)
  time: string;             // local date+time (12h, e.g. "9:19 AM, Feb 8")
};

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const TTL = 5 * 60 * 1000; // 5 minutes

// ---------- safe localStorage helpers ----------
const storage = {
  get(key: string) {
    try { return typeof window === "undefined" ? null : window.localStorage.getItem(key); }
    catch { return null; }
  },
  set(key: string, val: string) {
    try { if (typeof window !== "undefined") window.localStorage.setItem(key, val); }
    catch { /* ignore */ }
  },
  remove(key: string) {
    try { if (typeof window !== "undefined") window.localStorage.removeItem(key); }
    catch { /* ignore */ }
  },
};

/** format times using API timezone offset (seconds) — forced 12h clock */
function formatTime(unixSec: number, tzOffsetSec: number, withDate = false) {
  const localMs =
    (unixSec + tzOffsetSec) * 1000 - new Date().getTimezoneOffset() * 60000;
  const d = new Date(localMs);

  if (withDate) {
    return d.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ---------- tiny cache ----------
function cacheGet<T>(key: string): T | null {
  const raw = storage.get(key);
  if (!raw) return null;
  try {
    const { ts, data } = JSON.parse(raw);
    return Date.now() - ts < TTL ? (data as T) : null;
  } catch { return null; }
}
function cacheSet<T>(key: string, data: T) {
  storage.set(key, JSON.stringify({ ts: Date.now(), data }));
}

// =======================================================
// Public API
// =======================================================

/** Weather by numeric OpenWeather city ID (set force=true to bypass cache) */
export async function getWeatherById(id: number, force = false): Promise<WeatherData> {
  if (!API_KEY) throw new Error("Missing VITE_WEATHER_API_KEY");

  const cacheKey = `wx:${id}`;
  if (!force) {
    const cached = cacheGet<WeatherData>(cacheKey);
    if (cached) return cached;
  }

  try {
    const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { id, units: "metric", appid: API_KEY },
    });

    const tz = data.timezone ?? 0;
    const result: WeatherData = {
      name: data.name,
      condition: data.weather?.[0]?.main ?? "",
      description: data.weather?.[0]?.description ?? "",
      temp: Math.round(data.main?.temp),
      tempMin: Math.round(data.main?.temp_min),
      tempMax: Math.round(data.main?.temp_max),
      pressure: Number(data.main?.pressure),
      humidity: Number(data.main?.humidity),
      visibility: Math.round((Number(data.visibility) || 0) / 1000),
      sunrise: formatTime(Number(data.sys?.sunrise), tz),
      sunset: formatTime(Number(data.sys?.sunset), tz),
      time: formatTime(Number(data.dt), tz, true),
    };

    cacheSet(cacheKey, result);
    return result;
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err?.message || "Request failed";
    throw new Error(`OpenWeather error for id=${id} (${status ?? "?"}): ${msg}`);
  }
}

/** Preload many city IDs in parallel (use {force:true} to bypass cache) */
export async function prefetchWeather(ids: number[], opts?: { force?: boolean }) {
  const force = !!opts?.force;
  await Promise.allSettled(ids.map((id) => getWeatherById(id, force)));
}

/** Remove cached entries for given IDs; if none provided, clear all wx:* entries */
export function invalidateWeatherCache(ids?: number[]) {
  if (ids && ids.length) {
    ids.forEach((id) => storage.remove(`wx:${id}`));
  } else if (typeof window !== "undefined") {
    Object.keys(window.localStorage).forEach((k) => {
      if (k.startsWith("wx:")) storage.remove(k);
    });
  }
}

/** Resolve city name -> numeric ID, return { id, name } for your store */
export async function findCityIdByName(q: string): Promise<{ id: number; name: string } | null> {
  if (!API_KEY) throw new Error("Missing VITE_WEATHER_API_KEY");
  const term = q.trim();
  if (!term) return null;

  // 1) Name -> lat/lon
  const geo = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
    params: { q: term, limit: 1, appid: API_KEY },
  });
  const hit = geo.data?.[0];
  if (!hit) return null;

  // 2) Fetch once by lat/lon to get the canonical numeric city id
  const w = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: { lat: hit.lat, lon: hit.lon, appid: API_KEY },
  });

  return {
    id: Number(w.data.id),
    name: `${hit.name}${hit.country ? ", " + hit.country : ""}`,
  };
}

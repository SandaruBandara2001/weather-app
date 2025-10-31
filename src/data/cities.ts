import { create } from "zustand";

export type City = { id: number; name: string };

type S = {
  cities: City[];
  add: (c: City) => void;
  remove: (id: number) => void;
  setAll: (list: City[]) => void;
};

const LS_KEY = "cities.v1";

function validCity(c: any): c is City {
  return (
    c &&
    typeof c.id === "number" &&
    !Number.isNaN(c.id) &&
    typeof c.name === "string" &&
    c.name.length > 0
  );
}

function loadSaved(): City[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(validCity) : [];
  } catch {
    return [];
  }
}

export const useCities = create<S>((set, get) => ({
  cities: loadSaved(),
  add: (c) => {
    if (!validCity(c)) return;
    const next = [...get().cities.filter((x) => x.id !== c.id), c];
    set({ cities: next });
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  },
  remove: (id) => {
    const next = get().cities.filter((c) => c.id !== id);
    set({ cities: next });
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  },
  setAll: (list) => {
    const clean = list.filter(validCity);
    set({ cities: clean });
    localStorage.setItem(LS_KEY, JSON.stringify(clean));
  },
}));

// Seed from /cities.json once if nothing saved
(async () => {
  const saved = useCities.getState().cities;
  if (saved.length) return;
  try {
    const res = await fetch("/cities.json");
    const j = await res.json(); // { List: [{ CityCode, CityName, ...}] }
    const list: City[] = (j.List ?? [])
      .map((x: any) => ({
        id: Number(x.CityCode),
        name: String(x.CityName || "").trim(),
      }))
      .filter(validCity);
    useCities.getState().setAll(list);
  } catch (e) {
    console.warn("Seed failed:", e);
  }
})();

import { create } from "zustand";

export type City = { id: number; name: string };

type S = {
  cities: City[];
  add: (c: City) => void;
  remove: (id: number) => void;
  setAll: (list: City[]) => void;
};

const LS_KEY = "cities.v1";

const saved: City[] = (() => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
})();

export const useCities = create<S>((set, get) => ({
  cities: saved,
  add: (c) => {
    const next = [...get().cities.filter(x => x.id !== c.id), c];
    set({ cities: next });
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  },
  remove: (id) => {
    const next = get().cities.filter(c => c.id !== id);
    set({ cities: next });
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  },
  setAll: (list) => {
    set({ cities: list });
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }
}));

// seed once from /cities.json if nothing saved
(async () => {
  if (saved.length) return;
  try {
    const res = await fetch("/cities.json");
    const j = await res.json();          // { List: [{ CityCode, CityName, ...}] }
    const list: City[] = (j.List ?? []).map((x: any) => ({
      id: Number(x.CityCode),
      name: x.CityName
    }));
    useCities.getState().setAll(list);
  } catch { /* ignore seed errors in dev */ }
})();

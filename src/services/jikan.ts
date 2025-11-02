import type {
  Anime,
  AnimeCharacter,
  AnimeRecommendation,
  AnimeStaff,
  Episode,
} from '../types';

const BASE = 'https://api.jikan.moe/v4';

// Ricerca con ordinamento di base e filtro SFW
export async function searchAnime(query: string, page = 1) {
  const url = `${BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&order_by=score&sort=desc&sfw`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as {
    data: Anime[];
    pagination: { has_next_page: boolean; current_page: number };
  };
}

export async function getAnimeById(malId: number) {
  const res = await fetch(`${BASE}/anime/${malId}/full`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: Anime };
}

export async function getAnimeEpisodes(malId: number) {
  const res = await fetch(`${BASE}/anime/${malId}/episodes`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: Episode[] };
}

export async function getPopularAnime(page = 1) {
  const url = `${BASE}/anime?order_by=popularity&sfw&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as {
    data: Anime[];
    pagination: { has_next_page: boolean; current_page: number };
  };
}

export async function getSeasonNow() {
  const res = await fetch(`${BASE}/seasons/now`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: Anime[] };
}

export async function getTopAnime(page = 1) {
  const res = await fetch(`${BASE}/top/anime?page=${page}`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: Anime[] };
}

export async function getAnimeCharacters(malId: number) {
  const res = await fetch(`${BASE}/anime/${malId}/characters`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: AnimeCharacter[] };
}

export async function getAnimeStaff(malId: number) {
  const res = await fetch(`${BASE}/anime/${malId}/staff`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: AnimeStaff[] };
}

export async function getAnimeRecommendations(malId: number) {
  const res = await fetch(`${BASE}/anime/${malId}/recommendations`);
  if (!res.ok) throw new Error(`Errore Jikan: ${res.status}`);
  return (await res.json()) as { data: AnimeRecommendation[] };
}

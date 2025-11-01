import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchEntry, WatchStatus, Anime } from '../types';

const KEY = 'WATCHLIST_V1';
const RATINGS_KEY = 'RATINGS_V1';
const COMMENTS_KEY = 'COMMENTS_V1';
const LIKES_KEY = 'LIKES_V1';

export async function getWatchlist(): Promise<WatchEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WatchEntry[];
  } catch {
    return [];
  }
}

async function saveWatchlist(list: WatchEntry[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function addToWatchlist(anime: Anime) {
  const list = await getWatchlist();
  const exists = list.find(e => e.id === anime.mal_id);
  if (exists) return exists;

  const entry: WatchEntry = {
    id: anime.mal_id,
    title: anime.title,
    image: anime.images?.jpg?.image_url ?? anime.images?.webp?.image_url,
    totalEpisodes: anime.episodes ?? null,
    progress: 0,
    status: 'Plan to Watch',
    addedAt: Date.now(),
  };
  const updated = [entry, ...list];
  await saveWatchlist(updated);
  return entry;
}

export async function removeFromWatchlist(id: number) {
  const list = await getWatchlist();
  const updated = list.filter(e => e.id !== id);
  await saveWatchlist(updated);
}

export async function updateProgress(id: number, progress: number) {
  const list = await getWatchlist();
  const updated = list.map(e => (e.id === id ? { ...e, progress } : e));
  await saveWatchlist(updated);
}

export async function updateStatus(id: number, status: WatchStatus) {
  const list = await getWatchlist();
  const updated = list.map(e => (e.id === id ? { ...e, status } : e));
  await saveWatchlist(updated);
}

// Ratings
export async function getRatings(): Promise<{ [malId: number]: number }> {
  const raw = await AsyncStorage.getItem(RATINGS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveRatings(ratings: { [malId: number]: number }) {
  await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

export async function addRating(malId: number, rating: number) {
  const ratings = await getRatings();
  ratings[malId] = rating;
  await saveRatings(ratings);
}

export async function getRating(malId: number): Promise<number | null> {
  const ratings = await getRatings();
  return ratings[malId] ?? null;
}

// Comments
export async function getComments(): Promise<{ [malId: number]: string[] }> {
  const raw = await AsyncStorage.getItem(COMMENTS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveComments(comments: { [malId: number]: string[] }) {
  await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export async function addComment(malId: number, comment: string) {
  const comments = await getComments();
  if (!comments[malId]) {
    comments[malId] = [];
  }
  comments[malId].push(comment);
  await saveComments(comments);
}

export async function getCommentsForAnime(malId: number): Promise<string[]> {
  const comments = await getComments();
  return comments[malId] ?? [];
}

// Likes
export async function getLikes(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(LIKES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveLikes(likes: number[]) {
  await AsyncStorage.setItem(LIKES_KEY, JSON.stringify(likes));
}

export async function toggleLike(malId: number) {
  const likes = await getLikes();
  const index = likes.indexOf(malId);
  if (index > -1) {
    likes.splice(index, 1);
  } else {
    likes.push(malId);
  }
  await saveLikes(likes);
}

export async function isLiked(malId: number): Promise<boolean> {
  const likes = await getLikes();
  return likes.includes(malId);
}

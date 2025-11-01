export type Anime = {
  mal_id: number;
  url?: string;
  images?: {
    jpg?: { image_url?: string; large_image_url?: string };
    webp?: { image_url?: string; large_image_url?: string };
  };
  title: string;
  title_english?: string;
  episodes?: number | null;
  score?: number | null;
  synopsis?: string | null;
  year?: number | null;
  status?: string | null;
};

export type WatchStatus =
  | 'Watching'
  | 'Completed'
  | 'On Hold'
  | 'Dropped'
  | 'Plan to Watch';

export type WatchEntry = {
  id: number;                // mal_id
  title: string;
  image?: string;
  totalEpisodes?: number | null;
  progress: number;          // episodi visti
  status: WatchStatus;
  addedAt: number;           // timestamp
};

export type AnimeImages = {
  jpg?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
    maximum_image_url?: string;
  };
  webp?: {
    image_url?: string;
    small_image_url?: string;
    large_image_url?: string;
  };
};

export type NamedEntity = {
  mal_id: number;
  name: string;
  url?: string;
  type?: string;
};

export type AnimeTitleVariant = {
  type?: string | null;
  title: string;
};

export type AnimeTrailer = {
  youtube_id?: string | null;
  url?: string | null;
  embed_url?: string | null;
  images?: {
    image_url?: string | null;
    small_image_url?: string | null;
    medium_image_url?: string | null;
    large_image_url?: string | null;
    maximum_image_url?: string | null;
  } | null;
};

export type AnimeBroadcast = {
  day?: string | null;
  time?: string | null;
  timezone?: string | null;
  string?: string | null;
};

export type AnimeAired = {
  from?: string | null;
  to?: string | null;
  string?: string | null;
  prop?: {
    from?: { day?: number | null; month?: number | null; year?: number | null };
    to?: { day?: number | null; month?: number | null; year?: number | null };
  };
};

export type AnimeRelation = {
  relation: string;
  entry: Array<{
    mal_id: number;
    name: string;
    type?: string;
    url?: string;
  }>;
};

export type AnimeStream = {
  name: string;
  url: string;
};

export type AnimeExternal = AnimeStream;

export type AnimeThemeSongs = {
  openings: string[];
  endings: string[];
};

export type Anime = {
  mal_id: number;
  url?: string;
  images?: AnimeImages;
  title: string;
  titles?: AnimeTitleVariant[] | null;
  title_english?: string | null;
  title_japanese?: string | null;
  title_synonyms?: string[] | null;
  type?: string | null;
  source?: string | null;
  episodes?: number | null;
  status?: string | null;
  airing?: boolean;
  aired?: AnimeAired | null;
  duration?: string | null;
  rating?: string | null;
  score?: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
  synopsis?: string | null;
  background?: string | null;
  season?: string | null;
  year?: number | null;
  broadcast?: AnimeBroadcast | null;
  producers?: NamedEntity[] | null;
  licensors?: NamedEntity[] | null;
  studios?: NamedEntity[] | null;
  genres?: NamedEntity[] | null;
  themes?: NamedEntity[] | null;
  demographics?: NamedEntity[] | null;
  trailer?: AnimeTrailer | null;
  streaming?: AnimeStream[] | null;
  external?: AnimeExternal[] | null;
  theme?: AnimeThemeSongs | null;
  relations?: AnimeRelation[] | null;
};

export type AnimeCharacter = {
  character: {
    mal_id: number;
    name: string;
    url?: string;
    images?: AnimeImages;
  };
  role: string;
  favourites?: number;
  voice_actors: Array<{
    person: {
      mal_id: number;
      name: string;
      url?: string;
      images?: AnimeImages;
    };
    language: string;
  }>;
};

export type AnimeStaff = {
  person: {
    mal_id: number;
    name: string;
    url?: string;
    images?: AnimeImages;
  };
  positions: string[];
};

export type AnimeRecommendation = {
  entry: {
    mal_id: number;
    title: string;
    url?: string;
    images?: AnimeImages;
  };
  votes: number;
};

export type Episode = {
  mal_id: number;
  title: string;
  aired?: string;
};

export type WatchStatus = 'Watching' | 'Completed' | 'On Hold' | 'Dropped' | 'Plan to Watch';

export type WatchEntry = {
  id: number; // mal_id
  title: string;
  image?: string;
  totalEpisodes?: number | null;
  progress: number; // episodi visti
  status: WatchStatus;
  addedAt: number; // timestamp
};

import { TMDB_API_KEY } from "@/constants.d";
import { DMovie } from "@/types";

export interface IgetDiscoverMoviesPayload {
  page: number;
}

export interface IgetDiscoverMoviesResponse {
  page: number;
  results: DMovie[];
  total_pages: number;
  total_results: number;
}

export async function getDiscoverMovies(payload: IgetDiscoverMoviesPayload) {
  let { page, with_genres, sort_by } = payload;

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&with_genres=${with_genres}&sort_by=${sort_by}`;

  const res = await fetch(url, {
    next: {
      revalidate: 5,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return await res.json();
}

export async function getMovieGenres(payload) {
  let {} = payload;

  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;

  const res = await fetch(url, {
    next: {},
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return await res.json();
}

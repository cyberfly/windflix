import { TMDB_API_KEY } from "@/constants.d";
import { DMovie } from "@/types";

export interface IgetDiscoverMoviesPayload {
  page: number;
  with_genres: string | string[];
  sort_by: string | string[];
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

  console.log("url", url);

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

export interface IgetMovieGenresPayload {}

export interface IgetMovieGenresResponse {
  genres: [];
}

export async function getMovieGenres(payload: IgetMovieGenresPayload) {
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

export interface IgetDiscoverMoviesCursorPaginatePayload {
  page: number;
  with_genres: string | string[];
  sort_by: string | string[];
}

export interface IgetDiscoverMoviesCursorPaginateResponse {
  page: number;
  results: DMovie[];
  total_pages: number;
  total_results: number;
}

export async function getDiscoverMoviesCursorPaginate(
  payload: IgetDiscoverMoviesCursorPaginatePayload
) {
  let { page, with_genres, sort_by } = payload;

  /* Idea Breakdown:
  1. API supports only 20 records per page. 30 / 20 = 1.5 = 2 page
  2. If we need 30 records, then we need to loop 2 times, returns 40 records
  3. Promise all so that the request can run async (faster)
  4. However, async request can finish not in order. Eg page 1, page 3, page 2
  5. So we need to reorder the result based on page 1, page 2, page 3
  6. From the result, we need to slice 30 records out of 40. 
  7. When slicing, need to be careful to not effect the array orders
  8. We need to get the ID of records 31, example 569094
  9. We need to get the current page 2
  10. When user navigate to page 2 (UI), loop need to start from page 2, end page 3
  11. Page 2 result only must start from ID 569094, so we get 10 records
  12. Page 3 got 20 records full
  13. If there is no slice, we need to request page 4 without any start id
  14. I think we need to know how many was slice on the next request
  */

  /*
  Manual test via Postman: The data might change from time to time depending on voting, so this might not be accurate
  First page (1,2)(20,10): First: 1029575 Rebel Moon - 20: 502356 The Super Mario - Last: 762430 Retribution
  Second Page (2,3)(10,20): First: 940721 Godzilla - 20: 1010581 My Fault - Last: 315162 Puss in Boots
  Third Page (4,5)(20,10): First: 609681 The Marvels - 20: 360920 The Grinch - Last: 1072790 Anyone But You
  Fourth Page (5,6)(10,20): First: 1186957 The Velveteen Rabbit - 20: 868759 Ghosted - Last: 640146 Ant-Man and the Wasp
  */

  /**
   * Try to find some pattern from here (inverse on even page)
   * If need 30, pattern is (20,10),(10,20),(20,10)
   * If need 40, pattern is (20,20),(20,20),(20,20)
   * If need 50, pattern is (20,20,10),(10,20,20),(20,20,10)
   * If need 60, pattern is (20,20,20),(20,20,20),(20,20,20)
   * If need 70, pattern is (20,20,20,10),(10,20,20,20),(20,20,20,10)
   */

  /**
   * Slice pattern
   * If need 30, pattern is (0,30),(10,40),(0,30),(10,40)
   *
   * 20 + 20 = 40 (0,30) 1-2
   * 20 + 20 = 40 (10,40) 2-3
   * 20 + 20 = 40 (0,30) 4-5
   * 20 + 20 = 40 (10,40) 5-6
   */

  /**
   * Update: we can simplify by removing cursor page and cursor id, just use slice based on calculation
   */

  console.log("---->STARTING MOVIES FETCH<-----");

  const api_size = 20;

  let client_size = 30;

  const page_needed = Math.ceil(client_size / api_size);

  let promises = [];

  const getApiPageNumber = (page_number: number, per_page: number): number => {
    let api_page_number = ((page_number - 1) * per_page) / api_size + 1;

    return Math.floor(api_page_number);
  };

  const starting_page = getApiPageNumber(page, client_size);

  for (let i = 0; i < page_needed; i++) {
    let page_payload = {
      page: starting_page + i,
      with_genres: with_genres,
      sort_by: sort_by,
    };

    promises.push(getDiscoverMovies(page_payload));
  }

  const responses = await Promise.all(promises);

  // IMPORTANT. Here we will transform the data to current interface

  let total_results = responses[0].total_results;

  let total_pages = Math.ceil(total_results / client_size);

  let combined_page_movies = [];
  let page_movies = [];

  // Combine results arrays using map and flat
  combined_page_movies = responses.map((response) => response.results).flat();

  // console.log("combined_page_movies", combined_page_movies);

  // determine slicing size

  let slice_start_index = 0;
  let slice_end_index = 0;

  // second page end of pattern
  if (page % 2 === 0) {
    // slice_start_index = 10;
    // slice_end_index = 40;

    slice_start_index = client_size - api_size;
    slice_end_index = client_size + slice_start_index;
  } else {
    // slice_end_index = 30;
    slice_end_index = client_size;
    slice_start_index = 0;
  }

  // get the page movies by slicing

  page_movies = combined_page_movies.slice(slice_start_index, slice_end_index);

  const paginate_result = {
    page: page,
    results: page_movies,
    total_pages: total_pages,
    total_results: total_results,
  };

  return paginate_result;
}

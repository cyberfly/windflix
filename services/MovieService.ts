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
  cursor_page: number;
  cursor_id: number;
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
  let { page, cursor_page, cursor_id, with_genres, sort_by } = payload;

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
   * Easier to test with less popular, data dont change much
   * First page (1,2)(20,10): Let the Sea Resound -> 野球どアホウ未亡人
   * Second Page (2,3)(10,20):cursor_id 0: Close Dalny -> Epiplaphobia
   * Third Page (4,5)(20,10): Paco Roca -> The Worker
   * Fourth Page (5,6)(10,20):cursor_id 0: Martha Argerich -> KEVIN
   */

  console.log("---->STARTING MOVIES FETCH<-----");

  const api_size = 20;

  let client_size = 30;

  const page_needed = Math.ceil(client_size / api_size);

  const last_page = cursor_page - 1 + page_needed;
  let next_cursor_page = last_page;

  console.log("cursor_page", cursor_page);
  console.log("page_needed", page_needed);
  console.log("last_page", last_page);

  let promises = [];

  for (let i = cursor_page; i <= last_page; i++) {
    console.log(`Processing page ${i}`);

    let page_payload = {
      page: i,
      with_genres: with_genres,
      sort_by: sort_by,
    };

    promises.push(getDiscoverMovies(page_payload));
  }

  const responses = await Promise.all(promises);

  // console.log('responses', responses);

  // IMPORTANT. Here we will transform the data to current interface

  let total_results = responses[0].total_results;

  let total_pages = Math.ceil(total_results / client_size);

  let next_cursor_id = 0;

  let page_movies = [];

  for (const response of responses) {
    let page_results = response.results;

    console.log(`page_${response.page}_results_first_record`, page_results[0]);

    if (cursor_id !== 0 && cursor_page == response.page) {
      const targetIndex = page_results.findIndex(
        (record) => record.id === cursor_id
      );

      if (targetIndex !== -1) {
        const recordsAfterTarget = page_results.slice(targetIndex);
        // console.log(recordsAfterTarget);

        page_movies = [...page_movies, ...recordsAfterTarget];
      }
    } else {
      const needed_records_size = Math.min(
        client_size - page_movies.length,
        page_results.length
      );

      console.log("response.page", response.page);
      console.log("needed_records_size", needed_records_size);
      // console.log("page_results", page_results[0]);

      // for example only need 10 out of 20, then we need to get cursor_id
      if (needed_records_size != api_size) {
        const next_cursor_results = page_results.slice(needed_records_size);

        const first_cursor_remaining_id = next_cursor_results[0]?.id;

        next_cursor_id = first_cursor_remaining_id;
      } else {
        // skip the first page logic
        if (cursor_page != 1) {
          // if need 20, then it means we got all data from last page, so next cursor page should be increase + 1
          next_cursor_page = last_page + 1;
        }
      }

      page_movies = [
        ...page_movies,
        ...page_results.slice(0, needed_records_size),
      ];
    }

    if (page_movies.length >= client_size) {
      break;
    }
  }

  console.log("next_cursor_page", next_cursor_page);
  console.log("next_cursor_id", next_cursor_id);

  const paginate_result = {
    page: page,
    results: page_movies,
    total_pages: total_pages,
    total_results: total_results,
    cursor_page: next_cursor_page,
    cursor_id: next_cursor_id,
  };

  return paginate_result;
}

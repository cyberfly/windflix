import {
  getDiscoverMovies,
  getDiscoverMoviesCursorPaginate,
  getMovieGenres,
  IgetDiscoverMoviesPayload,
  IgetDiscoverMoviesResponse,
  IgetMovieGenresResponse,
  IgetDiscoverMoviesCursorPaginatePayload,
} from "@/services/MovieService";
import MovieCard from "@/components/MovieCard";
import Paginate from "@/components/commons/Paginate";
import MovieFilter from "@/components/commons/MovieFilter";
import { ISearchParams } from "@/types";
import { MOST_POPULAR_SORT, LESS_POPULAR_SORT } from "@/constants.d";
import Link from "next/link";

interface IHome {
  params: {};
  searchParams: ISearchParams;
}

export default async function Home(props: IHome) {
  const { searchParams } = props;

  const page = Array.isArray(searchParams["page"])
    ? parseInt(searchParams["page"][0] ?? "1", 10)
    : parseInt(searchParams["page"] ?? "1", 10);

  const cursor_page = Array.isArray(searchParams["cursor_page"])
    ? parseInt(searchParams["cursor_page"][0] ?? "1", 10)
    : parseInt(searchParams["cursor_page"] ?? "1", 10);

  // const cursor_page =
  //   searchParams["cursor_page"] !== undefined
  //     ? Array.isArray(searchParams["cursor_page"])
  //       ? parseInt(searchParams["cursor_page"][0] ?? "1", 10)
  //       : parseInt(searchParams["cursor_page"] ?? "1", 10)
  //     : null;

  const cursor_id = Array.isArray(searchParams["cursor_id"])
    ? parseInt(searchParams["cursor_id"][0] ?? "0", 10)
    : parseInt(searchParams["cursor_id"] ?? "0", 10);

  const with_genres = searchParams["with_genres"] ?? "";
  const sort_by = searchParams["sort_by"] ?? LESS_POPULAR_SORT;

  let payload: IgetDiscoverMoviesPayload = {
    page: page,
    with_genres: with_genres,
    sort_by: sort_by,
  };

  const discover_movies: IgetDiscoverMoviesResponse = await getDiscoverMovies(
    payload
  );

  let payload2: IgetDiscoverMoviesCursorPaginatePayload = {
    page: page,
    cursor_page: cursor_page,
    cursor_id: cursor_id,
    with_genres: with_genres,
    sort_by: sort_by,
  };

  const discover_movies2 = await getDiscoverMoviesCursorPaginate(payload2);

  const movie_genres: IgetMovieGenresResponse = await getMovieGenres(payload);

  return (
    <main className="min-h-screen">
      <header className="">
        <div className="max-w-screen-2xl px-8 py-10 mx-auto flex items-center justify-between">
          <Link href="/" className="text-4xl font-bold">
            <span className="text-slate-100">Wind</span>
            <span className="text-green-500">Flix</span>
          </Link>

          <a
            className="hover:underline text-2xl"
            href="https://github.com/cyberfly/windflix"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </div>
      </header>

      <section className="max-w-screen-2xl px-8 mx-auto">
        <h3 className="text-2xl font-bold mb-4">Now Showing</h3>
      </section>

      {/* filters */}

      <section className="max-w-screen-2xl px-8 mx-auto">
        <div className="mb-4 p-4 rounded-lg bg-slate-800">
          <MovieFilter movie_genres={movie_genres.genres}></MovieFilter>
        </div>
      </section>

      {/* end filters */}

      {/* movie list */}

      <section className="max-w-screen-2xl px-8 mx-auto">
        <div className="flex flex-wrap -mb-4 -mx-2">
          {discover_movies2.results.map((movie, key) => {
            return (
              <div
                key={key}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4 px-2"
              >
                <MovieCard movie={movie}></MovieCard>
              </div>
            );
          })}
        </div>
      </section>

      {/* end movie list */}

      {/* pagination */}
      <section className="max-w-screen-2xl my-8 px-8 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 p-4 rounded-lg bg-slate-800 ">
          <div className="flex flex-col md:flex-row items-center p-4 rounded-lg bg-slate-800 md:space-x-4">
            <p>
              <span className="font-bold">Page:</span>{" "}
              <span className="text-slate-300">
                {discover_movies.page} of {discover_movies.total_pages}
              </span>
            </p>

            <p>
              <span className="font-bold">Total Results:</span>{" "}
              <span className="text-slate-300">
                {discover_movies.total_results}
              </span>
            </p>
          </div>
          <Paginate
            page={discover_movies.page}
            cursor_page={discover_movies2.cursor_page}
            cursor_id={discover_movies2.cursor_id}
            total_pages={discover_movies.total_pages}
          ></Paginate>
        </div>
      </section>

      {/* end pagination */}
    </main>
  );
}

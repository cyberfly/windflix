import {
  getDiscoverMovies,
  getMovieGenres,
  IgetDiscoverMoviesPayload,
  IgetDiscoverMoviesResponse,
} from "@/services/MovieService";
import MovieCard from "@/components/MovieCard";
import Paginate from "@/components/commons/Paginate";
import MovieFilter from "@/components/commons/MovieFilter";
import { ISearchParams } from "@/types";
import { MOST_POPULAR_SORT } from "@/constants.d";

interface IHome {
  searchParams: ISearchParams;
}

export default async function Home(props: IHome) {
  const { searchParams } = props;

  const page = parseInt(searchParams["page"] ?? "1");
  const with_genres = searchParams["with_genres"] ?? "";
  const sort_by = searchParams["sort_by"] ?? MOST_POPULAR_SORT;

  // TODO: update IgetDiscoverMoviesPayload

  let payload: IgetDiscoverMoviesPayload = {
    page: page,
    with_genres: with_genres,
    sort_by: sort_by,
  };

  const discover_movies: IgetDiscoverMoviesResponse = await getDiscoverMovies(
    payload
  );

  // TODO: add interface getMovieGenres

  const movie_genres = await getMovieGenres(payload);

  return (
    <main className="min-h-screen">
      <header className="">
        <div className="max-w-screen-2xl px-8 py-10 mx-auto">
          <h3 className="text-4xl font-bold">
            <span className="text-green-200">Wind</span>
            <span className="text-green-500">Flix</span>
          </h3>
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
          {discover_movies.results.map((movie, key) => {
            return (
              <div
                key={key}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 px-2"
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
              <span className="font-bold">Page:</span> {discover_movies.page} of{" "}
              {discover_movies.total_pages}
            </p>

            <p>
              <span className="font-bold">Total Results:</span>{" "}
              {discover_movies.total_results}
            </p>
          </div>
          <Paginate page={discover_movies.page}></Paginate>
        </div>
      </section>

      {/* end pagination */}
    </main>
  );
}

import Image from "next/image";
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3 className="text-2xl font-bold mb-4">Now Showing</h3>

      <div className="mb-4 p-4 rounded-lg bg-gray-800">
        <h4>Meta:</h4>
        <p>Page: {discover_movies.page}</p>
        <p>Total Pages: {discover_movies.total_pages}</p>
        <p>Total Results: {discover_movies.total_results}</p>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-gray-800">
        <MovieFilter movie_genres={movie_genres.genres}></MovieFilter>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-gray-800">
        <Paginate page={discover_movies.page}></Paginate>
      </div>

      <ul className="list-none">
        {discover_movies.results.map((movie, key) => {
          return (
            <li key={key} className="mb-6 px-2">
              <MovieCard movie={movie}></MovieCard>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

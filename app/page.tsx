import Image from "next/image";
import {
  getDiscoverMovies,
  IgetDiscoverMoviesPayload,
  IgetDiscoverMoviesResponse,
} from "@/services/MovieService";
import MovieCard from "@/components/MovieCard";
import Paginate from "@/components/commons/Paginate";
import { ISearchParams } from "@/types";

interface IHome {
  searchParams: ISearchParams;
}

export default async function Home(props: IHome) {
  const { searchParams } = props;

  const page = parseInt(searchParams["page"] ?? "1");

  let payload: IgetDiscoverMoviesPayload = {
    page: page,
  };

  const discover_movies: IgetDiscoverMoviesResponse = await getDiscoverMovies(
    payload
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3 className="text-2xl font-bold mb-4">Now Showing</h3>

      <div className="mb-4 p-4 rounded-lg bg-gray-800">
        <h4>Meta:</h4>
        {discover_movies.page}
        <p>Page: {discover_movies.page}</p>
        <p>Total Pages: {discover_movies.total_pages}</p>
        <p>Total Results: {discover_movies.total_results}</p>
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

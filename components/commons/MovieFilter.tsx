"use client";
import { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useQueryFilter from "@/hooks/useQueryFilter";
import { MOST_POPULAR_SORT } from "@/constants.d";
import { DGenre } from "@/types";

interface iMovieFilter {
  movie_genres: DGenre[];
}

const MovieFilter: FC<iMovieFilter> = (props) => {
  const { movie_genres } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUrlQueryString } = useQueryFilter();

  const [genre, setGenre] = useState(searchParams.get("with_genres") ?? "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") ?? MOST_POPULAR_SORT
  );

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let genre_value = event.target.value;

    setGenre(genre_value);

    let new_query_string = updateUrlQueryString("with_genres", genre_value);

    router.push(`/?${new_query_string}`);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let sort_by_value = event.target.value;

    setSortBy(sort_by_value);

    let new_query_string = updateUrlQueryString("sort_by", sort_by_value);

    router.push(`/?${new_query_string}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
        <div className="w-full md:w-auto">
          <label className="block mb-2" htmlFor="genre">
            Genre
          </label>

          <select
            className="w-full text-slate-800 rounded-lg border-gray-400 text-sm"
            id="genre"
            value={genre}
            onChange={(e) => handleGenreChange(e)}
          >
            <option value="">All Genre</option>
            {movie_genres.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <label className="block mb-2" htmlFor="sort_by">
            Sort By
          </label>

          <select
            className="w-full text-slate-800 rounded-lg border-gray-400 text-sm"
            id="sort_by"
            value={sortBy}
            onChange={(e) => handleSortChange(e)}
          >
            <option value="">Default Sort</option>
            <option value="vote_average.desc">Highest Vote</option>
            <option value="vote_average.asc">Lowest Vote</option>
            <option value="popularity.desc">Most Popular</option>
            <option value="popularity.asc">Less Popular</option>
            <option value="revenue.desc">Highest Revenue</option>
            <option value="revenue.asc">Lowest Revenue</option>
            <option value="primary_release_date.desc">Newest Release</option>
            <option value="primary_release_date.asc">Oldest Release</option>

            {/* <option value="vote_count.desc">Most Voted</option>
            <option value="vote_count.asc">Less Voted</option> */}
          </select>
        </div>
      </div>
    </>
  );
};

export default MovieFilter;

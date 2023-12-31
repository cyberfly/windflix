"use client";
import { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useQueryFilter from "@/hooks/useQueryFilter";
import { MOST_POPULAR_SORT } from "@/constants.d";

interface iMovieFilter {
  page: number;
}

const MovieFilter: FC<iMovieFilter> = (props) => {
  const { page, movie_genres } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUrlQueryString } = useQueryFilter();

  const [genre, setGenre] = useState(searchParams.get("with_genres") ?? "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") ?? MOST_POPULAR_SORT
  );

  const handleGenreChange = (event) => {
    let genre_value = event.target.value;

    setGenre(genre_value);

    let new_query_string = updateUrlQueryString("with_genres", genre_value);

    router.push(`/?${new_query_string}`);
  };

  const handleSortChange = (event) => {
    let sort_by_value = event.target.value;

    setSortBy(sort_by_value);

    let new_query_string = updateUrlQueryString("sort_by", sort_by_value);

    router.push(`/?${new_query_string}`);
  };

  return (
    <>
      <div className="flex items-center">
        <div>
          <label className="block" htmlFor="genre">
            Genre
          </label>

          <select
            className="text-gray-800"
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

        <div>
          <label className="block" htmlFor="sort_by">
            Sort By
          </label>

          <select
            className="text-gray-800"
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

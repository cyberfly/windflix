"use client";

import { FC, useEffect, useState } from "react";
import { DMovie } from "@/types";
import Image from "next/image";
import MovieModal from "@/components/MovieModal";
export interface IMovieCard {
  movie: DMovie;
}

const MovieCard: FC<IMovieCard> = (props) => {
  const { movie } = props;

  const image_path = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "/placeholder_poster.jpeg";

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal(e: React.MouseEvent<HTMLButtonElement>) {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function afterOpenModal() {}

  function afterCloseModal() {}

  return (
    <>
      <button
        className="h-full shadow-md rounded-lg border border-transparent hover:border-green-500"
        onClick={(e) => openModal(e)}
        type="button"
      >
        <div className="h-full w-full dark:bg-slate-800 dark:text-slate-100 rounded-lg ">
          <div className="relative ">
            <img className="rounded-t-lg" src={image_path} alt="" />

            <div className="absolute top-0 right-0 bg-green-500 p-1 rounded-tr-lg">
              <span className="text-gray-800 font-medium">
                {movie.vote_average}
              </span>
            </div>
          </div>

          <div className="px-4 py-4 space-y-4">
            <h3>{movie.title}</h3>
          </div>
        </div>
      </button>

      <MovieModal
        movie={movie}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        afterOpenModal={afterOpenModal}
        afterCloseModal={afterCloseModal}
      ></MovieModal>
    </>
  );
};

export default MovieCard;

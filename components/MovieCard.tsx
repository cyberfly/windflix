"use client";
import { DMovie } from "@/types";
import { FC, useEffect, useState } from "react";
import MovieModal from "@/components/MovieModal";
export interface IMovieCard {
  movie: DMovie;
}

const MovieCard: FC<IMovieCard> = (props) => {
  const { movie } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function afterOpenModal() {}

  function afterCloseModal() {}

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-sm px-8 py-8 space-y-4">
        <h3>Movie Name: {movie.title}</h3>
        <p>Release Date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average}</p>
        <p>Overview:</p>
        <p>{movie.overview}</p>
        <p>Thumb:</p>
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt=""
        />

        <button onClick={(e) => openModal(e)} type="button">
          Show Modal
        </button>
      </div>

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

"use client";
import { FC, useEffect, useState } from "react";
import { DMovie } from "@/types";
import Modal from "react-modal";
import Image from "next/image";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "0px",
    transform: "translate(-50%, -50%)",
    background: "rgb(0, 0, 0, 1.0)",
    border: "1px solid #22c55e",
  },
};

Modal.setAppElement("body");

type closeModalFunction = () => void;
type afterOpenModalFunction = () => void;
type afterCloseModalFunction = () => void;

export interface IMovieModal {
  movie: DMovie;
  modalIsOpen: boolean;
  closeModal: closeModalFunction;
  afterOpenModal: afterOpenModalFunction;
  afterCloseModal: afterCloseModalFunction;
}

const MovieModal: FC<IMovieModal> = (props) => {
  const { movie, modalIsOpen, closeModal, afterOpenModal, afterCloseModal } =
    props;

  const formatted_release_date = new Date(
    movie.release_date
  ).toLocaleDateString("en-GB");

  const image_path = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`
    : "/placeholder.jpg";

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onAfterClose={afterCloseModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Movie Modal"
      >
        <div className="modal-body bg-gradient-to-t from-slate-900  to-slate-900 ">
          <div className="relative">
            <div className="relative h-56 md:h-96 lg:h-[28rem]">
              <Image
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
                className="rounded-t-lg"
                fill
                style={{ objectFit: "cover" }}
                src={image_path}
                alt="thumb"
              />

              {/* refer here for higher image size https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400 */}

              <div className="absolute w-full h-full bg-gradient-to-t from-slate-900"></div>
            </div>

            <button
              className="absolute top-[10px] right-[20px]"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="absolute bottom-0 px-8">
              <h3 className="text-2xl mb-8 text-white">{movie.title}</h3>
              <p className="mb-4">Release Date: {formatted_release_date}</p>
              <p>
                Rating:{" "}
                <span className="bg-green-500 text-slate-800 p-1 rounded">
                  {movie.vote_average}
                </span>
              </p>
            </div>
          </div>

          <div className="px-8 py-8 space-y-4">
            <h4 className="text-lg font-semibold">Overview:</h4>
            <p>{movie.overview}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MovieModal;

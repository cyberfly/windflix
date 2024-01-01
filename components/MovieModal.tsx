"use client";
import { FC, useEffect, useState } from "react";
import { DMovie } from "@/types";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
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

  function doSomething() {}

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onAfterClose={afterCloseModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
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

        <div className="modal-header text-gray-800">
          <h3 className="text-2xl mb-8">Modal Header {movie.title}</h3>
        </div>

        <div className="modal-body"></div>
        <div className="modal-footer">
          <div className="text-center">
            <button onClick={(e) => doSomething(e)} type="button">
              Ok
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MovieModal;

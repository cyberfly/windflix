import { DMovie } from "@/types";

export interface IMovieCard {
  movie: DMovie;
}

const MovieCard: React.FC<IMovieCard> = (props) => {
  const { movie } = props;

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-sm px-8 py-8 space-y-4">
        <h3>Movie Name: {movie.title}</h3>
        <p>Overview: {movie.overview}</p>
        <p>Thumb:</p>
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt=""
        />
      </div>
    </>
  );
};

export default MovieCard;

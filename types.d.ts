export interface DMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export interface DGenre {
  id: number;
  name: string;
}

export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

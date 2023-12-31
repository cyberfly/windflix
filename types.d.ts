export interface DMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

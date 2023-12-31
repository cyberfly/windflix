export interface DMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

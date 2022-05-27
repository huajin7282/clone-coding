const API_KEY = "5a8a70f59f8369c5bbb8b23cb93600f0";
const BASE_PATH = "https://api.themoviedb.org/3";

interface Movie {
  backdrop_path: string;
  id: number;
  poster_path: string;
  title: string;
  overview: string;
}

export interface GetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
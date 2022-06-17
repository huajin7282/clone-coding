const API_KEY = "5a8a70f59f8369c5bbb8b23cb93600f0";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface Content {
  backdrop_path: string;
  id: number;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
}

export interface GetContentResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Content[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  key: string;
  type: string;
}

export interface GetVideoResult {
  results: Video[];
}

export function getContents(category: string, type: string) {
  return fetch(`${BASE_PATH}/${category}/${type}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getVideos(category: string, id: string) {
  return fetch(`${BASE_PATH}/${category}/${id}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// src/api.js
const API_KEY = '89ce07cf-b75a-4390-8dc6-2de4504c8c05';
const BASE_URL = `https://www.omdbapi.com/`

export const fetchTrending = async () => {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
  return res.json();
};

export const fetchPopularMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  return res.json();
};

export const fetchTopRated = async () => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  return res.json();
};

export const fetchTVShows = async () => {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  return res.json();
};

export const fetchWebSeries = async () => {
  const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
  return res.json();
};

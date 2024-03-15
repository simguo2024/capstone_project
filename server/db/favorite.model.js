import { query } from "./db.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class Favorite {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }
}

async function getFavorites(userId) {
  const [results, fields] = await query(
    `SELECT movieId FROM favorites WHERE userId=${userId}`
  );
  if (results.length > 0) {
    return results;
  }
  return;
}

async function createFavorite(userId, movieId) {
  const [results, fields] = await query(
    `INSERT INTO favorites (userId, movieId) VALUES (${userId}, ${movieId})`
  );
  return;
}

async function removeFavorite(userId, movieId) {
  const [results, fields] = await query(
    `DELETE FROM favorites WHERE userId=${userId} and movieId=${movieId}`
  );
  return;
}

async function getFavoritesRankedByLikes() {
  const sqlQuery = `
        SELECT movieId, COUNT(*) AS likes
        FROM favorites
        GROUP BY movieId
        ORDER BY likes DESC
    `;

  try {
    const [moviesRankedByLikes] = await query(sqlQuery);

    const moviesWithDetails = await Promise.all(
      moviesRankedByLikes.map(async (movie) => {
        const movieDetails = await fetchMovieDetailsFromTMDB(movie.movieId);
        return {
          movieId: movie.movieId,
          likes: movie.likes,
          title: movieDetails.title,
        };
      })
    );

    return moviesWithDetails;
  } catch (error) {
    console.error("Failed to fetch favorites ranked by likes", error);
    throw error;
  }
}

async function fetchMovieDetailsFromTMDB(movieId) {
  const tmdbAPIKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbAPIKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch movie details from TMDB for movieId: ${movieId}`,
      error
    );
    throw error;
  }
}

export {
  getFavorites,
  createFavorite,
  removeFavorite,
  getFavoritesRankedByLikes,
  fetchMovieDetailsFromTMDB,
};

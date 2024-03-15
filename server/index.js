import express from "express";
import cors from "cors";
import path from "path";
import * as url from "url";
import { connection } from "./db/db.js";
import { createUser, getUser } from "./db/user.model.js";
import axios from "axios";
import {
  createFavorite,
  getFavorites,
  removeFavorite,
  getFavoritesRankedByLikes,
  fetchMovieDetailsFromTMDB,
} from "./db/favorite.model.js";
import dotenv from "dotenv";
dotenv.config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();
const tmdbAPIKey = process.env.TMDB_API_KEY;
let tmdbConfig = { headers: { accept: "application/json" } };

app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

app.post("/api/login", async (req, res) => {
  let resStatus = 401;
  if (req.body?.username && req.body?.password) {
    const user = await getUser(req.body.username);
    if (user && req.body.password == user.password) {
      resStatus = 200;
    }
  }
  res.status(resStatus).end();
});

app.post("/api/register", async (req, res) => {
  let resStatus = 409;
  if (req.body?.username && req.body?.password) {
    let user = await getUser(req.body.username);
    if (user) {
      res.status(resStatus).json({ message: "username exists" });
      return;
    }
    createUser(req.body.username, req.body.password);
    resStatus = 201;
  }
  res.status(resStatus).end();
});

app.post("/api/user/favorites", async (req, res) => {
  let resStatus = 409;
  if (req.body?.username) {
    let user = await getUser(req.body.username);
    if (user) {
      const data = await getFavorites(user.id);
      res.json(data);
    }
  }
  res.status(resStatus).end();
});

app.post("/api/user/favorite", async (req, res) => {
  let resStatus = 409;
  console.log(req.body);
  if (req.body?.username && req.body?.movieId) {
    let user = await getUser(req.body.username);
    if (user) {
      await createFavorite(user.id, req.body.movieId);
      resStatus = 201;
    }
  }
  res.status(resStatus).end();
});

app.post("/api/user/unfavorite", async (req, res) => {
  let resStatus = 409;
  if (req.body?.username && req.body?.movieId) {
    let user = await getUser(req.body.username);
    if (user) {
      await removeFavorite(user.id, req.body.movieId);
      resStatus = 201;
    }
  }
  res.status(resStatus).end();
});

app.get("/api/user/:username/favorites", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const userId = user.id;
    const favoriteMovieIds = await getFavorites(userId);
    if(favoriteMovieIds == null) {
      return;
    }
    const favoriteMoviesWithDetails = await Promise.all(
      favoriteMovieIds?.map(async (movie) =>
        fetchMovieDetailsFromTMDB(movie.movieId)
      )
    );

    res.json(favoriteMoviesWithDetails);
  } catch (error) {
    console.error(`Failed to fetch favorites for username: ${username}`, error);
    res.status(500).send("Server error");
  }
});

app.get("/api/popularmovies", async (req, res) => {
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${tmdbAPIKey}`;

  try {
    const response = await axios.get(url, tmdbConfig);
    const movies = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    }));
    res.json(movies);
  } catch (error) {
    console.error("/api/popularmovies error", error);
    res.status(500).json({ message: "Failed to fetch popular movies" });
  }
});

app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (query.trim()) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: tmdbAPIKey,
            query: query,
            include_adult: false,
          },
        }
      );
      const searchedMovies = response.data.results;
      res.json(searchedMovies);
    } catch (error) {
      console.error("Error fetching search results", error);
      res.status(500).send("Error fetching search results");
    }
  } else {
    res.status(400).send("Query parameter is required");
  }
});

app.get("/api/movies/favorites/ranked", async (req, res) => {
  try {
    const rankedFavorites = await getFavoritesRankedByLikes();
    res.json(rankedFavorites);
  } catch (error) {
    console.error("Failed to fetch global ranked favorites", error);
    res
      .status(500)
      .json({ message: "Failed to fetch global ranked favorites" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});

process.on("SIGINT", () => {
  connection.end();
  process.exit();
});

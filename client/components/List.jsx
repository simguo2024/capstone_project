import * as React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

function FavoriteButton({ movie, username, setRerender }) {
    const handleOnClick = () => {
    axios
      .post("/api/user/" + (movie.favorited ? "unfavorite" : "favorite"), {
        username,
        movieId: movie.id,
      })
      .then(() => {
        setRerender({}); 
      })
      .catch(error => {
        console.error(`Failed to ${movie.favorited ? 'unfavorite' : 'favorite'} movieId: ${movie.id}`, error);
      });
  };

  return (
    <>
      {movie.favorited ? (
        <Favorite onClick={handleOnClick} />
      ) : (
        <FavoriteBorder onClick={handleOnClick} />
      )}
    </>
  );
}

export default function List() {
  const [data, setData] = React.useState([]);
  const [rerender, setRerender] = React.useState({}); 
  const [displayedData, setDisplayedData] = React.useState([]); 
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.get('/api/search', { params: { query: searchQuery } });
        const { data: userFavorites } = await axios.post(
          "/api/user/favorites",
          { username }
        );
        const searchedMovies = response.data;
          const movieIds = new Set(userFavorites.map((movie) => movie.movieId));
          const updatedMoviesData = searchedMovies?.map((movie) => ({
            ...movie,
            favorited: movieIds.has(movie.id),
          }));

        setData(updatedMoviesData);
        setDisplayedData(updatedMoviesData); 
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    }
  };
  const { username } = useOutletContext();

  if (!username) return <Navigate to="/Login" />;

  React.useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const { data: moviesData } = await axios.get("/api/popularmovies");
        const { data: userFavorites } = await axios.post(
          "/api/user/favorites",
          { username }
        );

        const movieIds = new Set(userFavorites?.length ? userFavorites.map((movie) => movie.movieId) : []);
        const updatedMoviesData = moviesData.map((movie) => ({
          ...movie,
          favorited: movieIds.has(movie.id),
        }));
        
        if (!searchQuery.trim()) {
          setData(updatedMoviesData)
          setDisplayedData(updatedMoviesData)
        }
        handleSearch();
      } catch (error) {
        console.error("Fetching movies or favorites failed", error);
      }
    };

    getPopularMovies();
  }, [rerender, username]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ height: "50vh", padding: 2 }}>
      <TextField
        fullWidth
        width= '100%'
        margin="normal"
        variant="outlined"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(); 
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}></IconButton>
            </InputAdornment>
          ),
        }}
      />
      <ImageList variant="masonry" cols={isSmallScreen ? 2 : 4} gap={8}>
        {displayedData?.map((movie) => (
          <ImageListItem key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <ImageListItemBar
              title={movie.title}
              subtitle={<span>{movie.overview}</span>}
              actionIcon={
                <IconButton
                  aria-label={`info about ${movie.title}`}
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                >
                  <FavoriteButton
                    movie={movie}
                    username={username}
                    setRerender={setRerender}
                  />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

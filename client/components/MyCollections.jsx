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
  Typography,
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
      {movie?.favorited ? (
        <Favorite onClick={handleOnClick} />
      ) : (
        <FavoriteBorder onClick={handleOnClick} />
      )}
    </>
  );
}

export default function MyCollections() {
  const [rerender, setRerender] = React.useState({});
  const [displayedData, setDisplayedData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true); 

  const { username } = useOutletContext();

  if (!username) return <Navigate to="/Login" />;

  React.useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true); 
      try {
        const { data: userFavorites } = await axios.get(
          `/api/user/${username}/favorites`
        );
        const updatedMoviesData = userFavorites?.map((movie) => ({
          ...movie,
          favorited: true,
        }));
        setDisplayedData(updatedMoviesData || []); 
      } catch (error) {
        console.error("Fetching favorites failed", error);
      }finally {
        setIsLoading(false); 
      }
    };

    if (username) {
      fetchFavorites();
    }
  }, [username, rerender]); 

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
    return (
      <Box sx={{ height: "50vh", padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading your favorites...</Typography>
      </Box>
    );
  } else if (displayedData.length === 0) {
    return (
      <Box sx={{ height: "50vh", padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">
          You don't have any favorites yet. Start adding some!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "50vh", padding: 2 }}>
      <ImageList variant="masonry" cols={isSmallScreen ? 2 : 3} gap={8}>
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

import * as React from "react";
import axios from "axios";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

export default function FavoriteButton({ movie, username, setRerender }) {
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
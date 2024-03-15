import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    const fetchRankedFavorites = async () => {
      try {
        const response = await axios.get(
          "/api/movies/favorites/ranked"
        );
        setFavoriteMovies(response.data);
      } catch (error) {
        console.error("Failed to fetch ranked favorites", error);
      }
    };

    fetchRankedFavorites();
  }, []);

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        borderRadius: "15px",
        overflow: "hidden",
        marginTop: 2,
        padding: "0 16px", 
      }}
    >
      <Table aria-label="favorite movies table">
        <TableHead sx={{ backgroundColor: "#1976D2" }}>
          <TableRow>
            <TableCell>
              <Typography
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Rank
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Title
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Likes
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {favoriteMovies?.map((movie, index) => (
            <TableRow
              key={movie.movieId || index}
              sx={{
                "&:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
                "&:hover": {
                  backgroundColor: "#ADD8E6",
                },
                cursor: "pointer",
                variant:"h6"
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.likes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

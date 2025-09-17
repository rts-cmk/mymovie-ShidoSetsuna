require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/api/db/now_playing", async (req, res) => {
  const page = req.query.page || 1;
  const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/db/popular", async (req, res) => {
  const page = req.query.page || 1;
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/db/genres", async (req, res) => {
  const page = req.query.page || 1;
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/db/movie/details/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  if (!movieId) {
    return res.status(400).json({ error: "Missing movieId" });
  }
  const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,images,credits,release_dates&language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

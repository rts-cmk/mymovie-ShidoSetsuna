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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

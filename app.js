const express = require('express');

const app = express();
app.use(express.json());

let movies = [];
let nextId = 1;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.get('/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.status(200).json(movie);
});

app.post('/movies', (req, res) => {
  const { title, director, year } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newMovie = {
    id: nextId++,
    title,
    director: director || 'Unknown',
    year: year || null
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  const { title, director, year } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  movie.title = title;
  if (director !== undefined) movie.director = director;
  if (year !== undefined) movie.year = year;
  res.status(200).json(movie);
});

app.delete('/movies/:id', (req, res) => {
  const index = movies.findIndex((m) => m.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  movies.splice(index, 1);
  res.status(204).send();
});

app.resetMovies = () => {
  movies = [];
  nextId = 1;
};

module.exports = app;

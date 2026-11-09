const express = require('express');
const app = express();

app.use(express.json());
const unusedVariable = 'esto causara un error de linting';
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '2.0.0' });
});

app.get('/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

module.exports = app;
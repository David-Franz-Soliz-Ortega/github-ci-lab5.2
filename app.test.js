const request = require('supertest');
const app = require('./app');

describe('CRUD /movies', () => {
  beforeEach(() => {
    app.resetMovies();
  });

  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /movies creates a movie', async () => {
    const res = await request(app)
      .post('/movies')
      .send({ title: 'Inception', director: 'Christopher Nolan', year: 2010 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      title: 'Inception',
      director: 'Christopher Nolan',
      year: 2010
    });
  });

  test('POST /movies creates a movie with default values and returns 400 without title', async () => {
    const defaultRes = await request(app).post('/movies').send({ title: 'Matrix' });
    expect(defaultRes.statusCode).toBe(201);
    expect(defaultRes.body).toEqual({
      id: 1,
      title: 'Matrix',
      director: 'Unknown',
      year: null
    });

    const badRes = await request(app).post('/movies').send({});
    expect(badRes.statusCode).toBe(400);
  });

  test('GET /movies returns all movies', async () => {
    await request(app).post('/movies').send({ title: 'Inception' });
    const res = await request(app).get('/movies');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('GET /movies/:id returns a movie or 404', async () => {
    await request(app).post('/movies').send({ title: 'Inception' });

    const found = await request(app).get('/movies/1');
    expect(found.statusCode).toBe(200);
    expect(found.body.title).toBe('Inception');

    const notFound = await request(app).get('/movies/99');
    expect(notFound.statusCode).toBe(404);
  });

  test('PUT /movies/:id updates a movie or returns 400/404', async () => {
    await request(app).post('/movies').send({ title: 'Inception' });

    const updated = await request(app)
      .put('/movies/1')
      .send({ title: 'Interstellar', director: 'Christopher Nolan', year: 2014 });
    expect(updated.statusCode).toBe(200);
    expect(updated.body.title).toBe('Interstellar');
    expect(updated.body.director).toBe('Christopher Nolan');
    expect(updated.body.year).toBe(2014);

    const partialUpdate = await request(app)
      .put('/movies/1')
      .send({ title: 'Tenet' });
    expect(partialUpdate.statusCode).toBe(200);
    expect(partialUpdate.body.title).toBe('Tenet');

    const badReq = await request(app).put('/movies/1').send({});
    expect(badReq.statusCode).toBe(400);

    const notFound = await request(app).put('/movies/99').send({ title: 'Interstellar' });
    expect(notFound.statusCode).toBe(404);
  });

  test('DELETE /movies/:id deletes a movie or returns 404', async () => {
    await request(app).post('/movies').send({ title: 'Inception' });

    const deleted = await request(app).delete('/movies/1');
    expect(deleted.statusCode).toBe(204);

    const notFound = await request(app).delete('/movies/1');
    expect(notFound.statusCode).toBe(404);
  });
});

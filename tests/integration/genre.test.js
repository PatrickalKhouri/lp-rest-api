const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Genre } = require('../../src/models');
const { genreOne, genreTwo, insertGenres } = require('../fixtures/genre.fixture');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Genre routes', () => {
  describe('POST /v1/genres', () => {
    let newGenre;

    beforeEach(() => {
      newGenre = {
        name: 'reggae',
      };
    });

    test('should return 201 and successfully create new genre if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newGenre)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newGenre.name,
      });

      const dbGenre = await Genre.findById(res.body.id);
      expect(dbGenre).toBeDefined();
      expect(dbGenre).toMatchObject({ name: newGenre.name });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/genres').send(newGenre).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user creating genre isnt an admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/genres')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newGenre)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error if genre isnt valid', async () => {
      await insertUsers([admin]);
      newGenre.name = 'invalid genre';

      await request(app)
        .post('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newGenre)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if genre is already exists', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      newGenre.name = genreOne.name;

      await request(app)
        .post('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newGenre)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/genres', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne, genreTwo]);

      const res = await request(app)
        .get('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: genreOne._id.toHexString(),
        name: genreOne.name,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertGenres([genreOne, genreTwo]);

      await request(app).get('/v1/genres').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all genres', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/genres')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      const res = await request(app)
        .get('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: genreOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(genreOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne, genreTwo]);

      const res = await request(app)
        .get('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'name:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(genreOne._id.toHexString());
      expect(res.body.results[1].id).toBe(genreTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne, genreTwo]);

      const res = await request(app)
        .get('/v1/genres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 1,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(genreOne._id.toHexString());
    });
  });

  describe('GET /v1/genres/:genreId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      const res = await request(app)
        .get(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: genreOne._id.toHexString(),
        name: genreOne.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([genreOne]);

      await request(app).get(`/v1/genres/${genreOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non admin is trying to get a genre', async () => {
      await insertUsers([userOne]);
      await insertGenres([genreOne]);

      await request(app)
        .get(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if genreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      await request(app)
        .get('/v1/genres/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if genre is not found', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      await request(app)
        .get(`/v1/genres/${genreTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/genres/:genreId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      await request(app)
        .delete(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbGenre = await Genre.findById(genreOne._id);
      expect(dbGenre).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertGenres([genreOne]);

      await request(app).delete(`/v1/genres/${genreOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user non admin is trying to delete genre', async () => {
      await insertUsers([userOne]);
      await insertGenres([genreOne]);

      await request(app)
        .delete(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if genreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      await request(app)
        .delete('/v1/genres/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if genre already is not found', async () => {
      await insertUsers([admin]);
      await insertGenres([genreTwo]);

      await request(app)
        .delete(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/genres/:genreId', () => {
    test('should return 200 and successfully update genre if data is ok', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);

      const updateBody = {
        name: 'mpb',
      };

      const res = await request(app)
        .patch(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: genreOne._id.toHexString(),
        name: updateBody.name,
      });

      const dbGenre = await Genre.findById(genreOne._id);
      expect(dbGenre).toBeDefined();
      expect(dbGenre).toMatchObject({ name: updateBody.name });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertGenres([genreOne]);
      const updateBody = { name: 'mpb' };

      await request(app).patch(`/v1/genres/${genreOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non admin user is updating a genre', async () => {
      await insertUsers([userOne]);
      await insertGenres([genreOne]);
      const updateBody = { name: 'mpb' };

      await request(app)
        .patch(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another genre that is not found', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);
      const updateBody = { name: 'mpb' };

      await request(app)
        .patch(`/v1/genres/${genreTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if genreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);
      const updateBody = { name: 'mpb' };

      await request(app)
        .patch(`/v1/genres/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if name is invalid', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne]);
      const updateBody = { name: 'invalid name' };

      await request(app)
        .patch(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if genre is exists', async () => {
      await insertUsers([admin]);
      await insertGenres([genreOne, genreTwo]);
      const updateBody = { name: genreTwo.name };

      await request(app)
        .patch(`/v1/genres/${genreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

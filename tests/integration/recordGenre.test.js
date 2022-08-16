const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { RecordGenre } = require('../../src/models');
const { recordGenreOne, recordGenreTwo, insertRecordGenres } = require('../fixtures/recordGenre.fixture');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { genreOne, genreTwo, insertGenres } = require('../fixtures/genre.fixture');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Record Genre routes', () => {
  describe('POST /v1/recordGenre', () => {
    let newRecordGenre;

    beforeEach(() => {
      newRecordGenre = {
        recordId: mongoose.Types.ObjectId(),
        genreId: mongoose.Types.ObjectId(),
      };
    });

    test('should return 201 and successfully create new record genre if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/recordGenre')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecordGenre)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        recordId: newRecordGenre.recordId,
        genreId: newRecordGenre.genreId,
      });

      const dbRecordGenre = await RecordGenre.findById(res.body.id);
      expect(dbRecordGenre).toBeDefined();
      expect(dbRecordGenre).toMatchObject({ recordId: newRecordGenre.recordId, genreId: newRecordGenre.genreId });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/recordGenre').send(newRecordGenre).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user creating isnt an admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/recordGenre')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newRecordGenre)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/recordGenre', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertGenres([genreOne, genreTwo]);
      await insertRecordGenres([recordGenreOne, recordGenreTwo]);

      const res = await request(app)
        .get('/v1/recordGenre')
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
        id: recordGenreOne._id.toHexString(),
        recordId: recordGenreOne.recordId,
        genreId: recordGenreOne.genreId,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);

      await request(app).get('/v1/recordGenre').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all recordGenres', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/recordGenre')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      const res = await request(app)
        .get('/v1/recordGenre')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ recordId: recordGenreOne.recordId })
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
      expect(res.body.results[0].id).toBe(recordGenreOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertGenres([genreOne, genreTwo]);
      await insertRecordGenres([recordGenreOne, recordGenreTwo]);

      const res = await request(app)
        .get('/v1/recordGenre')
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
      expect(res.body.results[0].id).toBe(recordGenreOne._id.toHexString());
    });
  });

  describe('GET /v1/recordGenre/:recordGenreId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      const res = await request(app)
        .get(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: artistOne._id.toHexString(),
        recordId: recordGenreOne.recordId,
        genreId: recordGenreOne.genreId,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);

      await request(app).get(`/v1/recordGenre/${recordGenreOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non admin is trying to get a record genre', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .get(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if recordGenreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .get('/v1/recordGenre/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if record genre is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .get(`/v1/recordGenre/${recordGenreTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/recordGenre/:recordGenreId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .delete(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbRecordGenre = await RecordGenre.findById(recordGenreOne._id);
      expect(dbRecordGenre).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);

      await request(app).delete(`/v1/recordGenre/${recordGenreOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user non admin is trying to delete band member', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .delete(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if recordGenreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .delete('/v1/recordGenre/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if recordGenres is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertGenres([genreTwo]);
      await insertRecordGenres([recordGenreTwo]);

      await request(app)
        .delete(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/recordGenre/:recordGenreId', () => {
    test('should return 200 and successfully update label if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = {
        recordId: mongoose.Types.ObjectId(),
      };

      const res = await request(app)
        .patch(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: recordGenreOne._id.toHexString(),
        recordId: updateBody.recordId,
        genreId: recordGenreOne.genreId,
      });

      const dbRecordGenre = await RecordGenre.findById(artistOne._id);
      expect(dbRecordGenre).toBeDefined();
      expect(dbRecordGenre).toMatchObject({ recordId: updateBody.recordId, genreId: recordGenreOne.genreId });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);
      const updateBody = { recordId: mongoose.Types.ObjectId() };

      await request(app).patch(`/v1/recordGenre/${recordGenreOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non admin user is updating a band member', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = { recordId: mongoose.Types.ObjectId() };

      await request(app)
        .patch(`/v1/recordGenre/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another band membert that is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = { recordId: mongoose.Types.ObjectId() };

      await request(app)
        .patch(`/v1/recordGenre/${recordGenreTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if arstistId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = { recordId: mongoose.Types.ObjectId() };

      await request(app)
        .patch(`/v1/recordGenre/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

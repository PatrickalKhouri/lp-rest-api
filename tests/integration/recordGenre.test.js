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
const { recordOne, recordTwo, insertRecords } = require('../fixtures/record.fixture');

setupTestDB();

describe('Record Genre routes', () => {
  describe('POST /v1/recordGenres', () => {
    let newRecordGenre;

    beforeEach(() => {
      newRecordGenre = {
        recordId: String(recordOne._id),
        genreId: String(genreOne._id),
      };
    });

    test('should return 201 and successfully create new record genre if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertGenres([genreOne]);

      const res = await request(app)
        .post('/v1/recordGenres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecordGenre)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        recordId: newRecordGenre.recordId,
        genreId: newRecordGenre.genreId,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/recordGenres').send(newRecordGenre).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user creating record genre isnt an admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/recordGenres')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newRecordGenre)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 500 if record genre already exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertGenres([genreOne]);
      await insertRecordGenres([recordGenreOne]);
      newRecordGenre = recordGenreOne;

      await request(app)
        .post('/v1/recordGenres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecordGenre)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/recordGenres', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertGenres([genreOne, genreTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertRecordGenres([recordGenreOne, recordGenreTwo]);

      const res = await request(app)
        .get('/v1/recordGenres')
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
      // expect(res.body.results[0]).toEqual({
      //   id: recordGenreOne._id.toHexString(),
      //   recordId: recordGenreOne.recordId,
      //   genreId: recordGenreOne.genreId,
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);

      await request(app).get('/v1/recordGenres').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all recordGenres', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/recordGenres')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on recordID field', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      const res = await request(app)
        .get('/v1/recordGenres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ recordId: String(recordGenreOne.recordId) })
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
      // expect(res.body.results[0].id).toBe(recordGenreOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertGenres([genreOne, genreTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertRecordGenres([recordGenreOne, recordGenreTwo]);

      const res = await request(app)
        .get('/v1/recordGenres')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(recordGenreOne._id.toHexString());
    });
  });

  describe('GET /v1/recordGenres/:recordGenreId', () => {
    test('should return 200 and the record genre object if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      const res = await request(app)
        .get(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: recordGenreOne._id.toHexString(),
        recordId: String(recordGenreOne.recordId),
        genreId: String(recordGenreOne.genreId),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);

      await request(app).get(`/v1/recordGenres/${recordGenreOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non admin is trying to get a record genre', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .get(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if recordGenreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .get('/v1/recordGenres/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if record genre is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .get(`/v1/recordGenres/${recordGenreTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/recordGenres/:recordGenreId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .delete(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbRecordGenre = await RecordGenre.findById(recordGenreOne._id);
      expect(dbRecordGenre).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);

      await request(app).delete(`/v1/recordGenres/${recordGenreOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user non admin is trying to delete record genre', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .delete(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if recordGenreId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreOne]);

      await request(app)
        .delete('/v1/recordGenres/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if recordGenres is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertGenres([genreTwo]);
      await insertRecords([recordOne]);
      await insertRecordGenres([recordGenreTwo]);

      await request(app)
        .delete(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/recordGenres/:recordGenreId', () => {
    test('should return 200 and successfully update record genre if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne, artistTwo]);
      await insertGenres([genreOne, genreTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = {
        recordId: recordTwo._id,
      };

      const res = await request(app)
        .patch(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: recordGenreOne._id.toHexString(),
        recordId: String(updateBody.recordId),
        genreId: String(recordGenreOne.genreId),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecordGenres([recordGenreOne]);
      const updateBody = { recordId: mongoose.Types.ObjectId() };

      await request(app).patch(`/v1/recordGenres/${recordGenreOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non admin user is updating a record genre', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne, recordTwo]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = { recordId: recordTwo._id };

      await request(app)
        .patch(`/v1/recordGenres/${recordGenreOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another record genre that is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne, recordTwo]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = { recordId: recordTwo._id };

      await request(app)
        .patch(`/v1/recordGenres/${recordGenreTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if recordgenre is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertGenres([genreOne]);
      await insertRecords([recordOne, recordTwo]);
      await insertRecordGenres([recordGenreOne]);

      const updateBody = { recordId: recordTwo._id };

      await request(app)
        .patch(`/v1/recordGenres/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

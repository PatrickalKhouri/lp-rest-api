const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Record } = require('../../src/models');
const { insertRecords, recordOne, recordTwo } = require('../fixtures/record.fixture');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Record routes', () => {
  describe('POST /v1/records', () => {
    let newRecord;

    beforeEach(() => {
      newRecord = {
        artistId: artistOne._id,
        labelId: labelOne._id,
        recordType: 'LP',
        name: 'Greates Hits',
        releaseYear: faker.finance.amount(1800, 2023, 0),
        country: faker.address.country(),
        duration: '11:10',
        language: 'English',
        numberOfTracks: faker.finance.amount(1, 30, 0),
      };
    });

    test('should return 201 and successfully create new record if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      const res = await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        artistId: newRecord.artistId,
        labelId: newRecord.labelId,
        name: newRecord.name,
        releaseYear: newRecord.releaseYear,
        country: newRecord.country,
        duration: newRecord.duration,
        language: newRecord.language,
        numberOfTracks: newRecord.numberOfTracks,
      });

      // const dbRecord = await Record.findById(res.body.id);
      // expect(dbRecord).toBeDefined();
      // expect(dbRecord).toMatchObject({
      //   artistId: newRecord.artistId,
      //   labelId: newRecord.labelId,
      //   name: newRecord.name,
      //   releaseYear: newRecord.releaseYear,
      //   country: newRecord.country,
      //   duration: newRecord.duration,
      //   language: newRecord.language,
      //   numberOfTracks: newRecord.numberOfTracks,
      // });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/records').send(newRecord).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error number of tracks are less than 0', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      newRecord.numberOfTracks = -2;

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 400 if duration is in the wrong format', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      newRecord.duration = 'wrong format';

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if release year is in the future', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      newRecord.releaseYear = 2024;

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 500 if record already exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      newRecord = recordOne;

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 404 if artistId doesnt exists', async () => {
      await insertUsers([admin]);
      await insertArtists([artistOne]);

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 if labelId doesnt exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      await request(app)
        .post('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newRecord)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/records', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);

      const res = await request(app)
        .get('/v1/records')
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
        id: recordOne._id.toHexString(),
        artistId: recordOne.artistId,
        labelId: recordOne.labelId,
        name: recordOne.name,
        recordType: recordOne.recordType,
        releaseYear: recordOne.releaseYear,
        country: recordOne.country,
        duration: recordOne.duration,
        language: recordOne.language,
        numberOfTracks: recordOne.numberOfTracks,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertRecords([recordOne, recordTwo]);

      await request(app).get('/v1/records').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all records', async () => {
      await insertUsers([userOne]);
      await insertRecords([recordOne, recordTwo]);

      await request(app)
        .get('/v1/records')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);

      const res = await request(app)
        .get('/v1/records')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: recordOne.name })
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
      expect(res.body.results[0].id).toBe(recordOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);

      const res = await request(app)
        .get('/v1/records')
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
      expect(res.body.results[0].id).toBe(recordOne._id.toHexString());
    });
  });

  describe('GET /v1/records/:recordId', () => {
    test('should return 200 and the record object if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      const res = await request(app)
        .get(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: recordOne._id.toHexString(),
        artistId: recordOne.artistId,
        labelId: recordOne.labelId,
        name: recordOne.name,
        releaseYear: recordOne.releaseYear,
        country: recordOne.country,
        recordType: recordOne.recordType,
        duration: recordOne.duration,
        language: recordOne.language,
        numberOfTracks: recordOne.numberOfTracks,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecords([recordOne]);

      await request(app).get(`/v1/records/${recordOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if recordId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .get('/v1/records/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if record is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .get(`/v1/records/${recordTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/records/:recordId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .delete(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbRecord = await Record.findById(recordOne._id);
      expect(dbRecord).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecords([recordOne]);

      await request(app).delete(`/v1/records/${recordOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete record without being Admin', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .delete(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if recordId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .delete('/v1/records/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if record is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .delete(`/v1/records/${recordTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/records/:recordId', () => {
    test('should return 200 and successfully update record if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = {
        name: faker.music.songName(),
        releaseYear: faker.finance.amount(1800, 2023, 0),
      };

      const res = await request(app)
        .patch(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: recordOne._id.toHexString(),
        name: updateBody.name,
        releaseYear: updateBody.releaseYear,
        country: recordOne.country,
        recordType: recordOne.recordType,
        duration: recordOne.duration,
        language: recordOne.language,
        numberOfTracks: recordOne.numberOfTracks,
      });

      const dbRecord = await Record.findById(recordOne._id);
      expect(dbRecord).toBeDefined();
      expect(dbRecord).toMatchObject({
        id: recordOne._id.toHexString(),
        name: updateBody.name,
        releaseYear: updateBody.releaseYear,
        country: recordOne.country,
        recordType: recordOne.recordType,
        duration: recordOne.duration,
        language: recordOne.language,
        numberOfTracks: recordOne.numberOfTracks,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertRecords([recordOne]);
      const updateBody = { name: faker.music.songName() };

      await request(app).patch(`/v1/records/${recordOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if trying to update without being and admin', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = { name: faker.music.songName() };

      await request(app)
        .patch(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another record that is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = { name: faker.music.songName() };

      await request(app)
        .patch(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if recordId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = { name: faker.music.songName() };

      await request(app)
        .patch(`/v1/records/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if number of tracks is below zero', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = { numberOfTracks: -2 };

      await request(app)
        .patch(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if year is in the future', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = { releaseYear: 3000 };

      await request(app)
        .patch(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if duration is in the wrong format', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      const updateBody = { duration: 'wrong format' };

      await request(app)
        .patch(`/v1/records/${recordOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

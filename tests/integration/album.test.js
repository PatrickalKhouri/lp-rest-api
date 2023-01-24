const request = require('supertest');
const faker = require('faker');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Album } = require('../../src/models');
const { albumOne, albumTwo, insertAlbums } = require('../fixtures/album.fixture');
const { insertRecords, recordOne, recordTwo } = require('../fixtures/record.fixture');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Album routes', () => {
  describe('POST /v1/albums', () => {
    let newAlbum;

    beforeEach(() => {
      newAlbum = {
        recordId: String(recordOne._id),
        userId: String(userOne._id),
        description: faker.lorem.lines(),
        stock: Number(faker.finance.amount(0, 50, 2)),
        year: Number(faker.finance.amount(1800, 2022, 0)),
        new: faker.datatype.boolean(),
        price: Number(faker.finance.amount(1, 1000, 2)),
        format: 'CD',
      };
    });

    test('should return 201 and successfully create new album if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      const res = await request(app)
        .post('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newAlbum)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        recordId: newAlbum.recordId,
        userId: newAlbum.userId,
        description: newAlbum.description,
        stock: newAlbum.stock,
        year: newAlbum.year,
        new: newAlbum.new,
        price: newAlbum.price,
        format: newAlbum.format,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/albums').send(newAlbum).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not creating for his user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);

      await request(app)
        .post('/v1/albums')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(newAlbum)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 year is in the future', async () => {
      await insertUsers([admin]);
      newAlbum.year = 3000;

      await request(app)
        .post('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newAlbum)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Price is below zero', async () => {
      await insertUsers([admin]);
      newAlbum.price = -10;

      await request(app)
        .post('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newAlbum)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 Stock is below zero', async () => {
      await insertUsers([admin]);
      newAlbum.stock = -10;

      await request(app)
        .post('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newAlbum)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 500 if trying to create and album that the user already has', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      newAlbum = albumOne;

      await request(app)
        .post('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newAlbum)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/albums', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);

      const res = await request(app)
        .get('/v1/albums')
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
        id: albumOne._id.toHexString(),
        recordId: albumOne.recordId,
        userId: albumOne.userId,
        description: albumOne.description,
        stock: albumOne.stock,
        year: albumOne.year,
        new: albumOne.new,
        price: albumOne.price,
        format: albumOne.format,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertAlbums([albumOne, albumTwo]);

      await request(app).get('/v1/albums').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on description field', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);

      const res = await request(app)
        .get('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ description: albumOne.description })
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
      expect(res.body.results[0].id).toBe(albumOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      albumOne.year = 1999;
      albumTwo.year = 2000;
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);

      const res = await request(app)
        .get('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'year:desc' })
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
      expect(res.body.results[0].id).toBe(albumTwo._id.toHexString());
      expect(res.body.results[1].id).toBe(albumOne._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      albumOne.year = 1999;
      albumTwo.year = 2000;
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);

      const res = await request(app)
        .get('/v1/albums')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'year:asc' })
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
      expect(res.body.results[0].id).toBe(albumOne._id.toHexString());
      expect(res.body.results[1].id).toBe(albumTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);

      const res = await request(app)
        .get('/v1/albums')
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
      expect(res.body.results[0].id).toBe(albumOne._id.toHexString());
    });
  });

  describe('GET /v1/albums/:albumId', () => {
    test('should return 200 and the album object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);

      const res = await request(app)
        .get(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: albumOne._id.toHexString(),
        recordId: albumOne.recordId,
        userId: albumOne.userId,
        description: albumOne.description,
        stock: albumOne.stock,
        year: albumOne.year,
        new: albumOne.new,
        price: albumOne.price,
        format: albumOne.format,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertAlbums([albumOne]);

      await request(app).get(`/v1/albums/${albumOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the album object if admin is trying to get another users album', async () => {
      await insertUsers([userTwo, admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);

      await request(app)
        .get(`/v1/albums/${albumTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if albumId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);

      await request(app)
        .get('/v1/albums/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if album is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);

      await request(app)
        .get(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/albums/:albumId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);

      await request(app)
        .delete(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbAlbum = await Album.findById(albumOne._id);
      expect(dbAlbum).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertAlbums([albumOne]);

      await request(app).delete(`/v1/albums/${albumOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another users album', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);

      await request(app)
        .delete(`/v1/albums/${albumTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 204 if admin is trying to delete another users album', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);

      await request(app)
        .delete(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if albumId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);

      await request(app)
        .delete('/v1/albums/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if album already is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);

      await request(app)
        .delete(`/v1/albums/${userTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/albums/:albumId', () => {
    test('should return 200 and successfully update album if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      const updateBody = {
        description: faker.lorem.lines(),
        stock: Number(faker.finance.amount(0, 50, 2)),
        year: Number(faker.finance.amount(1800, 2022, 0)),
      };

      const res = await request(app)
        .patch(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: albumOne._id.toHexString(),
        recordId: albumOne.recordId,
        userId: albumOne.userId,
        description: updateBody.description,
        stock: updateBody.stock,
        year: updateBody.year,
        new: albumOne.new,
        price: albumOne.price,
        format: albumOne.format,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertAlbums([albumOne]);
      const updateBody = { description: faker.lorem.lines() };

      await request(app).patch(`/v1/albums/${albumOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another users album', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      const updateBody = { description: faker.lorem.lines() };

      await request(app)
        .patch(`/v1/albums/${albumTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and successfully update album if admin is updating another users album', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      const updateBody = { description: faker.lorem.lines() };

      await request(app)
        .patch(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 400 error if albumId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      const updateBody = { description: faker.lorem.lines() };

      await request(app)
        .patch(`/v1/albums/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if year is in the future', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      const updateBody = { year: 3000 };

      await request(app)
        .patch(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 400 if price is negative', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      const updateBody = { price: -200 };

      await request(app)
        .patch(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 400 if stock is negative', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      const updateBody = { stock: -200 };

      await request(app)
        .patch(`/v1/albums/${albumOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

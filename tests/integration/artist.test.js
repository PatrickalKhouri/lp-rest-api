const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Artist } = require('../../src/models');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Artist routes', () => {
  describe('POST /v1/artists', () => {
    let newArtist;

    beforeEach(() => {
      newArtist = {
        labelId: labelOne._id,
        name: faker.name.firstName(),
        country: faker.address.country(),
      };
    });

    test('should return 201 and successfully create new artist if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      const res = await request(app)
        .post('/v1/artists')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newArtist)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        labelId: String(newArtist.labelId),
        name: newArtist.name,
        country: newArtist.country,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/artists').send(newArtist).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user creating artist isnt an admin', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);

      await request(app)
        .post('/v1/artists')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newArtist)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if country isnt valid', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      newArtist.country = 'invalid country';

      await request(app)
        .post('/v1/artists')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newArtist)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if creating for non existing label', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      newArtist.labelId = labelTwo._id;

      await request(app)
        .post('/v1/artists')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newArtist)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 500 error if artist already exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      newArtist = artistOne;

      await request(app)
        .post('/v1/artists')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newArtist)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/artists', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);

      const res = await request(app)
        .get('/v1/artists')
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
        id: artistOne._id.toHexString(),
        labelId: String(artistOne.labelId),
        name: artistOne.name,
        country: artistOne.country,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertArtists([artistOne]);

      await request(app).get('/v1/artists').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all artists', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/artists')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      const res = await request(app)
        .get('/v1/artists')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: artistOne.name })
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
      expect(res.body.results[0].id).toBe(artistOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      artistOne.name = 'A';
      artistTwo.name = 'B';
      await insertArtists([artistOne, artistTwo]);

      const res = await request(app)
        .get('/v1/artists')
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
      expect(res.body.results[0].id).toBe(artistTwo._id.toHexString());
      expect(res.body.results[1].id).toBe(artistOne._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      artistOne.name = 'A';
      artistTwo.name = 'B';
      await insertArtists([artistOne, artistTwo]);

      const res = await request(app)
        .get('/v1/artists')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'name:asc' })
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
      expect(res.body.results[0].id).toBe(artistOne._id.toHexString());
      expect(res.body.results[1].id).toBe(artistTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);

      const res = await request(app)
        .get('/v1/artists')
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
      expect(res.body.results[0].id).toBe(artistOne._id.toHexString());
    });
  });

  describe('GET /v1/artists/:artistId', () => {
    test('should return 200 and the artist object if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      const res = await request(app)
        .get(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: artistOne._id.toHexString(),
        labelId: String(artistOne.labelId),
        name: artistOne.name,
        country: artistOne.country,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertArtists([artistOne]);

      await request(app).get(`/v1/artists/${artistOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non admin is trying to get an artist', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      await request(app)
        .get(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if artistId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      await request(app)
        .get('/v1/artists/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if artist is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      await request(app)
        .get(`/v1/artists/${artistTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/artists/:artistId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      await request(app)
        .delete(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbArtist = await Artist.findById(artistOne._id);
      expect(dbArtist).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertArtists([artistOne]);

      await request(app).delete(`/v1/artists/${artistOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user non admin is trying to delete artist', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      await request(app)
        .delete(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if artistId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      await request(app)
        .delete('/v1/artists/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if artists is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);

      await request(app)
        .delete(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/artists/:artistId', () => {
    test('should return 200 and successfully update artist if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);

      const updateBody = {
        name: faker.name.firstName(),
      };

      const res = await request(app)
        .patch(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: artistOne._id.toHexString(),
        labelId: String(artistOne.labelId),
        name: updateBody.name,
        country: artistOne.country,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertArtists([artistOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app).patch(`/v1/artists/${artistOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non admin user is updating a artist', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app)
        .patch(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another artist that is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app)
        .patch(`/v1/artists/${artistTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 if admin is updating artist label and is non existent', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      const updateBody = { labelId: labelTwo._id };

      await request(app)
        .patch(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if arstistId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app)
        .patch(`/v1/artists/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if country is invalid', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      const updateBody = { country: 'invalid country' };

      await request(app)
        .patch(`/v1/artists/${artistOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

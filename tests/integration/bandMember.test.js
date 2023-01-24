const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { BandMember } = require('../../src/models');
const { bandMemberOne, bandMemberTwo, insertBandMembers } = require('../fixtures/bandMember.fixture');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { personOne, personTwo, insertPeople } = require('../fixtures/person.fixture');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Band Member routes', () => {
  describe('POST /v1/bandMembers', () => {
    let newBandMember;

    beforeEach(() => {
      newBandMember = {
        artistId: artistOne._id,
        personId: personOne._id,
      };
    });

    test('should return 201 and successfully create new band member if data is ok', async () => {
      await insertUsers([admin]);
      await insertPeople([personOne]);
      await insertArtists([artistOne]);

      const res = await request(app)
        .post('/v1/bandMembers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBandMember)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        artistId: String(newBandMember.artistId),
        personId: String(newBandMember.personId),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/bandMembers').send(newBandMember).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user creating new band member isnt an admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/bandMembers')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newBandMember)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if band member already exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);
      newBandMember = bandMemberOne;

      await request(app)
        .post('/v1/bandMembers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBandMember)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error artist doesnt exits', async () => {
      await insertUsers([admin]);
      await insertPeople([personOne]);

      await request(app)
        .post('/v1/bandMembers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBandMember)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error person doesnt exits', async () => {
      await insertUsers([admin]);
      await insertArtists([artistOne]);

      await request(app)
        .post('/v1/bandMembers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBandMember)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/bandMembers', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertPeople([personOne, personTwo]);
      await insertBandMembers([bandMemberOne, bandMemberTwo]);

      const res = await request(app)
        .get('/v1/bandMembers')
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
      //   id: bandMemberOne._id.toHexString(),
      //   artistId: bandMemberOne.artistId,
      //   personId: bandMemberOne.personId,
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertBandMembers([bandMemberOne]);

      await request(app).get('/v1/bandMembers').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all bandMembers', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/bandMembers')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on artistId field', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      const res = await request(app)
        .get('/v1/bandMembers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ artistId: String(bandMemberOne.artistId) })
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
      expect(res.body.results[0].id).toBe(bandMemberOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertPeople([personOne, personTwo]);
      await insertBandMembers([bandMemberOne, bandMemberTwo]);

      const res = await request(app)
        .get('/v1/bandMembers')
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
      expect(res.body.results[0].id).toBe(bandMemberOne._id.toHexString());
    });
  });

  describe('GET /v1/bandMembers/:bandMemberId', () => {
    test('should return 200 and the band member object if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      const res = await request(app)
        .get(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: bandMemberOne._id.toHexString(),
        artistId: String(bandMemberOne.artistId),
        personId: String(bandMemberOne.personId),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertBandMembers([bandMemberOne]);

      await request(app).get(`/v1/bandMembers/${bandMemberOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non admin is trying to get a band member', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      await request(app)
        .get(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if bandMemberId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      await request(app)
        .get('/v1/bandMembers/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if band member is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      await request(app)
        .get(`/v1/bandMembers/${bandMemberTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/bandMembers/:bandMemberId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      await request(app)
        .delete(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbBandMember = await BandMember.findById(bandMemberOne._id);
      expect(dbBandMember).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertBandMembers([bandMemberOne]);

      await request(app).delete(`/v1/bandMembers/${bandMemberOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user non admin is trying to delete band member', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      await request(app)
        .delete(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if bandMemberId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      await request(app)
        .delete('/v1/bandMembers/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if bandMember is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertPeople([personTwo]);
      await insertBandMembers([bandMemberTwo]);

      await request(app)
        .delete(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/bandMembers/:bandMemberId', () => {
    test('should return 200 and successfully update band member if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne, artistTwo]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      const updateBody = {
        artistId: artistTwo._id,
      };

      const res = await request(app)
        .patch(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: bandMemberOne._id.toHexString(),
        artistId: String(updateBody.artistId),
        personId: String(bandMemberOne.personId),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertBandMembers([bandMemberOne]);
      const updateBody = { artistId: mongoose.Types.ObjectId() };

      await request(app).patch(`/v1/bandMembers/${bandMemberOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non admin user is updating a band member', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      const updateBody = { artistId: mongoose.Types.ObjectId() };

      await request(app)
        .patch(`/v1/bandMembers/${bandMemberOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another band member that is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      const updateBody = { artistId: mongoose.Types.ObjectId() };

      await request(app)
        .patch(`/v1/bandMembers/${bandMemberTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if bandMemberId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertPeople([personOne]);
      await insertBandMembers([bandMemberOne]);

      const updateBody = { artistId: mongoose.Types.ObjectId() };

      await request(app)
        .patch(`/v1/bandMembers/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

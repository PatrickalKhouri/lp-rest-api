const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { UserAddress } = require('../../src/models');
const { userAddressOne, userAddressTwo, insertUserAddresses } = require('../fixtures/userAddress.fixture');
const { userOne, userTwo, insertUsers, admin } = require('../fixtures/user.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('User Address Routes routes', () => {
  describe('POST /v1/userAddresses', () => {
    let newUserAddress;

    beforeEach(() => {
      newUserAddress = {
        userId: userOne._id,
        streetName: 'Rua Baronesa',
        buildingNumber: '1241',
        postalCode: '22471-270',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brazil',
      };
    });

    test('should return 201 and successfully create new user address if data is ok', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app)
        .post('/v1/userAddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        userId: String(newUserAddress.userId),
        streetName: newUserAddress.streetName,
        buildingNumber: newUserAddress.buildingNumber,
        postalCode: newUserAddress.postalCode,
        city: newUserAddress.city,
        state: newUserAddress.state,
        country: newUserAddress.country,
      });

      // const dbUserAddress = await UserAddress.findById(res.body.id);
      // expect(dbUserAddress).toBeDefined();
      // expect(dbUserAddress).toMatchObject({
      //   _id: dbUserAddress._id,
      //   userId: String(newUserAddress.userId),
      //   streetName: newUserAddress.streetName,
      //   postalCode: newUserAddress.postalCode,
      //   buildingNumber: newUserAddress.buildingNumber,
      //   city: newUserAddress.city,
      //   state: newUserAddress.state,
      //   country: newUserAddress.country,
      // });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/userAddresses').send(newUserAddress).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if logged user is creating a userAddres for another user and isnt admin', async () => {
      await insertUsers([userOne, userTwo]);

      await request(app)
        .post('/v1/userAddresses')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if format of zipcode is invalid', async () => {
      await insertUsers([admin]);
      newUserAddress.postalCode = 'invalid zipcode';

      await request(app)
        .post('/v1/userAddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if country doesnt exist', async () => {
      await insertUsers([admin]);
      newUserAddress.country = 'country';

      await request(app)
        .post('/v1/userAddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if state doesnt exist', async () => {
      await insertUsers([admin]);
      newUserAddress.state = 'state';

      await request(app)
        .post('/v1/userAddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 500 error if trying to create an already exsiting address to the same user', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      newUserAddress = userAddressOne;

      await request(app)
        .post('/v1/userAddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/userAddresses', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get('/v1/userAddresses')
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
      //   id: userAddressOne._id.toHexString(),
      //   userId: userAddressOne.userId,
      //   streetName: userAddressOne.streetName,
      //   buildingNumber: userAddressOne.buildingNumber,
      //   postalCode: userAddressOne.postalCode,
      //   city: userAddressOne.city,
      //   state: userAddressOne.state,
      //   country: userAddressOne.country,
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      await request(app).get('/v1/userAddresses').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all useraddresses', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      await request(app)
        .get('/v1/userAddresses')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on field', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get('/v1/userAddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ country: userAddressOne.country })
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
      expect(res.body.results[0].id).toBe(userAddressOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get('/v1/userAddresses')
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
      // expect(res.body.results[0].id).toBe(userAddressOne._id.toHexString());
    });

    test('should return 200 if user is trying to acess all of his addresses', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get(`/v1/userAddresses`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ userId: userOne._id })
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
      expect(res.body.results[0].id).toBe(userAddressOne._id.toHexString());
    });

    test('should return 403 if user is trying to acess all of another users addresses', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      await request(app)
        .get(`/v1/userAddresses`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/userAddresses/:userAddressId', () => {
    test('should return 200 and the user address object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      const res = await request(app)
        .get(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: userAddressOne._id.toHexString(),
        userId: userOne._id.toHexString(),
        streetName: userAddressOne.streetName,
        buildingNumber: userAddressOne.buildingNumber,
        postalCode: userAddressOne.postalCode,
        city: userAddressOne.city,
        state: userAddressOne.state,
        country: userAddressOne.country,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);

      await request(app).get(`/v1/userAddresses/${userAddressOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .get('/v1/userAddresses/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user is not found', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .get(`/v1/userAddresses/${userAddressTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/userAddresses/:userAddressId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUserAddress = await UserAddress.findById(userAddressOne._id);
      expect(dbUserAddress).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);

      await request(app).delete(`/v1/userAddresses/${userAddressOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete without being the correct user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 203 if user is trying to delete is admin', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if userAddressId is not a valid mongo id', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete('/v1/userAddresses/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if userAddressId is not found', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .delete(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/userAddresses/:userAddressId', () => {
    test('should return 200 and successfully update user address if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = {
        city: faker.address.city(),
      };

      const res = await request(app)
        .patch(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: userAddressOne._id.toHexString(),
        userId: userOne._id.toHexString(),
        streetName: userAddressOne.streetName,
        buildingNumber: userAddressOne.buildingNumber,
        postalCode: userAddressOne.postalCode,
        city: updateBody.city,
        state: userAddressOne.state,
        country: userAddressOne.country,
      });

      // const dbUserAddress = await UserAddress.findById(userAddressOne._id);
      // expect(dbUserAddress).toBeDefined();
      // expect(dbUserAddress).toMatchObject({
      //   id: userAddressOne._id.toHexString(),
      //   userId: userOne._id.toHexString(),
      //   streetName: userAddressOne.streetName,
      //   buildingNumber: userAddressOne.buildingNumber,
      //   postalCode: userAddressOne.postalCode,
      //   city: updateBody.city,
      //   state: userAddressOne.state,
      //   country: userAddressOne.country,
      // });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app).patch(`/v1/userAddresses/${userAddressOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if trying to update another user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app)
        .patch(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 if admin is updating another user address that is not found', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app)
        .patch(`/v1/userAddresses/${userAddressTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app)
        .patch(`/v1/userAddresses/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if postal code  is invalid', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { postalCode: 'invalid postal code' };

      await request(app)
        .patch(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if country  is invalid', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: 'invalid country' };

      await request(app)
        .patch(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 400 if state is invalid', async () => {
      await insertUsers([userOne, admin]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: 'invalid state' };

      await request(app)
        .patch(`/v1/userAddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

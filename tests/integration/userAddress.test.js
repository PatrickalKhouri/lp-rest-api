const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { UserAddress } = require('../../src/models');
const { userAddressOne, userAddressTwo, insertUserAddresses } = require('../fixtures/userAddress.fixture');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('User Address Routes routes', () => {
  describe('POST /v1/useraddresses', () => {
    let newUserAddress;

    beforeEach(() => {
      newUserAddress = {
        userId: mongoose.Types.ObjectId(),
        streetName: 'Rua Baronesa',
        streetNumber: '1241',
        postalCode: '49047-410',
        city: faker.address.city(),
        state: 'MG',
        country: faker.address.country(),
        createdAt: faker.datatype.datetime(),
        modifiedAt: faker.datatype.datetime(),
      };
    });

    test('should return 201 and successfully create new userAddress if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([newUserAddress]);

      const res = await request(app)
        .post('/v1/useraddress')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        userId: userOne._id,
        streetName: newUserAddress.streetName,
        postalCodeive: newUserAddress.postalCode,
        city: newUserAddress.city,
        state: newUserAddress.state,
        country: newUserAddress.country,
        createdAt: newUserAddress.createdAt,
        modifiedAt: newUserAddress.modifiedAt,
      });

      const dbUserAddress = await UserAddress.findById(res.body.id);
      expect(dbUserAddress).toBeDefined();
      expect(dbUserAddress).toMatchObject({
        userId: userOne._id,
        streetName: newUserAddress.streetName,
        postalCode: newUserAddress.postalCode,
        city: newUserAddress.city,
        state: newUserAddress.state,
        country: newUserAddress.country,
        createdAt: newUserAddress.createdAt,
        modifiedAt: newUserAddress.modifiedAt,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/useraddress').send(newUserAddress).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in userAddress is not user', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([newUserAddress]);

      await request(app)
        .post('/v1/useraddress')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if date of zipcode is invalid', async () => {
      newUserAddress.postalCode = 'invalid zipcode';
      await insertUsers([userOne]);
      await insertUserAddresses([newUserAddress]);

      await request(app)
        .post('/v1/useraddress')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if country doesnt exist', async () => {
      newUserAddress.country = 'country';
      await insertUsers([userOne]);
      await insertUserAddresses([newUserAddress]);

      await request(app)
        .post('/v1/useraddress')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if state doesnt exist', async () => {
      newUserAddress.state = 'state';
      await insertUsers([userOne]);
      await insertUserAddresses([newUserAddress]);

      await request(app)
        .post('/v1/useraddress')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUserAddress)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/useraddresses', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get('/v1/useraddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
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
      expect(res.body.results[0]).toEqual({
        id: userAddressOne._id.toHexString(),
        userId: userOne._id.toHexString(),
        streetName: userAddressOne.streetName,
        postalCode: userAddressOne.postalCode,
        city: userAddressOne.city,
        state: userAddressOne.state,
        country: userAddressOne.country,
        createdAt: userAddressOne.createdAt,
        modifiedAt: userAddressOne.modifiedAt,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);

      await request(app).get('/v1/useraddresses').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all useraddresses', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      await request(app)
        .get('/v1/useraddresses')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      const res = await request(app)
        .get('/v1/useraddresses')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ streetName: userAddressOne.streetName })
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

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get('/v1/useraddresses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'streetName:desc,country:asc' })
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

      const expectedOrder = [userAddressOne, userAddressTwo].sort((a, b) => {
        if (a.streetName < b.streetName) {
          return 1;
        }
        if (a.streetName > b.streetName) {
          return -1;
        }
        return a.country < b.country ? -1 : 1;
      });

      expectedOrder.forEach((userAddress, index) => {
        expect(res.body.results[index].id).toBe(userAddress._id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserAddresses([userAddressOne, userAddressTwo]);

      const res = await request(app)
        .get('/v1/useraddresses')
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
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(userAddressOne._id.toHexString());
    });
  });

  describe('GET /v1/useraddresses/:userAddressId', () => {
    test('should return 200 and the person object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      const res = await request(app)
        .get(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: userAddressOne._id.toHexString(),
        userId: userOne._id.toHexString(),
        streetName: userAddressOne.streetName,
        postalCode: userAddressOne.postalCode,
        city: userAddressOne.city,
        state: userAddressOne.state,
        country: userAddressOne.country,
        createdAt: userAddressOne.createdAt,
        modifiedAt: userAddressOne.modifiedAt,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);

      await request(app).get(`/v1/useraddresses/${userAddressOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .get('/v1/useraddresses/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user is not found', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .get(`/v1/useraddresses/${userAddressTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/useraddresses/:userAddressId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUserAddress = await UserAddress.findById(userAddressOne._id);
      expect(dbUserAddress).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);

      await request(app).delete(`/v1/useraddresses/${userAddressOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete without being the correct user', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if userAddressId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete('/v1/useraddresses/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if userAddressId already is not found', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);

      await request(app)
        .delete(`/v1/useraddresses/${userTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/useraddresses/:userId', () => {
    test('should return 200 and successfully update user if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = {
        country: faker.address.country(),
        city: faker.address.city(),
      };

      const res = await request(app)
        .patch(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: userAddressOne._id.toHexString(),
        country: updateBody.country,
        city: updateBody.city,
      });

      const dbUserAddress = await UserAddress.findById(userAddressOne._id);
      expect(dbUserAddress).toBeDefined();
      expect(dbUserAddress).toMatchObject({
        id: userAddressOne._id.toHexString(),
        country: updateBody.country,
        city: updateBody.city,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app).patch(`/v1/useraddresses/${userAddressOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if trying to update another user', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app)
        .patch(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another person that is not found', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app)
        .patch(`/v1/useraddresses/${userAddressTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: faker.address.country() };

      await request(app)
        .patch(`/v1/useraddresses/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if postal code  is invalid', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { postalCode: 'invalid postal code' };

      await request(app)
        .patch(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if country  is invalid', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: 'invalid countrt' };

      await request(app)
        .patch(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if state is invalid', async () => {
      await insertUsers([userOne]);
      await insertUserAddresses([userAddressOne]);
      const updateBody = { country: 'invalid state' };

      await request(app)
        .patch(`/v1/useraddresses/${userAddressOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});

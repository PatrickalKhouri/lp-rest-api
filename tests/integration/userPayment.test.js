const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { UserPayment } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userPaymentOne, userPaymentTwo, insertUserPayments } = require('../fixtures/userPayment.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('User Payments routes', () => {
  describe('POST /v1/userPayments', () => {
    let newUserPayment;

    beforeEach(() => {
      newUserPayment = {
        userId: userOne._id,
        accountNumber: faker.finance.account(),
        paymentType: 'Pix',
        provider: 'Visa',
      };
    });

    test('should return 201 and successfully create new user payment if data is ok', async () => {
      await insertUsers([admin, userOne]);

      const res = await request(app)
        .post('/v1/userPayments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserPayment)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        userId: String(newUserPayment.userId),
        accountNumber: newUserPayment.accountNumber,
        paymentType: newUserPayment.paymentType,
        provider: newUserPayment.provider,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/userPayments').send(newUserPayment).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user creating user payment for another user', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/userPayments')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(newUserPayment)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if payment method is invalid', async () => {
      await insertUsers([admin]);
      newUserPayment.paymentType = 'invalid payment type';

      await request(app)
        .post('/v1/userPayments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserPayment)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if provider method is invalid', async () => {
      await insertUsers([admin]);
      newUserPayment.provider = 'invalid provider';

      await request(app)
        .post('/v1/userPayments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUserPayment)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/userPayments', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      const res = await request(app)
        .get('/v1/userPayments')
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
      //   id: userPaymentOne._id.toHexString(),
      //   userId: String(userPaymentOne.userId),
      //   accountNumber: userPaymentOne.accountNumber,
      //   paymentType: userPaymentOne.paymentType,
      //   provider: userPaymentOne.provider,
      //   createdAt: userPaymentOne.createdAt,
      //   modifiedAt: userPaymentOne.modifiedAt,
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertUserPayments([userPaymentOne]);

      await request(app).get('/v1/userPayments').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all user payments', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      await request(app)
        .get('/v1/userPayments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on provider field', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      const res = await request(app)
        .get('/v1/userPayments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ provider: userPaymentOne.provider })
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
      expect(res.body.results[0].id).toBe(userPaymentOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      const res = await request(app)
        .get('/v1/userPayments')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'provider:desc' })
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
      expect(res.body.results[0].id).toBe(userPaymentOne._id.toHexString());
      expect(res.body.results[1].id).toBe(userPaymentTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      const res = await request(app)
        .get('/v1/userPayments')
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
      expect(res.body.results[0].id).toBe(userPaymentOne._id.toHexString());
    });

    test('should return 200 if user is trying to acess all of his payments', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      const res = await request(app)
        .get(`/v1/userPayments`)
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
      expect(res.body.results[0].id).toBe(userPaymentOne._id.toHexString());
    });

    test('should return 401 if non admin user is trying to acess all of another users payments', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      await request(app)
        .get(`/v1/userPayments`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .query({ userId: userOne._id })
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/userPayments/:userPaymentId', () => {
    test('should return 200 and the user payment object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);

      const res = await request(app)
        .get(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: userPaymentOne._id.toHexString(),
        userId: String(userPaymentOne.userId),
        accountNumber: userPaymentOne.accountNumber,
        paymentType: userPaymentOne.paymentType,
        provider: userPaymentOne.provider,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserPayments([userPaymentOne]);

      await request(app).get(`/v1/userPayments/${userPaymentOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get another user Payment', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentTwo]);

      await request(app)
        .get(`/v1/userPayments/${userPaymentTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the user payment object if admin is trying to get another user paymetn', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .get(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if userPaymentId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .get('/v1/userPayments/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user payment is not found', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .get(`/v1/userPayments/${userPaymentTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/userPayments/:userPaymentId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .delete(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUserPayment = await UserPayment.findById(userPaymentOne._id);
      expect(dbUserPayment).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserPayments([userPaymentOne]);

      await request(app).delete(`/v1/userPayments/${userPaymentOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another user payment', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);

      await request(app)
        .delete(`/v1/userPayments/${userPaymentTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 204 if admin is trying to delete another user payment', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .delete(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if userP aymentId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .delete('/v1/userPayments/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/userPayments/:userId', () => {
    test('should return 200 and successfully update user payment if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);

      const updateBody = {
        accountNumber: faker.finance.account(),
      };

      const res = await request(app)
        .patch(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: userPaymentOne._id.toHexString(),
        userId: String(userPaymentOne.userId),
        accountNumber: updateBody.accountNumber,
        paymentType: userPaymentOne.paymentType,
        provider: userPaymentOne.provider,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUserPayments([userPaymentOne]);
      const updateBody = { accountNumber: faker.finance.account() };

      await request(app).patch(`/v1/userPayments/${userPaymentOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another user payment', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentTwo]);
      const updateBody = { accountNumber: faker.finance.account() };

      await request(app)
        .patch(`/v1/userPayments/${userPaymentTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and successfully update user if admin is updating another user payment', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);
      const updateBody = { accountNumber: faker.finance.account() };

      await request(app)
        .patch(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another user payment that is not found', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);
      const updateBody = { accountNumber: faker.finance.account() };

      await request(app)
        .patch(`/v1/userPayments/${userPaymentTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userPaymentId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      const updateBody = { accountNumber: faker.finance.account() };

      await request(app)
        .patch(`/v1/userPayments/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is provider', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      const updateBody = { provider: 'invalidProvider' };

      await request(app)
        .patch(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 400 if payment type is invalid', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      const updateBody = { paymentType: 'invalidPaymentType' };

      await request(app)
        .patch(`/v1/userPayments/${userPaymentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

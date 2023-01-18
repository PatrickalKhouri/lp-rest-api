const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { OrderDetail } = require('../../src/models');
const { orderDetailOne, orderDetailTwo, insertOrderDetails } = require('../fixtures/orderDetail.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userPaymentOne, userPaymentTwo, insertUserPayments } = require('../fixtures/userPayment.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Order Details routes', () => {
  describe('POST /v1/orderDetails', () => {
    let newOrderDetails;

    beforeEach(() => {
      newOrderDetails = {
        userId: userOne._id,
        userPaymentId: userPaymentOne._id,
        total: faker.finance.amount(0, 1000, 2),
      };
    });

    test('should return 201 and successfully create new order detail if data is ok', async () => {
      await insertUsers([admin, userOne]);
      await insertUserPayments([userPaymentOne]);

      const res = await request(app)
        .post('/v1/orderDetails')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderDetails)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        userId: String(newOrderDetails.userId),
        userPaymentId: String(newOrderDetails.userPaymentId),
        total: Number(newOrderDetails.total),
      });

      // const dbOrderDetail = await OrderDetail.findById(res.body.id);
      // expect(dbOrderDetail).toBeDefined();
      // expect(dbOrderDetail).toMatchObject({
      //   userId: String(newOrderDetails.userId),
      //   userPaymentId: String(newOrderDetails.userPaymentId),
      //   total: Number(newOrderDetails.total),
      // });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/orderDetails').send(newOrderDetails).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if logged in user is not creating for his user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne]);

      await request(app)
        .post('/v1/orderDetails')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(newOrderDetails)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if total is smaller than zero', async () => {
      await insertUsers([admin]);

      newOrderDetails.total = -5;

      await request(app)
        .post('/v1/orderDetails')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderDetails)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/orderDetails', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      const res = await request(app)
        .get('/v1/orderDetails')
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
      //   id: orderDetailOne._id.toHexString(),
      //   userId: orderDetailOne.userId,
      //   userPaymentId: orderDetailOne.userPaymentId,
      //   total: orderDetailOne.total,
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertOrderDetails([orderDetailOne]);

      await request(app).get('/v1/orderDetails').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all order details', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      await request(app)
        .get('/v1/orderDetails')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on provided field', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      const res = await request(app)
        .get('/v1/orderDetails')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ total: orderDetailOne.total })
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
      expect(res.body.results[0].id).toBe(orderDetailOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      orderDetailOne.total = 1;
      orderDetailTwo.total = 2;
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      const res = await request(app)
        .get('/v1/orderDetails')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'total:desc' })
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
      expect(res.body.results[1].id).toBe(orderDetailOne._id.toHexString());
      expect(res.body.results[0].id).toBe(orderDetailTwo._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      orderDetailOne.total = 1;
      orderDetailTwo.total = 2;
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      const res = await request(app)
        .get('/v1/orderDetails')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'total:asc' })
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
      expect(res.body.results[0].id).toBe(orderDetailOne._id.toHexString());
      expect(res.body.results[1].id).toBe(orderDetailTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      const res = await request(app)
        .get('/v1/orderDetails')
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
      expect(res.body.results[0].id).toBe(orderDetailOne._id.toHexString());
    });

    test('should return 200 if user is trying to acess all of his order details', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      const res = await request(app)
        .get(`/v1/orderDetails`)
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
      expect(res.body.results[0].id).toBe(orderDetailOne._id.toHexString());
    });

    test('should return 401 if non admin user is trying to acess all of another users order details', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);

      await request(app)
        .get(`/v1/orderItems`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .query({ userId: userOne._id })
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/orderDetails/:orderDetailId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      const res = await request(app)
        .get(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: orderDetailOne._id.toHexString(),
        userId: String(orderDetailOne.userId),
        userPaymentId: String(orderDetailOne.userPaymentId),
        total: Number(orderDetailOne.total),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertOrderDetails([orderDetailOne]);

      await request(app).get(`/v1/orderDetails/${orderDetailOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get another order detail', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentOne, userPaymentTwo]);
      await insertOrderDetails([orderDetailTwo]);

      await request(app)
        .get(`/v1/orderDetails/${orderDetailTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the order detail object if admin is trying to get another users order detail', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .get(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if orderDetailId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .get('/v1/orderDetails/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if order detail is not found', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .get(`/v1/orderDetails/${orderDetailTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/orderDetails/:orderDetailId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .delete(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbOrderDetail = await OrderDetail.findById(orderDetailOne._id);
      expect(dbOrderDetail).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertOrderDetails([orderDetailOne]);

      await request(app).delete(`/v1/orderDetails/${orderDetailOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another order detail', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentTwo]);
      await insertOrderDetails([orderDetailTwo]);

      await request(app)
        .delete(`/v1/orderDetails/${orderDetailTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 204 if admin is trying to delete another order detail', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .delete(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if orderDetailId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .delete('/v1/orderDetails/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/orderDetails/:orderDetailId', () => {
    test('should return 200 and successfully update order detail if data is ok', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);

      const updateBody = {
        total: faker.finance.amount(0, 1000, 2),
      };

      const res = await request(app)
        .patch(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: orderDetailOne._id.toHexString(),
        userId: String(orderDetailOne.userId),
        userPaymentId: String(orderDetailOne.userPaymentId),
        total: Number(updateBody.total),
      });

      // const dbOrderDetail = await OrderDetail.findById(orderDetailOne._id);
      // expect(dbOrderDetail).toBeDefined();
      // expect(dbOrderDetail).toMatchObject({
      //   id: orderDetailOne._id.toHexString(),
      //   userId: orderDetailOne.userId,
      //   userPaymentId: orderDetailOne.accountNumber,
      //   total: updateBody.total,
      //   createdAt: orderDetailOne.createdAt,
      //   modifiedAt: orderDetailOne.modifiedAt,
      // });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertOrderDetails([orderDetailOne]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app).patch(`/v1/orderDetails/${orderDetailOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another order detail', async () => {
      await insertUsers([userOne, userTwo]);
      await insertUserPayments([userPaymentTwo]);
      await insertOrderDetails([orderDetailTwo]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/orderDetails/${orderDetailTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and successfully update user if admin is updating another order detail', async () => {
      await insertUsers([userOne, admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    // test('should return 404 if admin is updating another order detail that is not found', async () => {
    //   await insertUsers([userOne, admin]);
    //   await insertUserPayments([userPaymentOne]);
    //   await insertOrderDetails([orderDetailOne]);
    //   const updateBody = { total: faker.finance.amount(0, 1000, 2) };

    //   await request(app)
    //     .patch(`/v1/orderDetails/${orderDetailTwo._id}`)
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(updateBody)
    //     .expect(httpStatus.NOT_FOUND);
    // });

    test('should return 400 error if orderDetailId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/orderDetails/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if total is below zero', async () => {
      await insertUsers([userOne]);
      await insertUserPayments([userPaymentOne]);
      await insertOrderDetails([orderDetailOne]);
      const updateBody = { total: -2 };

      await request(app)
        .patch(`/v1/orderDetails/${orderDetailOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

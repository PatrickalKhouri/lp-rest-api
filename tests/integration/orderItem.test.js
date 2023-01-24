const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { OrderItem } = require('../../src/models');
const { orderItemOne, orderItemTwo, insertOrderItems } = require('../fixtures/orderItem.fixture');
const { orderDetailOne, orderDetailTwo, insertOrderDetails } = require('../fixtures/orderDetail.fixture');
const { albumOne, albumTwo, insertAlbums } = require('../fixtures/album.fixture');
const { insertRecords, recordOne, recordTwo } = require('../fixtures/record.fixture');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Order Item routes', () => {
  describe('POST /v1/orderItems', () => {
    let newOrderItem;

    beforeEach(() => {
      newOrderItem = {
        albumId: albumOne._id,
        orderDetailId: orderDetailOne._id,
        quantity: faker.finance.amount(0, 50, 2),
      };
    });

    test('should return 201 and successfully create new order item if data is ok', async () => {
      await insertUsers([admin]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);

      const res = await request(app)
        .post('/v1/orderItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        albumId: String(newOrderItem.albumId),
        orderDetailId: String(newOrderItem.orderDetailId),
        quantity: Number(newOrderItem.quantity),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/orderItems').send(newOrderItem).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if logged in user is not creating for his user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);

      await request(app)
        .post('/v1/orderItems')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 Quantity is below zero', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      newOrderItem.quantity = -10;

      await request(app)
        .post('/v1/orderItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 500 if order item already exists', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      newOrderItem = orderItemOne;

      await request(app)
        .post('/v1/orderItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/orderItems', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      await insertOrderItems([orderItemOne, orderItemTwo]);

      const res = await request(app)
        .get('/v1/orderItems')
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
      //   id: orderItemOne._id.toHexString(),
      //   albumId: String(orderItemOne.albumId),
      //   orderDetailId: String(orderItemOne.albumId),
      //   quantity: Number(orderItemOne.quantity),
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertOrderItems([orderItemOne, orderItemTwo]);

      await request(app).get('/v1/orderItems').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all orderItems', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      await insertOrderItems([orderItemOne, orderItemTwo]);

      await request(app)
        .get('/v1/orderItems')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on quantity field', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      await insertOrderItems([orderItemOne, orderItemTwo]);
      const res = await request(app)
        .get('/v1/orderItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ quantity: orderItemOne.quantity })
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
      expect(res.body.results[0].id).toBe(orderItemOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      orderItemOne.quantity = 20;
      orderItemTwo.quantity = 30;
      await insertOrderItems([orderItemOne, orderItemTwo]);

      const res = await request(app)
        .get('/v1/orderItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'quantity:desc' })
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
      expect(res.body.results[0].id).toBe(orderItemTwo._id.toHexString());
      expect(res.body.results[1].id).toBe(orderItemOne._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      orderItemOne.quantity = 20;
      orderItemTwo.quantity = 30;
      await insertOrderItems([orderItemOne, orderItemTwo]);

      const res = await request(app)
        .get('/v1/orderItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'quantity:asc' })
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
      expect(res.body.results[1].id).toBe(orderItemTwo._id.toHexString());
      expect(res.body.results[0].id).toBe(orderItemOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      await insertOrderItems([orderItemOne, orderItemTwo]);

      const res = await request(app)
        .get('/v1/orderItems')
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
      // expect(res.body.results[0].id).toBe(orderItemOne._id.toHexString());
    });

    test('should return 200 if user is trying to acess all of his order items', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      await insertOrderItems([orderItemOne, orderItemTwo]);

      const res = await request(app)
        .get(`/v1/orderItems`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .query({ orderDetailId: orderItemOne.orderDetailId })
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
      expect(res.body.results[0].id).toBe(orderItemOne._id.toHexString());
    });

    test('should return 401 if non admin user is trying to acess all of another users order items', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertOrderDetails([orderDetailOne, orderDetailTwo]);
      await insertOrderItems([orderItemOne, orderItemTwo]);

      await request(app)
        .get(`/v1/orderItems`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .query({ orderDetailId: orderItemOne.orderDetailId })
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/orderItems/:orderItemId', () => {
    test('should return 200 and the order item object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);

      const res = await request(app)
        .get(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: orderItemOne._id.toHexString(),
        albumId: String(orderItemOne.albumId),
        orderDetailId: String(orderItemOne.orderDetailId),
        quantity: orderItemOne.quantity,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);

      await request(app).get(`/v1/orderItems/${orderItemOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get another users order item', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertOrderDetails([orderDetailTwo]);
      await insertOrderItems([orderItemTwo]);

      await request(app)
        .get(`/v1/orderItems/${orderItemTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the album object if admin is trying to get another users order item', async () => {
      await insertUsers([admin, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertOrderDetails([orderDetailTwo]);
      await insertOrderItems([orderItemTwo]);

      await request(app)
        .get(`/v1/orderItems/${orderItemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if orderItemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertOrderDetails([orderDetailTwo]);
      await insertOrderItems([orderItemTwo]);

      await request(app)
        .get('/v1/orderItems/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if order item is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertOrderDetails([orderDetailTwo]);
      await insertOrderItems([orderItemTwo]);

      await request(app)
        .get(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/orderItems/:orderItemId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);

      await request(app)
        .delete(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbOrderItem = await OrderItem.findById(orderItemOne._id);
      expect(dbOrderItem).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertOrderItems([orderItemOne]);

      await request(app).delete(`/v1/orderItems/${orderItemOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another users order item', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertOrderDetails([orderDetailTwo]);
      await insertOrderItems([orderItemTwo]);

      await request(app)
        .delete(`/v1/orderItems/${orderItemTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 204 if admin is trying to delete another users order item', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);

      await request(app)
        .delete(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if orderItemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);

      await request(app)
        .delete('/v1/orderItems/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if order item is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);

      await request(app)
        .delete(`/v1/orderItems/${orderItemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/orderItems/:orderItemId', () => {
    test('should return 200 and successfully update order item if data is ok', async () => {
      await insertUsers([admin, userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);
      const updateBody = {
        quantity: faker.finance.amount(0, 50, 2),
      };

      const res = await request(app)
        .patch(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: orderItemOne._id.toHexString(),
        albumId: String(orderItemOne.albumId),
        orderDetailId: String(orderItemOne.orderDetailId),
        quantity: Number(updateBody.quantity),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertOrderItems([orderItemOne]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app).patch(`/v1/orderItems/${orderItemOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another users order item', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertOrderDetails([orderDetailTwo]);
      await insertOrderItems([orderItemTwo]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app)
        .patch(`/v1/orderItems/${orderItemTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and successfully update user if admin is updating another users order item', async () => {
      await insertUsers([admin, userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app)
        .patch(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    // test('should return 404 if admin is updating another user order item that is not found', async () => {
    // await insertUsers([admin, userOne]);
    // await insertLabels([labelOne]);
    // await insertArtists([artistOne]);
    // await insertRecords([recordOne]);
    // await insertAlbums([albumOne]);
    // await insertOrderDetails([orderDetailOne]);
    // await insertOrderItems([orderItemOne]);
    //   const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

    //   await request(app)
    //     .patch(`/v1/orderItems/${orderItemTwo._id}`)
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(updateBody)
    //     .expect(httpStatus.NOT_FOUND);
    // });

    test('should return 400 error if orderItemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app)
        .patch(`/v1/orderItems/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if quantity is negative', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertOrderDetails([orderDetailOne]);
      await insertOrderItems([orderItemOne]);
      const updateBody = { quantity: -200 };

      await request(app)
        .patch(`/v1/orderItems/${orderItemOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

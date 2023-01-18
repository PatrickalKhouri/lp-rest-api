const request = require('supertest');
const faker = require('faker');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { CartItem } = require('../../src/models');
const { cartItemOne, cartItemTwo, insertCartItems } = require('../fixtures/cartItem.fixture');
const { shoppingSessionOne, shoppingSessionTwo, insertShoppingSessions } = require('../fixtures/shoppingSession.fixture');
const { albumOne, albumTwo, insertAlbums } = require('../fixtures/album.fixture');
const { insertRecords, recordOne, recordTwo } = require('../fixtures/record.fixture');
const { artistOne, artistTwo, insertArtists } = require('../fixtures/artist.fixture');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Cart Item routes', () => {
  describe('POST /v1/cartItems', () => {
    let newCartItem;

    beforeEach(() => {
      newCartItem = {
        albumId: albumOne._id,
        shoppingSessionId: shoppingSessionOne._id,
        quantity: faker.finance.amount(0, 50, 2),
      };
    });

    test('should return 201 and successfully create new cart item if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/cartItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCartItem)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        albumId: String(newCartItem.albumId),
        shoppingSessionId: String(newCartItem.shoppingSessionId),
        quantity: Number(newCartItem.quantity),
      });

      // const dbCartItem = await CartItem.findById(res.body.id);
      // expect(dbCartItem).toBeDefined();
      // expect(dbCartItem).toMatchObject({
      //   albumId: newCartItem.albumId,
      //   shoppingSessionId: newCartItem.albumId,
      //   quantity: newCartItem.quantity,
      //   createdAt: newCartItem.createdAt,
      //   modifiedAt: newCartItem.modifiedAt,
      // });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/cartItems').send(newCartItem).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if logged in user is not creating for his user', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/cartItems')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newCartItem)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 Quantity is below zero', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);
      newCartItem.quantity = -10;

      await request(app)
        .post('/v1/cartItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCartItem)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test('should return 500 if cartItem already exists', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);
      newCartItem = cartItemOne;

      await request(app)
        .post('/v1/cartItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCartItem)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/cartItems', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      await insertCartItems([cartItemOne, cartItemTwo]);

      const res = await request(app)
        .get('/v1/cartItems')
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
      //   id: cartItemOne._id.toHexString(),
      //   albumId: String(cartItemOne.albumId),
      //   shoppingSessionId: String(cartItemOne.albumId),
      //   quantity: Number(cartItemOne.quantity),
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertCartItems([cartItemOne, cartItemTwo]);

      await request(app).get('/v1/cartItems').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all cartItems', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      await insertCartItems([cartItemOne, cartItemTwo]);

      await request(app)
        .get('/v1/cartItems')
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
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      await insertCartItems([cartItemOne, cartItemTwo]);

      const res = await request(app)
        .get('/v1/cartItems')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ quantity: cartItemOne.quantity })
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
      expect(res.body.results[0].id).toBe(cartItemOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      cartItemOne.quantity = 20;
      cartItemTwo.quantity = 30;
      await insertCartItems([cartItemOne, cartItemTwo]);

      const res = await request(app)
        .get('/v1/cartItems')
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
      expect(res.body.results[0].id).toBe(cartItemTwo._id.toHexString());
      expect(res.body.results[1].id).toBe(cartItemOne._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      cartItemOne.quantity = 20;
      cartItemTwo.quantity = 30;
      await insertCartItems([cartItemOne, cartItemTwo]);

      const res = await request(app)
        .get('/v1/cartItems')
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
      expect(res.body.results[1].id).toBe(cartItemTwo._id.toHexString());
      expect(res.body.results[0].id).toBe(cartItemOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      await insertCartItems([cartItemOne, cartItemTwo]);

      const res = await request(app)
        .get('/v1/cartItems')
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
      // expect(res.body.results[0].id).toBe(cartItemOne._id.toHexString());
    });

    test('should return 200 if user is trying to acess all of his cart items', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      await insertCartItems([cartItemOne, cartItemTwo]);

      const res = await request(app)
        .get(`/v1/cartItems`)
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
      expect(res.body.results[0].id).toBe(cartItemOne._id.toHexString());
    });

    test('should return 401 if non admin user is trying to acess all of another users cart items', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelOne, labelTwo]);
      await insertArtists([artistOne, artistTwo]);
      await insertRecords([recordOne, recordTwo]);
      await insertAlbums([albumOne, albumTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);
      await insertCartItems([cartItemOne, cartItemTwo]);

      await request(app)
        .get(`/v1/cartItems`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .query({ userId: userOne._id })
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/cartItems/:cartItemId', () => {
    test('should return 200 and the cart item object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);

      const res = await request(app)
        .get(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: cartItemOne._id.toHexString(),
        albumId: String(cartItemOne.albumId),
        shoppingSessionId: String(cartItemOne.shoppingSessionId),
        quantity: cartItemOne.quantity,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);

      await request(app).get(`/v1/cartItems/${cartItemOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get another users cart item', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      await insertCartItems([cartItemTwo]);

      await request(app)
        .get(`/v1/cartItems/${cartItemTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the album object if admin is trying to get another users cart item', async () => {
      await insertUsers([userTwo, admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      await insertCartItems([cartItemTwo]);

      await request(app)
        .get(`/v1/cartItems/${cartItemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if cartItemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      await insertCartItems([cartItemTwo]);

      await request(app)
        .get('/v1/cartItems/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if cart item is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      await insertCartItems([cartItemTwo]);

      await request(app)
        .get(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/cartItems/:cartItemId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);

      await request(app)
        .delete(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbCartItem = await CartItem.findById(cartItemOne._id);
      expect(dbCartItem).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertCartItems([cartItemOne]);

      await request(app).delete(`/v1/cartItems/${cartItemOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another users cart item', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      await insertCartItems([cartItemTwo]);

      await request(app)
        .delete(`/v1/cartItems/${cartItemTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 204 if admin is trying to delete another users cart item', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);

      await request(app)
        .delete(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if cartItemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);

      await request(app)
        .delete('/v1/cartItems/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if cart item is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);

      await request(app)
        .delete(`/v1/cartItems/${cartItemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/cartItems/:cartItemId', () => {
    test('should return 200 and successfully update cart item if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);
      const updateBody = {
        quantity: faker.finance.amount(0, 50, 2),
      };

      const res = await request(app)
        .patch(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: cartItemOne._id.toHexString(),
        albumId: String(cartItemOne.albumId),
        shoppingSessionId: String(cartItemOne.shoppingSessionId),
        quantity: Number(updateBody.quantity),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertCartItems([cartItemOne]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app).patch(`/v1/cartItems/${cartItemOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another users cart item', async () => {
      await insertUsers([userOne, userTwo]);
      await insertLabels([labelTwo]);
      await insertArtists([artistTwo]);
      await insertRecords([recordTwo]);
      await insertAlbums([albumTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      await insertCartItems([cartItemTwo]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app)
        .patch(`/v1/cartItems/${cartItemTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and successfully update user if admin is updating another users cart item', async () => {
      await insertUsers([userOne, admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app)
        .patch(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    // test('should return 404 if admin is updating another user cart item that is not found', async () => {
    //   await insertUsers([admin, userOne]);
    //   await insertLabels([labelOne]);
    //   await insertArtists([artistOne]);
    //   await insertRecords([recordOne]);
    //   await insertAlbums([albumOne]);
    //   await insertShoppingSessions([shoppingSessionOne]);
    //   await insertCartItems([cartItemOne]);
    //   const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

    //   await request(app)
    //     .patch(`/v1/cartItems/${cartItemTwo._id}`)
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(updateBody)
    //     .expect(httpStatus.NOT_FOUND);
    // });

    test('should return 400 error if cartItemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      await insertArtists([artistOne]);
      await insertRecords([recordOne]);
      await insertAlbums([albumOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);
      const updateBody = { quantity: faker.finance.amount(0, 50, 2) };

      await request(app)
        .patch(`/v1/cartItems/invalidId`)
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
      await insertShoppingSessions([shoppingSessionOne]);
      await insertCartItems([cartItemOne]);
      const updateBody = { quantity: -200 };

      await request(app)
        .patch(`/v1/cartItems/${cartItemOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});

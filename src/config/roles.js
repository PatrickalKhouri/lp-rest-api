const allRoles = {
  user: [
    'createUserAddress',
    'getUserAddress',
    'manageUserAddresses',
    'getUserAddresses',
    'createAlbum',
    'getAlbums',
    'manageAlbums',
    'createShoppingSession',
    'getShoppingSessions',
    'manageShoppingSession',
    'createUserPayment',
    'getUserPayments',
    'manageUserPayments',
    'createCartItem',
    'getCartItems',
    'manageCartItems',
    'createOrderDetail',
    'getOrderDetails',
    'manageOrderDetail',
    'createOrderItem',
    'getOrderItems',
    'manageOrderItem',
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'createUserAddress',
    'getUserAddresses',
    'getUserAddress',
    'manageUserAddresses',
    'createLabel',
    'manageLabel',
    'createGenre',
    'manageGenre',
    'createPerson',
    'managePeople',
    'createArtist',
    'manageArtists',
    'createBandMember',
    'manageBandMembers',
    'createRecord',
    'manageRecords',
    'createRecordGenre',
    'manageRecordGenres',
    'createAlbum',
    'getAlbums',
    'manageAlbums',
    'createShoppingSession',
    'getShoppingSessions',
    'manageShoppingSession',
    'createUserPayment',
    'getUserPayments',
    'manageUserPayments',
    'createCartItem',
    'getCartItems',
    'manageCartItems',
    'createOrderDetail',
    'getOrderDetails',
    'manageOrderDetail',
    'createOrderItem',
    'getOrderItems',
    'manageOrderItem',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

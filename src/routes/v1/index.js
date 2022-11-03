const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const userAddressRoute = require('./userAddress.route');
const labelRoute = require('./label.route');
const genreRoute = require('./genre.route');
const personRoute = require('./person.route');
const artistRoute = require('./artist.route');
const recordRoute = require('./record.route');
const bandMemberRoute = require('./bandMember.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const recordGenresRoute = require('./recordGenre');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/userAddresses',
    route: userAddressRoute,
  },
  {
    path: '/labels',
    route: labelRoute,
  },
  {
    path: '/genres',
    route: genreRoute,
  },
  {
    path: '/people',
    route: personRoute,
  },
  {
    path: '/artists',
    route: artistRoute,
  },
  {
    path: '/bandMembers',
    route: bandMemberRoute,
  },
  {
    path: '/records',
    route: recordRoute,
  },
  {
    path: '/recordGenres',
    route: recordGenresRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

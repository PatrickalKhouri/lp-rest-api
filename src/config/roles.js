const allRoles = {
  user: ['createUserAddress', 'getUserAddress', 'manageUserAddresses', 'getUserAddresses'],
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
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

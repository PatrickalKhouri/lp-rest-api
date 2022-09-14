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
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

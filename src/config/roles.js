const allRoles = {
  user: ['createUserAddress'],
  admin: ['getUsers', 'manageUsers', 'createUserAddress', 'getUserAddresses', 'manageUserAddresses'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

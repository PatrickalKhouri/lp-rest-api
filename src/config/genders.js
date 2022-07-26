/* eslint-disable prettier/prettier */
const allGenders = {
    M: 'Male',
    F: 'Female',
    O: 'Others'
}

const gendersShort = Object.keys(allGenders);
const genders = Object.values(allGenders);

module.exports = {
  gendersShort,
  genders,
};

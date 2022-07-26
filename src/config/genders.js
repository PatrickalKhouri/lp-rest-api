/* eslint-disable prettier/prettier */
const allGenders = {
    M: 'Male',
    F: 'Female',
    O: 'Others'
}

const gendersShort = Object.keys(allGenders);
const genders = new Map(Object.entries(gendersShort));

module.exports = {
  gendersShort,
  genders,
};

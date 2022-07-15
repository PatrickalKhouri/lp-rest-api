/* eslint-disable prettier/prettier */
const allGenres = {
    M: 'Male',
    F: 'Female',
    O: 'Others'
}

const humanGenresShort = Object.keys(allGenres);
const humanGenres = new Map(Object.entries(humanGenresShort));

module.exports = {
  humanGenresShort,
  humanGenres,
};

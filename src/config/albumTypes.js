const allAlbumTypes = {
  LP: 'lp',
  EP: 'ep',
  CD: 'cd',
  TAPE: 'tape',
  SINGLE: 'single',
};

const albumTypes = Object.keys(allAlbumTypes);
const albumTypesString = new Map(Object.entries(albumTypes));

module.exports = {
  albumTypes,
  albumTypesString,
};

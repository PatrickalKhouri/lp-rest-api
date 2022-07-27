const allAlbumTypes = {
  lp: 'lp',
  ep: 'ep',
  cd: 'cd',
  tape: 'tape',
  single: 'single',
};

const albumTypes = Object.keys(allAlbumTypes);
const albumTypesString = Object.values(allAlbumTypes);

module.exports = {
  albumTypes,
  albumTypesString,
};

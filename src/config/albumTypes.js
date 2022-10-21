const allAlbumTypes = {
  lp: 'LP',
  ep: 'EP',
  cd: 'CD',
};

const albumTypes = Object.keys(allAlbumTypes);
const albumTypesString = Object.values(allAlbumTypes);

module.exports = {
  albumTypes,
  albumTypesString,
};

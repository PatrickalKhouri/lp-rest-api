const allAlbumFormats = {
  cd: 'CD',
  tape: 'Tape',
  vinyl: 'Vinyl',
};

const albumFormats = Object.keys(allAlbumFormats);
const albumFormatsString = Object.values(allAlbumFormats);

module.exports = {
  albumFormats,
  albumFormatsString,
};

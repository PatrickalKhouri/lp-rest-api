const allAlbumFormats = {
  cd: 'CD',
  tape: 'Tape',
  vinyl: 'Vinyl',
};

const albumFormats = Object.keys(allAlbumFormats);
const albumFormatsString = Object.values(albumFormats);

module.exports = {
  albumFormats,
  albumFormatsString,
};

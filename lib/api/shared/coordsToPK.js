const toPK = coordinates => {
  return `${coordinates.x.padStart(2, '0')}-${coordinates.y.padStart(2, '0')}`;
};

const toCoords = PK => {
  const [x, y] = PK.split('-').map(str => + str.replace('0', ''));
  return {x, y};
};

module.exports = { toPK, toCoords };
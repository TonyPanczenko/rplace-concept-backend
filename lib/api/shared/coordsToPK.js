const toPK = coordinates => {
  return `${coordinates.x.toString(10).padStart(2, '0')}-${coordinates.y.toString(10).padStart(2, '0')}`;
};

const toCoords = PK => {
  const [x, y] = PK.split('-').map(str => + str.replace('0', ''));
  return {x, y};
};

module.exports = { toPK, toCoords };
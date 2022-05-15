const { DynamoDB } = require('aws-sdk');
const respond = require('../respond');
const { toPK } = require('../shared/coordsToPK');

const ddb = new DynamoDB();

exports.handler = async (event) => {
  const timestamp = new Date();
  let bodyObj = {};

  try {
    bodyObj = JSON.parse(event.body);
  } catch (e) {
    respond(400, e.message);
  }

  const {
    coordinates,
    color
  } = bodyObj;
  const userIp = event.requestContext.identity.sourceIp;
  const PK = toPK(coordinates);

  await ddb.putItem({
    tableName: process.env.PIXELS_TABLE,
    item: {
      PK,
      coordinates,
      color,
      userIp,
      timestamp
    }
  })
    .catch(e => respond(500, e.message));
};
// eslint-disable-next-line node/no-unpublished-require
const { DynamoDB } = require('aws-sdk');
const response = require('../shared/response');
const { toPK } = require('../shared/coordsToPK');

const ddb = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const timestamp = new Date().toISOString();
  let bodyObj = {};

  try {
    bodyObj = JSON.parse(event.body);
  } catch (e) {
    return response(400, {message: e.message});
  }

  const {
    coordinates,
    color
  } = bodyObj;
  const userIp = event.requestContext.identity.sourceIp;
  const PK = toPK(coordinates);

  try {
    await ddb.put({
      TableName: process.env.PIXELS_TABLE,
      Item: {
        PK,
        Coordinates: coordinates,
        Color: color,
        UserIp: userIp,
        Timestamp: timestamp
      }
    }).promise();
  } catch(e) {
    return response(500, {message: e.message});
  }

  return response(200, {message: 'Pixel added'});
};
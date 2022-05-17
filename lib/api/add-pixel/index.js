/* eslint-disable node/no-unpublished-require */
const { DynamoDB } = require('aws-sdk');
const response = require('../shared/response');
const { toPK } = require('../shared/coordsToPK');

const ddb = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const timestamp = new Date();
  let bodyObj = {};

  try {
    bodyObj = JSON.parse(event.body);
  } catch (e) {
    return response(400, e.message);
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
        color,
        userIp,
        timestamp
      }
    }).promise();
  } catch(e) {
    return response(500, e.message);
  }

  return response(200, 'Pixel added');
};
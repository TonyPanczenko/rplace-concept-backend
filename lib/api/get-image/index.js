// eslint-disable-next-line node/no-unpublished-require
const { DynamoDB } = require('aws-sdk');
const response = require('../shared/response');

const ddb = new DynamoDB.DocumentClient();

exports.handler = async () => {
  let data;
  try {
    data = await ddb.scan({
      TableName: process.env.PIXELS_TABLE,
      ProjectionExpression: 'Coordinates, Color, UserIp, Timestamp'
    }).promise();
  } catch (e) {
    return response(500, {message: e.message});
  }

  return response(200, {pixels: data.items});
};
// eslint-disable-next-line node/no-unpublished-require
const { DynamoDB } = require('aws-sdk');
const response = require('../shared/response');

const ddb = new DynamoDB.DocumentClient();

exports.handler = async () => {
  let data;
  try {
    data = await ddb.scan({
      TableName: process.env.PIXELS_TABLE,
      ExpressionAttributeNames: {
        '#T': 'Timestamp'
      },
      ProjectionExpression: 'Coordinates, Color, UserIp, #T'
    }).promise();
  } catch (e) {
    return response(500, { message: e.message });
  }

  let pixels = data['Items'];
  pixels = pixels.map((n) => {
    return Object.fromEntries(Object.entries(n).map((entry) => {
      entry[0] = entry[0].charAt(0).toLowerCase() + entry[0].slice(1);
      return entry;
    }));
  });

  return response(200, { pixels });
};
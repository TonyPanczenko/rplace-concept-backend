module.exports = (statusCode, bodyObj, headers = {}) => {
  const body = JSON.stringify(bodyObj);
  console.log(`# Respond [${statusCode}] with message: [${body}]`);
  return {
    statusCode,
    headers: {
      'Content-type': 'application/json',
      'Cache-Control': 'no-cache',
      ...headers,
    },
    body,
  };
};
module.exports = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      'Content-type': 'application/json',
      'Cache-Control': 'no-cache',
      ...headers,
    },
    body: JSON.stringify(body, null, 2)
  };
};
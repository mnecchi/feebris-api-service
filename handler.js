'use strict';

module.exports.selftest = async event => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ success: true })
});

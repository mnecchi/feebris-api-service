'use strict';

/**
 * GET - /selftest
 * Checks if the API is working fine
 */
const get = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ success: true })
});

module.exports = { get };

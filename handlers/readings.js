'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const { isFlu } = require('../helpers');

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * POST - /readings
 * Save a reading on the DB
 */
const post = async ({ body }) => {
  let requestBody;

  try {
    requestBody = JSON.parse(body);
    const { temperature } = requestBody;

    // Check if temperature has been provided, is a number and is between 35 and 43
    // if not throw an error
    if (!temperature) {
      throw new Error('The temperature is required');
    }

    if (isNaN(temperature) || temperature < 35 || temperature > 43) {
      throw new Error('The temperature must be a number between 35 and 43');
    }
  } catch (err) {
    // this catches the json parse errors or the temperature validation errors
    // in both cases I reply with a 400 (bad request) status code
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err.message })
    };
  }

  try {
    const { temperature, cough, feverInLast5Days } = requestBody;
    // new readings id
    const id = uuid.v4();

    // try to insert the new reading in the DB
    await dynamoDB.put({
      TableName: process.env.READINGS_TABLE,
      Item: {
        id,
        temperature,
        cough: !!cough, // converted to a boolean
        feverInLast5Days: !!feverInLast5Days, // converted to a boolean
        isFlu: isFlu(temperature, cough, feverInLast5Days), // checks if the patience has got a flu
        createdAt: new Date().getTime()
      }
    }).promise();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    };
  }
};

/**
 * GET - /readings
 * Get all the readings in the DB
 */
const get = async () => {
  try {
    const res = await dynamoDB.scan({ TableName: process.env.READINGS_TABLE }).promise();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res.Items)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    };
  }
}

module.exports = { post, get };

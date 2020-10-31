'use strict';

/**
 * 
 * Creates and returns a Twilio client using credentials provided.
 * The client is tested and verified by pinging Twilio's availablePhoneNumbers API using the credentials provided.
 * 
 * @param { string } accountSid Requester's Twilio Account Sid.
 * @param { string } authToken Requester's Twilio Auth Token.
 */
const getClient = (accountSid, authToken) => {
  const client = require('twilio')(accountSid, authToken);
  return client.availablePhoneNumbers('AU')
  .fetch()
  .then(() => {
      return client;
  })
  .catch((e) => {
    console.log(e);
    throw({ code: 500, message: e.message });
  });
}

/**
 * 
 * Returns a JSON.stringified version of the object provided.
 * 
 * @param { object } object Object to be stringified.
 */
const serialize = (object) => {
  return JSON.stringify(object, null, 2);
}

/**
 * 
 * Translates input object's values back to integers if they have been converted to strings during stringification. Returns a new object.
 * 
 * @param { object } obj Object to be translated.
 */
const translateObjectIntStrings = (obj) => {
  const res = {}
  for (const key in obj) {
    res[key] = {};
    for (const prop in obj[key]) {
      const parsed = parseInt(obj[key], 10);
      res[key] = isNaN(parsed) ? obj[key] : parsed;
    }
  }
  return res;
}

/**
 * 
 * Returns an Error HTTP Response.
 * 
 * @param { object } error Error to be returned with the response.
 */
const formatError = (error) => {
  var response = {
    "statusCode": error.code ? error.code : error.statusCode,
    "headers": {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": error.code
    },
    "isBase64Encoded": false,
    "body": error.code + ": " + error.message
  }
  return response
}


/**
 * 
 * Returns a HTTP 200 response.
 * 
 * @param { object } body Payload to be returned with the response.
 */
const formatResponse = (body) => {
  var response = {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": body
  }
  return response
}

module.exports = { getClient, serialize, translateObjectIntStrings , formatError, formatResponse };
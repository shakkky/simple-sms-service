'use strict';
const { getClient, serialize, translateObjectIntStrings , formatError, formatResponse } = require("../helpers");

/**
 * 
 * Validates and extracts the required headers and parameters from the incoming event.
 * 
 * @param { object } event Event object.
 */
const processEvent = (event) => {
  var { ACCOUNT_SID, AUTH_TOKEN, account_sid, auth_token } = event.headers;
  var params = event.queryStringParameters;
  ACCOUNT_SID = ACCOUNT_SID ? ACCOUNT_SID : account_sid;
  AUTH_TOKEN = AUTH_TOKEN ? AUTH_TOKEN : auth_token;
  if (!ACCOUNT_SID){
    throw({ code: 400, message: 'missing Account SID'});
  }
  if (ACCOUNT_SID.toString().substring(0, 2) !== "AC"){
    throw({ code: 400, message: 'accountSid must start with AC'});
  }
  if (!AUTH_TOKEN){
    throw({ code: 400, message: 'missing Auth Token'});
  }
  var response = { ACCOUNT_SID, AUTH_TOKEN };

  if (params){
    params = translateObjectIntStrings(params); // clean up requestParams object. Converts integers that were converted to strings during stringification process back into integers.
    response = { ...response, ...params };
  }
  return response;
}

 /**
  * 
  * Retrieves history that suits the request paramaters (if any).
  * 
  * @param { Twilio Client } client A valid Twilio Client.
  * @param { object } requestParams Filter conditions as per Twilio's SMS API standard.
  */
const processListHistoryRequest = (client, requestParams) => {
  return client.messages.list(requestParams)
  .then((response) => {
    return response;
  })
  .catch((e) => {
    throw({ code: 500, message: e.message });
  });
}

const handler = async (event) => {
  try {
    //extract details from event
    var { ACCOUNT_SID, AUTH_TOKEN, limit, To, From , DateSent } = processEvent(event);

    // create twilio client using account Sid and auth token
    var twilioClient = await getClient(ACCOUNT_SID, AUTH_TOKEN);

    // make the request to twilio passing in any queryString parameters, then format and return the response
    return formatResponse(serialize(await processListHistoryRequest(twilioClient, { limit, To, From , DateSent})));
  } catch (e){

    // an error has occured. Log the error
    console.log(e);

    // format and return the error
    return formatError(e);
  }
};

module.exports = { handler, processEvent };
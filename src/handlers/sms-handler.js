'use strict';
const { getClient, serialize, formatError, formatResponse } = require("../helpers");
const { translateString } = require("../translation");

/**
 * 
 * Validates and extracts the required headers and parameters from the incoming event.
 * 
 * @param { object } event Event object.
 */
const processEvent = (event) => {
  var { ACCOUNT_SID, AUTH_TOKEN, account_sid, auth_token } = event.headers;
  var body;
  try {
    body = JSON.parse(event.body);
  } catch (e){
    console.log("Unable to parse JSON body", e);
    body = event.body;
  }
  const { From, To, MessageBody, TargetLanguageCode } = body;
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
  if (!From){
    throw({ code: 400, message: 'missing From number'});
  }
  if (!To){
    throw({ code: 400, message: 'missing To number'});
  }
  if (!MessageBody){
    throw({ code: 400, message: 'missing message body'});
  }
  return { ACCOUNT_SID, AUTH_TOKEN, From, To, MessageBody, TargetLanguageCode };
}

 /**
  * 
  * Issues request to send outbound SMS via Twilio's SMS API.
  * 
  * @param { Twilio Client } client A valid Twilio Client.
  * @param { object } requestParams Request parameters as per Twilio's SMS API standard.
  */
const processSMSRequest = (client, requestParams) => {
  return client.messages.create(requestParams)
  .then((response) => {
    return response;
  })
  .catch((e) => {
    throw({ code: 500, message: e.message });
  })
}

const handler = async (event) => {
  try {
    //extract details from event
    var { ACCOUNT_SID, AUTH_TOKEN, From, To, MessageBody, TargetLanguageCode } = processEvent(event);

    // create twilio client using account Sid and auth token
    var twilioClient = await getClient(ACCOUNT_SID, AUTH_TOKEN);

    // construct the SMS request parameters, only translating the MessageBody if the target language is specified and is not english
    var requestParams = {
      from: From,
      to: To,
      body: (!TargetLanguageCode || TargetLanguageCode === 'en') ? MessageBody : await translateString({ TargetLanguageCode: TargetLanguageCode, Text: MessageBody })
    };

    // make the request to twilio passing in the parameters, then format and return the response
    return formatResponse(serialize(await processSMSRequest(twilioClient, requestParams)));
  } catch (e){

    // an error has occured. Log the error
    console.log(e);

    // format and return the error
    return formatError(e);
  }
};

module.exports = { handler, processEvent };
'use strict';
var AWS = require("aws-sdk");
AWS.config.region = process.env.REGION ? process.env.REGION : 'ap-southeast-2';
var translate = new AWS.Translate({ REGION: process.env.REGION ? process.env.REGION : 'ap-southeast-2' });

 /**
  * 
  * Retrieves a translated string using AWS Translate.
  * Will use AWS Comprehend to detect the dominant language of the provided Text and use that as the Source if the SourceLanguageCode is not specified.
  * 
  * @param { object } params Request parameters including the TargetLanguageCode and Text to be translated.
  */
const translateString = (requestParams) => {
  requestParams.SourceLanguageCode = 'auto';
  return translate.translateText(requestParams).promise()
  .then((data) => {
    return data.TranslatedText;
  })
  .catch((e) => {
    throw({ code: 500, message: e.message });
  })
  
}

module.exports = { translateString };
const twilioAccountSid = "YOUR_ACCOUNT_SID";
const twilioAuthToken = "YOUR_AUTH_TOKEN";
const availableTwilioPhoneNumber = "A_NUMBER_IN_YOUR_ACCOUNT"; // used to test outbound SMS.
const smsEndpoint = "ANY_SMS_CAPABLE_NUMBER"; // used to test outbound SMS. If you have a trial Twilio account, this number will need to already be verified.

module.exports = { twilioAccountSid, twilioAuthToken, availableTwilioPhoneNumber, smsEndpoint };
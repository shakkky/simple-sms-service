Simple Twilio REST API with real-time language translation support using Serverless Framework
==================================================================

## Introduction
This simple API service is used as proxy service to [Twilio's SMS API](https://www.twilio.com/docs/sms/api) over multiple Twilio instances, and supports real-time language translation using [AWS Translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html).

This repository deploys an [AWS API Gateway](https://aws.amazon.com/api-gateway/) endpoint with the following services:
```
1. POST - /sms
```
```
2. GET - /numbers
```
```
3. GET - /history
```

## Getting Started
### Credentials
All requests to the service need to be authenticated with a set of valid Twilio Credentials. These are the account Sid and auth token. 
The account SID and auth token are the master keys to your account. They can found on your [Twilio Account Dashboard](https://www.twilio.com/console).

Once you have these handy, keep them around! These will need to be attached to the header of any request made to the service, like so:

```
curl --request GET -H "ACCOUNT_SID: {YOUR ACCOUNT SID}" -H "AUTH_TOKEN: {YOUR AUTH TOKEN}" https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/numbers
```

## Testing
This repository comes with 5 Jest Test Suites divided up between each endpoint, the library of helper functions and the AWS Translation service for a total of 33 test cases. The Lambda functions can also be tested by running them locally with the use of serverless framework's invoke local command. If you'd like to run these tests yourself, follow the following steps for the method you'd like to use.

### Jest tests

In order to run the tests, Jest will make requests to your Twilio instance.

**Setup**: Navigate to variables.js and update it with your Twilio credentials like so:

```javascript
const twilioAccountSid = "YOUR_ACCOUNT_SID";
const twilioAuthToken = "YOUR_AUTH_TOKEN";
const availableTwilioPhoneNumber = "A_NUMBER_IN_YOUR_ACCOUNT"; // used to test outbound SMS.
const smsEndpoint = "ANY_SMS_CAPABLE_NUMBER"; // used to test outbound SMS. If you have a trial Twilio account, this number will need to already be verified.
```

**Note**: These credentials will **only** ever be used to execute tests.

**Run**: Jest tests can be executed locally by running the following command:
```
npm run test
```

**Note**: Some logging messages will be displayed as part of negative tests.

Passed tests:
```
 PASS  __tests__/sms.spec.js (5.281 s)
  Helper functions work
    ✓ processEvent works with correct args and headers (31 ms)
    ✓ processEvent throws error when invoked without Account SID header (2 ms)
    ✓ processEvent throws error when invoked with incorrect Account SID format (2 ms)
    ✓ processEvent throws error when invoked without Auth Token header (2 ms)
    ✓ processEvent throws error when invoked without arg - from (2 ms)
    ✓ processEvent throws error when invoked without arg - to (1 ms)
    ✓ processEvent throws error when invoked without arg - messageBody (6 ms)
  POST /sms success
    ✓ should respond with a 200 statusCode when invoked with the correct args (3592 ms)
    ✓ should respond with a 200 statusCode when invoked with the correct args + real-time translation (1 ms)
    ✓ should respond with a 400 statusCode when invoked with missing headers
    ✓ should respond with a 400 statusCode when invoked with missing args

 PASS  __tests__/translation.spec.js
  translateString tests
    ✓ translateString works with correct args - es (301 ms)
    ✓ translateString throws error when invoked with incorrect args (140 ms)

 PASS  __tests__/helpers.spec.js
  getClient tests
    ✓ getClient works with correct args
    ✓ getClient throws error when invoked with incorrect Twilio Credentials (1 ms)
  translateObjectIntStrings tests
    ✓ translateObjectIntStrings works with valid JSON input and no translation required
    ✓ translateObjectIntStrings works with valid JSON input and translation required

 PASS  __tests__/numbers.spec.js (7.336 s)
  Helper functions work
    ✓ processEvent works with correct headers and queryString parameters (2 ms)
    ✓ processEvent works with correct headers and no queryString parameters
    ✓ processEvent throws error when invoked without Account SID header
    ✓ processEvent throws error when invoked with incorrect Account SID format (1 ms)
    ✓ processEvent throws error when invoked without Auth Token header (4 ms)
  GET /numbers
    ✓ should respond with a 200 statusCode when invoked with the correct args (3600 ms)
    ✓ should respond with a 200 statusCode when invoked with the correct args and a queryString parameter (2065 ms)
    ✓ should respond with a 400 statusCode when invoked with missing headers (20 ms)

 PASS  __tests__/history.spec.js (7.765 s)
  Helper functions work
    ✓ processEvent works with correct headers and queryString parameters (2 ms)
    ✓ processEvent works with correct headers and no queryString parameters
    ✓ processEvent throws error when invoked without Account SID header
    ✓ processEvent throws error when invoked with incorrect Account SID format (1 ms)
    ✓ processEvent throws error when invoked without Auth Token header
  GET /history
    ✓ should respond with a 200 statusCode when invoked with the correct args (3986 ms)
    ✓ should respond with a 200 statusCode when invoked with the correct args and a queryString parameter (2206 ms)
    ✓ should respond with a 400 statusCode when invoked with missing headers (20 ms)

Test Suites: 5 passed, 5 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        8.198 s, estimated 9 s
Ran all test suites.
```

### Serverless invoke local
Run your tests by sending dummy payloads to the lambda functions directly.

**Setup**: Add your Twilio credentials to headers in each dummy request.
Navigate to the payloads folder and update each sample request schema with your credentials like so:
```json
{
    "resource": "/",
    "path": "/",
    "httpMethod": "GET",
    "headers": {
      "ACCOUNT_SID": "ACXXXXXXXXXXXXXXX", // <-- your account Sid goes here
      "AUTH_TOKEN": "YYYYYYYYYYYYYYYY"    // <-- your auth token goes here
    },
    "queryStringParameters": {
        "foo": "bar"
    },
    "pathParameters": {
        "foo": "bar"
    }
}
```

**Run**: The Lambdas functions can now be executed locally by running the following command:
```
sls invoke local --f functionName --p pathName
```

Working example to list phone numbers:
```
sls invoke local --f numbers-handler --p ./payloads/numbers/get-event.json
```

More details on the sls invoke local command can be found [here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/).

## Deployment
Deployment is handled entirely by serverless framework. Once you have following the standard serverless [setup procedure](https://www.serverless.com/framework/docs/providers/aws/guide/installation/) and have [configured aws-cli](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/), you're ready to deploy the services in your own AWS environment.

Deploy the stack by issuing this command:
```
sls deploy -v
```

The expected output will be:
```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service simple-sms-service.zip file to S3 (5.46 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
CloudFormation - UPDATE_IN_PROGRESS - AWS::CloudFormation::Stack - simple-sms-service-dev
CloudFormation - UPDATE_IN_PROGRESS - AWS::Lambda::Function - NumbersDashhandlerLambdaFunction
CloudFormation - UPDATE_IN_PROGRESS - AWS::Lambda::Function - SmsDashhandlerLambdaFunction
CloudFormation - UPDATE_IN_PROGRESS - AWS::Lambda::Function - HistoryDashhandlerLambdaFunction
CloudFormation - UPDATE_COMPLETE - AWS::Lambda::Function - NumbersDashhandlerLambdaFunction
CloudFormation - UPDATE_COMPLETE - AWS::Lambda::Function - HistoryDashhandlerLambdaFunction
CloudFormation - UPDATE_COMPLETE - AWS::Lambda::Function - SmsDashhandlerLambdaFunction
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - NumbersDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - HistoryDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - SmsDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - NumbersDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - SmsDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::Lambda::Version - HistoryDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - NumbersDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - SmsDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_COMPLETE - AWS::Lambda::Version - HistoryDashhandlerLambdaVersionxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeploymentxxxx
CloudFormation - CREATE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeploymentxxxx
CloudFormation - CREATE_COMPLETE - AWS::ApiGateway::Deployment - ApiGatewayDeploymentxxxx
CloudFormation - UPDATE_COMPLETE_CLEANUP_IN_PROGRESS - AWS::CloudFormation::Stack - simple-sms-service-dev
CloudFormation - DELETE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeploymentxxxx
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - NumbersDashhandlerLambdaVersionxxx
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - SmsDashhandlerLambdaVersionxxxx
CloudFormation - DELETE_SKIPPED - AWS::Lambda::Version - HistoryDashhandlerLambdaVersionxxxx
CloudFormation - DELETE_COMPLETE - AWS::ApiGateway::Deployment - ApiGatewayDeploymentxxxx
CloudFormation - UPDATE_COMPLETE - AWS::CloudFormation::Stack - simple-sms-service-dev
Serverless: Stack update finished...
Service Information
service: simple-sms-service
stage: dev
region: ap-southeast-2
stack: simple-sms-service-dev
resources: 23
api keys:
  None
endpoints:
  POST - https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/sms
  GET - https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/numbers
  GET - https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/history
functions:
  sms-handler: simple-sms-service-dev-sms-handler
  numbers-handler: simple-sms-service-dev-numbers-handler
  history-handler: simple-sms-service-dev-history-handler
layers:
  None

Stack Outputs
HistoryDashhandlerLambdaFunctionQualifiedArn: arn:aws:lambda:ap-southeast-2:xxxx:function:simple-sms-service-dev-history-handler:11
SmsDashhandlerLambdaFunctionQualifiedArn: arn:aws:lambda:ap-southeast-2:xxxx:function:simple-sms-service-dev-sms-handler:11
NumbersDashhandlerLambdaFunctionQualifiedArn: arn:aws:lambda:ap-southeast-2:xxxx:function:simple-sms-service-dev-numbers-handler:11
ServiceEndpoint: https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev
ServerlessDeploymentBucketName: simple-sms-service-dev-serverlessdeploymentbucket-xxxx

Serverless: Removing old service artifacts from S3...
```

Note: potential sensitive details have been redacted from above snippet.

## Usage
Great! The service is now deployed and ready to use! Use the below information to get a head start.

### Send an SMS
A POST request to this endpoint is made to send an SMS through Twilio. If the optional variable for "TargetLanguageCode" in the JSON body contains a valid AWS Translate language code that is not set to "en" - English, the outbound SMS will be translated into that language. Otherwise, the service will not run the text through AWS Translate.

**Sample payload:**
```
curl --location --request POST 'https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/sms' \
--header 'ACCOUNT_SID: {YOUR ACCOUNT SID}' \                      //REQUIRED
--header 'AUTH_TOKEN: {YOUR AUTH TOKEN}' \                        //REQUIRED
--header 'Content-Type: application/json' \                       //REQUIRED
--data-raw '{
    "From": "{YOUR TWILIO OUTBOUND NUMBER}",                      //REQUIRED
    "To": "{YOUR SMS ENDPOINT}",                                  //REQUIRED
    "MessageBody": "hello from shak'\''s simple sms service!",    //REQUIRED
    "TargetLanguageCode": "es"                                    //OPTIONAL
}'
```

### View incoming numbers
A GET request to this endpoint is made to view the incoming phone numbers claimed by an account. The endpoint supports an optional querystring parameter to specify the limit of numbers to be retrieved.

**Sample payload without limit:**
```
curl --location --request GET 'https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/numbers' \
--header 'ACCOUNT_SID: {YOUR ACCOUNT SID}' \                      //REQUIRED
--header 'AUTH_TOKEN: {YOUR AUTH TOKEN}' \                        //REQUIRED
```

**Sample payload with limit:**
```
curl --location --request GET 'https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/numbers?limit=3' \
--header 'ACCOUNT_SID: {YOUR ACCOUNT SID}' \                      //REQUIRED
--header 'AUTH_TOKEN: {YOUR AUTH TOKEN}' \                        //REQUIRED
```

### View messaging history
A GET request to this endpoint is made to search and retrieve the messages that have been sent with Programmable SMS. The endpoint supports optional querystring parameters to specify filters as per Twilio's standard when making calls to Programmable SMS.

**Sample payload without parameters:**
```
curl --location --request GET 'https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/history' \
--header 'ACCOUNT_SID: {YOUR ACCOUNT SID}' \                      //REQUIRED
--header 'AUTH_TOKEN: {YOUR AUTH TOKEN}' \                        //REQUIRED
```

**Sample payload with parameters:**
```
curl --location --request GET 'https://{YOUR OWN ENDPOINT}.execute-api.ap-southeast-2.amazonaws.com/dev/history?limit=3' \
--header 'ACCOUNT_SID: {YOUR ACCOUNT SID}' \                      //REQUIRED
--header 'AUTH_TOKEN: {YOUR AUTH TOKEN}' \                        //REQUIRED
```

## Plans for the future
In the future, a /email endpoint would be another useful endpoint to add to the stack. Creating an email channel could prove to be useful and potentially built to use AWS SES for delivery.
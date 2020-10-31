// we use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("../app");
const { processEvent } = require("../src/handlers/sms-handler");
const { twilioAccountSid, twilioAuthToken, availableTwilioPhoneNumber, smsEndpoint } = require("../variables");

describe("Helper functions work", () => {
    test("processEvent works with correct args and headers", () => {
        var headers = {
            ACCOUNT_SID: twilioAccountSid,
            AUTH_TOKEN: twilioAuthToken
        };
        const body = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect(processEvent({ headers : headers, body: body })).toMatchObject({ ...headers, ...body });
      });

      test("processEvent throws error when invoked without Account SID header", () => {
        const headers = {
            AUTH_TOKEN: twilioAuthToken
        }
        const body = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect.assertions(1);
        try {
            processEvent({ headers : headers, body: body });
        } catch (e) {
          expect(e).toEqual({ "code": 400, "message": "missing Account SID" });
        }
      });

      test("processEvent throws error when invoked with incorrect Account SID format", () => {
        const headers = {
            ACCOUNT_SID: "BCac628284nfsl63aa4c0c96531",
            AUTH_TOKEN: twilioAuthToken
        }
        const body = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect.assertions(1);
        try {
            processEvent({ headers : headers, body: body });
        } catch (e) {
          expect(e).toEqual({ "code": 400, "message": "accountSid must start with AC" });
        }
      });

      test("processEvent throws error when invoked without Auth Token header", () => {
        const headers = {
            ACCOUNT_SID: twilioAccountSid
        };
        const body = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect.assertions(1);
        try {
            processEvent({ headers : headers, body: body });
        } catch (e) {
          expect(e).toEqual({ "code": 400, "message": "missing Auth Token" });
        }
      });

      test("processEvent throws error when invoked without arg - from", () => {
        var headers = {
            ACCOUNT_SID: twilioAccountSid,
            AUTH_TOKEN: twilioAuthToken
        };
        const body = {
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect.assertions(1);
        try {
            processEvent({ headers : headers, body: body });
        } catch (e) {
          expect(e).toEqual({ "code": 400, "message": "missing From number" });
        }
      });

      test("processEvent throws error when invoked without arg - to", () => {
        var headers = {
            ACCOUNT_SID: twilioAccountSid,
            AUTH_TOKEN: twilioAuthToken
        };
        const body = {
            From: availableTwilioPhoneNumber,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect.assertions(1);
        try {
            processEvent({ headers : headers, body: body });
        } catch (e) {
          expect(e).toEqual({ "code": 400, "message": "missing To number" });
        }
      });

      test("processEvent throws error when invoked without arg - messageBody", () => {
        var headers = {
            ACCOUNT_SID: twilioAccountSid,
            AUTH_TOKEN: twilioAuthToken
        };
        const body = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
        };
        expect.assertions(1);
        try {
            processEvent({ headers : headers, body: body });
        } catch (e) {
          expect(e).toEqual({ "code": 400, "message": "missing message body" });
        }
      });
});

describe("POST /sms success", () => {
    test("should respond with a 200 statusCode when invoked with the correct args", async () => {
        const postBody = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        const res = await request(app)
                        .post("/sms")
                        .set({ "content-type": "application/json" })
                        .set({ "ACCOUNT_SID": twilioAccountSid, "AUTH_TOKEN": twilioAuthToken })
                        .send(postBody)
        expect(res.statusCode).toEqual(200);
    });

    test("should respond with a 200 statusCode when invoked with the correct args + real-time translation", () => {
        const postBody = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!",
            TargetLanguageCode: "es"
        };
        expect( async () => {
            await request(app)
                .post("/sms")
                .set({ "content-type": "application/json" })
                .set({ "ACCOUNT_SID": twilioAccountSid, "AUTH_TOKEN": twilioAuthToken })
                .send(JSON.stringify(postBody)).statusCode.toBe(200);
        });
    });

    test("should respond with a 400 statusCode when invoked with missing headers", () => {
        const postBody = {
            From: availableTwilioPhoneNumber,
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect( async () => {
            await request(app)
                .post("/sms")
                .set({ "content-type": "application/json" })
                .send(JSON.stringify(postBody)).statusCode.toBe(400);
        });
    });

    test("should respond with a 400 statusCode when invoked with missing args", () => {
        const postBody = {
            To: smsEndpoint,
            MessageBody: "hello from shak's simple sms service!"
        };
        expect( async () => {
            await request(app)
                .post("/sms")
                .set({ "content-type": "application/json" })
                .set({ "ACCOUNT_SID": twilioAccountSid, "AUTH_TOKEN": twilioAuthToken })
                .send(JSON.stringify(postBody)).statusCode.toBe(400);
        });
    });
});
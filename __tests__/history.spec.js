// we use supertest to test HTTP requests/responses
const request = require("supertest");
const app = require("../app");
const { processEvent } = require("../src/handlers/history-handler");
const { twilioAccountSid, twilioAuthToken } = require("../variables");

describe("Helper functions work", () => {
    test("processEvent works with correct headers and queryString parameters", () => {
        var headers = {
            ACCOUNT_SID: twilioAccountSid,
            AUTH_TOKEN: twilioAuthToken
        };
        const queryStringParameters = {
            limit: "3"
        };
        expect(processEvent({ headers : headers, queryStringParameters: queryStringParameters })).toMatchObject({ ...headers, ...{ limit: 3 } });
    });

    test("processEvent works with correct headers and no queryString parameters", () => {
        var headers = {
            ACCOUNT_SID: twilioAccountSid,
            AUTH_TOKEN: twilioAuthToken
        };
        const queryStringParameters = null;
        expect(processEvent({ headers : headers, queryStringParameters: queryStringParameters })).toMatchObject({ ...headers, ...queryStringParameters });
      });

      test("processEvent throws error when invoked without Account SID header", () => {
        var headers = {
            AUTH_TOKEN: twilioAuthToken
        };
        const queryStringParameters = null;
        expect.assertions(1);
        try {
            processEvent({ headers : headers, queryStringParameters: queryStringParameters });
        } catch (e) {
          expect(e).toEqual({ code: 400, message: 'missing Account SID'});
        }
      });

      test("processEvent throws error when invoked with incorrect Account SID format", () => {
        const headers = {
            ACCOUNT_SID: "BCac628284nfsl63aa4c0c96531",
            AUTH_TOKEN: twilioAuthToken
        };
        const queryStringParameters = null;
        expect.assertions(1);
        try {
            processEvent({ headers : headers, queryStringParameters: queryStringParameters });
        } catch (e) {
          expect(e).toEqual({ code: 400, message: 'accountSid must start with AC'});
        }
      });

      test("processEvent throws error when invoked without Auth Token header", () => {
        const headers = {
            ACCOUNT_SID: twilioAccountSid
        };
        const queryStringParameters = null;
        expect.assertions(1);
        try {
            processEvent({ headers : headers, queryStringParameters: queryStringParameters });
        } catch (e) {
          expect(e).toEqual({ code: 400, message: 'missing Auth Token'});
        }
      });
});

describe("GET /history", () => {
    test("should respond with a 200 statusCode when invoked with the correct args", async () => {
        const res = await request(app)
                        .get("/history")
                        .set({ "ACCOUNT_SID": twilioAccountSid, "AUTH_TOKEN": twilioAuthToken })
        expect(res.statusCode).toEqual(200);
    });
    
    test("should respond with a 200 statusCode when invoked with the correct args and a queryString parameter", async () => {
        const res = await request(app)
                        .get("/history?limit=3")
                        .set({ "ACCOUNT_SID": twilioAccountSid, "AUTH_TOKEN": twilioAuthToken })
        expect(res.statusCode).toEqual(200);
    });

    test("should respond with a 400 statusCode when invoked with missing headers", async () => {
        const res = await request(app)
                        .get("/history");
        expect(res.statusCode).toEqual(400);
    });
});
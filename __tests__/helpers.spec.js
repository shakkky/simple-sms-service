const { getClient, translateObjectIntStrings  } = require("../src/helpers");

describe("getClient tests", () => {
    test("getClient works with correct args", () => {
        var ACCOUNT_SID = "AC1a15dec2a255e9fc31e6e24755fb6a79";
        var AUTH_TOKEN = "83b902e7343e35e932687b75fc2ba8a9";
        expect( async () => {
            await getClient(ACCOUNT_SID, AUTH_TOKEN).not.toThrow("Unable to make requests with the provided Twilio credentials. Please check the credentials and try again.");
        });
      });

      test("getClient throws error when invoked with incorrect Twilio Credentials", () => {
        var ACCOUNT_SID = "AC1a15dec2a255e9fc31e6e24755fb6a79";
        var AUTH_TOKEN = "93b902e7343e35e932687b75fc2ba8a9";
        expect( async () => {
          await getClient(ACCOUNT_SID, AUTH_TOKEN).toThrow("Unable to make requests with the provided Twilio credentials. Please check the credentials and try again");
        });
      });
});

describe("translateObjectIntStrings tests", () => {
  test("translateObjectIntStrings works with valid JSON input and no translation required", () => {
    const input = {
      foo: 'bar'
    };
    expect(translateObjectIntStrings(input)).toMatchObject(input);
  });

  test("translateObjectIntStrings works with valid JSON input and translation required", () => {
    const input = {
      foo: '1'
    };
    expect(translateObjectIntStrings(input)).toMatchObject({ foo: 1 });
  });

  // test("translateObjectIntStrings throws with invalid JSON input", () => {
  //   const input = 1;
  //   expect(translateObjectIntStrings(input)).toMatchObject({ foo: 1 });
  // });
});
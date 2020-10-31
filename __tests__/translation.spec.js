const { translateString } = require("../src/translation");

describe("translateString tests", () => {
    test("translateString works with correct args - es", async () => {
        const payload = {
            TargetLanguageCode: 'es',
            Text: 'hello'
        };
        expect(await translateString(payload)).toEqual("hola");
      });

      test("translateString throws error when invoked with incorrect args", async () => {
        const payload = {
            TargetLanguageCode: 'fail',
            Text: 'hello'
        };
        expect.assertions(1);
        try {
          await translateString(payload);
        } catch (e) {
          expect(e).toEqual({ code: 500, message: "Unsupported language pair: en to fail. Target language 'fail' is not supported" });
        }
      });
});
const request = require("supertest");
const app = require("./app");

describe("Test the Express server", () => {
  it("Should include CORS header in response", done => {
    request(app)
      .get("/api/healthcheck")
      .then(response => {
        const headers = response.headers;
        const corsHeader = headers["access-control-allow-origin"];
        expect(corsHeader).toBeDefined();
        expect(corsHeader).toBe("*");
        done();
      });
  });
});
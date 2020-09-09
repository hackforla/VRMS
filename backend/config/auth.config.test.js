const { expectCt } = require("helmet");

test("Environment variables are working as expected", () => {
  const backendUrl = process.env.REACT_APP_PROXY;
  expect(backendUrl === `http://localhost:${process.env.BACKEND_PORT}`);
});

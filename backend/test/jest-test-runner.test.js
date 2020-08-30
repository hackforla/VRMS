// Jest Test Runner Test - This file shows that we can test our test runner.

test("The testing environment is working", () => {
  const test_env_var = process.env.NODE_ENV;
  expect(test_env_var).toBe("test");
});

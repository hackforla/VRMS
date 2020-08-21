test("The testing environment is working", () => {
  const test_env_var = process.env.NODE_ENV;
  expect(test_env_var).toBe("test");
});

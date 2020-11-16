test.skip('Environment variables are working as expected', () => {
  const backendUrl = process.env.REACT_APP_PROXY;
  expect(backendUrl).toEqual(`http://localhost:${process.env.BACKEND_PORT}`);
});

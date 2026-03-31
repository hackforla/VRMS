const FeatureFlagsController = require('./featureFlags.controller');

test('can get feature flags', async () => {
  const req = {
    headers: { 'x-customrequired-header': 'secret-header' },
    userId: 'user-1',
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await FeatureFlagsController.index(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});

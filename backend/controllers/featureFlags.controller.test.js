const FeatureFlagsController = require('./featureFlags.controller');

const { getAllFlags } = require('../services/featureFlags.service');

jest.mock('../services/featureFlags.service.js');

describe('FeatureFlagsController.index', () => {
  let req, res;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      headers: { 'x-customrequired-header': process.env.CUSTOM_REQUEST_HEADER },
      userId: 'user-1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  test('can get feature flags', async () => {
    await FeatureFlagsController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should return 400 when getAllFlags throws an error', async () => {
    getAllFlags.mockRejectedValue(new Error('error'));

    await FeatureFlagsController.index(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });
});

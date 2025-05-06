module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  watchPathIgnorePatterns: ['globalConfig'],
  testPathIgnorePatterns: ['/test/old-tests/'],
};

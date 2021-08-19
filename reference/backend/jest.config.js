module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['./jest.setup.js'],
  watchPathIgnorePatterns: ['globalConfig'],
};

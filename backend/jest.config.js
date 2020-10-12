module.exports = {
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  setupFilesAfterEnv: ['./jest.setup.js']
};

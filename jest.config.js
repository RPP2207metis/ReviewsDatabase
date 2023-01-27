module.exports = {
  preset: '@shelf/jest-mongodb',
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/models/**/*.js",
    "<rootDir>/routes/**/*.js",
    "server.js",
    "!<rootDir>/node_modules/"],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      lines: 100,
      statements: 100
    }
  },
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  verbose: true
};

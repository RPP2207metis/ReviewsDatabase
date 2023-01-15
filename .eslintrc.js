module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ['jest'],
  extends: 'standard',
  overrides: [
    {
      files: ["*.test.js", "*.spec.js"],
      plugins: ["jest"],
      env: {
        jest: true
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ["mockData.js"],
  rules: {
    semi: [2, "always"],
    quotes: "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
};

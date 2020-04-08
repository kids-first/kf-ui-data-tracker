module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/?!(@amplitude/react-amplitude/src/lib)',
  ],
  setupFiles: ['./__setups__/localStorage.js', './__setups__/date.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/cypress/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
};

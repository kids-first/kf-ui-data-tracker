module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(kf-uikit)/)'],
  setupFiles: ['./__setups__/localStorage.js'],
};

module.exports = config => {
  require('react-app-rewire-postcss')(config, {
    plugins: loader => [
      require('postcss-import-ext-glob'),
      require('postcss-import'),
      require('postcss-for'),
      require('postcss-extend-rule'),
      require('postcss-nested'),
    ],
  });

  return config;
};

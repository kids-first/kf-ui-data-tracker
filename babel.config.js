module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-modules-commonjs',
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/transform-runtime',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },
};

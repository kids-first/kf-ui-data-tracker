const {
    addAfterLoader,
    removeLoaders,
    loaderByName,
    getLoaders,
    throwUnexpectedConfigError,
} = require('@craco/craco');

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    webpack: {
        configure: (webpackConfig, {paths}) => {
            const {hasFoundAny, matches} = getLoaders(
                webpackConfig,
                loaderByName('babel-loader'),
            );
            if (!hasFoundAny) throwError('failed to find babel-loader');

            console.log('removing babel-loader');
            const {hasRemovedAny, removedCount} = removeLoaders(
                webpackConfig,
                loaderByName('babel-loader'),
            );
            if (!hasRemovedAny) throwError('no babel-loader to remove');
            if (removedCount !== 2)
                throwError('had expected to remove 2 babel loader instances');

            const tsLoader = {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: paths.appSrc,
                loader: require.resolve('ts-loader'),
                options: {transpileOnly: true},
            };

            const {isAdded: tsLoaderIsAdded} = addAfterLoader(
                webpackConfig,
                loaderByName('url-loader'),
                tsLoader,
            );
            if (!tsLoaderIsAdded) throwError('failed to add ts-loader');
            console.log('added ts-loader');

            console.log('adding non-application JS babel-loader back');
            const {isAdded: babelLoaderIsAdded} = addAfterLoader(
                webpackConfig,
                loaderByName('ts-loader'),
                matches[1].loader, // babel-loader
            );
            if (!babelLoaderIsAdded)
                throwError(
                    'failed to add back babel-loader for non-application JS',
                );
            return webpackConfig;
        },
    },
};

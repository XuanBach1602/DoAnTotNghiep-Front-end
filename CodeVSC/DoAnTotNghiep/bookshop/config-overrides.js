module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/node_modules\/@antv\/util/], // Broader exclusion pattern to cover all paths
    });
    return config;
};

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['thread-loader','babel-loader'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(), 
    ],
    output: { 
        filename: '[name].js',
        chunkFilename: '[name].js',
        devtoolModuleFilenameTemplate:
        'webpack:///[absolute-resource-path]',
    }, 
};
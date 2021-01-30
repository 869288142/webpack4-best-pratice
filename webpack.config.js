const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(), 
        new webpack.NamedChunksPlugin(
            chunk => chunk.name || Array.from(chunk.modulesIterable, m => m.id).join("_")
        ),
    ],
    output: { 
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
    }, 
};
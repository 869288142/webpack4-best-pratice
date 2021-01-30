const baseWebpackConfig = require('./webpack.config')
const { merge } = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
module.exports =   merge(baseWebpackConfig, {
    mode:'production',
    devtool : 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader,"css-loader", "postcss-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
                  "sass-loader",
                ],
            },
        ]
    },
    plugins: [new MiniCssExtractPlugin()],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(),new CssMinimizerPlugin()],
    },
});
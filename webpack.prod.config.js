const baseWebpackConfig = require('./webpack.config')
const { merge } = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
                  {
                    loader: "sass-loader",
                    options: {
                      sassOptions: {
                        fiber: require("fibers"),
                      },
                    },
                  }
                ],
            },
        ]
    },
    plugins: 
    [ 
        new MiniCssExtractPlugin(
            {
                filename: '[name].[contenthash].css',
                chunkFilename: '[name].[contenthash].css'
            }
        ),   
        new webpack.NamedChunksPlugin(
            chunk => chunk.name || Array.from(chunk.modulesIterable, m => m.id).join("_")
        ),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        runtimeChunk: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        }),new CssMinimizerPlugin()],
        hashedModuleIds: true,
    },
    output: { 
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
    }, 
 
});
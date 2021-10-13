const baseWebpackConfig = require('./webpack.config')
process.traceDeprecation = true;
const { merge } = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack')
module.exports =   merge(baseWebpackConfig, {
    mode:'production',
    devtool : 'source-map',
    cache: {
      type: "filesystem",
      // 生产缓存
      name: "prod",
      // webpack依赖更新时，清除缓存
      buildDependencies: {
        config: [__filename],
      },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,                  
                    {
                        loader: "css-loader",
                        options:{
                          importLoaders: 1,
                        } 
                    }, 
                    "postcss-loader"
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  MiniCssExtractPlugin.loader,
                  {
                    loader: "css-loader",
                    options:{
                      importLoaders: 2,
                    } 
                  }, 
                   "postcss-loader",
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
                filename: '[name].[contenthash:8].css',
                chunkFilename: '[name].[contenthash:8].css'
            }
        ),   
    ],
    optimization: {
        runtimeChunk: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        }),new CssMinimizerPlugin()],
    },
    output: { 
        clean: true,
        filename: '[name].[contenthash:8].js',
        chunkFilename: '[name].[contenthash:8].js',
    }, 
 
});
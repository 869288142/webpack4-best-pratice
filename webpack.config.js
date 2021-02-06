const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
var HelloWorldPlugin = require('./plugins/HelloWorldPlugin');
var FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const path = require('path')
module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                    },
                  },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['cache-loader', 'thread-loader','babel-loader'],
            },
            {
                test: /\.svg$/,
                use: [
                    { 
                        loader: 'svg-sprite-loader', 
                        options: {
                            plugins: [
                                // 自动删除svg的标题
                                { removeTitle: true },
                                // 禁止删除无用的Stroked和Fill
                                { removeUselessStrokeAndFill: false },
                            ],
                        } 
                    },
                  'svgo-loader'
                ]
            },
            {
                test: /\.vue$/,
                use: ['cache-loader', 'thread-loader','vue-loader'],
            },
            {
              test: /\.txt$/,
              use: {
                loader: path.resolve(__dirname, './loaders/replace-loader.js'),
                options: {
                  name: 'chenjiang'
                },
              }
            }

        ]
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new HtmlWebpackPlugin(), 
        new VueLoaderPlugin(),
    ],
    output: { 
        filename: '[name].js',
        chunkFilename: '[name].js',
        devtoolModuleFilenameTemplate:
        'webpack:///[absolute-resource-path]',
    }, 
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                  name: `chunk-vendors`,
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  chunks: 'initial'
                },
                common: {
                  name: `chunk-common`,
                  minChunks: 2,
                  priority: -20,
                  chunks: 'initial',
                  reuseExistingChunk: true
                }
              }
        }
    },
    stats: {
      // 只展示输出的文件
      cachedAssets : false,
      // 隐藏具体的模块信息
      modules: false,
      // 关闭子模块输出
      children: false,
      // 关闭webpack本次hash输出
      hash: false,
      // 关闭webpack版本输出
      version: false,
      // 关闭构建完成时间
      builtAt: false,
      // 编译消耗时间
      timings: false,
    }
};
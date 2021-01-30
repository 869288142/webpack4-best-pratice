const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
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

        ]
    },
    plugins: [
        new HtmlWebpackPlugin(), 
        new VueLoaderPlugin()
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
    }
};
const baseWebpackConfig = require('./webpack.config')
const { merge } = require('webpack-merge');
const webpack = require('webpack')
module.exports =   merge(baseWebpackConfig, {
    mode:'development',
    devtool : 'eval-source-map',
    cache: {
      type: "filesystem",
      // 开发缓存
      name: "dev",
      // webpack依赖更新时，清除缓存
      buildDependencies: {
        config: [__filename],
      },
    },
    devServer: {
      static: {
        directory: './dist',
      },
      overlay: {
        warnings: true,
        errors: true
      }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                  "style-loader",
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
                  "style-loader",
                  {
                    loader: "css-loader",
                    options:{
                      importLoaders: 1,
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
});
const baseWebpackConfig = require('./webpack.config')
const { merge } = require('webpack-merge');
module.exports =   merge(baseWebpackConfig, {
    mode:'development',
    devtool : 'eval-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
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
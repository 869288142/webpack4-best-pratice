

目前前端工程化很好，前端工程化在构建方面的核心毫无疑问是webpack，webpack工程师，是每个前端工程师都要有的头衔(狗头保命)，为了学习webpack，笔者看完了webpack中文网又查阅很多webpack的文章和VueCli和CRA脚手架，发掘目前基础webpack配置

## 安装webpack

``` shell
# 安装4最新版本
yarn add webpack@"^4.0.0"
```

## 加上配置文件 webpack.config.js

``` js
module.exports = {
    entry: './src/index.js'
    // 开发模式
    mode:'development',
    // 单独提取source-map，输出后的js更可读
    devtool : 'source-map'
};
```

## 添加运行命令

**package.json**

``` json
{
  "name": "webpack4-best-pratice",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
     // 添加dev命令
    "dev": "webpack"
  },
  "dependencies": {
    "webpack": "^4.0.0"
  }
}
```

## 添加src目录并运行

``` shell
yarn dev
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c75b1e28bd64f6b962c7134a545bfcc~tplv-k3u1fbpfcp-watermark.image)
![](./src/images/firstBundle.png)


##  javascript代码环境降级

**babel通过编译es6到es5实现了开发中使用es6代码部署中又不用考虑浏览器兼容**


### 安装babel

``` shell
# @babel/core babel 转换器核心包
# @babel/preset-env babel转化配置包
# babel-loader baberl的webpack插件
yarn add babel-loader @babel/core @babel/preset-env
```

### 使用webpack编译代码

在src/index.js新增

``` js
const a = 1
```

执行dev命令

``` shell
yarn dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99b831c2e2b144b2bbcae218538d8d6c~tplv-k3u1fbpfcp-watermark.image)
![](./src/images/webpack-compiler.png)


查看输出结果发现我们的const没有被编译成es5，接下来我们来解决这个问题


### 配置babel转译语法

新增`babel.config.js`

``` js
module.exports = {
    // 引入编译选项
    presets: [
        [
            '@babel/preset-env'
        ],
    ],
};
```

### 配置webpack对js文件使用babel编译

``` js
module.exports = {
    // .... 新增module字段
    module: {
        rules: [
          { 
            // 匹配.js文件
            test: /\.js$/,
            // 排除node_modules提升编译效率
            exclude: /(node_modules)/,
            // 使用babel-loader
            use: {
              loader: 'babel-loader',
            }
          }
        ]
    }
    // ...
};
```

### 执行命令验证编译结果

``` shell
yarn dev
```

![](src\images\babel-compiler.png)
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de6619eb4b194253a95dc2b6c6577526~tplv-k3u1fbpfcp-watermark.image)

可以看到我们的const已经被转译成了var

### 缺失的ES6+ API编译

我们在index.js新增

``` js
Promise.resolve(1)
```

执行`yarn dev`

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/816d6e356da0499c8224e61d909fec62~tplv-k3u1fbpfcp-watermark.image)
![](./src/images/babel-api-test.png)

可以看到我们的Promise并没有转译，<span style="color:red">也就会缺少API级别的兼容性</span>

### 配置ES6+ API编译

<span style="color:red">babel将编译分成了2类，一类成为语法编译，一类称为polyfill</span>

**语法：**

``` js
const a = 1
// 编译
var a  =  1
```

**polyfill**

``` js
Promise.resolve(1)
// 通过引入Promise
Promise = require('Promise')
```

也就是我们需要找到一个实现了`Promise`同时符合`ECMAScript`的API实现包，目前推荐的是`core-js`,在babel的配置下是这样的

**babel.config.js**

``` js
module.exports = {
    presets: [
        [
            '@babel/preset-env',{
                // 配置useBuiltIns为entry，防止依赖的第三方库没声明其es6+的API导致我们应用程序出错,不建议usage选项，需要在开发中熟悉第三方包是否使用到ES6+的API
                useBuiltIns: 'entry',
                // 使用corejs3版本，corejs2很早就冻结分支了，例如Array.prototype.flat只在corejs3版本
                corejs: 3
            }
        ],
    ],
};
```

**src/index.js**

``` js
// 引入core-js/stable和regenerator-runtime/runtime，相当于已经废弃的babel-polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const a = 1
Promise.resolve(1)
```

打包结果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17b039a564a04554a55fab209c7aa29a~tplv-k3u1fbpfcp-watermark.image)
![](src/images/babel-polyfill.png)

## css引入支持

在`src/css`下新增`globel.css`,内容如下：

``` css
body {
    background-color: rebeccapurple;
}
```

引入到`src/index.js`中

``` js
import './css/global.css'
```

执行`yarn dev`

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5cb66a1e3804fbf94e2be66f6c03767~tplv-k3u1fbpfcp-watermark.image)
![](src\images\no-css-loader-import.png)

出现报错提示我们可能需要这个文件类型的`loader`，这里需要安装`css-loader`,同时配置`webpack`

``` shell
yarn add css-loader
```

``` js
// 新增css文件处理
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["css-loader"],
            },
        ]
    }
};
```

安装完毕后执行`yarn dev`，发现已经不报错了

## 在src下新增index.html验证输出结果

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
<script src="../dist/main.js"></script>
</html>
```

我们在浏览器打开`index.html`发现样式并没有生效，这个时候我们需要引入`style-loader`,用来实现转换css到浏览器

``` shell
yarn add style-loader
```

**webpack.config.js**

``` js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                // 新增style-loader
                use: ["style-loader","css-loader"],
            },
        ]
    }
};
```

执行`yarn dev`并刷新页面，看到css生效

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9634df2a20e4f9da397d121e22b6c87~tplv-k3u1fbpfcp-watermark.image)
![](src\images\style-loader.png)

## 配置CSS私有前缀编译

在一些特性没有完全实现的时候，浏览器厂商常常会使用前缀允许我们使用，这块可以通过`postcss`帮助我们在编译时完成

### 安装依赖

``` shell
# postcss 用来编译css
# postcss-loader postcss的webpack插件
# postcss-preset-env类似@babel/preset-env,配置编译环境
yarn add  postcss-loader postcss postcss-preset-env
```

### 配置webpack

``` js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                // 新增postcss-loader
                use: ["style-loader","css-loader", "postcss-loader"],
            },
        ]
    }
};
```
### 新增postcss配置文件

postcss.config.js

``` js
module.exports = {
    plugins: [
      [
        "postcss-preset-env",
        {
          // 其他选项
        },
      ],
    ],
};
```

### 新增项目兼容浏览器范围配置

.browserslistrc

``` yaml
last 2 versions
```

### 修改global.css

``` css
body {
    background-color: rebeccapurple;
    /* 新增flex属性 */
    display: flex;
}
```

### 执行编译验证结果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4e4478e1d9741e48e21d305980ee98a~tplv-k3u1fbpfcp-watermark.image)
![](src\images\postCSS.png)

编译后已经输出了flex的浏览器私有前缀

## 配置css预编译语言

这里我们配置sass

### 安装依赖

``` shell
#  sass，sass的编译器，比node-sass兼容性好
# sass-loader sass的webpack插件
yarn add sass  sass-loader
```

### 配置webpack

``` js
module.exports = {
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader",
                ],
              },
        ]
    }
};
```


### 修改文件后缀验证

将src/css/global.css后缀改为scss，同时在index.js引入的后缀也改成css,运行`yarn dev`,打包成功

## 配置svg

目前`svg`比较合适的方法是通过`svg sprite`的方式来使用

### 安装依赖

``` shell
# svgo svg优化
# svgo-loader svgo webpack插件
# svg-sprite-loader svg-sprite插件
yarn add svgo-loader svgo svg-sprite-loader
```

### 配置webpack

webpack.config.js

``` js
module.exports = {
module: {
    rules: [
        {
            test: /\.svg$/,
            use: [
                { loader: 'svg-sprite-loader', options: {
                    
                } },
                'svgo-loader'
            ]
        }

    ]
},
```

### 新增svg目录

新增svg/index.js和svg/assets目录，在里面放入

``` svg
<svg id="图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><title>我的订单</title><path d="M20.23,4h0l16.12,6.37L19.93,16.22h-.11L3.7,9.86,20.15,4h.08m0-2a2.07,2.07,0,0,0-.78.14L.76,8.78a1.1,1.1,0,0,0,0,2.06l18.33,7.25a2.06,2.06,0,0,0,.77.14,2.11,2.11,0,0,0,.78-.14l18.69-6.63a1.11,1.11,0,0,0,0-2.07L21,2.15A2.06,2.06,0,0,0,20.23,2Z"/><path d="M19.79,27.9a3.14,3.14,0,0,1-1.13-.21l-18-7.13a1,1,0,0,1,.74-1.86l18,7.13a1.25,1.25,0,0,0,.83,0l18.51-6.57a1,1,0,1,1,.67,1.89L20.89,27.7A3.19,3.19,0,0,1,19.79,27.9Z"/><path d="M19.79,37.92a3.36,3.36,0,0,1-1.13-.2l-18-7.13a1,1,0,0,1-.56-1.3,1,1,0,0,1,1.3-.56l18,7.12a1.13,1.13,0,0,0,.83,0l18.51-6.56a1,1,0,1,1,.67,1.88l-18.5,6.56A3.19,3.19,0,0,1,19.79,37.92Z"/></svg>
```

``` js
let req = require.context('./assets', false, /\.svg$/);

let requireAll = function (requireContext) {
    requireContext.keys().map(requireContext);
};

requireAll(req);

```

### 运行命令验证效果

`yarn dev`

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bffca7dd7e92421dbed68ad1c8da75a4~tplv-k3u1fbpfcp-watermark.image)
![](src\images\svg.png)

## 支持静态资源

### 安装依赖

``` shell
yarn add file-loader  url-loader
```

### 配置webpack

``` js
module.exports = {
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
        ]
    },
};
```


## 配置Vue环境

### 安装依赖

``` shell
# vue-loader vue-template-compiler vue 用来编译Vue文件
# @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props 支持Vue JSX写法
yarn add vue-loader vue-template-compiler vue  @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
```

### 配置webpack

``` js
module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['cache-loader', 'thread-loader','vue-loader'],
            },

        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
};
```

### 新增文件验证

新增`src/test.vue`,在`index.js`引入

``` js
import testVue from './test.vue'
console.log(testVue);
```

执行`yarn dev`，看到控制台输出结果



## 热更新

### 自动注入依赖和复制html到dist目录

#### 安装依赖

``` shell
yarn add html-webpack-plugin
```

#### 配置webpack

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // 使用HtmlWebpackPlugin
    plugins: [new HtmlWebpackPlugin()]
};
```

### 配置热更新

#### 安装依赖

``` shell
# webpack-dev-server 热更新服务器
# webpack-cli webpack命令包
yarn add webpack-cli webpack-dev-server
```

#### 开启热更新

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // 开启热更新服务器配置
    devServer: {
        contentBase: './dist',
        hot: true,
    },
};
```

### 修改运行命令验证

package.json

``` json
"scripts": {
"dev": "webpack serve"
},
```

运行`yarn dev`

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/483f0939adf4415fa4dee009148b6d36~tplv-k3u1fbpfcp-watermark.image)
![](src\images\hot-load.png)

打开提示地址，查看结果，可以看到我们的代码已经在热更新服务器上运行，此时我们随意修改样式，可以实时生效

## 分离生产和开发环境配置

### 分离配置

**webpack.config.js**

``` js
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
    plugins: [new HtmlWebpackPlugin()]
};
```

**webpack.dev.config.js**

``` js
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
                use: ["style-loader","css-loader", "postcss-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader",
                ],
            },
        ]
    },
});
```


**webpack.prod.config.js**

``` js
const baseWebpackConfig = require('./webpack.config')
const { merge } = require('webpack-merge');
module.exports =   merge(baseWebpackConfig, {
    mode:'production',
    devtool : 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader","css-loader", "postcss-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader",
                ],
            },
        ]
    },
});
```

### 添加开发命令和生产命令

package.json

``` json
"scripts": {
    "dev": "webpack serve --config=./webpack.dev.config.js",
    "build": "webpack --config=./webpack.prod.config.js"
},
```

### 运行命令尝试

```yarn dev```


## 配置压缩

### javascript压缩

#### 安装依赖

``` shell
# 安装4.0最新版本，5版本只支持webpack5
terser-webpack-plugin@"^4.0.0"
```

#### 配置webpack

webpack.prod.config.js

``` js
const TerserPlugin = require("terser-webpack-plugin");
module.exports =   merge(baseWebpackConfig, {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
});
```
#### 执行命令验证

`yarn build`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a0865e30b8a4161a3170649cace7812~tplv-k3u1fbpfcp-watermark.image)
![](src\images\teser.png)


### 分离css到单独文件

#### 安装依赖

``` shell
yarn add mini-css-extract-plugin
```

#### 配置webpack

webpack.prod.config.js

``` js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports =   merge(baseWebpackConfig, {
    module: {
        rules: [
            {
                test: /\.css$/i,
                // 加上loader
                use: [MiniCssExtractPlugin.loader,"css-loader", "postcss-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                // 加上loader
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
                  "sass-loader",
                ],
            },
        ]
    },
    // 加上插件
    plugins: [new MiniCssExtractPlugin()],
});
```

#### 执行命令验证

执行`yarn build`,可以看到我们的`dist`文件下新增了一个`main.css`

### 压缩css

#### 安装依赖

``` shell
yarn add css-minimizer-webpack-plugin
```

#### 配置webpack

webpack.prod.config.js

``` js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
module.exports =   merge(baseWebpackConfig, {
    // 新增CssMinimizerPlugin压缩插件
    minimizer: [new TerserPlugin(),new CssMinimizerPlugin()],
});
```

#### 运行命令验证

```yarn dev```，看到main.css已经被压缩

## 持久化缓存

这里建议阅读[这篇文章](https://segmentfault.com/a/1190000016355127),详细讲述了每个情况下文件缓存名变化的应对方案，最终总结下来的配置如下：

webpack.config.js

``` js
module.exports = {
    output: { 
       filename: '[name].js',
       chunkFilename: '[name].js'
    }, 
};
```

webpack.prod.config.js

``` js
module.exports =   merge(baseWebpackConfig, {
    plugins: 
    [   
        // 稳定css hash
        new MiniCssExtractPlugin(
            {
                filename: '[name].[contenthash:8].css',
                chunkFilename: '[name].[contenthash:8].css'
            }
        ),   
        // 稳定chunk ID
        new webpack.NamedChunksPlugin(
            chunk => chunk.name || Array.from(chunk.modulesIterable, m => m.id).join("_")
        ),
    ],
    // 稳定模块 ID
    optimization: {
        hashedModuleIds: true,
    },
    output: { 
        // 分离chunks 映射关系，避免chunk改动时主js hash变动
        runtimeChunk: true,
        // 稳定文件hash
        filename: '[name].[contenthash:8].js',
        // 稳定chunk hash
        chunkFilename: '[name].[contenthash:8].js'
    }, 
});
```

## 性能优化-速度

### 并发

#### javascript

目前推荐使用官方的`thread-loader`,由于多线程有通信损耗，建议用在消耗大的loader，比如babel-loader

``` shell
yarn add thread-loader
```

webpack.config.js

``` js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                // 为babel添加thread-loader，多进程编译
                use: ['thread-loader','babel-loader']
            },
        ]
    },
};
```

#### sass

官方推荐使用使用`fibers`提升`sass`编译速度

``` shell
yarn add fibers
```

``` js
{
    loader: "sass-loader",
    options: {
        sassOptions: {
            require("fibers"),
        },
    },
},
```

### 缓存

目前推荐使用`cache-loader`

``` shell
yarn add  cache-loader
```

webpack.config.js

``` js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                // 添加cache-loader提高二次编译速度
                use: ['cache-loader', 'thread-loader','babel-loader']
            },
        ]
    },
};
```

## 性能优化 - 体积

### 分包

webpack的默认分包只是分包异步块，我们需要自己调整一下

webpack.config.js

``` js
module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                // node_modules打包在一个文件，提高缓存率
                vendors: {
                  name: `chunk-vendors`,
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  chunks: 'initial'
                },
                // 提取引入超过2次的代码,减少打包体积
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
```

执行`yarn build`可以看到`dist`下增加了一个`chunk-vendors`文件\

## 升级到webpack5

### 升级webpack

``` shell
yarn add webpack
```

### 升级terser-webpack-plugin

``` shell
yarn add terser-webpack-plugin
```

### 移除持久化缓存选项

webpack已经默认支持了moduleID和chunkID的稳定算法，所以这2个插件移除

``` js
module.exports =   merge(baseWebpackConfig, {
    plugins: 
    [ 
        // new webpack.NamedChunksPlugin(
        //     chunk => chunk.name || Array.from(chunk.modulesIterable, m => m.id).join("_")
        // ),
    ],
    optimization: {
        //hashedModuleIds: true,
    },
 
});
```

### 删除cache-loader

webpack5内置了缓存机制，缓存效果和缓存安全性更好,cache-loader可以删除

### 更新html-webpack-plugin

``` shell
yarn add  html-webpack-plugin@next
```

### 废弃file-loader和url-loader

``` js
{
    test: /\.(png|jpg|gif)$/i,
    type: 'asset/resource'
},
// {
//     test: /\.(png|jpg|gif)$/i,
//     use: [
//       {
//         loader: 'url-loader',
//         options: {
//           limit: 8192,
//         },
//       },
//     ],
// },
{
    test: /\.(png|jpg|gif)$/i,
    type: 'asset/inline'
},

// {
//     test: /\.(png|jpe?g|gif)$/i,
//     use: [
//       {
//         loader: 'file-loader',
//       },
//     ],
// },
```

热更新失败


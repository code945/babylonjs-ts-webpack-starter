# how to use it

1. clone the project form github
2. cd to project folder
3. run npm install to install all dependencies

``` bash
git clone https://github.com/code945/babylonjs-ts-webpack-starter.git
cd babylonjs-ts-webpack-starter
npm install
```


# create the starter project from empty step by step
1.init project package confing
``` bash 
npm init -y
```
2.add webpack and typescript for dev dependencies 
``` bash 
npm install webpack webpack-cli webpack-dev-server typescript ts-loader clean-webpack-plugin copy-webpack-plugin html-webpack-plugin mini-css-extract-plugin autoprefixer css-loader imports-loader less less-loader  postcss-loader  style-loader  -D
```   
3.add babylonjs(and loaders) dependencies
``` bash 
npm install babylonjs babylonjs-loaders
```   

4.add typescript config file tsconfig.json
``` json
{
    "compilerOptions": {
      "outDir": "./dist/",
      "sourceMap": true,
      "noImplicitAny": true,
      "module": "commonjs",
      "target": "es5",
      "jsx": "react",
      "allowJs": true,
      "types": [
        "babylonjs", 
        "babylonjs-loaders",
      ],
    }
  }

  ```
  5.add webpack config file webpack.dev.js webpack.prod.js
  ## webpack dev config file

  ``` js
const path = require('path'); 
const Webpack = require('webpack');
// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require('html-webpack-plugin');
// cleans dist folder
const CleanWebpackPlugin = require('clean-webpack-plugin');
// copies the assets folder into dist folder
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const distFolder = './dist';

  module.exports = {
    mode: 'development',
    entry: './src/index.ts', 
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, distFolder), 
    }, 
    devtool: 'inline-source-map',
    plugins: [
      require('autoprefixer'),
      new MiniCssExtractPlugin({
        filename: "css/[name].css"
      }),
      new Webpack.HotModuleReplacementPlugin(), 
      new CleanWebpackPlugin(
        distFolder, 
        //{ root: path.resolve(__dirname, '../')}
      ),  
      new HtmlWebpackPlugin({ 
        title:"babylon webpack ts starter",
        filename: "index.html",
        template: 'src/index.html'
      }),
      new CopyWebpackPlugin([
        { from: 'src/model', to: 'model' },
        { from: 'src/textures', to: 'textures' },
      ])
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?importLoaders=1',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?importLoaders=1',
            'postcss-loader',
            'less-loader'
          ]
        },
        {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            use: "url-loader"
        },
        {
            test:/\.(png|jpg|gif)$/,
            use:[{
                loader:'url-loader',
                options:{ // 这里的options选项参数可以定义多大的图片转换为base64
                    limit:50000, // 表示小于50kb的图片转为base64,大于50kb的是路径
                    outputPath:'images' //定义输出的图片文件夹
                }
            }]
        }

      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js', ".css", ".less" ]
    },
    devServer: {
      contentBase: distFolder, //网站的根目录为 根目录/dist，如果配置不对，会报Cannot GET /错误 
      port: 9000, //端口改为9000
      open:true, // 自动打开浏览器，适合懒人
      hot:true
    }, 
    optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "vendors",
                  chunks: "all"
              }
          }
      }
    },
    externals: {
      "oimo": true,
      "cannon": true,
      "earcut": true
    },
  };

  ```


  ``` js
const path = require('path'); 
const Webpack = require('webpack');
// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require('html-webpack-plugin');
// cleans dist folder
const CleanWebpackPlugin = require('clean-webpack-plugin');
// copies the assets folder into dist folder
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const distFolder = './dist';

  module.exports = {
    mode: 'production',
    entry: './src/index.ts', 
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, distFolder), 
    }, 
    //devtool: 'inline-source-map',
    plugins: [
      require('autoprefixer'),
      new MiniCssExtractPlugin({
        filename: "css/[name].css"
      }),
      new Webpack.HotModuleReplacementPlugin(), 
      new CleanWebpackPlugin(
        distFolder, 
        //{ root: path.resolve(__dirname, '../')}
      ),  
      new HtmlWebpackPlugin({ 
        title:"babylon webpack ts starter",
        filename: "index.html",
        template: 'src/index.html'
      }),
      new CopyWebpackPlugin([
        { from: 'src/model', to: 'model' },
        { from: 'src/textures', to: 'textures' },
      ])
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?importLoaders=1',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader?importLoaders=1',
            'postcss-loader',
            'less-loader'
          ]
        },
        {
            test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
            use: "url-loader"
        },
        {
            test:/\.(png|jpg|gif)$/,
            use:[{
                loader:'url-loader',
                options:{ // 这里的options选项参数可以定义多大的图片转换为base64
                    limit:50000, // 表示小于50kb的图片转为base64,大于50kb的是路径
                    outputPath:'images' //定义输出的图片文件夹
                }
            }]
        }

      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js', ".css", ".less" ]
    },
    devServer: {
      contentBase: distFolder, //网站的根目录为 根目录/dist，如果配置不对，会报Cannot GET /错误 
      port: 9000, //端口改为9000
      open:true, // 自动打开浏览器，适合懒人
      hot:true
    }, 
    optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "vendors",
                  chunks: "all"
              }
          }
      }
    },
    externals: {
      "oimo": true,
      "cannon": true,
      "earcut": true
    },
  };
  ```

add config file for postcss postcss.config.js
``` js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```


6.add script in package.json
``` json
 "scripts": {
    "dev": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
```


7.add a src folder for all source files which looks like:
```bash
--src
    +static
        +images
        +models 
        +textures
    +style
    +scripts
    index.html
    index.ts
```


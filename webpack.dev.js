
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
        { from: 'src/static', to: 'assets' }, 
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
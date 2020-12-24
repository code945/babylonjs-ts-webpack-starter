const path = require("path");
const Webpack = require("webpack");
// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require("html-webpack-plugin");
// cleans dist folder
const CleanWebpackPlugin = require("clean-webpack-plugin");
// copies the assets folder into dist folder
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const distFolder = "../dist";

let entryPoints = {
    index: `./src/index.ts`,
};

let html = [
    new HtmlWebpackPlugin({
        title: "首页",
        filename: `index.html`,
        template: `src/index.html`,
        chunks: ["vendors", "index"],
        minify: {
            removeRedundantAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            collapseBooleanAttributes: true,
        },
    }),
];

module.exports = {
    entry: entryPoints,
    output: {
        filename: "js/[name].[hash:5].js",
        path: path.resolve(__dirname, distFolder),
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        require("autoprefixer"),
        new MiniCssExtractPlugin({
            filename: "css/[hash:5].css",
            options: {
                publicPath: "../../",
            },
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(["dist"], { root: path.resolve(__dirname, "../") }),
        new CopyWebpackPlugin([
            {
                from: "src/static",
                to: "",
            },
        ]),
        ...html,
    ],
    module: {
        rules: [
            { test: /\.(ts|js)x?$/, loader: "babel-loader", exclude: /node_modules/ },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    "css-loader?importLoaders=1",
                    "postcss-loader",
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    "css-loader?importLoaders=1",
                    "postcss-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                use: "file-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "file-loader",
                options: {
                    esModule: false,
                    name: "[name]_[hash:8].[ext]",
                    // publicPath: "assets/images",
                    outputPath: "./images", //定义输出的图片文件夹
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css", ".less"],
    },
    // target: "node",
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    externals: {
        oimo: true,
        cannon: true,
        earcut: true,
    },
};

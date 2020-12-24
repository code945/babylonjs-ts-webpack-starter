const baseConfig = require("./webpack.config");

module.exports = {
    ...baseConfig,
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    devServer: {
        contentBase: "../dist",
        port: 9000,
        open: true,
        hot: true,
    },
};

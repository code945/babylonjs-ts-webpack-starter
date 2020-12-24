const baseConfig = require("./webpack.config");

module.exports = {
    ...baseConfig,
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "../dist",
        port: 9001,
        open: true,
        hot: true,
    },
};

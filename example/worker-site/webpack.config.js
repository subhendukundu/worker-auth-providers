const vitedgeWebpack = require("vitedge/webpack.cjs");

const config = vitedgeWebpack();
config.resolve.mainFields = ["browser", "module", "main"];
module.exports = {
    ...config,
};

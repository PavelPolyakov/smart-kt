const _ = require('lodash');
const argv = require('yargs').argv;

const config = require(`${process.cwd()}/webpack.config`);
const webpack = require('webpack');

module.exports = function () {
    // if the application was launched with the with-hmr flag
    const app = this;
    const appConfig = config(argv.env);
    const compiler = webpack(appConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        stats: { colors: true }
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}
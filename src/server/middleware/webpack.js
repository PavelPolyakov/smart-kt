const argv = require('yargs').argv;
const _ = require('lodash');

const config = require(`${process.cwd()}/webpack.config`);
const webpack = require('webpack');

module.exports = function () {
    // if the application was launched with the with-hmr flag
    if (_.get(argv, 'env.with-hmr')) {
        const app = this;
        const compiler = webpack(config(argv.env));

        app.use(require('webpack-dev-middleware')(compiler, {
            stats: { colors: true }
        }));

        app.use(require('webpack-hot-middleware')(compiler));
    }
}
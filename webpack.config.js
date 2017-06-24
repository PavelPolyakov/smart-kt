const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (env) {
    const appConfig = {
        name: 'app',
        entry: {
            app: ['./src/client/index.js']
        },
        output: {
            filename: 'bundle.js',
            sourceMapFilename: 'bundle.map',
            path: path.resolve(__dirname, 'public')
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [['es2015', { 'modules': false }], 'react'],
                                plugins: ['transform-async-to-generator',
                                    'transform-decorators-legacy',
                                    'transform-runtime',
                                    'react-html-attrs']
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/client/index.html',
                inject: "body"
            }),
            new webpack.DefinePlugin({
                HOST: process.env.NODE_ENV === 'production' ? JSON.stringify('http://smart-kt.pavelpolyakov.com') : JSON.stringify('http://localhost:3030'),
            }),
            new CopyWebpackPlugin([
                { from: 'public/favicon.ico', to: 'favicon.ico' },
                { from: 'public/assets/', to: 'assets' },
                { from: 'node_modules/bootstrap/dist/', to: 'vendor/bootstrap/dist' }
            ]),
            new HtmlWebpackIncludeAssetsPlugin({
                assets: [
                    'vendor/bootstrap/dist/css/bootstrap.css',
                    'assets/font-awesome-4.7.0/css/font-awesome.css'
                ],
                append: false
            }),
            new webpack.NamedModulesPlugin(),
        ],
        resolve: {
            extensions: ['.js', '.jsx']
        },
        devtool: 'inline-source-map'
    };

    if ((env && env['with-hmr'])) {
        _.map([appConfig], record => {
            // for hot HMR only application
            if (record.name === 'app') {
                record.entry[record.name].unshift(...['react-hot-loader/patch', `webpack-hot-middleware/client?reload=true&name=${record.name}`]);

                // add react hot loader only for the app
                _.filter(record.module.rules, record => _.isArray(record.use) && record.use.some(record => record.loader === 'babel-loader'))
                    .map(record => record.use.find(record => record.loader === 'babel-loader').options.plugins.push('react-hot-loader/babel'));

                record.plugins.push(new webpack.HotModuleReplacementPlugin());
            }
        });
    }

    return appConfig;
}
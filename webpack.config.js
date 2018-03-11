// Necessary modules

// File path management
const path = require('path');

// Webpack
const webpack = require('webpack');

// HTML package pluging
const HtmlWebpackPlugin = require('html-webpack-plugin');

// CSS extract pluging
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Environment detect
const isProduction = process.env.MODE == 'production';
let scssLoaders = [];

if (isProduction) {
    scssLoaders = ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?url=false&sourceMap=true', 'sass-loader?sourceMap=true']
    });
} else {
    scssLoaders = ['style-loader', 'css-loader?url=false&sourceMap=true', 'sass-loader?sourceMap=true'];
}


// Webpack config
module.exports = {
    // Entry point: File to build the dependency graph
    entry: ['babel-polyfill', path.join(__dirname, 'src', 'entry.js')],
    // Output: Generated code folder
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: path.join(__dirname, 'node_modules')
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    'file-loader?name=[name].[ext]&useRelativePath=true',
                    'image-webpack-loader'
                ]
            }, {
                test: /assets.[^img]/,
                use: 'file-loader?name=[name].[ext]&useRelativePath=true'
            },
            {
                test: /\.scss$/, // Any file ends with .scss
                use: scssLoaders
            }
        ]
    },
    // Plugings
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            minify: {
                collapseWhitespace: true
            }
        }),
        new ExtractTextPlugin('style.css')
    ],
    // Dev server config
    devServer: {
        open: true, // Open default browser
        port: 3000, // Port server
        overlay: true, // Show errors
        hot: true,
        contentBase: [path.join(__dirname, 'src'), path.join(__dirname, 'src/includes')],
        watchContentBase: true
    }
};
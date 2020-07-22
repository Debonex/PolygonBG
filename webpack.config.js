const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: __dirname + '/src/polybg.js',
    output: {
        path: __dirname + '/dist',
        filename: 'polypg.min.js',
        library: 'polybg',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },
    devServer: {
        hot: true,
        port: '8081'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'polygon background test page',
            template: __dirname + '/test/test.tmpl.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    },
}
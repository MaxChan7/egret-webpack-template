const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { copyLibs, devCopyLibs } = require('./libs');
const setting = JSON.parse(fs.readFileSync('./build/setting.json'));

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: path.resolve(__dirname, '../src/Main')
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', 'json' ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  devServer: {
    hot: true,
    clientLogLevel: 'error',
    host: '0.0.0.0'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: '../dist/index.html',
      template: 'src/index.html',
      inject: 'head',
      templateParameters: {
        isPrd: false,
        favicon: 'src/favicon.ico',
        setting,
        libs: copyLibs,
      },
    }),
    new CopyWebpackPlugin([{from: 'src/resource', to: 'resource'}].concat(devCopyLibs))
  ]
}
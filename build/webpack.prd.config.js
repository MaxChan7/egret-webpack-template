const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { copyLibs, prodMergeLibs } = require('./libs');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const setting = JSON.parse(fs.readFileSync('./build/setting.json'));

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, '../src/Main')
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].js?[contenthash:10]',
    chunkFilename: '[name].js?[contenthash:10]'
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: '../dist/index.html',
      template: 'src/index.html',
      inject: 'head',
      templateParameters: {
        isPrd: true,
        favicon: 'src/favicon.ico',
        setting,
        libs: copyLibs,
      },
    }),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    new MergeIntoSingleFilePlugin({
      files: {'vendor.js': prodMergeLibs }
    })
  ]
}
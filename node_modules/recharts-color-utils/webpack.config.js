'use strict'

var webpack = require('webpack');

module.exports = {
  entry: ['./index.js'],
  output: {
    path: __dirname + '/build/',
    filename: 'recharts-color-utils.js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        query: {
          presets:['es2015']
        }
      }
    ]
  }
};

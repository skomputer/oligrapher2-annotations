var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');

var config = {
  entry: [
    path.resolve(__dirname, 'app/main.jsx'),
  ],
  output: {
    path: 'build',
    filename: '/oligrapher.annotations.min.js',
    library: 'OligrapherAnnotations',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": { 'NODE_ENV': JSON.stringify('production') } })
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: /node_modules\/(?!oligrapher)/i,
        loader: 'babel-loader' },
      { test: /\.css$/, 
        loader: "style-loader!css-loader" },
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=30000' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};


module.exports = config;

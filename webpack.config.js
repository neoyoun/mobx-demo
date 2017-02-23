let path = require('path');
let srcPath = path.resolve(__dirname,'./src');
let webpack = require('webpack');
let BowerWebpackPlugin = require('bower-webpack-plugin');
//let bootstrapLoader = require('bootstrap-loader')
wepackConfig = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias:{
      'components':`${srcPath}/components`,
      'actions':`${srcPath}/actions`,
      'datas':`${srcPath}/datas`,
      'imgs':`${srcPath}/imgs`
    }
  },
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.css$/,
      loaders: ['style','css'],
    },
    {
      test: /\.s(a|c)ss$/,
      loaders: ['style','css','sass?outputStyle=expanded'],
    },
    {
      test: /\.json$/,
      loaders: ['json'],
    },
    {
        test: /\.(png|jpg|gif|)$/,
        loader: 'url-loader?limit=8192'
    },
    ]
  }
};

module.exports = wepackConfig
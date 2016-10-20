'use strict';
let path = require('path');
let srcPath = path.resolve(__dirname,'./src');
let srcPath2 = path.resolve(__dirname,'./src2');
let webpack = require('webpack');
let BowerWebpackPlugin = require('bower-webpack-plugin');
module.exports = {
	entry: ['webpack-dev-server/client?http://127.0.0.1:8080',
    'webpack/hot/only-dev-server',
	 './index.js'],
	output: {
		filename: 'main.js',
		path: './dev/js',
		publicPath:'/'
	},
	cache: true,
  devtool: 'eval-source-map',
	devServer: {
		inline: true,
		contentBase: './src/',
		/*proxy: {
			'./api': {
				target: 'http://xaljbbs.com/src/api',
				host: 'xaljbbs.com',
				port:80,
				secure: false
			}
		}*/
	},
	resolve:{
		extentsions:['','.js','.jsx'],
		alias:{
			'components':`${srcPath}/components`,
			'actions':`${srcPath}/actions`,
			'datas':`${srcPath}/datas`,
			'imgs':`${srcPath}/imgs`
		}
	},
	module: {
			preloaders: [
				{
					test: /\.(js|jsx)$/,
					include: srcPath,
					loader: 'eslint-loader'
				}
			],
			loaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader?presets[]=es2015&presets=react'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.s(a|c)ss$/,
				loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.(png|jpg|gif|)$/,
				loader: 'url-loader?limit=8192'
			},
			{
	      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	      loader: 'url-loader?limit=10000',
	    },
	    {
	      test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
	      loader: 'file-loader',
	    },
			]
		},
	plugins: [
		new webpack.DefinePlugin({
	    'process.env.NODE_ENV': '"development"'
		}),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
	]	
}
'usr strict';
let webpack = require('webpack');
let path = require('path');
let srcPath = path.resolve(__dirname,'./src');
module.exports = {
	entry: './index.js',
	output: {
		path: '/',
		filename: 'main.js',
	},
	cache: false,
	module: {
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
      'process.env.NODE_ENV': '"production"'
    	}),
			new webpack.optimize.UglifyJsPlugin({
				compress:{
					warnings:false
				}
			}),
	    new webpack.NoErrorsPlugin()
		]
}
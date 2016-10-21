var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var outputPath = path.join(__dirname, 'dist');

module.exports = {
	devtool: 'source-map',
	entry: [
		//'webpack-hot-middleware/client',
		'./index'
	],
	output: {
		path: outputPath,
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		//new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new Clean([outputPath])
	],
	module: {
		loaders: [
			{test: /\.ts$/, loader: 'ts-loader', include: __dirname, exclude: /node_modules/}
		]
	}
};


// When inside Eligo repo, prefer src to compiled version.
// You can safely delete these lines in your project.
var promasterPortablePackageRoot = path.join(__dirname, '..');
var promasterPortableNodeModules = path.join(__dirname, '..', 'node_modules');
var fs = require('fs');
if (fs.existsSync(path.join(promasterPortablePackageRoot, 'package.json')) && fs.existsSync(promasterPortableNodeModules)) {
	console.log("USING SOURCE INSTEAD OF PACKAGE");
	// Resolve promaster-portable to the package root
	Object.assign(module.exports.resolve, {alias: {'promaster-portable': promasterPortablePackageRoot}});
	// Compile promaster-portable from source (using same tsconfig as the example)
	var tsConfig = path.join(__dirname, 'tsconfig.json');
	module.exports.module.loaders = [
		//{test: /\.ts$/, loader: 'ts-loader?configFileName=' + tsConfig, include: promasterPortablePackageRoot, exclude: /node_modules/}
		{test: /\.ts$/, loader: 'ts-loader', include: [promasterPortablePackageRoot], exclude: /node_modules/}
	];
}

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './source/app.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
	extensions:
		['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'game.js',
		path: path.resolve(__dirname, '../build'),
	},
		
	plugins: [
		new CopyPlugin({
			patterns: [
				{ 
					from: path.resolve(__dirname, '../html/'),
					to: path.resolve(__dirname, '../build')
				},
				{
					from: path.resolve(__dirname, '../assets/sprites/tilesets/'),
					to: path.resolve(__dirname, '../build/assets')
				},
				{
					from: path.resolve(__dirname, '../assets/sprites/backgrounds/'),
					to: path.resolve(__dirname, '../build/assets')
				}
			],
		}),
	],
};
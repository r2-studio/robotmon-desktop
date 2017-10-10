const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

	watch: true,

	target: 'electron',

	entry: './app/src/entry.js',

	output: {
		path: __dirname + '/app/build',
		publicPath: 'build/',
		filename: 'bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['react']
					}
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: "css-loader"
				})
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: { name: '[name].[ext]?[hash]' }
					}
				]
			}
		]
	},

	plugins: [
		new ExtractTextPlugin({
			filename: 'bundle.css',
			disable: false,
			allChunks: true
		})
	]

}

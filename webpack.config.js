var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  cache: true,
  entry: './static/js/main.js',
  output: {
    path: path.join(__dirname, 'static/output'),
    publicPath: '/output/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: __dirname,
    alias: {}
  },
  module: {
    loaders: [
      {test: /\.js$/,
       exclude: [/node_modules\/.*/],
       loader: '6to5'},
      {test: /\.jsx$/, loader: "jsx?harmony"},
      {test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css!less") },
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css") },
      {test: /\.json$/, loader: "json"}
    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   regeneratorRuntime: 'static/js/regenerator-runtime.js'
    // }),
    new ExtractTextPlugin('styles.css')
  ]
};

if(process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // mangle: {
      //   except: ['GeneratorFunction', 'GeneratorFunctionPrototype']
      // }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}
else {
  config.devtool = 'sourcemap';
  config.debug = true;
}

module.exports = config;

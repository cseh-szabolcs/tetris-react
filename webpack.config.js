var webpack = require('webpack');
var path = require('path');

// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// entry: ['babel-polyfill'] -> must also be installed by npm with dev-dept


module.exports = {
  // ================================================================
  entry: [
    'script-loader!jquery/dist/jquery.min.js',
    'script-loader!foundation-sites/dist/js/foundation.js',
    './app/app.jsx'
  ],
  // ================================================================
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  // ================================================================
  externals: {
    'jquery': 'jQuery'
  },
  // ================================================================
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      'tetris-actions': 'app/redux/actions/index.js',
      'tetris-components': 'app/components/index.js',
      'tetris-library': 'app/library/index.js',
      'tetris-logics': 'app/redux/logics/index.js',
      'tetris-pages': 'app/pages/index.js',
      'tetris-reducers': 'app/redux/reducers/index.js',
      'tetris-store': 'app/store/index.js',
      applicationStyles: 'app/styles/app.scss'
    },
    extensions: ['*', '.js', '.jsx']
  },
  // ================================================================
  module: {
    loaders: [
      // JXS -----
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2017', 'stage-0']
        },
        exclude: /(node_modules|bower_components)/
      },
      // SCSS ----
      {
        test: /\.scss$/,
        //use: ExtractTextPlugin.extract({
        //  fallback: "style-loader",
          use: [
            {loader: "style-loader"}, //<--
            {
              loader: "css-loader",
              //options: { // ! occurs an warning !
              //  minimize: true
              //}
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [path.resolve(__dirname, './node_modules/foundation-sites/scss')]
              }
            }
          ]
        //})
      }
    ]
  },
  // ================================================================
  plugins: [
    /*
    new ExtractTextPlugin("public/styles.css"), // [contenthash]
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: false
    })
    */
  ],
  // ================================================================
  devtool: 'cheap-module-eval-source-map'
};

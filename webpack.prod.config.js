var webpack = require('webpack');
var path = require('path');

// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// entry: ['babel-polyfill'] -> must also be installed by npm with dev-dept


module.exports = {
  // ================================================================
  entry: [
    'script-loader!jquery/dist/jquery.min.js',
    'script-loader!foundation-sites/dist/js/foundation.js',
    './src/app.jsx'
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
      'library': 'library/index.js',
      'tetris-actions': 'src/redux/actions/index.js',
      'tetris-components': 'src/components/index.js',
      'tetris-logics': 'src/redux/logics/index.js',
      'tetris-pages': 'src/pages/index.js',
      'tetris-reducers': 'src/redux/reducers/index.js',
      'tetris-store': 'src/store/index.js',
      applicationStyles: 'src/styles/app.scss'
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
    // new ExtractTextPlugin("public/styles.css"), // [contenthash]
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,   // enable source maps to map errors (stack traces) to modules
      output: {
        comments: false, // remove all comments
      },
    })


  ],
  // ================================================================
  devtool: 'cheap-module-eval-source-map'
};

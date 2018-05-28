var webpack = require('webpack');
var path = require('path');


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
        use: [
          {loader: "style-loader"}, //<--
          {
            loader: "css-loader",
           },
          {
            loader: "sass-loader",
            options: {
              includePaths: [path.resolve(__dirname, './node_modules/foundation-sites/scss')]
            }
          }
        ]
      }
    ]
  },
  // ================================================================
  plugins: [
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

const ngToolsWebpack = require('@ngtools/webpack');
const webpack = require('webpack');
const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(env) {
  return {
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        AppConfig: env.prod ? path.resolve(__dirname, "app/config/app-prod.config") : path.resolve(__dirname, "app/config/app-dev.config"),
      },
    },
    entry: {
      app: './app/main.aot.ts',
      vendor: [
        'bootstrap',
        'bootstrap/dist/css/bootstrap.css',
        'core-js/es7/reflect',
        'font-awesome/css/font-awesome.css',
        'jquery',
        'zone.js',
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/',
      library: '[name]_[hash]',
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.ts$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: {
            emitErrors: true,
            failOnHint: true,
          }
        },
        {
          test: /\.ts$/,
          exclude: /\.jit.ts$/,
          loader: '@ngtools/webpack'
        },
        {
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          test: /\.less$/,
          include: /app/,
          use: [
            'raw-loader',
            'postcss-loader',
            'less-loader',
          ]
        },
        {
          test: /\.css$/,
          include: /app/,
          loader: 'raw-loader'
        },
        {
          test: /\.css(\?|$)/,
          exclude: /app/,
          loader: extractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
          loader: 'url-loader?limit=100000'
        },
      ]
    },
    plugins: [
      new ngToolsWebpack.AotPlugin({
        tsConfigPath: './tsconfig.aot.json',
        entryModule: __dirname + '/app/app.module#AppModule'
      }),
      new extractTextPlugin({
        filename: '[name].css'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        sourceMap: false
      })
    ],
    devServer: {
      historyApiFallback: true
    }
  };
}

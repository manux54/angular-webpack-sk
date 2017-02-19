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
      app: './app/main.jit.ts',
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
          exclude: /\.aot.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFileName: "tsconfig.jit.json"
              }
            },
            'angular2-template-loader',
            'angular-router-loader'
          ],
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
      // Workaround for angular/angular#11580
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve(__dirname, "app"),
        {}
      ),
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

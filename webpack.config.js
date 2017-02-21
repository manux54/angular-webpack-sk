const ngToolsWebpack = require('@ngtools/webpack');
const webpack = require('webpack');
const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(env) {
  env = env || {};

  return {
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        AppConfig: env.prod ? path.resolve(__dirname, "app/config/app-prod.config") : path.resolve(__dirname, "app/config/app-dev.config"),
      },
    },
    entry: {
      app: env.aot ? './app/main.aot.ts' : './app/main.jit.ts',
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
          use: env.aot ? [ '@ngtools/webpack' ] : [
            'ts-loader',
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
    ].concat(env.aot ? [
      new ngToolsWebpack.AotPlugin({
        tsConfigPath: './tsconfig.json',
        entryModule: __dirname + '/app/app.module#AppModule',
        locale: 'fr',
        i18nFile: './app/locale/messages.fr.xlf',
        i18nFormat: 'xlf'
      })
    ] : [
      // Workaround for angular/angular#11580
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve(__dirname, "app"),
        {}
      )
    ]),
    devServer: {
      historyApiFallback: true
    }
  };
}

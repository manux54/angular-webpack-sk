const ngToolsWebpack = require('@ngtools/webpack');
const webpack = require('webpack');
const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');
const copyPlugin = require('copy-webpack-plugin');

module.exports = function(env) {
  env = env || {};

  env.locale = env.locale || "en";
  let i18nProviders = path.resolve(__dirname, `app/locale/i18n-providers.${env.locale}`);

  return {
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        AppConfig: env.prod ? path.resolve(__dirname, "app/config/app-prod.config") : path.resolve(__dirname, "app/config/app-dev.config"),
        "i18n-providers": i18nProviders,
      },
    },
    entry: {
      app: env.aot ? './app/main.aot.ts' : './app/main.jit.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/',
      library: '[name]_[hash]',
      filename: `[name].${env.locale}.js`
    },
    devtool: "inline-source-map",
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
          test: /\.xlf$/,
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
          exclude: /(styles|prebuilt)/,
          use: [
            'to-string-loader',
            'css-loader'
          ]
        },
        {
          test: /\.css$/,
          include: /(styles|prebuilt)/,
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
      new copyPlugin([
        { from: 'app.loader.js' },
        { from: 'assets', to: 'assets' },
      ]),
      new extractTextPlugin({
        filename: '[name].css'
      }),
    ].concat(env.aot ? [
      new ngToolsWebpack.AotPlugin({
        tsConfigPath: './tsconfig.json',
        entryModule: __dirname + '/app/app.module#AppModule',
        locale: env.locale === "en" ? null : env.locale,
        i18nFile: env.locale === "en" ? null : `./app/locale/messages.${env.locale}.xlf`,
        i18nFormat: env.locale === "en" ? null : 'xlf'
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

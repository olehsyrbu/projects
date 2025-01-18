const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (_, argv) => {
  let prod = argv.mode === 'production' || !argv.mode;
  const version = require('./package.json').version;

  let plugins = [
    new Dotenv({
      path: './.env.local',
      systemvars: true,
      defaults: './.env',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './static/favicon.ico',
    }),
    new CopyPlugin({ patterns: [{ from: './src/outdated.html', to: '.' }] }),
    new DefinePlugin({
      __MIR_APP_VERSION__: JSON.stringify(version),
    }),
  ];

  if (prod) {
    plugins.push(new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }));

    if (process.env.SENTRY_AUTH_TOKEN) {
      plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'miresource',
          project: 'miresource',
          include: 'dist',
          configFile: 'sentry.properties',
          release: version,
        }),
      );
    }
  } else {
    plugins.push(new ReactRefreshWebpackPlugin());
    plugins.push(
      new CopyPlugin({ patterns: [{ from: 'public/mockServiceWorker.js', to: 'dist' }] }),
    );
  }

  return {
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: prod ? '[name].[contenthash].js' : '[name].js',
      assetModuleFilename: prod ? 'assets/[contenthash][ext]' : 'assets/[name][id][ext]',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
              env: { development: { plugins: ['react-refresh/babel'] } },
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
        { test: /\.(png|svg|jpg|gif)$/, type: 'asset/resource' },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins,
    devtool: prod ? 'source-map' : 'eval-source-map',
    devServer: {
      historyApiFallback: true,
    },
  };
};

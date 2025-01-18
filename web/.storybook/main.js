const path = require('node:path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: (config, { configType }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, '../src');

    Object.assign(
      config.module.rules.find((rule) => rule.test.test('.css')),
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    );

    if (configType === 'DEVELOPMENT') {
      config.plugins.push(new ReactRefreshWebpackPlugin());
    }

    return config;
  },
  docs: {
    autodocs: 'tag',
  },
};

const path = require('path');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  devtool: 'eval-source-map',
  mode: 'development',
  // mode: 'production',
  entry: {
    'main': './src/main.ts',
  },
  module: {
    rules: [{
      // TS -> JS
      test: /\.ts$/,
      use: 'ts-loader',
      include: [
        path.resolve(__dirname, 'src/')
      ]
    }]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src/')
    },
    extensions: ['.ts', '.js'],
    plugins: [
      new TSConfigPathsPlugin({
        extensions: ['.ts', '.js', 'tsx'],
        baseUrl: 'src/',
      }),
    ]
  },
  output: {
    publicPath: './',
    filename: '[name].js',
    path: path.resolve(__dirname, './')
  },
};

module.exports = config;
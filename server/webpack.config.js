const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/templates/chatbot-template.js',
  output: {
    filename: 'chatbot-bundle.js',
    path: path.resolve(__dirname, 'src/public/js'),
    publicPath: '/js/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom'
    }),
    new MiniCssExtractPlugin({
      filename: '../css/chatbot-styles.css',
    }),
  ]
};
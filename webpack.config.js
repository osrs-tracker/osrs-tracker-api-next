'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const NodemonPlugin = require('nodemon-webpack-plugin');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}) => {
  const config = {
    entry: ['./src/main.ts'],
    mode: env.development ? 'development' : 'production',
    target: 'node',
    devtool: env.development ? 'inline-source-map' : false,
    node: {
      __dirname: false, // Fix for native node __dirname
      __filename: false, // Fix for native node __filename
    },
    output: {
      filename: `${packageJson.name}.js`,
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['node_modules', 'src'],
    },
    stats: {
      modules: false, // We don't need to see this
      warningsFilter: /^(?!CriticalDependenciesWarning$)/,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      // Use module replacement to use different configs for dev and prod
      new NormalModuleReplacementPlugin(
        /[\\/]src[\\/]config[\\/]config.ts$/, // [\\/] works on all operating systems.
        env.development ? 'config.dev.ts' : 'config.ts'
      ),
    ],
  };

  if (env.nodemon) {
    config.watch = true;
    config.plugins.push(new NodemonPlugin());
  }

  if (env.analyse) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generates file instead of starting a web server
      })
    );
  }

  return config;
};

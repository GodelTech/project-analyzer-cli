// @ts-check

import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default {
  target: 'node',
  entry: {
    index: './src/index.ts',
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
  output: {
    filename: 'index.cjs',
    path: path.resolve(__dirname, 'lib'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

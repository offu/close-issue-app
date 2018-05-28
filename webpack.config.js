const path = require('path')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [{
          loader: 'tslint-loader',
          options: {
            emitErrors: true,
            typeCheck: true
          }
        }]
      },
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        loaders: ['ts-loader']
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  plugins: [
    new NodemonPlugin({
      script: './dist/build.js',
      execMap: {
        js: 'probot run'
      }
    }),
  ]
}
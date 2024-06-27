const path = require('path');

module.exports = {
  mode: 'production',  // or 'development' depending on your needs
  target: 'node',  // Ensures that Webpack compiles code for use in a Node.js environment
  entry: './src/app.ts',  // Adjust this if your entry file is different
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Resolves these extensions
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@config': path.resolve(__dirname, 'src/config/')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    // List node-specific packages here if you encounter issues, such as 'fs', 'path', etc.
  },
  ignoreWarnings: [(warning) => {
    return warning.message.includes("Critical dependency: the request of a dependency is an expression");
  }],
};

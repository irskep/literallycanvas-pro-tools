var path = require('path');

module.exports = {
  entry: "./demo_js/entry.js",
  output: {
      path: __dirname,
      filename: "demo.js"
  },
  externals: {
    "literallycanvas": "LC",
    "react": "React"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    root: [
      path.resolve('./'),
      path.resolve('./node_modules')
    ]
  }
};
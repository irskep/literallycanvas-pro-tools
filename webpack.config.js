var path = require('path');

module.exports = {
  entry: "./demo/js/entry.js",
  output: {
      path: __dirname,
      filename: "demo/demo.js"
  },
  externals: {
    "literallycanvas": "LC",
    "react": "React"
  },
  module: {
    loaders: [
      {
        test: [/\.js$/, /\.jsx$/],
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
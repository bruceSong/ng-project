var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = [
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css!postcss')
  },
  {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css!postcss!less')
  },
  {
    test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
    loader: 'url-loader?name=images/[name].[hash:8].[ext]&limit=8192' // <8k的图片，输出为base64 dataurl
  },
  {
    test: /\.(ttf|otf|woff|eot)$/,
    loader: 'url-loader?name=fonts/[name].[hash:8].[ext]&limit=1024'
  },
  {
    test: /\.js$/, 
    exclude: /node_modules/,
    loader: 'ng-annotate!babel'
  },
  {
      test: /\.html$/,
      loader: 'raw'
  }
];

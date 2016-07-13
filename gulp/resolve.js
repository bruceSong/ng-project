var path = require('path');
module.exports = {
  extensions: ['', '.coffee', '.js', '.jsx'],
  alias: {
    components: path.resolve(__dirname, '../', './src/components'),
    service: path.resolve(__dirname, '../', './src/service')
  }
};

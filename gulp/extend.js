function extend(dest, props) {
  if (!props) return dest;

  for (var key in props) {
    var item = props[key];
    if (!dest[key] && item) {
      dest[key] = item;
    }
  }
  return dest;
};

module.exports = extend;
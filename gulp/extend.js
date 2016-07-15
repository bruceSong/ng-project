function extend(dest, props) {
    if (!props) return dest;

    for (var key in props) {  
        var val = props[key];
        if (typeof val == 'object') {
            if (val instanceof Array) {
                dest[key] = [];
            }
            arguments.callee(dest[key], val); 
        } else {
            dest[key] = val;
        }
        
    }  
    return dest;
};

module.exports = extend;
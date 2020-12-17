let __prefix = "juakoto"

module.exports = {
    change_prefix : function (new_prefix) {
        __prefix = new_prefix
    }
}

module.exports = {
    prefix : function() {
        return __prefix;
    }
}
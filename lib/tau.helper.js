/*
 * AAE Node js helper class
 * Developer: Chia
 * 
 */


module.exports = {
    getUUID: (function(){
        var _ref=function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return function() {
            return _ref() + _ref() + '-' + _ref() + '-' + _ref() + '-' +
                   _ref() + '-' + _ref() + _ref() + _ref();
        };
    })()
};
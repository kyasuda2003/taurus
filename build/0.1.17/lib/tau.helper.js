/*
 * AAE Node js helper class
 * Developer: K. Yasuda
 * 
 */
;(function(){

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
        })(),
        objCopy:function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },
	getCount:function(obj){
	    var _ref=0;

	    for (var key in obj){
		if (obj.hasOwnProperty(key)){
		    _ref++;
		}
	    }

	    return _ref;
	}
    };
})();
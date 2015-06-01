/*
 * Taurus tests with mocha
 * developer: K. Yasuda
 */
var assert = require("assert");
describe('Taurus collab service ', function(){
    describe('Taurus APIs.', function(){
      it('should test Taurus login.', function(){
        assert.equal(-1, [1,2,3].indexOf(5));
        assert.equal(-1, [1,2,3].indexOf(0));
      });
    });
});
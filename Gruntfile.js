/* 
 * Tau Service Grunt automation
 * 
 * Build developer: K. Yasuda
 */
module.exports = function (grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });
    
    grunt.registerTask('start-dev', 'Start the Taurus', function() {
        
        var _tau=require('./index');

        _tau.init({port:3131,isdev:true});
        _tau.start();
    });
    
    grunt.registerTask('start', 'Start the Taurus', function() {
        
        var _tau=require('./index'),ncb=this.async();

        _tau.init({port:3131,isdev:false});
        _tau.start();
        
    });
    
    grunt.registerTask('test', 'Start the AAE Plugin', function() {
        
        var exec = require('child_process').exec,
            ncb = this.async();
        
        var _ref=exec('node ./server/index -nomin -dev -mqchat -apm -p 7171 -h http://localhost', {}, function(err, stdout, stderr) {
            console.log('\nStart the AAE Plugin');
        });
        
        _ref.stdout.on('data', function (data) {
            console.log(data);
        });
        
        _ref.stderr.on('data', function (data) {
            console.log(data);
        });
        
        _ref.on('close', function (code) {
            console.log('AAE-Plugin exited with code ' + code);
            ncb();
        });
    });
    
    grunt.registerTask('default');
};

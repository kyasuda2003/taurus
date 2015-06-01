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
    
    grunt.registerTask('test', 'Start the Taurus unit test.', function() {
        
        var exec = require('child_process').exec,
            ncb = this.async();
        
        var _ref=exec('mocha', {}, function(err, stdout, stderr) {
            console.log('\nStart the AAE Plugin');
        });
        
        _ref.stdout.on('data', function (data) {
            console.log(data);
        });
        
        _ref.stderr.on('data', function (data) {
            console.log(data);
        });
        
        _ref.on('close', function (code) {
            console.log('Taurus exited with code: ' + code);
            ncb();
        });
    });
    
    grunt.registerTask('publish', 'Publish taurus npm package.', function() {
        
        //copy dicts pattern designed
        var exec = require('child_process').exec,
            ncb = this.async(),pkg=require('./package.json'),
            _ref1='./build/'+pkg.version,_ref=
            function(src,dest, isfile){
                //console.log('test');
                
                if (isfile){
                    grunt.file.copy(src,dest+'/'+src,{});
                    console.log('File has been created as '+dest+'/'+src);
                    return;
                }
                
                grunt.file.recurse(src, function(abspath, rootdir, subdir, filename){
                    var _ref3=(typeof subdir=='undefined'?'':(subdir+'/'));
                    grunt.file.copy(abspath,dest+'/'+src+'/'+_ref3+filename, {});
                    console.log('File has been created as '+dest+'/'+src+'/'+filename);
                });
                
            };
        
        _ref('./cli',_ref1,false);
        _ref('./lib',_ref1,false);
        _ref('./test',_ref1,false);
        _ref('./Gruntfile.js',_ref1,true);
        _ref('./README.md',_ref1,true);
        _ref('./index.js',_ref1,true);
        _ref('./package.json',_ref1,true);
        
        var _ref4=exec('npm publish ./build/'+pkg.version+'/', {}, function(err, stdout, stderr) {
            console.log('\nPublish taurus.');
        });
        
        _ref4.stdout.on('data', function (data) {
            console.log(data);
        });
        
        _ref4.stderr.on('data', function (data) {
            console.log(data);
        });
        
        _ref4.on('close', function (code) {
            console.log('Taurus exited with code: ' + code);
            ncb();
        });
    });
    
    grunt.registerTask('default');
};

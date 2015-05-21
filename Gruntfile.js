/* 
 * AAE Team Grunt automation
 * 
 * Build developer: Chia
 */
module.exports = function (grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'libs/aae/<%=pkg.name%>-<%=pkg.version%>.min.js': 
                        ['libs/aae/aae.helper.js','scripts/aae.app.js','libs/aae/aae.api.js',
                         'libs/aae/aae.mqchat.js','libs/aae/aae.usrmgr.js','scripts/aae.app.render.js','scripts/aae.app.ui.js']
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('compiling-bootstrap','Compile bootstrap less to aee.css',function(){
        
        //copy dicts pattern designed
        var _ref='./theme/apm/bootstrap',_ref1='./bower_components/bootstrap/less',_ref2=
            function(src,dest){
                grunt.file.recurse(src, function(abspath, rootdir, subdir, filename){
                    var _ref3=(typeof subdir=='undefined'?'':(subdir+'/'));
                    grunt.file.copy(abspath, dest+'/'+_ref3+filename, {});
                    console.log('File has been created as '+dest+'/'+_ref3+filename);
                });
                
            };
            
        _ref2(_ref1,_ref);
        
        var exec=require('child_process').exec,
            _ref4=this.async(),
            _ref5=exec('lessc ./theme/apm/aae.less ./theme/apm/aae.css', {}, function(err, stdout, stderr) {
                console.log('\nStart with AAE Less conpilation.');
            });
        
        _ref5.stdout.on('data', function (data) {
            console.log(data);
        });
        
        _ref5.stderr.on('data', function (data) {
            console.log(data);
        });
        
        _ref5.on('close', function (code) {
            console.log('Done with less compilation.');
            _ref4();
        });
        
    });
    
    grunt.registerTask('bower', 'install the backend and frontend dependencies', function() {
        var exec = require('child_process').exec,
            ncb = this.async();
        
        console.log('\nInstall the backend and frontend dependencies');
        
        exec('bower install', {}, function(err, stdout, stderr) {
            console.log(stdout);
            ncb();
        });
    });
    
    grunt.registerTask('init', 'Start the AAE Plugin', function() {
        
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
    
    grunt.registerTask('default', ['bower','uglify','compiling-bootstrap','init']);
};

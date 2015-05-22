/*
 * nodejs web app for AAE plugin mocking
 * developer: Chia
 */

var express=require('./../node_modules/express'),
    path=require('path'),
    fs=require('fs'),
    obj={host:'http://localhost',port:'3131',isdev:false,entity:'aae',chatType:'xmpp'},
    vpath=__dirname,
    currentPath=path.resolve('./'),
    exp=express(),
    route = express.Router();
    minify = require('./../node_modules/express-minify'),
    chatserver = require('./aae.server.chat'),
    bodyParser = require('./../node_modules/body-parser'),
    helper = require('./aae.server.helper');
    pkg = require('./../package.json');

console.log('currentPath:'+currentPath);
console.log('__dirname:'+__dirname); 

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: false,
    index: 'aae',
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
	res.set('x-timestamp', Date.now());
    }
};

    
if (process.argv.indexOf('-h')>-1){
    obj.host=process.argv[process.argv.indexOf('-h')+1];
}

if (process.argv.indexOf('-dev')>-1){
    obj.isdev=true;
}

if (process.argv.indexOf('-apm')>-1){
    obj.entity='apm';
}

if (process.argv.indexOf('-mqchat')>-1){
    obj.chatType='mqchat';
}

if (process.argv.indexOf('-p')>-1){
    obj.port=process.argv[process.argv.indexOf('-p')+1];
}


if (process.argv.indexOf('-nomin')<0){
    console.log('\naae-plugin is being minimised. (use -nomin to disable minimisation)');
    exp.use(minify(
    {
        js_match: /javascript/,
        css_match: /css/,
        sass_match: /scss/,
        less_match: /less/,
        stylus_match: /stylus/,
        coffee_match: /coffeescript/,
        cache: false
    }));
}

route.get('/aae.conf.json', function (req, res, next) {
    //console.log('req.params:'+req.params);
    res.setHeader('Content-Type','application/json');
    
    fs.readFile('settings/aae.conf.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj.conf = JSON.parse(data);
        
        fs.readFile('package.json', 'utf8', function (err, data) {
            if (err) throw err;
            obj.version = JSON.parse(data).version;
            
            return res.end(JSON.stringify(obj));
        });
    });
});

route.get('/aae.js',function(req,res,next){
    
    fs.readFile(currentPath+'/server/aae.main.js', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var result = data.replace(/{{aaeref}}/g, '\''+obj.host+':'+obj.port+'\'');
        res.setHeader('content-type', 'text/javascript');
        res.send(result);
        res.end();
    });
});

route.get('/version',function(req,res,next){
    res.end(JSON.stringify(pkg.version).replace(/"/g,''));
    
});

route.get('/allcallbacks',chatserver._validate,chatserver.callbacks);
route.post('/login',chatserver.login);
route.post('/leavechatroom',chatserver._validate,chatserver.leaveroom);

exp.use(bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        route,express.static(currentPath,options));

exp.listen(obj.port);
console.log('\naae-plugin is running on port# ' + obj.port.toString());

/*
 * Nodejs Tau Chat server
 * developer: 安田　圭介
 */

var _express=require('express'),
    _helper=require('./lib/tau.helper'),
    _bodyParser = require('body-parser'),
    _path=require('path'),
    _fs=require('fs'),
    _vpath=__dirname,
    _currentPath=path.resolve('./'),
    _exp=_express(),
    _route = _express.Router();
    _pkg = require('./package.json'),
    _options = {
        dotfiles: 'ignore',
        etag: false,
        extensions: false,
        maxAge: '1d',
        redirect: false,
        setHeaders: function (res, path, stat) {
            res.set('x-timestamp', Date.now());
        }
    },      
    _obj={port:3131,isdev:false},
    _status={online:1,offline:2,away:3,left:4,joined:5},
    _roster={},_rooms={},_res={},
    _removeUserInRooms=function(userId){
         for (key in _rooms){
            if (_rooms.hasOwnProperty(key)){
                var pos=_rooms[key].users.indexOf(userId);
                if (pos>-1)
                    _rooms[key].users.splice(pos,1);
            }
         }
    },
    _msgproc=function(senderId,msgtype,msgval){

        for (var key in _res) {
            if (_res.hasOwnProperty(key)) {
                var pr=_res[key];
                if (key!=senderId){
                    pr.end({callbackType:msgtype,callbackInfo:msgval});
                }
            }
        }
    },  
    _api={
        callbacks: function(req, res, next){
            /*
             * request body
             * {userId:<userId>,userName:<userName>,timeout:<timeout>}
             * response
             * {callbackType:<msgtype>,callbackInfo:<msgval>}
             */
            
            var userId=req.body.userId,
                timeout=req.body.timeout;
    
            timeout&&(timeout==60000);  
            res.setTimeout(timeout, function(){
                return res.end(JSON.stringify({callbackType:'AppStatus',
                                        callbackInfo:{status:'Connection expired in millisec:'+timeout}}));
            });
            
            _res[userId]=res;
            
        },
        login: function(req,res, next){
            /*
             * request body
             * {userName:<username>}
             * response
             * {status:<status>,userId:<userId>,user:{userName:<username>,status:<enum>}}
             */
            var userId=_helper.getUUID(),body=req.body,
                rosterObj={};
        
            _roster[userId]={userName:body.userName,status:_status.online};
            
            rosterObj=_helper.objCopy(_roster[userId]);
            rosterObj.status=_status.online;
            _msgproc(userId,'presenceStatus',rosterObj);

            return res.end(JSON.stringify({status:'User '+rosterObj.userName+' has logged-in tau.',userId:userId,user:rosterObj}));

        },
        logout: function(req,res, next){
            /*
             * request body
             * {userId:<userId>,userName:<userName>}
             * response
             * {status:<status>,user:{userName:<username>,status:<enum>}}
             */

            var userId=req.body.userId,rosterObj=_helper.objCopy(_roster[userId]);

            delete _res[userId];

            delete _roster[userId];
            
            _removeUserInRooms(userId);
            
            rosterObj.status=_status.offline;
            
            _msgproc(userId,'presenceStatus',rosterObj);
            
            return res.end(JSON.stringify({status:'User '+rosterObj.userName+' has logged-out tau.',
                                           user:rosterObj}));

        },
        joinroom:function(req,res,next){
            /*
             * request body
             * {userId:<userId>,userName:<userName>,roomId:<roomId>,roomName:<roomName>}
             * response
             * {status:<status>,room:{roomId:<roomId>,roomName:<roomName>,users:<[userId]>}}
             */

            var body=req.body,userId=body.userId,
                roomId=body.roomId,roomName=body.roomName,
                roomObj={},rosterObj={};

            if (typeof roomId=='undefined'){
                roomId=_helper.getUUID();
            }
            else {
                if (typeof _rooms[roomId]=='undefined'){
                    res.writeHead(501, "No mapping", {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({status:'Room invalid.'}));
                }
            }
            
            roomObj=_rooms[roomId];
            
            if (typeof roomObj=='undefined'){
                roomObj=(_rooms[roomId]=
                            {roomId:roomId,roomName:roomName,users:[]});
            }
            
            if (roomObj.users.indexOf(userId)<0){
                _roster[userId].status=_status.online;
                roomObj.users.splice(0,0,userId);
                rosterObj=_helper.objCopy(_roster[userId]);
                rosterObj.status=_status.joined;
                _msgproc(userId,'presenceStatus',rosterObj);
            
                return res.end(JSON.stringify({status:'User joined the room:'+roomName,
                                               room:roomObj}));
            }

            return res.end(JSON.stringify({status:'User failed joining the room:'+roomName}));
        },
        leaveroom:function(req,res,next){

            /*
             * request body
             * {userId:<userId>,userName:<userName>,roomId:<roomId>}
             * response
             * {status:<status>}
             */
            
            var body=req.body,
                userId=body.userId,
                roomId=body.roomId,
                rosterObj={},
                pos=_rooms[roomId].users.indexOf(userId);

            if (pos>-1){
                _roster[userId].status=_status.online;
                _rooms[roomId].users.splice(pos,1);
                rosterObj=_helper.objCopy(_roster[userId]);
                rosterObj.status=_status.left;
                _msgproc(userId,'presenceStatus',rosterObj);
            
                return res.end(JSON.stringify({status:'User left the room:'+_rooms[roomId].roomName}));
            }

            return res.end(JSON.stringify({status:'Room invalid.'}));

        },
        validate:function(req,res,next){
            
            /*
             * request body
             * {userId:<userId>,userName:<userName>}
             * fail response
             * {status:<status>}
             */
            
            var userId=req.body.userId,
                userName=req.body.userName,
                _ref=true;

            //console.log(_roster[_ref1]+', cid:'+_ref1);
            
            if ((typeof _roster[userId]=='undefined')||(_roster[userId]&&_roster[userId].UserName!=userName))
                _ref=false;

            if (_ref==false){
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({status:'auth fail.'}));
            }
            
            return next();
        }
    },module.exports={,
        init:function(conf){
            obj.port=conf.port;
            obj.isdev=conf.isdev;
            
        },
        start:function(){
            
            route.post('/login',_api.login);
            route.get('/allcallbacks',_api.validate,_api.callbacks);
            route.post('/leavechatroom',_api.validate,_api.leaveroom);

            exp.use(bodyParser.json(),
                    bodyParser.urlencoded({ extended: true }),
                    route,express.static(currentPath,options));

            exp.listen(obj.port);
            
            console.log('\ntau is running on port# ' + obj.port.toString());

        },
        shutdown:function(){}
    };


    



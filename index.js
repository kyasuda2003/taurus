/*
 * Taurus Nodejs RTC service
 * developer: K. Yasuda /安田圭介
 */

;(function(){

    var _helper=require('./lib/tau.helper'),
        _route=require('taurus-express-light');
        _path=require('path'),
        _fs=require('fs'),
        _vpath=__dirname,
        _currentPath=_path.resolve('./'),
        _pkg = require('./package.json'),     
        _obj={port:3131,isdev:false, maxUsers:100,maxRooms:500},
        _status={online:1,offline:2,away:3,left:4,joined:5},
	    _roster={},_rooms={},_res={},_msg={},
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

			switch (msgtype){
			    case 'presenceStatus':
				pr.end(JSON.stringify({callbackType:msgtype,callbackInfo:msgval}));
				break;
			    case 'presenceMessage':
				var roomObj=_rooms[msgval.roomId];
				if (roomObj.users.indexOf(key)>-1){
				    pr.end(JSON.stringify({callbackType:msgtype,callbackInfo:msgval}));
				}
				break;
			    default:
				break;
			}

                    }
                }
            }
        },
	_cleanup=function(){
	    
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

                if (typeof timeout=='undefined')
                    timeout=60000;  

                res.setTimeout(timeout, function(){
                    return res.end(JSON.stringify({callbackType:'AppStatus',
                                            callbackInfo:{status:'Connection expired in millisec:'+timeout}}));
                });

                _res[userId]=res;

            },
            connect: function(req,res, next){
                /*
                 * request body
                 * {userName:<userName>}
                 * response
                 * {status:<status>,userId:<userId>,user:{userName:<userName>,status:<enum>}}
                 */
                
                //return res.end();
                
                var userId=_helper.getUUID(),body=req.body,
                    rosterObj={};

		if (_helper.getCount(_roster)>_obj.maxUsers){
		    res.writeHead(501, "No mapping", {'Content-Type': 'application/json'});
		    return res.end(JSON.stringify({status:'Max roster is reached..'}));
                   
		}

                _roster[userId]={userName:body.userName,status:_status.online,timeStamp:Date.now()};

                rosterObj=_helper.objCopy(_roster[userId]);
                rosterObj.status=_status.online;
                _msgproc(userId,'presenceStatus',rosterObj);
                
		console.log('User request (userId:'+userId+') '+JSON.stringify(_roster[userId]));

                return res.end(JSON.stringify({status:'User '+rosterObj.userName+' has logged-in tau.',userId:userId,user:rosterObj}));

            },
            disconnect: function(req,res, next){
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

		
		if (_helper.getCount(_rooms)>_obj.maxRooms){
		    res.writeHead(501, "No mapping", {'Content-Type': 'application/json'});
		    return res.end(JSON.stringify({status:'Max number of rooms is reached..'}));
                   
		}

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
			{roomId:roomId,roomName:roomName,users:[],timeStamp:Date.now()});
                }

                if (roomObj.users.indexOf(userId)<0){
                    _roster[userId].status=_status.online;
                    roomObj.users.splice(0,0,userId);
                    rosterObj=_helper.objCopy(_roster[userId]);
                    rosterObj.status=_status.joined;
                    rosterObj.roomId=roomId;
                    _msgproc(userId,'presenceStatus',rosterObj);
                    
                    res.writeHead(200, { "Content-Type": "application/json" });
                
                    return res.end(JSON.stringify({status:'User joined the room: '+roomObj.roomName,
                                                   room:roomObj}));
                }

                res.writeHead(501, { "Content-Type": "application/json" });
                
                return res.end(JSON.stringify({status:'User failed joining the room: '+roomObj.roomName}));
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
                    rosterObj.roomId=roomId;
                    _msgproc(userId,'presenceStatus',rosterObj);
                    
                    res.writeHead(200, { "Content-Type": "application/json" });
                
                    return res.end(JSON.stringify({status:'User left the room:'+_rooms[roomId].roomName}));
                }
                
                res.writeHead(501, { "Content-Type": "application/json" });
                
                return res.end(JSON.stringify({status:'Room invalid.'}));

            },
            send:function(req,res, next){
                /*
                 * request body
                 * {userId:<userId>,userName:<userName>,roomId:<roomId>,msg:<msg>}
                 * response
                 * {status:<status>}
                 */
                var body=req.body,
                    userId=body.userId,
		    roomId=body.roomId,
		    uuid=_helper.getUUID();
            
		//validate the room
                if (typeof _rooms[roomId]=='undefined'){
                    res.writeHead(501, { "Content-Type": "application/json" });
                    
                    return res.end(JSON.stringify({status:'Room invalid.'}));
                }

		//is the user in the room?
                if (_rooms[roomId].users.indexOf(userId)<0){
		    res.writeHead(501, { "Content-Type": "application/json" });
			
                    return res.end(JSON.stringify({status:'Room invalid.'}));
                
                }

		_msg[uuid]={userId: userId, roomId: roomId, msg:body.msg, timeStamp:Date.now()};
		console.log(JSON.stringify(_msg[uuid]));

		//broadcast the message
		_msgproc(userId,'presenceMessage',{msg: new Buffer(_msg[uuid].msg).toString('base64'),timeStamp:_msg[uuid].timeStamp,userId:userId, roomId:roomId});
		
		res.writeHead(200, { "Content-Type": "application/json" });
                
		return res.end(JSON.stringify({status:'Message has been sent: '+body.msg}));
                    
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

                console.log('User request (userId:'+userId+') '+JSON.stringify(_roster[userId]));

                    
                if ((typeof _roster[userId]=='undefined')||(_roster[userId]&&_roster[userId].userName!=userName))
                    _ref=false;

                if (_ref==false){
                    res.writeHead(401, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({status:'auth fail.'}));
                }

                return next();
            }
        };

    module.exports={
        init:function(conf,route){
            _obj.port=conf.port;
            _obj.isdev=conf.isdev;

	    if (_obj.isdev){
		_route=route;
	    }

        },
        start:function(){
            
            _route.post('/connect',_api.connect);
            _route.post('/disconnect',_api.validate,_api.disconnect);
            _route.post('/callbacks',_api.validate,_api.callbacks);
            _route.post('/joinroom',_api.validate,_api.joinroom);
            _route.post('/leaveroom',_api.validate,_api.leaveroom);
            _route.post('/send',_api.validate,_api.send);
	    
            _route.listen(_obj.port);

            
            console.log('\ntaurus is running on port# ' + _obj.port.toString());

            process.on('exit', function(code) {
                console.log('\nTaurus exit with code:'+ code);
            });

            process.on('uncaughtException', function(err) {
                console.log('\nTaurus was caught with exception: ' + err);
            });

            process.on('SIGINT', function() {
                //socket.close();
                process.exit(-151);
            });
            
        },
        shutdown:function(){}
    };
})();
    
    


    



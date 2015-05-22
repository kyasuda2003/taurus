/* 
 * AAE-Plugin Chat service
 * developer: Chia
 */

var helper = require('./aae.server.helper'),
    promise = require('./../node_modules/bluebird'),
    _roster={},_rooms={},_promises={},app=module.exports={
        
    callbacks: function(req, res, next){
        
        //http://localhost:8080/allcallbacks?username=user2&clientid=9beb73a9-40fd-440d-ab2c-4f210e03b35c&timeoutseconds=180
        
        var _ref=req.query.clientid,
            _ref1=req.query.username,
            _ref2=req.query.timeoutseconds,
            _ref3=_promises[_ref];
    
        if (typeof _ref3=='undefined'){
            res.writeHead(501, "No mapping", {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({status:'No mapping'}));
        }
            
        _ref3.prms.then(function(val){
            _ref3.prms=new promise(function(resolve,reject){
                _ref3.resolve=resolve;
                _ref3.reject=reject;
            });
            
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(val));
        });
    },
    login: function(req,res, next){
        
        var _ref=helper.getUUID(),_ref1=req.body,
            _ref2=_roster[_ref]={UserName:_ref1.userName,ClientId:_ref,PresenceStatus:'Available'},
            _ref3=_promises[_ref]={cid:_ref};
    
            _ref3.prms=new promise(function(resolve,reject){
                _ref3.resolve=resolve;
                _ref3.reject=reject;
            });
        
        app._msgproc('PresenceStatus',_ref2);
        
        return res.end(JSON.stringify(_ref2));
        
    },
    logout: function(req,res, next){
        
        //{"userName":"user1","clientId":"1dc0afa2-9fb7-43b5-880d-b94d2a6dda67"}
        var _ref=req.body.ClientId;
        
        delete _roster[_ref];
        delete _promises[_ref];
        
        
        delete _rooms[_ref];
    },
    createroom:function(req,res,next){
        if (!app._validate(req))
            return res.end(JSON.stringify({status:'auth fail.'}));
        
        //{"userName":"user1","clientId":"0b6648b8-9a81-4e85-bc77-1c8e8b1f3f87","roomName":"room1"}
        
    },
    joinroom:function(req,res,next){
        
        //{"userName":"user2","clientId":"fd76786f-c926-4d10-b5ab-dcf6c56deb2d","roomName":"room1","createRoomIfNotExist":false}

        var roomName=req.body.roomName,
            cId=req.body.clientId,
            createRoomNotExist=req.body.createRoomIfNotExist;
    
        if (createRoomNotExist){
            if (typeof _rooms[roomName]=='undefined')
                _rooms[roomName]={users:[]};
        }
        
        if (_rooms[roomName]&&_rooms[roomName].users.indexOf(cId)<0){
            _rooms[roomName].users.splice(0,0,cId);
            return res.end(JSON.stringify({status:'User joined the room:'+roomName}));
        }
        
        return res.end(JSON.stringify({status:'User failed joining the room:'+roomName}));
        
    
    },
    leaveroom:function(req,res,next){
        
        //{"userName":"user2","clientId":"9048d8a3-b7db-4c5a-9a07-15e0c1439ecb","roomName":"room1"}
        var roomName=req.body.roomName,
            cId=req.body.clientId,
            pos=_rooms[roomName].users.indexOf(cId);
    
        if (pos>-1){
            _rooms[roomName].users.splice(pos,1);
            return res.end(JSON.stringify({status:'User left the room:'+roomName}));
        }
        
        return res.end(JSON.stringify({status:'Room error.'}));
        
    },
    _msgproc: function(msgtype,msgval){
        
        for (var key in _promises) {
            if (_promises.hasOwnProperty(key)) {
                var pr=_promises[key];
                if (key!=msgval.ClientId)
                    pr.resolve({callbackType:msgtype,callbackInfo:msgval});
            }
        }
        
    },
    _validate:function(req,res,next){
        var _ref=req.body.userName,
            _ref1=req.body.ClientId,
            _ref2=true;
        
        console.log(_roster[_ref1]+', cid:'+_ref1);
        if ((typeof _roster[_ref1]=='undefined')||(_roster[_ref1]&&_roster[_ref1].UserName!=_ref))
            _ref2=false;
        
        if (_ref2==false){
            res.writeHead(401, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({status:'auth fail.'}));
        }
        
        return next();
    }
};



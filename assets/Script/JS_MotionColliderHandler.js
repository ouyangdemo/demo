var EventType = require("EventType");
var ColliderGroupMapping = require("ColliderGroupMapping");
var ColliderGroupEnum = require("ColliderGroupEnum");
var DirectionType = require("DirectionType");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        activeOnEnable: true,
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();

        this.lockArray = [];
        
        this.enable = false;
     },
    
    onEnable: function () {
        this.lockArray.length = 0;

        this.enable = this.activeOnEnable;
    },
    
    onDisable: function () {

    },
    
    //conllider
    // ConlliderEnable: 10,
    // ConlliderEnter: 11,
    // ConlliderStay: 12,
    // ConlliderExit: 13,

    initListener : function(){
        this.node.on(EventType.MotionColliderHandlerEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.ConlliderEnter, 
            function (event) {
                // console.log("MotionColliderHandler-->ConlliderEnter");
                if(this.checkGroup(event)){
                    this.enterHandler(event);
                }
            },
            this);
        this.node.on(EventType.ConlliderStay, 
            function (event) {
                this.stayHandler(event);
            },
            this);
        this.node.on(EventType.ConlliderExit, 
            function (event) {
                // console.log("MotionColliderHandler-->ConlliderExit");
                if(this.checkGroup(event)){
                    this.exitHandler(event);
                }
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    componentEnable : function( event ){
        
        var userData = event.getUserData();

        this.enable = userData.enable;
    },
    
    //ColliderGroup
    // Player: 0,
    // Enemy: 1,
    // Terrain: 2,
    // Res: 3,
    
    enterHandler : function( event ){
        // console.log("MotionColliderHandler-->enterHandler",this.enable);
        if(this.enable!==true){
            return;
        }
        
        var userData = event.getUserData();
        
        // if(this.node.group == "Player"){
        //     console.log("MotionColliderHandler-->enterHandler"); 
        // }

        this.rigidBodyCheck(userData);
         // console.log("MotionColliderHandler-->enterHandler",this.node.group,other.group,other.name);
    },
    
    exitHandler : function( event ){
         if(this.enable!==true){
            return;
        }
        
        // if(this.node.group == "Player"){
        //     console.log("MotionColliderHandler-->exitHandler"); 
        // }
        
        // console.log("MotionColliderHandler-->exitHandler");
        
        var userData = event.getUserData();
        var direction = userData.direction;
        var part= userData.part;
        var actorPos = userData.actorPos;
        var other = userData.other;
        
        var partArr = this.exitFrom(other,direction);
        
        while(partArr.length>0){
            part= partArr.pop();
            // if(this.node.group == "Player"){
            //     console.log("MotionColliderHandler-->exitHandler",part);
            // }
            // console.log("MotionColliderHandler-->exitHandler",part);
            this.colliderCheck(part);
        }
        
        // console.log("MotionColliderHandler-->exitHandler",this.node.group,other.group,other.name);
    },
    
    //DirectionType
    // Left: 0,
    // Up: 1,
    // Right: 2,
    // Down: 3,
    // ConerA: 4,
    // ConerB: 5,
    // ConerC: 6,
    // ConerD: 7,
    
    checkGroup:function(event){
        var userData = event.getUserData();
        
        var actorEnum = ColliderGroupMapping[userData.actor.node.group];
        var otherEnum = ColliderGroupMapping[userData.other.node.group];
        if(actorEnum===undefined || otherEnum===undefined){
            return false;
        }
        
        if(actorEnum == ColliderGroupEnum.Player && otherEnum == ColliderGroupEnum.Terrain ||
            actorEnum == ColliderGroupEnum.Enemy && otherEnum == ColliderGroupEnum.Terrain ||
            actorEnum == ColliderGroupEnum.Resource && otherEnum == ColliderGroupEnum.Terrain){
            return true;
        }

        return false;
    },

    enterAt : function(userData){
        // console.log("MotionColliderHandler-->enterAt",userData.part,userData.other.node.group);
        var part= userData.part;
        var lArray;
        
        if(this.lockArray[part]===undefined){
            this.lockArray[part] = [];
        }
        lArray = this.lockArray[part];
        lArray.push(userData);

        this.colliderCheck(part);
        // console.log("MotionColliderHandler-->enterAt");
    },
    
    exitFrom : function( other , direction ){
        // console.log("MotionColliderHandler-->exitFrom",other.node.group,direction);
        var partArr = [];
        var part;
        if(direction == DirectionType.ConerA){
            part= DirectionType.Down;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
            
            part= DirectionType.Right;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.ConerB){
            part= DirectionType.Down;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
            
            part= DirectionType.Left;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.ConerC){
            part= DirectionType.Up;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
            
            part= DirectionType.Left;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.ConerD){
            part= DirectionType.Up;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
            
            part= DirectionType.Right;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.Up){
            part= DirectionType.Down;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.Down){
            part= DirectionType.Up;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.Left){
            part= DirectionType.Right;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }
        else if(direction == DirectionType.Right){
            part = DirectionType.Left;
            if(this.clearpartLockArray(part)){
                partArr.push(part);
            }
        }

        var kArray;
        var userData;
        for(var key in this.lockArray){
            kArray = this.lockArray[key];
            for(var jkey in kArray){
                userData = kArray[jkey];
                // console.log("MotionColliderHandler-->exitFrom other",jkey,userData,userData.other);
                if(userData.other==other){
                    kArray.splice(jkey,1);
                    // console.log("MotionColliderHandler-->exitFrom other",key);
                    partArr.push(key); 
                    return partArr;
                }
            }
        }
        
        // console.log("MotionColliderHandler-->exitFrom partArr",partArr,partArr.length);
        
        return partArr;
    },
    
    clearpartLockArray : function(part){
        // console.log("MotionColliderHandler-->clearpartLockArray",part,this.lockArray[part]);
        var kArray = this.lockArray[part];
        if(kArray!==undefined&&kArray.length>0){
            kArray.length = 0;
            // console.log("MotionColliderHandler-->clearpartLockArray true",part,this.lockArray[part].length);
            return true;
        }
        
        return false;
    },
    
    colliderCheck: function( part){
        if(part===undefined){
            return;
        }
        var kArray;
        if(this.lockArray[part]===undefined){
            this.lockArray[part] = [];
        }
        kArray = this.lockArray[part];

        // console.log("MotionColliderHandler-->colliderCheck",part,kArray.length);

        var event;
        var data = {};
        var bool = kArray.length>0;
        if(part==DirectionType.Up){
            if(bool){
                event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
                data.direction = part;
                data.bool = bool;
            }
            // console.log("MotionColliderHandler-->dispatchEventUp",bool,part);
        }
        else if(part==DirectionType.Down){
            event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
            data.direction = part;
            data.bool = bool;
            // console.log("MotionColliderHandler-->dispatchEventDown",bool,part);
            // if(this.node.group=="Player"){
            //     console.log("MotionColliderHandler-->dispatchEventDown",bool,part);
            // }
        }
        else if(part==DirectionType.Left || part==DirectionType.Right){
            event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
            data.direction = part;
            data.bool = bool;
            // console.log("MotionColliderHandler-->dispatchEventLeftRight",bool,part);
            // if(this.node.group=="Player"){
            //     console.log("MotionColliderHandler-->dispatchEventLeftRight",bool,part);
            // }
        }
            
        if(event){
            event.setUserData(data);
            // console.log("MotionColliderHandler-->dispatchEvent ",data.direction);
            this.dispatchLockEvent( event );
        }
        
        // console.log("MotionColliderHandler-->colliderCheck");
    },
    
    dispatchLockEvent : function(event){
        this.node.dispatchEvent( event );

        var lockcount = 0;
        var keyArr;
        for(var key in this.lockArray){
            keyArr = this.lockArray[key];
            // console.log("MotionColliderHandler-->dispatchLockEvent",key,keyArr.length,keyArr);
            // for(var keyj in keyArr){
            //     var nodej = keyArr[keyj];
            //     console.log("MotionColliderHandler-->dispatchLockEvent",keyj,nodej,nodej.group,nodej.name);
            // }
            lockcount +=keyArr.length;
        }
        if(lockcount){
            this.node.color = cc.Color.RED;
        }
        else{
            this.node.color = cc.Color.WHITE;
        }
        // console.log("MotionColliderHandler-->dispatchLockEvent",lockcount);
    },

    rigidBodyCheck:function(userData){
        var part= userData.part;
        var other = userData.other;
        var actor = userData.actor;
        var otherAabb = other.world.aabb;
        var actorAabb = actor.world.aabb;
        
        // console.log("MotionColliderHandler-->rigidBodyCheck1",part);
        // console.log("MotionColliderHandler-->rigidBodyCheck",actor.node.group);

        var pos;
        var oNodePos = this.node.position;
        var posWorld = this.node.parent.convertToWorldSpaceAR(oNodePos);
        var otherPosWorld;
        if(other.node.parent===null){
            otherPosWorld = otherAabb.center;
        }
        else{
            otherPosWorld = other.node.parent.convertToWorldSpaceAR(other.node.position);
        }
        // console.log("MotionColliderHandler1",otherPosWorld);
        if(part==DirectionType.Up){
            pos = new cc.Vec2(posWorld.x,otherPosWorld.y - otherAabb.height*.5 - actorAabb.height*.5);
        }
        else if(part==DirectionType.Down){
            pos = new cc.Vec2(posWorld.x,otherPosWorld.y + otherAabb.height*.5 + actorAabb.height*.5);
            // pos = new cc.Vec2(posWorld.x,otherPosWorld.y + otherAabb.height*.5 + actorAabb.height*.5 + 1);
        }
        else if(part== DirectionType.Left){
            pos = new cc.Vec2(otherPosWorld.x + otherAabb.width*.5 + actorAabb.width*.5,posWorld.y);
        }
        else if(part== DirectionType.Right){
            pos = new cc.Vec2(otherPosWorld.x - otherAabb.width*.5 - actorAabb.width*.5,posWorld.y);
        }
        // console.log("MotionColliderHandler1",pos,actorPos);
        // console.log("MotionColliderHandler1",this.node.position);
        // console.log("MotionColliderHandler1",this.node.parent.convertToWorldSpaceAR(this.node.position));

        this.node.position =  this.node.parent.convertToNodeSpaceAR(pos);
        
        this.revisePart(userData,pos,otherPosWorld,posWorld);

        // console.log("MotionColliderHandler-1",pos,this.node.position);
        // console.log("MotionColliderHandler-1",this.node.parent.convertToWorldSpaceAR(this.node.position));
        // console.log("MotionColliderHandler4",this.node.parent.convertToNodeSpace(pos));
        // console.log("MotionColliderHandler6",cc.js.getClassName(this.node.parent),this.node.parent.name,this.node.parent.position);
        // console.log("MotionColliderHandler-->rigidBodyCheck2",part);
    },
    
    revisePart: function(userData,actorPos,otherPos,oActorPos){
        var direction = userData.direction;
        var part= userData.part;
        var other = userData.other;
        var kArray = this.lockArray[part];

        var offset = actorPos.sub(otherPos);
        
        // console.log("MotionColliderHandler-->revisePart",part);
        
        // if(this.node.group =="Player"){
        //     console.log("MotionColliderHandler-->revisePart1",part);
        // }

        var kOtherSize=userData.other.world.aabb;
        var kActorSize=userData.actor.world.aabb;
        
        if(Math.abs(offset.x)==(kActorSize.width+kOtherSize.width)*.5
                    &&Math.abs(offset.y)==(kActorSize.height+kOtherSize.height)*.5){
            if(offset.x>0&&offset.y>0){
                if(direction == DirectionType.Left){
                    part= DirectionType.Down;
                }
                else if(direction == DirectionType.Down){
                    part= DirectionType.Left;
                }
            }
            else if(offset.x>0&&offset.y<0){
                if(direction == DirectionType.Left){
                    part= DirectionType.Up;
                }
                else if(direction == DirectionType.Up){
                    part= DirectionType.Left;
                }
            }
            else if(offset.x<0&&offset.y<0){
                if(direction == DirectionType.Up){
                    part= DirectionType.Right;
                }
                else if(direction == DirectionType.Right){
                    part= DirectionType.Up;
                }
            }
            else if(offset.x<0&&offset.y>0){
                if(direction == DirectionType.Down){
                    part= DirectionType.Right;
                }
                else if(direction == DirectionType.Right){
                    part= DirectionType.Down;
                }
            }
        }

        userData.actor.world.aabb.center.x = actorPos.x;
        userData.actor.world.aabb.center.y = actorPos.y;
        userData.part= part;
        
        // if(this.node.group =="Player"){
        //     console.log("MotionColliderHandler-->revisePart2",part,offset);
        // }
        
        var lArray;
        if(this.lockArray[part]===undefined){
            this.lockArray[part] = [];
        }
        lArray = this.lockArray[part];
        lArray.push(userData);
        this.colliderCheck(part);
        
        
        // console.log("MotionColliderHandler-->revisePart2",part);
    },
    
    stayHandler : function( event ){
        if(this.enable!==true){
            return;
        }
    },
});
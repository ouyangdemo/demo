var EventType = require("EventType");
var DirectionType = require("DirectionType");

var ColliderGroupMapping = require("ColliderGroupMapping");
var ColliderGroupEnum = require("ColliderGroupEnum");

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
        // ...rightOffsetRate
        activeOnEnable : true,
    },

    // use this for initialization
    onLoad: function () {
        
        this.initListener();

    },
    
    onEnable: function () {

        this.enable = this.activeOnEnable;

        // console.log("onEnable",this.enable,this.node.group);
    },
    
    onDisable: function () {

    },
    
    initListener: function(){
        this.node.on(EventType.ConlliderEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
    },
    
    componentEnable : function( event ){
        var userData = event.getUserData();
        if(!userData.enable){
            userData.enable = true;
        }
        this.enable = userData.enable;
        
        // console.log("componentEnable");
    },
    
    onCollisionEnter: function (other, self) {
        if(this.enable!==true){
            return;
        }
        
        // console.log("CheckCollider--->onCollisionEnter",self.node.group,other.node.group,this.enable);
        // console.log("CheckCollider--->onCollisionEnter");

        //conllider
        // ConlliderEnable : 10,
        // ConlliderEnter : 11,
        // ConlliderStay : 12,
        // ConlliderExit : 13,

        var event = new cc.Event.EventCustom(EventType.ConlliderEnter, true);
        var userData = {};
        userData.other = other;
        userData.actor = self;

        // check part
        var customCollider = this.customCollider(other, self , true);
        userData.direction = customCollider.direction;
        userData.part= customCollider.part;
        userData.actorPos = customCollider.actorPos;
        // console.log("ConlliderEnter-->customFormDirection",userData.direction,userData.tangent,userData.part);
        
        // if(userData.direction === undefined && this.node.group == "Player"){
        //     console.log("ConlliderEnter--> direction undefined",this.node.group);
        // }

        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
    
    customCollider : function(other, self ,enter){
        // console.log("CheckCollider--->customCollider enter",enter);
        var otherAabb = other.world.aabb;
        var selfAabb = self.world.aabb;
        var otherPreAabb = other.world.preAabb;
        var selfPreAabb = self.world.preAabb;
        
        var collider = this.calculateCollider(otherAabb,otherPreAabb,selfAabb,selfPreAabb,enter);

        var direction = collider.direction;
        var part= collider.part;
        var actorPos = collider.actorPos;
        
        if(direction == DirectionType.ConerA){
            part= DirectionType.Left;
        }
        else if(direction == DirectionType.ConerB){
            part= DirectionType.Right;
        }
        else if(direction == DirectionType.ConerC){
            part= DirectionType.Down;
        }
        else if(direction == DirectionType.ConerD){
            part= DirectionType.Down;
        }
        
        if(direction == DirectionType.Left || direction == DirectionType.Right){
            if(otherPreAabb.yMax.toFixed(3) == selfPreAabb.yMin.toFixed(3)){//Exclude landing
                part= DirectionType.Down;
            }
            else if(otherPreAabb.yMin.toFixed(3) == selfPreAabb.yMax.toFixed(3)){//Exclude press
                part= DirectionType.Up;
            }
        }
        // else if(direction == DirectionType.Up || direction == DirectionType.Down){
        //     if(otherPreAabb.xMax.toFixed(3) == selfPreAabb.xMin.toFixed(3)){//Exclude left
        //         part= DirectionType.Left;
        //     }
        //     else if(otherPreAabb.xMin.toFixed(3) == selfPreAabb.xMax.toFixed(3)){//Exclude right
        //         part= DirectionType.Right;
        //     }
        // }
        
        // if(self.node.group == "Player"){
        //     console.log("CheckCollider--->customCollider",direction,part,actorPos);
        // }
        // console.log("CheckCollider--->customCollider",direction,part,actorPos);
        return {direction,part,actorPos};
    },
    
    calculateCollider : function(otherAabb,otherPreAabb,actorAabb,actorPreAabb,enter){
        //speed
        var speed = this.calculateSpeed(otherAabb,otherPreAabb,actorAabb,actorPreAabb,enter);
        var otherSpeed = speed.otherSpeed;
        var actorSpeed = speed.actorSpeed;

        var otherXSpeed = otherSpeed.x;
        var otherYSpeed = otherSpeed.y;
        var actorXSpeed = actorSpeed.x;
        var actorYSpeed = actorSpeed.y;
        // console.log("CheckCollider--->calculateCollider speed",otherSpeed,actorSpeed);
    
        //colliderOffset
        var colliderOffsetX;
        var colliderOffsetY;
        if(actorXSpeed !== 0){
            if(actorXSpeed > 0){
                colliderOffsetX = actorAabb.xMax - otherAabb.xMin;
            }
            else{
                colliderOffsetX = actorAabb.xMin - otherAabb.xMax;
            }
        }
        else if(otherXSpeed !== 0){
            if(otherXSpeed > 0){
                colliderOffsetX = actorAabb.xMin - otherAabb.xMax;
            }
            else{
                colliderOffsetX = actorAabb.xMax - otherAabb.xMin;
            }
        }
        else{
            colliderOffsetX = 0;
        }
        
        if(actorYSpeed !== 0){
            if(actorYSpeed > 0){
                colliderOffsetY = actorAabb.yMax - otherAabb.yMin;
            }
            else{
                colliderOffsetY = actorAabb.yMin - otherAabb.yMax;
            }
        }
        else if(otherYSpeed !== 0){
            if(otherYSpeed > 0){
                colliderOffsetY = actorAabb.yMin - otherAabb.yMax;
            }
            else{
                colliderOffsetY = actorAabb.yMax - otherAabb.yMin;
            }
        }
        else{
            colliderOffsetY = 0;
        }
        // console.log("CheckCollider--->calculateCollider colliderOffset",colliderOffsetX,colliderOffsetY);
        
        //check axis
        var otherPreAabbClone = otherPreAabb.clone();
        var actorPreAabbClone = actorPreAabb.clone();
        otherPreAabbClone.x = otherAabb.x;
        actorPreAabbClone.x = actorAabb.x;
        var checkX = cc.Intersection.rectRect(actorPreAabbClone,otherPreAabbClone);
        
        // if(this.node.group=="Player"&&!xaxis&&!yaxis&&!coner){
        //     console.log("CheckCollider--->calculateDirection",checkX,enter,
        //                                         cc.Intersection.rectRect(otherPreAabb,actorPreAabb),
        //                                         cc.Intersection.rectRect(otherPreAabbClone,actorPreAabbClone));
        // }
        
        otherPreAabbClone = otherPreAabb.clone();
        actorPreAabbClone = actorPreAabb.clone();
        otherPreAabbClone.y = otherAabb.y;
        actorPreAabbClone.y = actorAabb.y;
        var checkY = cc.Intersection.rectRect(actorPreAabbClone,otherPreAabbClone);

        var xaxis = enter&&checkX&&!checkY || !enter&&!checkX&&checkY;
        var yaxis = enter&&!checkX&&checkY || !enter&&checkX&&!checkY;
        var coner = enter&&!checkX&&!checkY || !enter&&!checkX&&!checkY;
        // console.log("CheckCollider--->calculateCollider checkAxis",xaxis,yaxis,coner);
        
        // if(this.node.group=="Player"&&!xaxis&&!yaxis&&!coner){
        //     console.log("CheckCollider--->calculateDirection",checkY,enter,
        //                                         cc.Intersection.rectRect(otherPreAabb,actorPreAabb),
        //                                         cc.Intersection.rectRect(otherPreAabbClone,actorPreAabbClone));
        // }

        //backTime
        var xBackTime;
        var yBackTime;
        var backTime;
        if (enter&&!checkY || !enter&&checkY) {
            xBackTime = Math.abs(colliderOffsetX/(actorXSpeed - otherXSpeed));
        }
        if (enter&&!checkX || !enter&&checkX){
            yBackTime = Math.abs(colliderOffsetY/(actorYSpeed - otherYSpeed));
        }
        // console.log("CheckCollider--->calculateCollider backTime",xBackTime,yBackTime);
        
        if (xaxis) {
        //x-axis
            // console.log("CheckCollider--->calculateCollider x-axis");
            backTime = xBackTime;
        }
        else if (yaxis) {
        //y-axis
            // console.log("CheckCollider--->calculateCollider y-axis");
            backTime = yBackTime;
        }
        else if (coner){
        //xy-axis
            // console.log("CheckCollider--->calculateCollider xy-axis");
            backTime = xBackTime <= yBackTime ? xBackTime : yBackTime;
        }
        // console.log("CheckCollider--->calculateCollider backTime",backTime,xBackTime,yBackTime);
        
        var direction = this.calculateDirection(xaxis,yaxis,coner,speed);
        // console.log("CheckCollider--->calculateCollider direction",direction);
        var part = this.calculatepart(coner,direction,xBackTime,yBackTime);
        // console.log("CheckCollider--->calculateCollider part",part);
        
        // if(this.node.group=="Player"&&direction===undefined){
        //     console.log("CheckCollider--->calculateCollider",checkX,checkY,enter,
        //                                         otherPreAabb,actorPreAabb,
        //                                         otherAabb,actorAabb);
        // }
        
        // if(this.node.group=="Player"){
        //     console.log("CheckCollider--->calculateCollider direction",direction);
        // }

        //colliderPosition
        // console.log("CheckCollider--->calculateCollider colliderPosition",actorAabb.center,actorXSpeed,actorYSpeed,backTime);
        var otherPos = otherAabb.center.sub(new cc.Vec2(otherXSpeed,otherYSpeed).mul(backTime));
        var actorPos = actorAabb.center.sub(new cc.Vec2(actorXSpeed,actorYSpeed).mul(backTime));
        // console.log("CheckCollider--->calculateCollider colliderPosition",actorPos,otherPos);
        
        //test
        var otherAabbClone = otherAabb.clone();
        var actorAabbClone = actorAabb.clone();
        // console.log("CheckCollider--->calculateCollider 1",otherAabbClone,actorAabbClone);
        otherAabbClone.x = otherPos.x;
        otherAabbClone.y = otherPos.y;
        actorAabbClone.x = actorPos.x;
        actorAabbClone.y = actorPos.y;
        // console.log("CheckCollider--->calculateCollider 2",otherAabbClone,actorAabbClone);
        var check = cc.Intersection.rectRect(actorAabbClone,otherAabbClone);
        // console.log("CheckCollider--->calculateCollider",check);
        
        // console.log("CheckCollider--->calculateCollider",direction,part,actorPos,enter);
        return {direction,part,actorPos};
    },
    
    calculateSpeed : function(otherAabb,otherPreAabb,actorAabb,actorPreAabb){
        var otherCenter = otherAabb.center;
        var actorCenter = actorAabb.center;
        var otherPreCenter = otherPreAabb.center;
        var actorPreCenter = actorPreAabb.center;
        
        var otherSpeed = otherCenter.sub(otherPreCenter);
        var actorSpeed = actorCenter.sub(actorPreCenter);
        
        // console.log("CheckCollider--->calculateSpeed",otherSpeed,actorSpeed);
        return {otherSpeed,actorSpeed};
    },
    
    calculateDirection : function(xaxis,yaxis,coner,speed){
        var otherXSpeed = speed.otherSpeed.x;
        var otherYSpeed = speed.otherSpeed.y;
        var actorXSpeed = speed.actorSpeed.x;
        var actorYSpeed = speed.actorSpeed.y;

        var direction;
        if(xaxis) {
            if(actorXSpeed - otherXSpeed > 0){
                direction = DirectionType.Right;
            }
            else if(actorXSpeed - otherXSpeed < 0){
                direction = DirectionType.Left;
            }
        }
        else if (yaxis) {
            if(actorYSpeed - otherYSpeed > 0){
                direction = DirectionType.Up;
            }
            else if(actorYSpeed - otherYSpeed < 0){
                direction = DirectionType.Down;
            }
        }
        else if (coner){
            if(actorXSpeed - otherXSpeed > 0){
                if(actorYSpeed - otherYSpeed > 0){
                    direction= DirectionType.ConerB;//break
                }
                else if(actorYSpeed - otherYSpeed < 0){
                    direction = DirectionType.ConerC;
                }
            }
            else if(actorXSpeed - otherXSpeed < 0){
                if(actorYSpeed - otherYSpeed > 0){
                    direction = DirectionType.ConerA;
                }
                else if(actorYSpeed - otherYSpeed < 0){
                    direction = DirectionType.ConerD;
                }
            }
        }
        
        if(this.node.group=="Player" && direction === undefined ){
            console.log("CheckCollider--->calculateDirection",direction,xaxis,yaxis,coner,
                                            actorXSpeed - otherXSpeed,actorYSpeed - otherYSpeed);
        }

        // console.log("CheckCollider--->calculateDirection",direction,xaxis,yaxis,coner);
        return direction;
    },
    
    calculatepart: function(coner,direction,xBackTime,yBackTime){
        var part= direction;
        if (coner){
            if(xBackTime > yBackTime){
                if(part=== DirectionType.ConerA){
                    part= DirectionType.Up;
                }
                else if(part=== DirectionType.ConerB){
                    part= DirectionType.Up;
                }
                else if(part=== DirectionType.ConerC){
                    part= DirectionType.Down;
                }
                else if(part=== DirectionType.ConerD){
                    part= DirectionType.Down;
                }
            }
            else if(xBackTime < yBackTime){
                if(part=== DirectionType.ConerA){
                    part= DirectionType.Right;
                }
                else if(part=== DirectionType.ConerB){
                    part= DirectionType.Left;
                }
                else if(part=== DirectionType.ConerC){
                    part= DirectionType.Right;
                }
                else if(part=== DirectionType.ConerD){
                    part= DirectionType.Left;
                }
            }
        }
        
        // console.log("CheckCollider--->calculatepart",part,xaxis,yaxis,coner);
        return part;
    },
    
    onCollisionStay: function (other, self) {
        if(this.enable!==true){
            return;
        }
        
    },
    
    onCollisionExit: function (other, self) {
        if(this.enable!==true){
            return;
        }
        
        // console.log("onCollisionExit",self.node.group,other.node.group,this.enable);
        var event = new cc.Event.EventCustom(EventType.ConlliderExit, true);
        var userData = {};
        userData.other = other;
        userData.actor = self;
        
        var customCollider = this.customCollider(other, self , false);
        userData.direction = customCollider.direction;
        userData.part= customCollider.part;
        userData.actorPos = customCollider.actorPos;
        // console.log("CheckCollider--->onCollisionExit-->",userData.direction,userData.tangent,userData.part,this.node.group);
        
        // if(self.node.group == "Player"){
        //     console.log("CheckCollider--->onCollisionExit-->",userData.direction,userData.tangent,userData.part);
        // }
        
        // if(userData.direction === undefined  && this.node.group == "Player"){
        //     console.log("onCollisionExit--> direction undefined",this.node.group);
        // }
        
        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

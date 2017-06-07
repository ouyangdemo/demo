var EventType = require("EventType");
var StateType = require("StateType");
var GlobalReference = require("GlobalReference");

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
        // actor : {
        //     default : null,
        //     type: cc.Node,
        // },
        cameraWindow : {
            default: null,
            type: cc.Node,
        },
        focusPosRatio : new cc.Vec2(0.5,0),
        cameraAccelerate : new cc.Vec2(200,0),
        cameraInitSpeed : new cc.Vec2(300,0),
        followers : {
            default: [],
            type: [cc.Node],
        },
        scales : {
            default: [],
            type: [cc.Vec2],
        },
        activeOnEnable:true,
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    onEnable: function () {
        GlobalReference.CameraFollow = this.node;
        
        this.enable = this.activeOnEnable;
        
        // console.log("CameraFollow--->onEnable");
        this.initParameter();
        // console.log("CameraFollow--->onEnable",this.cameraWindow.position);
        // console.log("CameraFollow--->onEnable",this.cameraWindow.parent.convertToWorldSpaceAR(this.cameraWindow.position));
        
        // test
        var ctx = this.cameraWindow.getComponent(cc.Graphics);
        ctx.lineWidth = 5;
        ctx.strokeColor = cc.Color.WHITE;
        ctx.moveTo(0,0);
        ctx.lineTo(0,this.cameraWindow.height);
        ctx.lineTo(this.cameraWindow.width,this.cameraWindow.height);
        ctx.lineTo(this.cameraWindow.width,0);
        ctx.lineTo(0,0);
        ctx.moveTo(this.cameraWindow.width*(1-this.focusPosRatio.x)*.5,this.cameraWindow.height*(1+this.focusPosRatio.y)*.5);
        ctx.lineTo(this.cameraWindow.width*(1+this.focusPosRatio.x)*.5,this.cameraWindow.height*(1+this.focusPosRatio.y)*.5);
        ctx.lineTo(this.cameraWindow.width*(1+this.focusPosRatio.x)*.5,this.cameraWindow.height*(1-this.focusPosRatio.y)*.5);
        ctx.lineTo(this.cameraWindow.width*(1-this.focusPosRatio.x)*.5,this.cameraWindow.height*(1-this.focusPosRatio.y)*.5);
        ctx.lineTo(this.cameraWindow.width*(1-this.focusPosRatio.x)*.5,this.cameraWindow.height*(1+this.focusPosRatio.y)*.5);
        ctx.stroke();
        
    },
    
    onDisable: function () {
        this.enable = false;
    },
    
    initListener: function(){
        this.node.on(EventType.CameraFollowEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.CameraFollowTarget, 
            function (event) {
                this.cameraFollowTarget(event);
            },
            this);
        this.node.on(EventType.MoveState, 
            function (event) {
                //console.log(event.type);
                this.TargetMoveState(event);
            },
            this);
    },
    
    TargetMoveState : function( event ){
        var userData = event.getUserData();
        var state = userData.state;
        // console.log("CameraFollow--->TargetMoveState",state);
        var direction;
        if(state==StateType.MoveRight){
            direction = new cc.Vec2(1,this.direction.y);
        }
        if(state==StateType.MoveLeft){
            direction = new cc.Vec2(-1,this.direction.y);
        }

        this.setDirection(direction);
    },
    
    cameraFollowTarget : function( event ){
        var userData = event.getUserData();
        var target = userData.target;
        var direction = userData.direction;
        
        this.setActorTarget(target);
        this.setDirection(direction);
    },

    componentEnable : function( event ){
        var userData = event.getUserData();
        this.enable = userData.enable;
    },
    
    
    setActorTarget : function(target){
        if(target===undefined||this.target == target){
            return;
        }
        this.target = target;
        this.targetLastPos = this.target.position;

        var targetPos = this.target.parent.convertToWorldSpaceAR(this.target.position);
        var targetCameraPos = this.cameraWindow.convertToNodeSpaceAR(targetPos);
        // console.log("CameraFollow--->setActorTarget",this.target,this.enable);
    },
    
    setDirection : function(direction){
        // console.log("CameraFollow--->setDirection",direction);
        if(direction===undefined){
            return;
        }
        
        if(this.direction.x!=direction.x){
            this.direction.x=direction.x;
         }
        if(this.direction.y!=direction.y){
            this.direction.y=direction.y;
        }
        
        // console.log("CameraFollow--->setDirection",this.direction,direction);
    },
    
    initParameter:function(){
        if(this.focusPosRatio.x<0||this.focusPosRatio.x>1){
            this.focusPosRatio.x = 0;
        }
        if(this.focusPosRatio.y<0||this.focusPosRatio.y>1){
            this.focusPosRatio.y = 0;
        }
        
        this.boundary = new cc.Vec2(this.cameraWindow.width*.5,this.cameraWindow.height*.5);
        this.focusBasePos = new cc.Vec2(this.boundary.x*this.focusPosRatio.x,this.boundary.y*this.focusPosRatio.y);
        this.focusPos = new cc.Vec2(0,0);
        
        this.direction = new cc.Vec2(0,0);
        this.speed = new cc.Vec2(0,0);
        this.anchorPosition = {x:false,y:false};
        this.ifFocusing = {x:false,y:false};

        // console.log("CameraFollow--->initParameter",this.boundary,this.focusBasePos);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // console.log("CameraFollow--->update");
        if(this.enable===false||this.target===undefined){
            return;
        }
        
        if(!this.targetLastPos.equals(this.target.position)){
            this.calculateFocusing(dt);
        }
        
        if(this.anchorPosition.x===true || this.anchorPosition.y===true){
            this.anchorFocusingPos(dt);
        }
        
        if(this.ifFocusing.x===true || this.ifFocusing.y===true){
            this.focusing(dt);
        }
        
        this.targetLastPos = this.target.position;
        // console.log("CameraFollow--->update",focusDirection,this.target.position);
        // console.log("CameraFollow--->update",this.target.parent.convertToWorldSpaceAR(this.target.position));
    },
    
    calculateFocusing:function(dt){
        // console.log("CameraFollow--->calculateFocusPos");
        var targetPos = this.target.parent.convertToWorldSpaceAR(this.target.position);
        var targetCameraPos = this.cameraWindow.convertToNodeSpaceAR(targetPos);
        // console.log("CameraFollow--->calculateFocusPos",targetCameraPos.x,this.direction);
     
        if(this.anchorPosition.x===false){
            if(Math.abs(targetCameraPos.x)>this.boundary.x){
                this.focusPos.x = -this.focusBasePos.x*this.direction.x;
                this.anchorPosition.x = true;
                this.speed.x =0;
            }
            else if(Math.abs(targetCameraPos.x)<this.focusBasePos.x && this.focusPos.x*this.direction.x<=0){
                this.ifFocusing.x = true;
            }
            else{
                this.ifFocusing.x = false;
            }
        }
        
        if(this.anchorPosition.y===false){
            if(Math.abs(targetCameraPos.y)>this.boundary.y){
                this.focusPos.y = -this.focusBasePos.y*this.direction.y;
                this.anchorPosition.y = true;
                this.speed.y =0;
            }
            else if(Math.abs(targetCameraPos.y)<this.focusBasePos.y && this.focusPos.y*this.direction.y<=0){
                this.ifFocusing.y = true;
            }
            else{
                this.ifFocusing.y = false;
            }
        }
        
        // console.log("CameraFollow--->calculateFocusPos1",Math.abs(targetCameraPos.x));
        // console.log("CameraFollow--->calculateFocusPos2",this.focusPos,this.direction);
        // console.log("CameraFollow--->calculateFocusPos3",this.ifFocusing.x,this.ifFocusing.y);
    },
    
    anchorFocusingPos : function(dt){
        var targetPos = this.target.parent.convertToWorldSpaceAR(this.target.position);
        var targetCameraPos = this.cameraWindow.convertToNodeSpaceAR(targetPos);
        
        // console.log("CameraFollow--->anchorFocusingPos",this.focusPos.x,targetCameraPos.x);
        var offsetx = 0;
        var offsety = 0;
        if(this.anchorPosition.x===true){
            offsetx = this.focusPos.x-targetCameraPos.x;
        }
        if(this.anchorPosition.y===true){
            offsety = this.focusPos.y-targetCameraPos.y;
        }
        // console.log("CameraFollow--->anchorFocusingPos",offsetx,dt,this.speed.x);
        
        if(offsetx!==0){
            if(this.speed.x < Math.abs(this.cameraInitSpeed.x)){
                this.speed.x = Math.abs(this.cameraInitSpeed.x);
            }
            // console.log("CameraFollow--->anchorFocusingPos",offsetx,dt,this.speed.x,tSpeed);
            if(this.speed.x*dt < Math.abs(offsetx)){
                offsetx = Math.abs(offsetx)/offsetx*this.speed.x*dt;
                this.speed.x = this.speed.x + this.cameraAccelerate.x * dt;
            }
            else{
                this.anchorPosition.x = false;
                this.ifFocusing.x = true;
            }
        }
        
        if(offsety!==0){
            if(this.speed.x < Math.abs(this.cameraInitSpeed.y)){
                this.speed.x = Math.abs(this.cameraInitSpeed.y);
            }
            if(this.speed.y*dt < Math.abs(offsety)){
                offsety = Math.abs(offsety)/offsety*this.speed.y*dt;
                this.speed.y = this.speed.y + this.cameraAccelerate.y * dt;
            }
            else{
                this.anchorPosition.y = false;
                this.ifFocusing.y = true;
            }
        }
        // console.log("CameraFollow--->anchorFocusingPos",this.speed,this.cameraAccelerate,dt);
        // console.log("CameraFollow--->anchorFocusingPos",offsetx,this.speed.x,this.speed.x*dt);

        this.focusTarget(offsetx,offsety);
    },

    focusing:function(dt){
        // console.log("CameraFollow--->focusing");
        var targetPos = this.target.parent.convertToWorldSpaceAR(this.target.position);
        var targetCameraPos = this.cameraWindow.convertToNodeSpaceAR(targetPos);
        
        var offsetx = 0;
        var offsety = 0;
        if(this.ifFocusing.x===true){
            offsetx = this.focusPos.x-targetCameraPos.x;
        }
        if(this.ifFocusing.y===true){
            offsety = this.focusPos.y-targetCameraPos.y;
        }

        // console.log("CameraFollow--->focusing1",offsetx,offsety);
        // console.log("CameraFollow--->focusing1",this.focusPos.x,targetCameraPos.x);
        
        if(offsetx===0&&offsety===0){
            return;
        }
        
        // console.log("CameraFollow--->focusing",offsetx,offsety);
        this.focusTarget(offsetx,offsety);
    },
    
    focusTarget: function(offsetx,offsety){
        // console.log("CameraFollow--->focusTarget",offsetx,offsety);
        if(offsetx===0&&offsety===0){
            return;
        }
        var follower;
        var scale;

        for(var key in this.followers){
            follower = this.followers[key];
            scale = this.scales[key];
            if(scale === undefined){
                scale = new Vec2(1,1);
            }

            follower.position = follower.position.add(new cc.Vec2(offsetx*scale.x,offsety*scale.y));
            // console.log("CameraFollow--->follower.position2",follower.position,offsetx * scale.x,offsety * scale.y);
        }
        // console.log("CameraFollow--->follower.position2",follower.position,offsetx * scale.x,offsety * scale.y);
        
        var targetPos = this.target.parent.convertToWorldSpaceAR(this.target.position);
        var targetCameraPos = this.cameraWindow.convertToNodeSpaceAR(targetPos);
        // console.log("CameraFollow--->focusTarget",targetCameraPos.x);
    },
});

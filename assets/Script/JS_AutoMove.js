var EventType = require("EventType");
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
        index: {
            default : -1,
            type: cc.Integer,
        },
        distance : {
            default : 0,
            min: 0,
        },
        speed : {
            default : 50,
            min: 0,
        },
        directionEnum  : {
            default : DirectionType.Left,
            type: DirectionType,
        },
        activeOnEnable : true,
    },
    
    onLoad: function () {
        this.enable = false;
        
        this.initListener();
        
        // console.log("AutoMove--->onLoad");
    },
    
    onEnable: function () {
        this.enable = this.activeOnEnable;
        this.offset=0;
        this.direction = this.checkDirectionEnum(this.directionEnum);
        // console.log("AutoMove--->onEnable",this.distance,this.index);
        // console.log("AutoMove--->onEnable",!this.distance.equals( cc.Vec2.ZERO ));
        // console.log("AutoMove--->onEnable",this.direction);
    },
    
    onDisable: function () {

    },

    initListener : function(){
        this.node.on(EventType.AutoMoveEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.AutoMoveReverse, 
            function (event) {
                this.MoveReverse(event);
            },
            this);
    },
    
    componentEnable : function( event ){
        var userData = event.getUserData();
        if(userData.index!=this.index){
            return;
        }
        
        this.enable = userData.enable;
        this.offset=0;
        this.direction = this.checkDirectionEnum(this.directionEnum);
        if(userData.distance){
            this.distance=userData.distance;
        }
        if(userData.speed){
            this.speed=userData.speed;
        }
        
        // console.log("AutoMove--->componentEnable",this.direction);
    },
    
    MoveReverse : function( event ){
        var userData = event.getUserData();
        if(userData.index!=this.index){
            return;
        }
        
        this.enable = true;
        this.offset=0;
        this.direction = this.direction*-1;
        
        // console.log("AutoMove--->MoveReverse",this.direction);
    },
    
    checkDirectionEnum:function(directionEnum){
        var direction;
        if(directionEnum === DirectionType.Left || directionEnum === DirectionType.Down){
            direction = -1;
        }
        else if(directionEnum === DirectionType.Right || directionEnum === DirectionType.Up){
            direction = 1;
        }
        else{
            direction = 0;
        }
        
        // console.log("AutoMove--->checkDirectionEnum",this.direction);
        return direction;
    },
    
    offsetDirectionEnum:function(offset,directionEnum){
        if(directionEnum === DirectionType.Left || directionEnum === DirectionType.Right){
            this.node.x += offset;
        }
        else if(directionEnum === DirectionType.Down || directionEnum === DirectionType.Up){
            this.node.y += offset;
        }
        
        // console.log("AutoMove--->offsetDirectionEnum",this.node.x,this.node.y);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // console.log("AutoMove--->update",this.direction,this.enable,this.directionEnum);
        if(this.speed*this.direction===0){
            this.enable=false;
        }
        if(this.enable===true){
            var offset = dt*this.speed*this.direction;
            this.offset += offset;
            if(this.distance===0){
                this.offsetDirectionEnum(offset,this.directionEnum);
            }
            else if(Math.abs(this.offset)<this.distance){
                this.offsetDirectionEnum(offset,this.directionEnum);
            }
            else{
                // console.log("AutoMove--->update dispatchEvent",offset,this.offset,this.distance);
                offset = offset - this.offset +  (this.distance)*this.direction;
                // console.log("AutoMove--->update dispatchEvent",offset,this.offset,this.distance);
                this.offsetDirectionEnum(offset,this.directionEnum);
                this.enable=false;
                
                var event = new cc.Event.EventCustom(EventType.AutoMoveComplete, true );
                var userData={};
                userData.index = this.index;
                event.setUserData(userData);
                // console.log("AutoMove--->update dispatchEvent",event,userData,userData.index);
                this.node.dispatchEvent( event );
            }
        }
    },
});

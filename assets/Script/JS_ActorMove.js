var EventType = require("EventType");
var DirectionType = require("DirectionType");
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
        maxSpeed : {
            default : 400,
            min: 0,
        },
        initialSpeed:{
            default : 100,
            min: 0,
        },
        accelerate : {
            default : 300,
            min: 0,
        },
        dragAccelerate : {
            default : 800,
            min: 0,
        },
        stopLimit : {
            default : 20,
            min: 1,
        },
    },

    // use this for initialization
    onLoad: function () {

        
        this.initListener();
        
    },
    
    onEnable: function () {
        this.stateType = StateType.Idle;
        this.leftLock = false;
        this.rightLock = false;
        this.speed = 0;
    },
    
    onDisable: function () {

    },
    
    //control
    // ActorMove: 0,
    // ActorMoveStop: 1,
    // ActorJump: 2,
    // ActorJumpStop: 3,
    // ActorMotionLock: 4,
    
    initListener : function(){
        this.node.on(EventType.ActorMove, 
            function (event) {
                //console.log(event.type);
                this.aMove(event);
            },
            this);

        this.node.on(EventType.ActorMoveStop, 
            function (event) {
                //console.log(event.type);
                this.aStop(event);
            },
            this);
 
         this.node.on(EventType.ActorMotionLock, 
            function (event) {
                //console.log(event.type);
                this.aLock(event);
            },
            this);
    },
    
    // // StateType
    // Idle: 0,
    // //move
    // MoveLeft:1,
    // MoveRight:2,
    // MoveToStop:3,
    // //jump
    // Landing:4,
    // Jump:5,
    // Jump2:6,
    // Falling:7,
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var offsetSpeed;
        if(this.stateType == StateType.MoveRight){
            if(this.rightLock === true){
                this.speed = 0;
                return;
            }
            else{
                this.movingSpeed(1,dt);
            }
        }
        else if(this.stateType == StateType.MoveLeft){
            if(this.leftLock === true){
                this.speed = 0;
                return;
            }
            else{
                this.movingSpeed(-1,dt);
            }
        }

        if(this.stateType == StateType.MoveToStop){
            if(this.speed > 0 && this.rightLock === true){
                this.speed = 0;
            }
            else if(this.leftLock === true){
                this.speed = 0;
            }
            else{
                this.stoppingSpeed(dt);
            }
        }

        if(this.speed === 0){
            if(this.stateType == StateType.MoveToStop){
                this.mIdleState();
            }
        }
        
        // console.log("ActorMove--->update",this.stateType,this.speed," : ",this.maxSpeed);
        this.node.x +=this.speed*dt;
    },
    
    movingSpeed:function(direction,dt){
        if(Math.abs(this.speed) < this.initialSpeed || this.speed*direction < 0){
            this.speed = this.initialSpeed*direction;
        }
        else{
            this.speed += parseInt(this.accelerate*dt)*direction;
        }
        
        if(Math.abs(this.speed) > this.maxSpeed){
            this.speed = this.maxSpeed*direction;
        }
        
        // console.log("ActorMove--->movingSpeed",this.speed,direction);
    },
    
    stoppingSpeed:function(dt){
        var direction;
        if(Math.abs(this.speed) < this.stopLimit ){
            this.speed = 0;
        }
        else{
            if(this.speed > 0){
                this.speed -= parseInt(this.dragAccelerate)*dt;
            }
            else{
                this.speed += parseInt(this.dragAccelerate)*dt;
            }
        }
    },
    
    //DirectionType
    // UpLeft:0,
    // Up:1,
    // UpRight:2,
    // RightUp:3,
    // Right:4,
    // RightDown:5,
    // DownRight:6,
    // Down:7,
    // DownLeft:8,
    // LeftDown:9,
    // Left:10,
    // LeftUp:11,

    aMove: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;

        event = new cc.Event.EventCustom(EventType.ActorMotionFree, true );
        userData = {};
        if(direction==DirectionType.Left) {
            this.mMovingLeftState();
            userData.direction  = DirectionType.Right;
         }
        else if(direction==DirectionType.Right){
            this.mMovingRightState();
            userData.direction  = DirectionType.Left;
        }
        else{
            return;
        }
        
        event.setUserData(userData);
        this.node.dispatchEvent( event );
    },

    mMovingLeftState: function() {
        this.stateType = StateType.MoveLeft;
        
        var event = new cc.Event.EventCustom(EventType.MoveState, true );
        var userData = {};
        userData.state  = this.stateType;
        event.setUserData(userData);
        GlobalReference.CameraFollow.dispatchEvent( event );
        this.node.scaleX = -1;
        
        // console.log("ActorMove--->mMovingLeftState");
    },
    
    mMovingRightState: function() {
        this.stateType = StateType.MoveRight;
        
        var event = new cc.Event.EventCustom(EventType.MoveState, true );
        var userData = {};
        userData.state  = this.stateType;
        event.setUserData(userData);
        GlobalReference.CameraFollow.dispatchEvent( event );
        this.node.scaleX = 1;
        
        // console.log("ActorMove--->mMovingRightState");
    },
    
    aStop: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;

        if(direction==DirectionType.Left) {
            if(this.speed < 0 ){
                this.mMoveToStopState();
            }
        }
        else if(direction==DirectionType.Right){
            if(this.speed > 0 ){
                this.mMoveToStopState();
            }
        }
        
        if(this.speed === 0 ){
            this.mIdleState();
        }
    },

    mMoveToStopState: function() {
        
        this.stateType = StateType.MoveToStop;

    },
    
    mIdleState: function() {
        
        this.stateType = StateType.Idle;

    },
    
    aLock: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;
        var lock = userData.bool;
        
        // console.log("ActorMove--->",direction,lock);
        if(direction==DirectionType.Left) {
            this.leftLock = lock;
        }
        else if(direction==DirectionType.Right){
            this.rightLock = lock;
        }
        
        // console.log("ActorMove--->aLock",direction,lock,this.rightLock,direction==DirectionType.Right,direction===DirectionType.Right);
    },
});

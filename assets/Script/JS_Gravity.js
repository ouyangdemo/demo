var EventType = require("EventType");
var StateType = require("StateType");
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
        gravity : 2048,
        gStateType : {
            default:StateType.Landing,
            type:StateType,
        },
        activeOnEnable : true,
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
        this.speed = 0;
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
    
    onEnable: function () {
        this.stateType = this.gStateType;
        this.enable = this.activeOnEnable;
        // console.log("Gravity--->onEnable",this.stateType);
    },
    
    onDisable: function () {

    },
     
    //gravity
    // ActorLanding: 20,
    // ActorFalling: 21,
        
    initListener : function(){
        this.node.on(EventType.GravityEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.ActorFalling, 
            function (event) {
                // console.log("Gravity--->",event.type);
                this.gFallDown();
            },
            this);
        this.node.on(EventType.ActorMotionLock, 
            function (event) {
                this.gLock(event);
            },
            this);
    },
    
    componentEnable : function( event ){
        var userData = event.getUserData();
        this.enable = userData.enable;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.enable!==true){
            return;
        }
        // console.log("Gravity-->update",this.stateType,StateType.Falling,this.stateType === StateType.Falling,this.stateType == StateType.Falling);
        if(this.stateType === StateType.Falling){
            var endSpeed = this.speed - dt * this.gravity;
            var offsetY = (endSpeed + this.speed)/2 * dt;
            
            this.node.y += offsetY;
            this.speed = endSpeed;
            // console.log("Gravity-->update Falling",this.speed);
        }
    },
    
    gLanding: function() {
        if(this.enable!==true){
            return;
        }
        // console.log("gLanding-->",this.stateType);
        this.stateType = StateType.Landing;
        this.speed = 0;
        
        var event = new cc.Event.EventCustom(EventType.ActorLanding, true );
        this.node.dispatchEvent( event );
    },
    
    gFallDown: function() {
        // console.log("gFallDown-->",this.enable);
        if(this.enable!==true&&this.stateType!=StateType.Falling){
            return;
        }
        // console.log("gFallDown-->",this.stateType);
        this.stateType = StateType.Falling;
        this.speed = 0;
        //  console.log("gFallDown-->",this.stateType);
        // if(this.node.group=="Player"){
        //     console.log("Gravity-->gFallDown");
        // }
    },
    
    gLock: function(event) {
        if(this.enable!==true){
            return;
        }
        var userData = event.getUserData();
        var direction = userData.direction;
        var lock = userData.bool;
        // console.log("gLock-->",direction,DirectionType.Down,lock,direction !== DirectionType.Down,direction != DirectionType.Down);
        if(direction != DirectionType.Down){
            return;
        }
        // if(this.node.group == "Player"){
        //     console.log("gLock-->",this.stateType,lock);    
        // }
        // console.log("gLock-->",this.stateType,lock);
        if(lock){
            this.gLanding();
        }
        else{
            this.gFallDown();
        }

    },
});

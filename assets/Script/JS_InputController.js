var EventType = require("EventType");
var DirectionType = require("DirectionType");
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
        activeOnEnable:true,
    },

    // use this for initialization
    onLoad: function () {
        // console.log("InputController--->onLoad");
        this.initListener();
    },
    
    onEnable: function () {
        // GlobalReference.InputController = this.node;
        
        this.enable = this.activeOnEnable;        
        // console.log("InputController--->onEnable");
    },
    
    onDisable: function () {

    },
    
    start: function () {

        // console.log("InputController--->start");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
        // console.log("InputController--->update",GlobalReference.PlayerInstance);
    // },
    
    initListener : function(){
        var self = this;
        //add keyboard input listener to call turnLeft and turnRight
        var listener = {
            event: cc.EventListener.KEYBOARD, 
            onKeyPressed: function(keyCode, event) {
                // console.log("InputController--->onKeyPressed",self.actor);
                if(self.target===undefined){
                    return;
                }
                if(keyCode == cc.KEY.a || keyCode == cc.KEY.left){
                    self.mLeft();
                }
                else if(keyCode == cc.KEY.d || keyCode == cc.KEY.right){
                    self.mRight();
                }
                else if(keyCode == cc.KEY.j){
                    self.mJump();
                }
            },
            onKeyReleased: function(keyCode, event) {
                // console.log("InputController--->onKeyPressed",self.actor);
                if(self.target===undefined){
                    return;
                }
                if(keyCode == cc.KEY.a || keyCode == cc.KEY.left){
                    self.mLeftStop();
                }
                else if(keyCode == cc.KEY.d || keyCode == cc.KEY.right){
                    self.mRightStop();
                }
                else if(keyCode == cc.KEY.j){
                    self.mJumpStop();
                }
            },
        }
        
        cc.eventManager.addListener(listener, self.node);
        
        this.node.on(EventType.InputControllerEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.InputControllerTarget, 
            function (event) {
                this.inputControllerTarget(event);
            },
            this);
    },
    
    componentEnable : function( event ){
        var userData = event.getUserData();
        this.enable = userData.enable;
        
        // console.log("InputController--->componentEnable",this.enable);
    },

    inputControllerTarget : function( event ){
        var userData = event.getUserData();
        var target = userData.target;
        
        this.setActorTarget(target);
    },
    
    setActorTarget : function(target){
        if(target===undefined){
            return;
        }
        this.target = target;
    },
    
    //control
    // ActorMove: 0,
    // ActorMoveStop: 1,
    // ActorJump: 2,
    // ActorJumpStop: 3,
    
    mLeft: function() {
        // console.log("InputController--->mLeft",this.enable);
        if(this.enable===false||this.target===undefined){
            return;
        }
        var event = new cc.Event.EventCustom(EventType.ActorMove, true );
        var userData = {};
        userData.direction = DirectionType.Left;
        event.setUserData(userData);

        // console.log("InputController--->mLeft",this.target,event.type,userData.direction);        
        this.target.dispatchEvent( event );
    },

    mRight: function() {
        if(this.enable===false||this.target===undefined){
            return;
        }
        var event = new cc.Event.EventCustom(EventType.ActorMove, true );
        var userData = {};
        userData.direction = DirectionType.Right;
        event.setUserData(userData);
        
        // console.log(event.type,userData.direction);
        
        this.target.dispatchEvent( event );
    },
    
    mJump: function() {
        if(this.enable===false||this.target===undefined){
            return;
        }
        var event = new cc.Event.EventCustom(EventType.ActorJump, true );
        
        // console.log(event.type);
        
        this.target.dispatchEvent( event );
    },
    
    mLeftStop: function() {
        if(this.enable===false||this.target===undefined){
            return;
        }
        var event = new cc.Event.EventCustom(EventType.ActorMoveStop, true );
        var userData = {};
        userData.direction = DirectionType.Left;
        event.setUserData(userData);
        
        // console.log(event.type,userData.direction);        
        this.target.dispatchEvent( event );
    },
    
    mRightStop: function() {
        if(this.enable===false||this.target===undefined){
            return;
        }
        var event = new cc.Event.EventCustom(EventType.ActorMoveStop, true );
        var userData = {};
        userData.direction = DirectionType.Right;
        event.setUserData(userData);
        
        // console.log(event.type,userData.direction);        
        this.target.dispatchEvent( event );
    },
    
    mJumpStop: function() {
        if(this.enable===false||this.target===undefined){
            return;
        }
        var event = new cc.Event.EventCustom(EventType.ActorJumpStop, true );
        
        // console.log(event.type);        
        this.target.dispatchEvent( event );
    },

});

var EventType = require("EventType");
var GlobalReference = require("GlobalReference");
var PrefabType = require("PrefabType");

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
        event:{
            default : EventType.PlayerStep,
            type: EventType,
        },
        emit:{
            default : EventType.PlayerStep,
            type: EventType,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    initListener : function(){
        // console.log("PlayerStep-->initListener",this.event);
        this.addEachListener(this.event);
    },
    
    addEachListener:function(event){
        this.node.on(event, 
            function (event) {
                // console.log("PlayerStep-->addEachListener",event);
                var userData = event.getUserData();
                this.playerStepToJump();
                 return;
            },
        this);
    },

    playerStepToJump:function(){
        // console.log("PlayerStep-->playerStepToJump");
        var event = new cc.Event.EventCustom(EventType.ActorLanding, true);
        // var userData={};
        // event.setUserData(userData);
        this.node.dispatchEvent(event);
        event = new cc.Event.EventCustom(EventType.ActorJump, true);
        // userData={};
        // event.setUserData(userData);
        this.node.dispatchEvent(event);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

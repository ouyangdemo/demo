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
            default : EventType.ObjectPush,
            type: EventType,
        },
        emit:{
            default : EventType.InstanceChange,
            type: EventType,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },

    initListener : function(){
        // console.log("JS_GameEventEmitter-->initListener",this.event);
        this.addEachListener(this.event);
    },
    
    addEachListener:function(event){
        this.node.on(event, 
            function (event) {
                // console.log("JS_GameEventEmitter-->addEachListener",event);
                var userData = event.getUserData();
                this.emitGameModeEvent(this.emit,userData);
                return;
            },
        this);
    },

    emitGameModeEvent:function(emit,userData){
        if(emit===undefined){
            return;
        }
        
        var event = new cc.Event.EventCustom(emit, true);
        userData.node = this.node;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

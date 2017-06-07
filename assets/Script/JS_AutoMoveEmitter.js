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
        index: {
            default : -1,
            type: cc.Integer,
        },
        event:{
            default : EventType.AutoMoveComplete,
            type: EventType,
        },
        emits:{
            default : [],
            type: [EventType],
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    initListener : function(){
        // console.log("AutoMoveEmitter-->initListener",this.event);
        this.addEachListener(this.event);
    },
    
    addEachListener:function(event){
        this.node.on(event, 
            function (event) {
                var userData = event.getUserData();
                // console.log("AutoMoveEmitter-->addEachListener",event,userData,userData.index,this.index);
                if(this.index == userData.index){
                    this.emitInstanceManagerEvent(this.emits,userData);
                }
            },
        this);
    },

    emitInstanceManagerEvent:function(emits,userData){
        if(emits===undefined){
            return;
        }
        
        var event;
        var emit;
        for(var i=0;i<emits.length;i++){
            emit = emits[i];
            event = new cc.Event.EventCustom(emit, true);
            event.setUserData(userData);
            this.node.dispatchEvent(event);
            // console.log("AutoMoveEmitter-->emitInstanceManagerEvent",emit);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

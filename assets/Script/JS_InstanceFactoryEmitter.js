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
        type: {
            default:PrefabType.BrickSmash,
            type:PrefabType,
        },
        event:{
            default : EventType.ObjectPush,
            type: EventType,
        },
        emit:{
            default : EventType.InstanceChange,
            type: EventType,
        },
        pool:true,
        prefabType: {
            default:PrefabType.BrickSmash,
            type:PrefabType,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    initListener : function(){
        // console.log("InstanceManagerEmitter-->initListener",this.event);
        this.addEachListener(this.event);
    },
    
    addEachListener:function(event){
        this.node.on(event, 
            function (event) {
                // console.log("InstanceManagerEmitter-->addEachListener",event);
                var userData = event.getUserData();
                this.emitInstanceManagerEvent(this.emit,userData);
                return;
            },
        this);
    },

    emitInstanceManagerEvent:function(emit,userData){
        if(emit===undefined){
            return;
        }
        
        var event = new cc.Event.EventCustom(emit, true);
        userData.root = this.node.parent;
        userData.target = this.node;
        userData.type = this.type;
        userData.pool = this.pool;
        userData.prefabType = this.prefabType;
        userData.position = this.node.position;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
        
        // console.log("InstanceManagerEmitter-->emitInstanceManagerEvent",emit,userData.type);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

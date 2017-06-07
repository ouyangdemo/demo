var EventType = require("EventType");

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
            default : EventType.EmitterParameter1,
            type: EventType,
        },
        pName:[cc.String],
        pValue: [cc.Float],
        emit: {
            default : EventType.EmitterParameterEmit,
            type: EventType,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    initListener : function(){
        // console.log("EmitterNumParameterAssist-->initListener",this.event);
        this.addEachListener(this.event);
    },
    
    addEachListener:function(event){
        this.node.on(event, 
            function (event) {
                // console.log("EmitterNumParameterAssist-->addEachListener",event);
                var userData = event.getUserData();
                for(var key in this.pName){
                    userData[this.pName[key]] = this.pValue[key];
                }
                this.emitInstanceManagerEvent(this.emit,userData);
                 return;
            },
        this);
    },
    
    emitInstanceManagerEvent:function(emit,userData){
        if(emit===undefined){
            return;
        }
        
        // console.log("EmitterNumParameterAssist-->emitInstanceManagerEvent",userData.index,userData.sss);
        var event = new cc.Event.EventCustom(emit, true);
        event.setUserData(userData);
        this.node.dispatchEvent(event);
        // console.log("EmitterNumParameterAssist-->emitInstanceManagerEvent",emit,userData.type);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

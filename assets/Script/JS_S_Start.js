var EventType = require("EventType");
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
    },

    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(true);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    btnStart : function(event,data){
        // console.log("JS_S_Start--->btnStart",data);
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        var userData = {};
        userData.sceneName = data;
        event.setUserData(userData);
        if(GlobalReference.GameInstance!==null){
            GlobalReference.GameInstance.dispatchEvent(event);
        }
    },
});

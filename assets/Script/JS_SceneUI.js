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
        this.initListener();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    initListener : function(){
        this.node.on(EventType.SceneShowUI, 
            function (event) { 
                this.showUI(event);
            },
            this);
        this.node.on(EventType.SceneHideUI, 
            function (event) { 
                this.hideUI(event);
            },
            this);
    },

    showUI : function (event) {
        // console.log("SceneUI-->showUI");
        var userData = event.getUserData();
        event = new cc.Event.EventCustom(EventType.ManagerInteractUI, true );
        userData.show = true;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },

    hideUI : function (event) {
        // console.log("SceneUI-->hideUI");
        var userData = event.getUserData();
        event = new cc.Event.EventCustom(EventType.ManagerInteractUI, true );
        userData.show = false;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },
});

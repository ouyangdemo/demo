var EventType = require("EventType");
var GameStateType = require("GameStateType");
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

    onEnable: function () {
        this.statePause = false;
    },
    
    initListener : function(){
        this.node.on(EventType.SceneStart, 
            function (event) { 
                this.sceneStart(event);
            },
            this);
        this.node.on(EventType.ScenePause, 
            function (event) { 
                this.scenePause(event);
            },
            this);
    },

    sceneStart : function () {
        // console.log("JS_SceneState-->sceneResume");
        if(this.statePause===false){
            return;
        }
        this.statePause=false;
        
        this.enableInput(true);
        cc.game.resume();
    },

    scenePause : function () {
        // console.log("JS_SceneState-->scenePause");
        if(this.statePause===true){
            return;
        }
        this.statePause=true;
        
        this.enableInput(false);
        cc.game.pause();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    enableInput : function (enable) {
        var event = new cc.Event.EventCustom(EventType.InputControllerEnable, true );
        var userData = {};
        userData.enable = enable;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },
});

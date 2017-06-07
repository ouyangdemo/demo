var EventType = require("EventType");
var GlobalReference = require("GlobalReference");
var InteractUIGroup = require("InteractUIGroup");

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
    
    initListener : function(){
        this.node.on(EventType.SceneEnd, 
            function (event) {
                this.sceneEnd(event);
            },
            this);
        this.node.on(EventType.SceneWin, 
            function (event) { 
                this.sceneWin(event);
            },
            this);
    },
 
    onEnable: function () {
    },
    
    onDisable: function () {
    },
    
    start: function () {
    },    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    sceneEnd : function (event) {
        // console.log("JS_SGameResult-->sceneEnd");
        var userData = {};
        var event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIGroup = InteractUIGroup.GameOver;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
        
        event = new cc.Event.EventCustom(EventType.ScenePause, true );
        // event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },

    sceneWin : function (event) {
        // console.log("JS_SGameResult-->sceneWin");
        var userData = {};
        var event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIGroup = InteractUIGroup.GameOver;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
        
        event = new cc.Event.EventCustom(EventType.ScenePause, true );
        // event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },
});
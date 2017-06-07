var EventType = require("EventType");
var InteractUIGroup = require("InteractUIGroup");
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
    },

    onEnable: function () {
    },
    
    onDisable: function () {
    },

    initUI: function () {
        // console.log("JS_UI_SceneState--->initUI");
    },

    setUIData: function (initData) {
    //    console.log("JS_UI_SceneState--->setUIData",initData);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    btnPause : function(event,data){
        // console.log("UISceneState--->btnPause",data);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIGroup = InteractUIGroup.GamePause;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
        
        event = new cc.Event.EventCustom(EventType.ScenePause, true );
        GlobalReference.SceneMode.dispatchEvent(event);
    },
});

var EventType = require("EventType");
var InteractUIGroup = require("InteractUIGroup");
var SceneType = require("SceneType");
var SceneStateType = require("SceneStateType");
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
    
    initListener : function(){

    },

    onEnable: function () {
        // console.log("JS_UI_SceneOver--->onEnable");
    },
    
    onDisable: function () {
    },

    start: function () {
        // console.log("JS_UI_SceneOver--->start");
    },

    initUI: function () {
        // console.log("JS_UI_SceneOver--->initUI");
    },

    setUIData: function (event) {
        var userData = event.getUserData();
       console.log("JS_UI_SceneOver--->setUIData",userData.state);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    btnResart : function(event,data){
        this.sceneResume();

        // console.log("UISceneOver--->btnResart",data);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        userData.sceneName = cc.director.getScene().name;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },
    
    btnExit : function(event,data){
        // console.log("UISceneOver--->btnExit",data);
        this.sceneResume();

        var userData = {};
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        userData.sceneEnum = SceneType.Select;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },
    
    btnResume : function(event,data){
        // console.log("UISceneOver--->btnResume",data);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIGroup = InteractUIGroup.GameRun;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
        
        this.sceneResume();
    },
    
    btnContinue : function(event,data){
        // console.log("UISceneOver--->btnContinue",data);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIGroup = InteractUIGroup.GameRun;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
        event = new cc.Event.EventCustom(EventType.PlayerRespawn, true );
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);

        this.sceneResume();
    },
    
    btnNext : function(event,data){
        // console.log("UISceneOver--->btnNext",data);
        this.sceneResume();

        var userData = {};
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        userData.sceneName = GlobalReference.NextScene;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },

    sceneResume : function(){
        // console.log("UISceneOver--->btnResume",data);
        var event = new cc.Event.EventCustom(EventType.SceneStart, true );
        GlobalReference.SceneMode.dispatchEvent(event);
    },
});

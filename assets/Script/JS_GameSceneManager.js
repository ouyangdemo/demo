var EventType = require("EventType");
var SceneType = require("SceneType");
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
        sceneType:{
            default : [],
            type: [SceneType],
        },
        sceneName:[cc.String],
    },

    // use this for initialization
    onLoad: function () {
        
        this.initListener();
        
        // console.log("GameSceneManager--->onLoad");
    },
    
    initListener : function(){
        this.node.on(EventType.GameLoadingScene, 
            function (event) {
                this.gameLoadingScene(event);
            },
            this);
        this.node.on(EventType.LoadingUIComplete,
            function (event) {
                this.loadingUIComplete(event);
            },
            this);
         this.node.on(EventType.SceneLoadingComplete,
            function (event) {
                this.sceneLoadingComplete(event);
            },
            this);
        this.node.on(EventType.SceneEnterComplete,
            function (event) {
                this.sceneEnterComplete(event);
            },
            this);
    },
    
    onEnable: function () {
        // console.log("GameSceneManager--->onEnable");
    },
    
    onDisable: function () {

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    gameLoadingScene:function(event){        
        var userData = event.getUserData();
        var loadingName = this.sceneName[SceneType.Loading];
        cc.director.loadScene(loadingName);
        var nextSceneName = userData.sceneName;
        if(nextSceneName===undefined){
            if(userData.sceneEnum!==undefined){
                nextSceneName = this.sceneName[userData.sceneEnum];
            }
        }
        
        if(nextSceneName!==undefined){
            this.nextSceneName = nextSceneName;
        }
        // console.log("GameSceneManager--->gameLoadingScene",userData.sceneEnum,userData.sceneName,loadingName,this.nextSceneName);
    },
    
    loadingUIComplete:function(event){
        event = new cc.Event.EventCustom(EventType.LoadingScene, true );
        var userData={};
        userData.sceneName = this.nextSceneName;
        // console.log("GameSceneManager--->loadingUIComplete",userData.sceneName,this.nextSceneName);
        event.setUserData(userData);
        GlobalReference.Loading.dispatchEvent(event);
    },

    sceneLoadingComplete: function (event) {
        var userData = event.getUserData();
        // console.log("GameSceneManager--->sceneLoadingComplete",userData.sceneName);
        event = new cc.Event.EventCustom(EventType.EnterScene, true );
        event.setUserData(userData);
        GlobalReference.Loading.dispatchEvent( event );
    },
    
    sceneEnterComplete: function (event) {
        var userData = event.getUserData();
        // console.log("GameSceneManager--->sceneEnterComplete",userData.sceneName);
        
    },
});
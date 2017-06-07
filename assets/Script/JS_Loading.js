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
        loadingBackground: {
            default: null,
            type: cc.Node
        },
        
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        progressLabel: {
            default: null,
            type: cc.Label
        },

        rate: 0.1,
    },

    // use this for initialization
    onLoad: function () {
        // console.log("LoadingUI--->onLoad");
        
        this.initListener();
        this.progressBar.progress = 0;
    },
    
    initListener : function(){
        this.node.on(EventType.LoadingScene, 
            function (event) {
                this.testShowLoadingUIpreloadScene(event);
                // this.preloadScene(event);
            },
            this);
        this.node.on(EventType.EnterScene,
            function (event) {
                this.enterScene(event);
            },
            this);
    },
    
    onEnable: function () {
        GlobalReference.Loading = this.node;
        // console.log("LoadingUI--->onEnable");
        var event = new cc.Event.EventCustom(EventType.LoadingUIComplete, true );
        var userData={};
        event.setUserData(userData);

        if(GlobalReference.GameInstance!==null){
            GlobalReference.GameInstance.dispatchEvent(event);
        }
    },
    
    onDisable: function () {

    },
    
    testShowLoadingUIpreloadScene: function (event) {
        // console.log("LoadingUI--->testShowLoadingUIpreloadScene");
        this.loaded = false;
        var load = function(){
            this.progressBar.progress += 0.1;            
            if(this.progressBar.progress > 0.9&&this.loaded===false){
                this.preloadScene(event);
                this.loaded = true;
            }
        }
        this.schedule(load,this.rate);
    },
    
    preloadScene: function (event) {
        var userData = event.getUserData();
        // console.log("LoadingUI--->preloadScene",userData.sceneName);
        cc.director.preloadScene(userData.sceneName, this.preloadComplete(event));
    },
    
    preloadComplete: function (event) {
        var userData = event.getUserData();
        // console.log("LoadingUI--->preloadComplete",userData.sceneName);
        event = new cc.Event.EventCustom(EventType.SceneLoadingComplete, true );
        var data={};
        data.sceneName = userData.sceneName;
        event.setUserData(data);
        
        // console.log("LoadingUI--->preloadComplete22",GlobalReference.GameInstance.isChildClassOf(cc.node));
        GlobalReference.GameInstance.dispatchEvent(event);
    },
    
    enterScene: function (event) {
        var userData = event.getUserData();
        // console.log("LoadingUI--->enterScene",userData.sceneName);
         cc.director.loadScene(userData.sceneName);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
        
    // },
});
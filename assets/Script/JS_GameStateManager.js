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
    
    initListener : function(){
        this.node.on(EventType.GameState,
            function (event) {
                this.gameState(event);
            },
            this);
    },
    
     onEnable: function () {
        // console.log("GameStateManager--->onEnable");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    gameState : function (event) {
        var userData = event.getUserData();
        var type = userData.type;
        // console.log("GameStateManager-->gameState",type);
        
        if(type == GameStateType.Pause){
            this.pauseGame();
        }
        else if(type == GameStateType.Gaming){
            this.resumeGame();
        }
        else if(type == GameStateType.Over){
            this.overGame();
        }
    },

    startGame : function () {
        // console.log("GameStateManager-->resumeGame");
        
    },
    
    pauseGame : function () {
        // console.log("GameStateManager-->pauseGame");
        
    },

    resumeGame : function () {
        // console.log("GameStateManager-->resumeGame");
        
    },

    overGame : function () {
        // console.log("GameStateManager-->resumeGame");
        
    },
});

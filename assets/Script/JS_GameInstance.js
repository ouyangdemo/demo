var EventType = require("EventType");
var PrefabType = require("PrefabType");
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
        
        this.initListener();
        
        console.log("GameInstance--->onLoad");
    },
    
    initListener : function(){
      
    },
    
    start: function () {
        GlobalReference.GameInstance = this.node;
        
        console.log("GameInstance--->start GameInstance",GlobalReference.GameInstance);
        
        cc.game.addPersistRootNode(this.node);
        // removePersistRootNode
        // console.log("GameInstance.isPersistRootNode--->",cc.game.isPersistRootNode(this.node));
        // console.log("GameInstance--->start",GlobalReference.PlayerInstance);
    },
    
    onEnable: function () {

        // console.log("GameInstance--->onEnable");
    },
    
    onDisable: function () {

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
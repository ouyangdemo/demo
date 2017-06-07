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
        // console.log("JS_SceneMode-->start");
        GlobalReference.SceneMode = this.node;
        // this.initListener();
    },
    
    onDisable: function () {
        // this.removeListener();
    },
    
    start: function () {
        console.log("JS_SceneMode-->start",GlobalReference.SceneMode);
    },

    initListener: function () {
        
    },

    removeListener: function () {
        this.targetOff(this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
       
    // },
});
var GlobalReference = require("GlobalReference");
var EventType = require("EventType");
var PrefabType = require("PrefabType");

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
        type: {
            default:PrefabType.BrickSmash,
            type:PrefabType,
        },
        pool:true,
    },

    // use this for initialization
    onLoad: function () {
        this.myParticle = this.getComponent(cc.ParticleSystem);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.myParticle.particleCount === 0){
            this.putBackPool();
        }
    },
    
    onEnable: function () {
        // console.log("ParticlePool-->onEnable");
        this.myParticle.resetSystem();
    },
    
    onDisable: function () {
        
    },
    
    putBackPool:function(){
        // console.log("ParticlePool-->putBackPool");
        var event = new cc.Event.EventCustom(EventType.InstanceDelete, true);
        var userData = {};
        userData.target = this.node;
        userData.type = this.type;
        userData.pool = this.pool;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },
});

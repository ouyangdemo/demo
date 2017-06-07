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
        playerSpawnLayer : {
            default : null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox.enabled = true; 
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },
    
    initListener : function(){
        this.node.on(EventType.PlayerRespawn, 
            function (event) { 
                this.resetAtCheckpoint(event);
            },
            this);
    },
 
    onEnable: function () {
        GlobalReference.Checkpoint = this.playerSpawnLayer;
    },
    
    onDisable: function () {
        var event = new cc.Event.EventCustom(EventType.InstancePlayerPut, true);
        var userData={};
        event.setUserData(userData);
        if(GlobalReference.GameInstance!==null){
            GlobalReference.GameInstance.dispatchEvent(event);
        }
    },
    
    start: function () {
        // console.log("JS_SPlayerSpawner-->start");
        var initData;
        this.spawnPlayerInstance(initData);        
    },

    resetAtCheckpoint: function (event) {
        // console.log("JS_SPlayerSpawner-->resetAtCheckpoint");
        var initData;
        var checkpoint = GlobalReference.Checkpoint;
        var checkpointPosWorld = checkpoint.parent.convertToWorldSpaceAR(checkpoint.position);
        var playerCheckpointPos = this.playerSpawnLayer.convertToNodeSpaceAR(checkpointPosWorld);
        GlobalReference.PlayerInstance.position = playerCheckpointPos;
    },

    spawnPlayerInstance: function (initData) {
        // console.log("JS_SPlayerSpawner--->spawnPlayerInstance");
        var event = new cc.Event.EventCustom(EventType.InstancePlayerGet, true);
        var userData={};
        userData.initData = initData;
        userData.parent = this.playerSpawnLayer;
        
        userData.delegate = this;
        userData.callback = this.initScene;
        event.setUserData(userData);
        if(GlobalReference.GameInstance!==null){
            GlobalReference.GameInstance.dispatchEvent(event);
        }
    },
    
    initScene: function (delegate,target) {
        // console.log("JS_SPlayerSpawner--->initScene",target);
        if(target===undefined){
            return;
        }
        GlobalReference.PlayerInstance = target;
        delegate.setInputControllerTarget(target);
        delegate.setCameraFollowTarget(target);
        // console.log("JS_SPlayerSpawner--->initScene");
    },
    
    setInputControllerTarget: function (target) {
        // console.log("JS_SPlayerSpawner--->setInputControllerTarget",target);
        var event = new cc.Event.EventCustom(EventType.InputControllerTarget, true);
        var userData={};
        userData.target = GlobalReference.PlayerInstance;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },
    
    setCameraFollowTarget: function (target) {
        // console.log("JS_SPlayerSpawner--->setCameraFollowTarget",target);
        var event = new cc.Event.EventCustom(EventType.CameraFollowTarget, true);
        var userData={};
        userData.target = GlobalReference.PlayerInstance;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
    },
});
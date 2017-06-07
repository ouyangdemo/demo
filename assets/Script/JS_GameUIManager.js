var EventType = require("EventType");
var UIType = require("UIType");
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
        prefabType:{
            default : [],
            type: [UIType],
        },
        prefab:[cc.Prefab],
    },
    
    // use this for initialization
    onLoad: function () {
        // console.log("GameUIManager-->onLoad");
        
        this.showUIArray = [];
        this.poolArray = [];
        var arrLen = this.prefabType.length;
        for(var i = 0; i < arrLen; i++){
            this.poolArray[i] = new cc.NodePool();
        }
        
        var initCount;
        var instance;
        for(i = 0; i < arrLen; i++) {
            if(this.prefab[i]){
                instance = cc.instantiate(this.prefab[i]);
                this.poolArray[i].put(instance);
            }
        }
        
        this.initListener();
    },
    
    initListener : function(){
        this.node.on(EventType.ManagerInteractUI,
            function (event) { 
                this.managerInteractUI(event);
            },
            this);
        this.node.on(EventType.ManagerCloseAllUI,
            function (event) { 
                this.managerCloseAll(event);
            },
            this);
    },
    
    onEnable: function () {
        // console.log("GameUIManager-->onEnable");
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    managerInteractUI: function (event) {
        var userData = event.getUserData();
        var interactUIGroup = userData.interactUIGroup;
        var show = userData.show;
        var uiType;
        var data;
        // console.log("GameUIManager-->managerInteractUI",interactUIGroup);
        if(interactUIGroup==InteractUIGroup.GamePause){
            if(show===undefined||show===true){
                data = {};
                data.prefabType = UIType.SceneOver;
                data.root = cc.find("Canvas");
                data.position = new cc.Vec2(0,0);
                data.state = interactUIGroup;
                this.showUI(data);
            }
            else if(show===false){
                data = {};
                data.prefabType = UIType.SceneOver;
                data.pool = true;
                this.hideUI(data);
            }
        }
        else if(interactUIGroup==InteractUIGroup.GameRun){
            if(show===undefined||show===true){
                data = {};
                data.prefabType = UIType.SceneOver;
                data.pool = true;
                this.hideUI(data);
            }
        }
        else if(interactUIGroup==InteractUIGroup.GameOver){
            if(show===undefined||show===true){
                data = {};
                data.prefabType = UIType.SceneOver;
                data.root = cc.find("Canvas");
                data.position = new cc.Vec2(0,0);
                data.state = interactUIGroup;
                this.showUI(data);
            }
            else if(show===false){
                data = {};
                data.prefabType = UIType.SceneOver;
                data.pool = true;
                this.hideUI(data);
            }
        }
    },
    
    managerCloseAll: function (event) {
        // console.log("GameUIManager-->managerCloseAll",InteractUIGroup);
        var len = this.showUIArray.length;
        var userData = {};
        for(var i=0;i<len;i++){
            userData.prefabType = UIType.SceneOver;
            userData.pool = true;
            this.hideUI(userData);
        }
    },
    
    showUI: function (userData) {
        var root = userData.root;
        var prefabType = userData.prefabType;
        var position = userData.position;
        var state = userData.state;

        // console.log("GameUIManager-->showUI",target,prefabType,position);
        
        var prefabInstance = this.getPrefab(prefabType);
        if(position!==undefined){
            prefabInstance.position =  position;
        }
        else{
            prefabInstance.position =  new cc.Vec2(0,0);
        }
        
        prefabInstance.parent = root;

        this.showUIArray[prefabType] = prefabInstance;
        // console.log("GameUIManager-->showUI",prefabInstance.position,prefabInstance.parent);
    },
    
    hideUI: function (userData) {
        // var target = userData.target;
        var prefabType = userData.prefabType;
        var pool = userData.pool;
        
        var prefabInstance = this.showUIArray[prefabType];
        // console.log("GameUIManager-->hideUI",prefabInstance);
        
        if(pool){
            this.putBackPrefab(prefabType,prefabInstance);
        }
        else{
            target.destroy();
        }

        this.showUIArray[prefabType] = null;
    },
    
    getPrefab: function (type) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            // console.log("GameUIManager-->getPrefab undefined");
            return;
        }
        if(this.prefab[type]===undefined || this.poolArray[type]===undefined){
            // console.log("GameUIManager-->getPrefab undefined",type);
            return;  
        }

        // console.log("GameUIManager-->getPrefab",this.poolArray[type].size(),type);
        var instance = null;
        
        if (this.poolArray[type].size() > 0){
            instance = this.poolArray[type].get();
        }
        else{
            instance = cc.instantiate(this.prefab[type]);
        }
        // console.log("GameUIManager-->getPrefab",this.poolArray[type].size(),type,instance);

        return instance;
    },
    
    putBackPrefab: function (type,instance) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            // console.log("GameUIManager-->putBackPrefab undefined");
            return;
        }
        if(this.poolArray[type]===undefined){
            // console.log("GameUIManager-->putBackPrefab undefined",type);
            return;  
        }

        this.poolArray[type].put(instance);
        
        // console.log("GameUIManager-->putBackPrefab",this.poolArray[type].size(),type,instance);
    },
});
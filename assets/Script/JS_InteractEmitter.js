// var EventType = require("EventType");
// var DirectionType = require("DirectionType");
var ColliderGroupMapping = require("ColliderGroupMapping");
var JS_InteractEmitterAssist = require("JS_InteractEmitterAssist");

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
        collider:{
                default:[],
                type:[JS_InteractEmitterAssist],
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    initListener : function(){
        var emitterAssist;
        for(var i=0;i<this.collider.length;i++){
            emitterAssist = this.collider[i];
            this.addEachListener(emitterAssist);
        }
    },
    
    addEachListener:function(emitterAssist){
        var event = emitterAssist.event;
        var dArray = emitterAssist.part;
        var gArray = emitterAssist.group;
        var emit = emitterAssist.emit;
        var group;
        var part;
        this.node.on(event, 
            function (event) {
                var userData = event.getUserData();
                var otherGroupEnum = ColliderGroupMapping[userData.other.node.group];
                var check = this.checkGroup(otherGroupEnum,gArray);
                if(check){
                    part = userData.part;
                    check = this.checkPart(part,dArray);
                    if(check){
                        // console.log("InteractEmitter-->",ColliderGroupMapping[userData.other.node.group],emit);
                        this.emitObjectInteractEvent(emit,userData);
                    }
                }
                return;
            },
        this);
    },
    
    checkGroup:function(otherGroupEnum,gArray){
        if(otherGroupEnum===undefined){
            return false;
        }
        
        for(var i=0;i<gArray.length;i++){
            if(otherGroupEnum==gArray[i]){
                return true;
            }
        }
        
        return false;
    },
    
    checkPart:function(part,dArray){
        // console.log("InteractEmitter-->checkPart",part);
        if(dArray.length===0){
            return true;
        }
        
        for(var i=0;i<dArray.length;i++){
            if(part==dArray[i]){
                return true;
            }
        }
        
        return false;
    },

    emitObjectInteractEvent:function(emit,userData){
        var event = new cc.Event.EventCustom(emit, true);
        event.setUserData(userData);
        this.node.dispatchEvent(event);
        
        // console.log("InteractEmitter-->emitObjectInteractEvent",emit);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

var EventType = require("EventType");
var DirectionType = require("DirectionType");
var ColliderGroupEnum = require("ColliderGroupEnum");

var JS_InteractEmitterAssist = cc.Class({

    name: "JS_InteractEmitterAssist",

    ctor: function () {

    },

    properties: {
        event:{
            default : EventType.ConlliderEnter,
            type: EventType,
        },
        part:{
            default : [],
            type: [DirectionType],
        },
        group:{
            default : [],
            type: [ColliderGroupEnum],
        },
        
        emit:{
            default : EventType.ObjectPush,
            type: EventType,
        },
    },
});

module.exports = JS_InteractEmitterAssist;

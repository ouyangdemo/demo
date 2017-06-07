var StateType = cc.Enum({
    // StateType
    Idle: 0,
    //move
    MoveLeft:1,
    MoveRight:2,
    MoveToStop:3,
    //jump
    Landing:4,
    Jump:5,
    Jump2:6,
    Falling:7,
});

module.exports = StateType;
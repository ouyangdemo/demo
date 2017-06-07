var EventType =  cc.Enum({
    //control
    ActorMove: 0,
    ActorMoveStop: 1,
    ActorJump: 2,
    ActorJumpStop: 3,
    ActorMotionLock: 4,
    ActorMotionFree: 5,
    
    //conllider
    ConlliderEnable: 10,
    ConlliderEnter: 11,
    ConlliderStay: 12,
    ConlliderExit: 13,
    
    //gravity
    ActorLanding: 20,
    ActorFalling: 21,
    
    //autoMove
    AutoMoveReverse:30,
    AutoMoveComplete:31,
    
    //componentEnable
    MotionColliderHandlerEnable:40,
    CameraFollowEnable:41,
    GravityEnable:42,
    AutoMoveEnable:43,
    InputControllerEnable:44,
    
    //componentTarget
    CameraFollowTarget:50,
    InputControllerTarget:51,
    
    //instanceManager
    InstanceChange: 60,
    InstanceAdd: 61,
    InstanceDelete: 62,
    InstancePlayerGet: 63,
    InstancePlayerPut: 64,
    InstanceUIGet: 65,
    InstanceUIPut: 66,
    InstanceSetData: 67,
    
    //sceneEnterEvent
    GameLoadingScene: 70,
    LoadingUIComplete:71,
    LoadingScene:72,
    SceneLoadingComplete: 73,
    EnterScene: 74,
    SceneEnterComplete: 75,

    //camera
    
    //AnimationState
    MoveState:90,

    //objectInteractEvent
    ObjectPush : 100,
    ObjectCollect : 101,
    ObjectHit : 102,
    
    //gameInteractEvent
    BrickPush : 200,
    ResourceCollect : 201,
    EnemyHit : 202,
    
    //playerInteractEvent
    PlayerDamage : 300,
    PlayerStep : 301,
    PlayerLose : 302,
    PlayerWin : 303,
    
    //emitterParameterEvent
    EmitterParameterEmit : 400,
    EmitterParameter1 : 401,
    EmitterParameter2 : 402,
    
    //UIManager
    ManagerInteractUI: 500,
    ManagerCloseAllUI: 501,
    
    //GameEvent
    GameEvent: 600,
    GameState: 601,
    ClientToSceneDataSynchronize: 602,
    SceneToClientDataSynchronize: 603,
    
    //SceneEvent
    SceneStart: 700,
    ScenePause: 701,
    SceneSelect: 702,
    SceneRestart: 703,
    SceneNext: 704,
    SceneMapSelect: 705,
    SceneShowUI: 706,
    SceneHideUI: 707,
    SceneEnd: 708,
    SceneWin: 709,
    PlayerDie: 710,
    VictoryFlag: 711,
    SceneCheckpoint: 712,
    PlayerRespawn: 713,
});

module.exports = EventType;
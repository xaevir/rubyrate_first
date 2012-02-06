var tame = require('tamejs').runtime;
var __tame_defer_cb = null;
var __tame_fn_0 = function (__tame_k) {
    tame.setActiveCb (__tame_defer_cb);
    bcrypt = require ( 'bcrypt' )
    
    exports . create =
    function  (req, res) {
        var __tame_defer_cb = tame.findDeferCb ([req, res]);
        tame.setActiveCb (__tame_defer_cb);
        var __tame_this = this;
        var __tame_fn_1 = function (__tame_k) {
            tame.setActiveCb (__tame_defer_cb);
            var err, salt;
            var __tame_fn_2 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_defers = new tame.Deferrals (__tame_k);
                var __tame_fn_3 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    bcrypt . genSalt ( 10 ,
                    __tame_defers.defer ( { 
                        assign_fn : 
                            function () {
                                err = arguments[0];
                                salt = arguments[1];
                            }
                            ,
                        parent_cb : __tame_defer_cb,
                        line : 4,
                        file : "user.tjs"
                    } )
                    ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                __tame_fn_3(tame.end);
                __tame_defers._fulfill();
                tame.setActiveCb (null);
            };
            var err, hash;
            var __tame_fn_4 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_defers = new tame.Deferrals (__tame_k);
                var __tame_fn_5 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    bcrypt . hash ( req . form . password , salt ,
                    __tame_defers.defer ( { 
                        assign_fn : 
                            function () {
                                err = arguments[0];
                                hash = arguments[1];
                            }
                            ,
                        parent_cb : __tame_defer_cb,
                        line : 5,
                        file : "user.tjs"
                    } )
                    ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                __tame_fn_5(tame.end);
                __tame_defers._fulfill();
                tame.setActiveCb (null);
            };
            var __tame_fn_10 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                req . body . password = hash ;
                var __tame_fn_6 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    var err, user;
                    var __tame_fn_7 = function (__tame_k) {
                        tame.setActiveCb (__tame_defer_cb);
                        var __tame_defers = new tame.Deferrals (__tame_k);
                        var __tame_fn_8 = function (__tame_k) {
                            tame.setActiveCb (__tame_defer_cb);
                            db . collection ( 'users' ) . insert ( req . body ,
                            __tame_defers.defer ( { 
                                assign_fn : 
                                    function () {
                                        err = arguments[0];
                                        user = arguments[1];
                                    }
                                    ,
                                parent_cb : __tame_defer_cb,
                                line : 7,
                                file : "user.tjs"
                            } )
                            ) ;
                            tame.callChain([__tame_k]);
                            tame.setActiveCb (null);
                        };
                        __tame_fn_8(tame.end);
                        __tame_defers._fulfill();
                        tame.setActiveCb (null);
                    };
                    var __tame_fn_9 = function (__tame_k) {
                        tame.setActiveCb (__tame_defer_cb);
                        res . send ( true ) ;
                        req . session . user = user ;
                        tame.callChain([__tame_k]);
                        tame.setActiveCb (null);
                    };
                    tame.callChain([__tame_fn_7, __tame_fn_9, __tame_k]);
                    tame.setActiveCb (null);
                };
                tame.callChain([__tame_fn_6, __tame_k]);
                tame.setActiveCb (null);
            };
            tame.callChain([__tame_fn_2, __tame_fn_4, __tame_fn_10, __tame_k]);
            tame.setActiveCb (null);
        };
        tame.callChain([__tame_fn_1, __tame_k]);
        tame.setActiveCb (null);
    }
    ;
    
    
    exports . check_username =
    function  (req, res) {
        var __tame_defer_cb = tame.findDeferCb ([req, res]);
        tame.setActiveCb (__tame_defer_cb);
        var __tame_this = this;
        var __tame_fn_11 = function (__tame_k) {
            tame.setActiveCb (__tame_defer_cb);
            var err, user;
            var __tame_fn_12 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_defers = new tame.Deferrals (__tame_k);
                var __tame_fn_13 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    db . collection ( 'users' ) . findOne ( { username : req . form . username } ,
                    __tame_defers.defer ( { 
                        assign_fn : 
                            function () {
                                err = arguments[0];
                                user = arguments[1];
                            }
                            ,
                        parent_cb : __tame_defer_cb,
                        line : 15,
                        file : "user.tjs"
                    } )
                    ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                __tame_fn_13(tame.end);
                __tame_defers._fulfill();
                tame.setActiveCb (null);
            };
            var __tame_fn_14 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                    user ? res . send ( false ) : res . send ( true );
                    tame.callChain([tame.end, __tame_k]);
                tame.setActiveCb (null);
            };
            tame.callChain([__tame_fn_12, __tame_fn_14, __tame_k]);
            tame.setActiveCb (null);
        };
        tame.callChain([__tame_fn_11, __tame_k]);
        tame.setActiveCb (null);
    }
    ;
    
    
    exports . check_email =
    function  (req, res) {
        var __tame_defer_cb = tame.findDeferCb ([req, res]);
        tame.setActiveCb (__tame_defer_cb);
        var __tame_this = this;
        var __tame_fn_15 = function (__tame_k) {
            tame.setActiveCb (__tame_defer_cb);
            var err, user;
            var __tame_fn_16 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_defers = new tame.Deferrals (__tame_k);
                var __tame_fn_17 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    db . collection ( 'users' ) . findOne ( { email : req . form . email } ,
                    __tame_defers.defer ( { 
                        assign_fn : 
                            function () {
                                err = arguments[0];
                                user = arguments[1];
                            }
                            ,
                        parent_cb : __tame_defer_cb,
                        line : 23,
                        file : "user.tjs"
                    } )
                    ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                __tame_fn_17(tame.end);
                __tame_defers._fulfill();
                tame.setActiveCb (null);
            };
            var __tame_fn_18 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                    user ? res . send ( false ) : res . send ( true );
                    tame.callChain([tame.end, __tame_k]);
                tame.setActiveCb (null);
            };
            tame.callChain([__tame_fn_16, __tame_fn_18, __tame_k]);
            tame.setActiveCb (null);
        };
        tame.callChain([__tame_fn_15, __tame_k]);
        tame.setActiveCb (null);
    }
    ;
    
    exports . check_loggedin =
    function  (req, res) {
        return req . session . user ? res . send ( false ) : res . send ( true );
    }
    ;
    
    
    
    exports . login =
    function  (req, res) {
        var __tame_defer_cb = tame.findDeferCb ([req, res]);
        tame.setActiveCb (__tame_defer_cb);
        var __tame_this = this;
        var __tame_fn_19 = function (__tame_k) {
            tame.setActiveCb (__tame_defer_cb);
            var err, user;
            var __tame_fn_20 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_defers = new tame.Deferrals (__tame_k);
                var __tame_fn_21 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    db . collection ( 'users' ) . findOne ( { email : req . form . email } ,
                    __tame_defers.defer ( { 
                        assign_fn : 
                            function () {
                                err = arguments[0];
                                user = arguments[1];
                            }
                            ,
                        parent_cb : __tame_defer_cb,
                        line : 38,
                        file : "user.tjs"
                    } )
                    ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                __tame_fn_21(tame.end);
                __tame_defers._fulfill();
                tame.setActiveCb (null);
            };
            var __tame_fn_22 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_fn_23 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    res . send ( false ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                if (! user) {
                    tame.callChain([__tame_fn_23, __tame_k]);
                } else {
                    tame.callChain([__tame_k]);
                }
                tame.setActiveCb (null);
            };
            var err, match;
            var __tame_fn_24 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_defers = new tame.Deferrals (__tame_k);
                var __tame_fn_25 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    bcrypt . compare ( req . form . password , user . password ,
                    __tame_defers.defer ( { 
                        assign_fn : 
                            function () {
                                err = arguments[0];
                                match = arguments[1];
                            }
                            ,
                        parent_cb : __tame_defer_cb,
                        line : 40,
                        file : "user.tjs"
                    } )
                    ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                __tame_fn_25(tame.end);
                __tame_defers._fulfill();
                tame.setActiveCb (null);
            };
            var __tame_fn_26 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                var __tame_fn_27 = function (__tame_k) {
                    tame.setActiveCb (__tame_defer_cb);
                    res . send ( false ) ;
                    tame.callChain([__tame_k]);
                    tame.setActiveCb (null);
                };
                if (! match) {
                    tame.callChain([__tame_fn_27, __tame_k]);
                } else {
                    tame.callChain([__tame_k]);
                }
                tame.setActiveCb (null);
            };
            var __tame_fn_28 = function (__tame_k) {
                tame.setActiveCb (__tame_defer_cb);
                req . session . user = user ;
                res . send ( true ) ;
                tame.callChain([__tame_k]);
                tame.setActiveCb (null);
            };
            tame.callChain([__tame_fn_20, __tame_fn_22, __tame_fn_24, __tame_fn_26, __tame_fn_28, __tame_k]);
            tame.setActiveCb (null);
        };
        tame.callChain([__tame_fn_19, __tame_k]);
        tame.setActiveCb (null);
    }
    ;
    tame.callChain([__tame_k]);
    tame.setActiveCb (null);
};
__tame_fn_0 (tame.end);
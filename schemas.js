var iform = require('iform')

exports.user = iform({
    username: {
        required : true,
        len : [2, 60]
    },
    password: {
        required : true,
        min : 6
    },

    email : {
        type : 'email'
    },
});


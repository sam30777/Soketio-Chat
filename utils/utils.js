let moment = require('moment');

module.exports.generateMessage = function(from,message){
    return {
        from,
        message,
        createdAt : moment().valueOf()
    }
}
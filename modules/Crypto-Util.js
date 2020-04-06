const crypto = require("crypto");

exports.calculateHash = function(data){
    return crypto.createHash('sha256').update(data).digest('hex');
}
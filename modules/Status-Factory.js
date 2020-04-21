const Schema = require('./../proto/status_pb')

exports.createViewOfClient = function(clientID,eventID){
    let viewOfClient = new Schema.ViewOfClient();
    viewOfClient.setClientid(clientID);
    viewOfClient.setEventid(eventID);

    return viewOfClient;
}

exports.createStatus = function(){
    let status = new Schema.Status();
    return status;
}

exports.deserializeBinaryToStatus = function(bytes){
    return Schema.Status.deserializeBinary(bytes);
}


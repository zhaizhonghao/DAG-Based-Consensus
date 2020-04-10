const Schema = require('./../proto/event_pb')
const util = require('./../modules/Crypto-Util')

exports.createEvent = function(selfParent,parent,clientID,timestamp,stable){
    let event = new Schema.Event();

    event.setSelfparent(selfParent);
    event.setParent(parent);
    event.setTimestamp(timestamp);
    event.setClientid(clientID);
    event.setStable(stable);
    event.setHash(calculateHash(event));

    return event;
}

exports.deserializeBinaryToEvent = function(bytes){
    return Schema.Event.deserializeBinary(bytes);
}

function calculateHash(event){
    let content = {
        selfParent : event.getSelfparent(),
        parent : event.getParent(),
        clientID : event.getClientid()
      }
      let hash = util.calculateHash(JSON.stringify(content));
      return hash;
}


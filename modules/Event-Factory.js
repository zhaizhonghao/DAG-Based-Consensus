const Schema = require('./../proto/event_pb')
const util = require('./../modules/Crypto-Util')

exports.createEvent = function(selfParent,parent,clientID,eventID,stable){
    let event = new Schema.Event();

    event.setSelfparent(selfParent);
    event.setParent(parent);
    event.setTimestamp(getCurrentTime());
    event.setClientid(clientID);
    event.setEventid(eventID);
    event.setStable(stable);
    event.setHash(calculateHash(event));

    return event;
}

exports.convertJSONToEvent = function(jsonEvent){
    let event = new Schema.Event();

    event.setSelfparent(jsonEvent.selfParent);
    event.setParent(jsonEvent.parent);
    event.setTimestamp(jsonEvent.timestamp);
    event.setClientid(jsonEvent.clientID);
    event.setEventid(jsonEvent.eventID);
    event.setStable(jsonEvent.stable);
    event.setHash(jsonEvent.hash);

    return event;
}

exports.createMessage = function(){
    let message = new Schema.Message();
    return message;
}

exports.deserializeBinaryToEvent = function(bytes){
    return Schema.Event.deserializeBinary(bytes);
}

exports.deserializeBinaryToMessage = function(bytes){
    return Schema.Message.deserializeBinary(bytes);
}

/**
 * message Timestamp {
  // Represents seconds of UTC time since Unix epoch
  // 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
  // 9999-12-31T23:59:59Z inclusive.
  int64 seconds = 1;

  // Non-negative fractions of a second at nanosecond resolution. Negative
  // second values with fractions must still have non-negative nanos values
  // that count forward in time. Must be from 0 to 999,999,999
  // inclusive.
  int32 nanos = 2;
}
 */
function getCurrentTime(){
    let timestamp = Date.now();
    return timestamp;
}

function calculateHash(event){
    let content = {
        selfParent : event.getSelfparent(),
        parent : event.getParent(),
        clientID : event.getClientid(),
        eventID : event.getEventid()
      }
      let hash = util.calculateHash(JSON.stringify(content));
      return hash;
}


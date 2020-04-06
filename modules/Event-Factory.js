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
    const timestamp = new proto.google.protobuf.Timestamp()
    timestamp.setSeconds(Date.now() / 1000);
    return timestamp;
}

function calculateHash(event){
    let content = {
        selfParent : event.getSelfparent(),
        parent : event.getParent(),
        timestamp : event.getTimestamp(),
        clientID : event.getClientid(),
        eventID : event.getEventid(),
        stable : event.getStable()
      }
      let hash = util.calculateHash(JSON.stringify(content));
      return hash;
}


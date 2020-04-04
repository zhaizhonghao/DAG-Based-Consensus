const neo4j = require('neo4j-driver');
var crypto = require("crypto");

const uri = 'neo4j://localhost';
const user = 'neo4j';
const password = '1';
/**
 * ticket {
 * hash:string
 * clientID: int32
 * }
 * event {
  parent : int64
  self-parent : int64
  timestamp : Timestamp
  clientID : int64
  eventID: int64
  hash : int64
  stable : boolean
  poll : ticket[]
}
 */
exports.createEvent = async function(parent,clientID){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
        let label = 'clientID_'+clientID;
        let selfParent;
        await findLastestEventByClientID(clientID,driver).then(hash=>{
            selfParent = hash;
        });
        console.log(selfParent);
        let timestamp = Date.now();
        let eventID = await countEventsByClient(clientID,driver) + 1;
        //TODO
        let stable = false;

        let event = {
            parent : parent,
            selfParent : selfParent,
            timestamp : timestamp,
            clientID : clientID,
            eventID : eventID,
            stable : stable
        }
        let hash = calculateHash(JSON.stringify(event));
        const result = await session.run(
            `CREATE (a:`+label+` {parent: $parent,
                              selfParent : $selfParent,
                              clientID: $clientID,
                              timestamp :$timestamp,
                              stable : $stable,
                              eventID:$eventID,
                              hash: $hash}
                    ) 
            RETURN a`,
            { parent: parent,
              selfParent :JSON.stringify(selfParent),
              clientID:clientID,
              timestamp: timestamp,
              stable : stable,
              eventID:eventID,
              hash:hash,
              label:label}
        )
        console.log(result);
        
        } finally {
        await session.close()
        }
        // on application exit:
        await driver.close()
}
//find the hash of event by clientID
async function findLastestEventByClientID(clientID,driver){
    const session = driver.session();
    //find the latest event's id
    let eventID = await countEventsByClient(clientID,driver);
    //find the hash of the latest event by id and return
    const result = await session.run(
        `MATCH (x:Event {eventID: $eventID}) RETURN x`,
        { eventID:eventID}
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    
    return node.properties.hash;
}
//Some kind of wired
async function countEventsByClient(clientID,driver){
    const session = driver.session();
    const result = await session.run(
        `MATCH (x:Event {clientID: $clientID}) RETURN count(x)`,
        { clientID:clientID}
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    return node.low-node.high;
}

function calculateHash(data){
    return crypto.createHash('sha256').update(data).digest('hex');
}
